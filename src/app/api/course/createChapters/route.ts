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

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("unauthorised", { status: 401 });
    }
    const isPro = await checkSubscription();
    if (session.user.credits <= 0 && !isPro) {
      return new NextResponse("no credits", { status: 402 });
    }
    const body = await req.json();
    const { title } = createChaptersSchema.parse(body);

    
    let result = await createCourse(title) ;

    const imageSearchTerm = createThumbnail(title)

    const course_image = await getUnsplashImage(
      (await imageSearchTerm).image_search_term
    );
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
      },
    });

    for (const unit of result.outputUnits) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
}
