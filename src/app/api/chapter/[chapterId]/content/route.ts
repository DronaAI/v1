import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { chapterId: string } }
) {
  const chapterId = params.chapterId;
  console.log(`Received request for chapterId: ${chapterId}`);

  if (!chapterId) {
    console.error("chapterId is undefined");
    return NextResponse.json({ error: "Chapter ID is required" }, { status: 400 });
  }

  try {
    const chapterContent = await prisma.chapterContent.findUnique({
      where: { chapterId },
    });

    console.log(`Chapter content for ${chapterId}:`, chapterContent);

    if (!chapterContent) {
      console.log(`No content found for chapterId: ${chapterId}`);
      return NextResponse.json(
        { summary: [], keyPoints: [], chapterName: "Unknown Chapter" },
        { status: 200 }
      );
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    console.log(`Chapter details for ${chapterId}:`, chapter);

    const summary = Array.isArray(chapterContent.summary)
      ? chapterContent.summary
      : [];
    const keyPoints = Array.isArray(chapterContent.keyPoints)
      ? chapterContent.keyPoints
      : [];

    const chapterName = chapter?.name || "Untitled Chapter";

    console.log(`Returning data for chapterId: ${chapterId}`, {
      summary,
      keyPoints,
      chapterName,
    });

    return NextResponse.json({ summary, keyPoints, chapterName }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching content for chapterId ${chapterId}:`, error);
    return NextResponse.json({ error: "Failed to fetch chapter content" }, { status: 500 });
  }
}
