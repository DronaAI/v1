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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
                  userId: session.user.id
                }
              }
            }
          }
        },
        unitQuizResults: {
          where: {
            userId: session.user.id
          },
          include: {
            chapterQuizResults: {
              include: { chapter: true }
            }
          }
        }
      }
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

    // Prepare data for studentPerformanceAgent
    const unitResults = {
      unitId: unit.id,
      unitName: unit.name,
      totalScore: unitQuizResult.chapterQuizResults.reduce((sum, result) => sum + result.score, 0),
      maxScore: unit.chapters.reduce((sum, chapter) => sum + chapter.questions.length, 0),
      chapterScores: unit.chapters.map((chapter) => {
        const chapterQuizResult = chapter.chapterQuizResults[0];
        return {
          chapterId: chapter.id,
          chapterName: chapter.name,
          score: chapterQuizResult?.score || 0,
          maxScore: chapter.questions.length,
        };
      }),
    };

    const chapterResults = unit.chapters.map((chapter) => {
      const chapterQuizResult = chapter.chapterQuizResults[0];
      return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        score: chapterQuizResult?.score || 0,
        maxScore: chapter.questions.length,
        wrongAnswers: chapterQuizResult?.wrongAnswers as string[] || [],
      };
    });

    // Get performance analysis
    const analysis = await studentPerformanceAgent(unitResults, chapterResults);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error("Error providing insights:", error);
    return NextResponse.json(
      { error: "Failed to provide insights", details: error },
      { status: 500 }
    );
  }
}

