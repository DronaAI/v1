"use server"

import { prisma } from "../../lib/db";

export async function getCourseData(courseId: string, unitIndex: number, chapterIndex: number) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      units: {
        include: {
          chapters: {
            include: { questions: true },
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const unit = course.units[unitIndex];
  if (!unit) {
    throw new Error("Unit not found");
  }

  const chapter = unit.chapters[chapterIndex];
  if (!chapter) {
    throw new Error("Chapter not found");
  }

  return { course, unit, chapter };
}