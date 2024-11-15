"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Chapter, Course, Unit } from "@prisma/client"

type CourseSidebarProps = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[]
    })[]
  }
  currentChapterId: string
}

export function CourseSidebar({ course, currentChapterId }: CourseSidebarProps) {
  return (
    <nav className="space-y-6">
      {course.units.map((unit, unitIndex) => (
        <motion.div
          key={unit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: unitIndex * 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-3 text-blue-300">
            Unit {unitIndex + 1}: {unit.name}
          </h2>
          <ul className="space-y-2">
            {unit.chapters.map((chapter, chapterIndex) => (
              <motion.li
                key={chapter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                  className={cn(
                    "block p-2 rounded transition-colors",
                    chapter.id === currentChapterId
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "hover:bg-gray-700 text-gray-300 hover:text-white"
                  )}
                >
                  {chapter.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </nav>
  )
}