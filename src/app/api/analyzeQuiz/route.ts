import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const analyzeQuizSchema = z.object({
  unit_name: z.string(),
  chapter_wise_results: z.array(
    z.object({
      chapter_name: z.string(),
      score: z.number().min(0, "Score must be non-negative"),
      wrongAnswers: z.array(z.string()),
    })
  ),
});

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { unit_name, chapter_wise_results } = analyzeQuizSchema.parse(body);

    // Find the Unit
    const unit = await prisma.unit.findFirst({
      where: { name: unit_name },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Check or create `unitQuizResult` for this user and unit
    const unitQuizResult = await prisma.unitQuizResult.upsert({
      where: {
        userId_unitId: { userId: session.user.id, unitId: unit.id },
      },
      update: {},
      create: {
        userId: session.user.id,
        unitId: unit.id,
      },
    });

    // Fetch all chapters for the unit in a single query
    const chapters = await prisma.chapter.findMany({
      where: { unitId: unit.id },
      select: { id: true, name: true },
    });

    const chapterMap = new Map(chapters.map((chapter) => [chapter.name, chapter.id]));

    // Prepare data for bulk creation
    const chapterResultsData = chapter_wise_results.map((result) => {
      const chapterId = chapterMap.get(result.chapter_name);
      if (!chapterId) {
        throw new Error(`Chapter not found: ${result.chapter_name}`);
      }
      return {
        unitQuizResultId: unitQuizResult.id,
        chapterId,
        score: result.score,
        wrongAnswers: result.wrongAnswers,
      };
    });

    // Create all chapter quiz results in bulk
    await prisma.chapterQuizResult.createMany({
      data: chapterResultsData,
      skipDuplicates: true, // Prevents duplicate entries if results already exist
    });

    return NextResponse.json(
      { message: "Quiz results saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing quiz results:", error);

    // Return detailed error messages for Zod validation or other errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process quiz results", details: error },
      { status: 500 }
    );
  }
}
