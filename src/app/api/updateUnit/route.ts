import { prisma } from "@/lib/db";
import { chapterImprovementAgent } from "@/lib/AdaptiveLearningAgent";
import { getTranscript, searchYoutube } from "@/lib/youtube";
import { getQuestionsFromTranscript } from "@/lib/youtube";
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { generateExplanations } from "@/lib/ContentGenerationAgent";

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
    console.log("Starting POST request for updating unit chapters...");

    // Validate session
    const session = await getAuthSession();
    if (!session?.user) {
      console.error("Unauthorized access - session not found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const { unitId } = requestSchema.parse(body);

    console.log("Validated unitId:", unitId);

    // Fetch the unit and its associated data
    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { chapters: true },
    });

    if (!unit) {
      console.error("Unit not found:", unitId);
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    console.log("Fetched unit:", unit);

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
      console.error("No quiz results found for unit:", unitId);
      return NextResponse.json({ error: "No quiz results found" }, { status: 404 });
    }

    console.log("Fetched unit quiz results:", unitQuizResult);

    // Aggregate quiz results
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

    // Generate updated chapters
    const updatedChapters = await chapterImprovementAgent(quizResults, unit.chapters);
    const validatedChapters = updatedChapters.map((chapter) =>
      updatedChapterSchema.parse(chapter)
    );

    console.log("Validated chapters:", validatedChapters);

    // Delete old chapters and their associated data
    const chapterIds = unit.chapters.map((chapter) => chapter.id);

    try {
      console.log("Deleting associated ChapterContent records...");
      await prisma.chapterContent.deleteMany({
        where: {
          chapterId: { in: chapterIds },
        },
      });

      console.log("Deleting associated questions...");
      await prisma.question.deleteMany({
        where: {
          chapterId: { in: chapterIds },
        },
      });

      console.log("Deleting old chapters...");
      await prisma.chapter.deleteMany({
        where: {
          id: { in: chapterIds },
        },
      });

      console.log("Deleted old chapters and their related data.");
    } catch (deleteError) {
      console.error("Error deleting old chapters and related data:", deleteError);
      throw new Error("Failed to delete old chapters and associated data.");
    }

    // Process and create new chapters
    for (const chapterData of validatedChapters) {
      console.log(`Processing chapter: ${chapterData.title}`);

      const videoId = await searchYoutube(chapterData.youtube_search_query);
      const transcript = await getTranscript(videoId);
      const truncatedTranscript = transcript.split(" ").slice(0, 500).join(" ");
      const explanations = await generateExplanations(chapterData.title, truncatedTranscript);
      const questions = await getQuestionsFromTranscript(truncatedTranscript, chapterData.title);

      // Create the Chapter
      const newChapter = await prisma.chapter.create({
        data: {
          unitId: unit.id,
          name: chapterData.title,
          youtubeSearchQuery: chapterData.youtube_search_query,
          videoId,
        },
      });

      console.log(`Created chapter: ${newChapter.name}`);

      // Create questions for the Chapter
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

      console.log(`Inserted questions for chapter: ${newChapter.name}`);

      // Create ChapterContent
      await prisma.chapterContent.create({
        data: {
          chapterId: newChapter.id,
          summary: explanations.summary
            ? (explanations.summary as Prisma.InputJsonValue)
            : Prisma.JsonNull,
          keyPoints: explanations.keyPoints
            ? (explanations.keyPoints as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        },
      });

      console.log(`Created content for chapter: ${newChapter.name}`);
    }

    // Fetch the updated unit with its chapters
    const updatedUnit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { chapters: { orderBy: { name: "asc" } } },
    });

    console.log("Updated unit:", updatedUnit);

    return NextResponse.json(
      { message: "Chapters updated successfully", updatedUnit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chapters:", error);
    return NextResponse.json(
      { error: "Failed to update chapters", details: String(error) },
      { status: 500 }
    );
  }
}
