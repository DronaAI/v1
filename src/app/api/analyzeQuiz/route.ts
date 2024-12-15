import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const analyzeQuizSchema = z.object({
  unit_name: z.string(),
  chapter_wise_results: z.array(
    z.object({
      chapter_name: z.string(),
      score: z.number(),
      wrongAnswers: z.array(z.string()),
    })
  ),
});

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const { unit_name, chapter_wise_results } = analyzeQuizSchema.parse(body);

    // Find the Unit
    const unit = await prisma.unit.findFirst({
      where: { name: unit_name },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Check if `unitQuizResult` already exists for this user and unit
    let unitQuizResult = await prisma.unitQuizResult.findFirst({
      where: {
        userId: session.user.id,
        unitId: unit.id,
      },
    });

    // Create `unitQuizResult` if it doesn't exist
    if (!unitQuizResult) {
      unitQuizResult = await prisma.unitQuizResult.create({
        data: {
          userId: session.user.id,
          unitId: unit.id,
        },
      });
    }

    // Prepare chapter results for bulk creation
    const chapterResultsData = [];
    for (const result of chapter_wise_results) {
      const chapter = await prisma.chapter.findFirst({
        where: {
          unitId: unit.id,
          name: result.chapter_name,
        },
      });

      if (!chapter) {
        return NextResponse.json(
          { error: `Chapter not found: ${result.chapter_name}` },
          { status: 404 }
        );
      }

      chapterResultsData.push({
        unitQuizResultId: unitQuizResult.id,
        chapterId: chapter.id,
        score: result.score,
        wrongAnswers: result.wrongAnswers,
      });
    }

    // Create all chapter quiz results in bulk
    await prisma.chapterQuizResult.createMany({
      data: chapterResultsData,
    });

    return NextResponse.json({ message: "Quiz results saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing quiz results:", error);
    return NextResponse.json(
      { error: "Failed to process quiz results", details: error },
      { status: 500 }
    );
  }
}