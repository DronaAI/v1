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
    // Fetch chapter content
    const chapterContent = await prisma.chapterContent.findUnique({
      where: { chapterId },
    });

    console.log(`Chapter content for ${chapterId}:`, chapterContent);

    // Fetch chapter details
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    console.log(`Chapter details for ${chapterId}:`, chapter);

    // Parse JSON fields safely and provide defaults
    const summary = chapterContent?.summary
      ? (chapterContent.summary as Array<string>)
      : [];
    const keyPoints = chapterContent?.keyPoints
      ? (chapterContent.keyPoints as Array<string>)
      : [];
    const chapterName = chapter?.name || "Untitled Chapter";

    // Return chapter data
    return NextResponse.json({ summary, keyPoints, chapterName }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching content for chapterId ${chapterId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch chapter content" },
      { status: 500 }
    );
  }
}
