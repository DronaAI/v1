import { prisma } from "@/lib/db";
import { chapterImprovementAgent } from "@/lib/AdaptiveLearningAgent";
import { getTranscript, searchYoutube } from "@/lib/youtube";
import { generateSummary } from "@/lib/summaryGenerator";
import { getQuestionsFromTranscript } from "@/lib/youtube";
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const requestSchema = z.object({
  unitId: z.string(),
});

const updatedChapterSchema = z.object({
  title: z.string(),
  youtube_search_query: z.string(),
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
      include: { chapters: true },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

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

    // Aggregate chapter quiz results
    const quizResults = {
      unitId: unitQuizResult.unitId,
      userId: unitQuizResult.userId,
      chapterResults: unitQuizResult.chapterQuizResults.map((result) => ({
        chapterId: result.chapterId,
        chapterName: result.chapter.name,
        score: result.score,
        wrongAnswers: result.wrongAnswers || [],
      })),
    };

    console.log("Aggregated quiz results:", quizResults);

    // Pass aggregated results and existing chapters to the agent
    const updatedChapters = await chapterImprovementAgent(
      quizResults,
      unit.chapters
    );

    const validatedChapters = updatedChapters.map((chapter) =>
      updatedChapterSchema.parse(chapter)
    );

    console.log("Validated chapters:", validatedChapters);

    // Delete old chapters and associated questions
    const chapterIds = unit.chapters.map((chapter) => chapter.id);
    await prisma.question.deleteMany({ where: { chapterId: { in: chapterIds } } });
    await prisma.chapter.deleteMany({ where: { id: { in: chapterIds } } });

    console.log("Deleted old chapters and questions.");

    // Insert new chapters and questions
    await Promise.all(
      validatedChapters.map(async (chapterData, index) => {
        const videoId = await searchYoutube(chapterData.youtube_search_query);
        const transcript = await getTranscript(videoId);
        const truncatedTranscript = transcript.split(" ").slice(0, 500).join(" ");
        const { summary } = await generateSummary(truncatedTranscript);
        const questions = await getQuestionsFromTranscript(
          truncatedTranscript,
          chapterData.title
        );

        const newChapter = await prisma.chapter.create({
          data: {
            unitId: unit.id,
            name: chapterData.title,
            youtubeSearchQuery: chapterData.youtube_search_query,
            videoId,
            summary,
          },
        });

        await prisma.question.createMany({
          data: questions.map((question) => ({
            chapterId: newChapter.id,
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(
              [question.answer, question.option1, question.option2, question.option3].sort(
                () => Math.random() - 0.5
              )
            ),
          })),
        });

        console.log(`Created new chapter: ${newChapter.name}`);
      })
    );

    // Fetch updated unit
    const updatedUnit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { chapters: { orderBy: { name: "asc" } } },
    });

    return NextResponse.json(
      { message: "Chapters updated successfully", updatedUnit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chapters:", error);
    return NextResponse.json(
      { error: "Failed to update chapters", details: error},
      { status: 500 }
    );
  }
}
