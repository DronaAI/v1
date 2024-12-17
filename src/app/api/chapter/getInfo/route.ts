import { prisma } from "@/lib/db";
import { generateExplanations } from "@/lib/ContentGenerationAgent";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const bodyParser = z.object({
  chapterId: z.string(),
})

const yt_api_key = {
  key1: process.env.YOUTUBE_API_KEY_ONE,
  key2: process.env.YOUTUBE_API_KEY_TWO,
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: "Chapter not found" },
        { status: 404 }
      );
    }

    const yt_key = Math.random() > 0.5 ? yt_api_key.key1 : yt_api_key.key2;

    //@ts-ignore
    const videoId = await searchYoutube(chapter.youtubeSearchQuery , yt_key);
    let transcript = await getTranscript(videoId);

    // Limit transcript
    const maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const explanations = await generateExplanations(chapter.name, transcript);

    // Ensure explanations are valid JSON structures:
    // Check for any undefined values and remove them if present
    const summaryData = JSON.parse(JSON.stringify(explanations.summary));
    const keyPointsData = JSON.parse(JSON.stringify(explanations.keyPoints));

    const questions = await getQuestionsFromTranscript(transcript, chapter.name);

    await prisma.question.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
      },
    });

    // Cast to Prisma.InputJsonValue
    await prisma.chapterContent.upsert({
      where: { chapterId },
      create: {
        chapterId: chapterId,
        summary: summaryData as unknown as Prisma.InputJsonValue,
        keyPoints: keyPointsData as unknown as Prisma.InputJsonValue,
      },
      update: {
        summary: summaryData as unknown as Prisma.InputJsonValue,
        keyPoints: keyPointsData as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
    } else {
      return NextResponse.json({ success: false, error: "unknown" }, { status: 500 });
    }
  }
}
