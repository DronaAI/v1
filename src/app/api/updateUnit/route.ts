import { prisma } from "@/lib/db";
import { chapterImprovementAgent } from "@/lib/AdaptiveLearningAgent";
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for request validation
const requestSchema = z.object({
  unitId: z.string(), // The ID of the unit to update chapters for
});

export async function POST(req: Request) {
  try {
    // Verify the user's authentication session
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const { unitId } = requestSchema.parse(body);

    // Fetch the unit and its associated chapters
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { chapters: true },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Fetch the quiz results for the unit and the current user
    const unitQuizResult = await prisma.unitQuizResult.findFirst({
      where: {
        unitId: unit.id,
        userId: session.user.id,
      },
      include: {
        chapterQuizResults: {
          include: { chapter: true },
        },
      },
    });

    if (!unitQuizResult) {
      return NextResponse.json(
        { error: "No quiz results found for this unit and user" },
        { status: 404 }
      );
    }

    // Format the quiz results for the AI agent
    const formattedQuizResults = {
      userId: unitQuizResult.userId,
      chapterResults: unitQuizResult.chapterQuizResults.map((result) => ({
        chapterId: result.chapterId,
        chapterName: result.chapter.name,
        score: result.score,
        wrongAnswers: result.wrongAnswers || [],
      })),
    };

    // Use the AI agent to generate updated chapters
    const updatedChapters = await chapterImprovementAgent(
      formattedQuizResults,
      unit.chapters
    );

    // Process each chapter
    for (const chapterData of updatedChapters) {
      // Check if the chapter already exists
      const existingChapter = await prisma.chapter.findFirst({
        where: {
          unitId: unit.id,
          name: chapterData.title,
        },
      });

      if (existingChapter) {
        // Update the existing chapter
        await prisma.chapter.update({
          where: { id: existingChapter.id },
          data: {
            youtubeSearchQuery: chapterData.youtube_search_query,
          },
        });
      } else {
        // Create a new chapter
        await prisma.chapter.create({
          data: {
            unitId: unit.id,
            name: chapterData.title,
            youtubeSearchQuery: chapterData.youtube_search_query,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Chapters updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating chapters:", error);
    return NextResponse.json(
      { error: "Failed to update chapters", details: error.message },
      { status: 500 }
    );
  }
}
