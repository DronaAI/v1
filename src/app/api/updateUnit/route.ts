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

const ytApiKeys = [
  process.env.YOUTUBE_API_KEY_THREE,
  process.env.YOUTUBE_API_KEY_FOUR,
].filter(Boolean) as string[]; // Ensure keys are not undefined

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

    // Fetch unit and quiz result in parallel
    const [unit, unitQuizResult] = await Promise.all([
      prisma.unit.findUnique({
        where: { id: unitId },
        include: { chapters: true },
      }),
      prisma.unitQuizResult.findFirst({
        where: {
          unitId,
          userId: session.user.id,
        },
        include: {
          chapterQuizResults: {
            include: { chapter: true },
          },
        },
      }),
    ]);

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    if (!unitQuizResult) {
      return NextResponse.json({ error: "No quiz results found" }, { status: 404 });
    }

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

    // Generate updated chapters
    const updatedChapters = await chapterImprovementAgent(quizResults, unit.chapters);
    const validatedChapters = updatedChapters.map((chapter) =>
      updatedChapterSchema.parse(chapter)
    );

    // Delete old chapters and related data
    // Ideally, set onDelete: Cascade for ChapterContent and Question in schema to only delete chapters.
    // For now, we do a transaction:
    const chapterIds = unit.chapters.map((chapter) => chapter.id);
    await prisma.$transaction([
      prisma.chapterContent.deleteMany({
        where: { chapterId: { in: chapterIds } },
      }),
      prisma.question.deleteMany({
        where: { chapterId: { in: chapterIds } },
      }),
      prisma.chapter.deleteMany({
        where: { id: { in: chapterIds } },
      }),
    ]);

    // Process new chapters in parallel
    const chapterPromises = validatedChapters.map(async (chapterData, index) => {
      const currentApiKey = ytApiKeys[index % ytApiKeys.length]; 
      const [videoId, transcript] = await Promise.all([
        searchYoutube(chapterData.youtube_search_query, currentApiKey),
        // We'll fetch transcript after we get the videoId
      ]).then(async ([videoId]) => {
        const transcript = await getTranscript(videoId);
        return [videoId, transcript] as const;
      });

      const truncatedTranscript = transcript.split(" ").slice(0, 500).join(" ");

      // Run generation tasks in parallel
      const [explanations, questions] = await Promise.all([
        generateExplanations(chapterData.title, truncatedTranscript),
        getQuestionsFromTranscript(truncatedTranscript, chapterData.title),
      ]);

      // Create the Chapter
      const newChapter = await prisma.chapter.create({
        data: {
          unitId: unit.id,
          name: chapterData.title,
          youtubeSearchQuery: chapterData.youtube_search_query,
          videoId,
        },
      });

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

      return newChapter;
    });

    await Promise.all(chapterPromises);

    // Fetch the updated unit with its chapters
    const updatedUnit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: { chapters: { orderBy: { name: "asc" } } },
    });

    return NextResponse.json(
      { message: "Chapters updated successfully", updatedUnit },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update chapters", details: String(error) },
      { status: 500 }
    );
  }
}
