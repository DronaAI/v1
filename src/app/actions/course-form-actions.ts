"use server"

import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createChaptersSchema } from "@/validators/course"
import { generateChapters } from "@/lib/courseGenerator"

export async function createCourse(data: {
  title: string
  units: string[]
}) {
  const session = await getAuthSession()
  if (!session?.user) {
    throw new Error("You must be logged in to create a course")
  }

  const { title, units } = createChaptersSchema.parse(data)

  const course = await prisma.course.create({
    data: {
      name: title,
      userId: session.user.id,
    },
  })

  for (const unit of units) {
    await prisma.unit.create({
      data: {
        name: unit,
        courseId: course.id,
      },
    })
  }

  const chapters = await generateChapters(title, units)

  for (const chapter of chapters) {
    await prisma.chapter.create({
      data: {
        name: chapter.title,
        youtubeSearchQuery: chapter.youtube_search_query,
        unitId: chapter.unit_id,
      },
    })
  }

  return { course_id: course.id }
}