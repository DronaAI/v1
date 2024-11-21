import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { createQuiz } from "@/lib/quizCreator";

// Schema validation for the input
const reportSchema = z.object({
  lessonName: z.string(),
  score: z.number(),
  incorrectAnswers: z.array(z.string()),
});

const newAdaptiveSchema = z.object({
  newUnit: z.object({
    title: z.string(),
    chapters: z.array(
      z.object({
        youtube_search_query: z.string(),
        chapter_title: z.string(),
      })
    ),
  }),
});

// Create OpenAI client
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});

const model = openai("gpt-4o");

// API handler for updating course details
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const report = reportSchema.parse(body);

    // Find the chapter associated with the lesson
    const chapter = await prisma.chapter.findFirst({
      where: {
        name: report.lessonName,
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Fetch the associated unit
    const unit = await prisma.unit.findUnique({
      where: {
        id: chapter.unitId,
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // Generate adaptive lesson data using AI
    const quiz_feedback = report;

    const newAdaptiveLesson = await generateObject({
      model: model,
      schema: newAdaptiveSchema,
      system: `You are a feedback system which takes Quiz report as a feedback and based on the feedback modify the chapter content in the existing unit such that the user can understand and strengthen weak concepts based on the quiz feedback.`,
      prompt: `Create the chapters in the ${unit.name} more elaborate according to the user's ${quiz_feedback}`,
    });

    // Extract new chapters
    const newChapters = newAdaptiveLesson.object.newUnit.chapters.map((chap) => ({
      youtube_search_query: chap.youtube_search_query,
      name: chap.chapter_title,
      unitId: chapter.unitId,
    }));

    // Start a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      // Fetch all chapters in the current unit
      const chaptersToDelete = await prisma.chapter.findMany({
        where: { unitId: chapter.unitId },
      });

      // Delete all related questions for those chapters
      await prisma.question.deleteMany({
        where: {
          chapterId: { in: chaptersToDelete.map((chap) => chap.id) },
        },
      });

      // Delete all chapters in the current unit
      await prisma.chapter.deleteMany({
        where: {
          unitId: chapter.unitId,
        },
      });

      // Create new chapters and generate questions for them
      for (const newChapterData of newChapters) {
        const formattedChapterData = {
          youtubeSearchQuery: newChapterData.youtube_search_query,
          name: newChapterData.name,
          unitId: newChapterData.unitId,
        };

        // Create new chapter
        const newChapter = await prisma.chapter.create({
          data: formattedChapterData,
        });

        // Generate quiz for the chapter
        const transcript = ""; // Replace with actual transcript if available
        const topic = newChapter.name;
        const numberOfQuestions = 5; // Number of questions per chapter

        const quiz = await createQuiz(topic, transcript, numberOfQuestions);

        // Map questions into the format for Prisma
        const questions = quiz.questions.map((q) => ({
          chapterId: newChapter.id,
          question: q.question,
          answer: q.answer,
          options: JSON.stringify([q.option1, q.option2, q.option3]),
        }));

        // Create questions for the chapter
        await prisma.question.createMany({
          data: questions,
        });
      }
    });

    // Return success response
    return NextResponse.json(
      { message: "Course details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
