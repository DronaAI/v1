import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { studentPerformanceAgent } from "@/lib/PerformanceManagementAgent";

const requestSchema = z.object({
  unitId: z.string(),
});

export async function POST(req: Request) {
  try {
    // Validate session
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized: User is not logged in" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const { unitId } = requestSchema.parse(body);

    // Fetch the unit and its associated data
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        chapters: {
          include: {
            questions: true,
            chapterQuizResults: {
              where: {
                unitQuizResult: {
                  userId: session.user.id,
                },
              },
            },
          },
        },
        unitQuizResults: {
          where: {
            userId: session.user.id,
          },
          include: {
            chapterQuizResults: {
              include: { chapter: true },
            },
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    const unitQuizResult = unit.unitQuizResults[0];

    if (!unitQuizResult) {
      return NextResponse.json(
        { error: "No quiz results found for this unit and user" },
        { status: 404 }
      );
    }

    // Aggregate data for studentPerformanceAgent
    const chapterScores = unit.chapters.map((chapter) => {
      const chapterQuizResult = chapter.chapterQuizResults[0];
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        score: chapterQuizResult?.score || 0,
        maxScore: chapter.questions.length,
      };
    });

    const totalScore = chapterScores.reduce((sum, chapter) => sum + chapter.score, 0);
    const maxScore = chapterScores.reduce((sum, chapter) => sum + chapter.maxScore, 0);

    const unitResults = {
      unitId: unit.id,
      unitName: unit.name,
      totalScore,
      maxScore,
      chapterScores,
    };

    const chapterResults = unit.chapters.map((chapter) => {
      const chapterQuizResult = chapter.chapterQuizResults[0];
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        score: chapterQuizResult?.score || 0,
        maxScore: chapter.questions.length,
        wrongAnswers: (chapterQuizResult?.wrongAnswers as string[]) || [],
      };
    });

    // Get performance analysis
    const analysis = await studentPerformanceAgent(unitResults, chapterResults);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error("Error processing POST request:", error);

    const errorMessage = 
      error instanceof z.ZodError 
        ? "Invalid request body" 
        : "Internal server error";

    return NextResponse.json(
      { error: errorMessage, details: error instanceof z.ZodError ? error.errors : error },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}
