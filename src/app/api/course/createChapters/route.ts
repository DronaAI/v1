// /api/course/createChapters

import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";
import { createThumbnail } from "@/lib/thumbnailGenerator";
import { createCourse } from "@/lib/courseGenerator";

export async function POST(req: Request) { // Removed `res: Response` as it's not used in Next.js API routes
  try {
    const session = await getAuthSession();
    console.log("Session User ID:", session?.user?.id); // Logging for debugging

    if (!session?.user || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isPro = await checkSubscription();
    if (user.credits <= 0 && !isPro) {
      return new NextResponse("No credits", { status: 402 });
    }

    const body = await req.json();
    const { title, units } = createChaptersSchema.parse(body);

    let result = await createCourse(title, units.length);

    const imageSearchTerm = await createThumbnail(title);

    const course_image = await getUnsplashImage(imageSearchTerm.image_search_term);

    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });

    for (const unit of result.outputUnits) {
      const unitTitle = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: unitTitle,
          courseId: course.id,
        },
      });

      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => ({
          name: chapter.chapter_title,
          youtubeSearchQuery: chapter.youtube_search_query,
          unitId: prismaUnit.id,
        })),
      });
    }

    // Update user credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    });

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid request body", { status: 400 });
    }
    console.error("Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
