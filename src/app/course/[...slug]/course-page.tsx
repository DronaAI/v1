"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Course, Unit, Chapter } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CourseSidebar } from "@/components/CourseSideBar"
import { MainVideoSummary } from "@/components/MainVideoSummary"
import { QuizModal } from "@/components/quiz-modal"
import { RevisionSection } from "@/components/revision-section"

// ... (keep existing types)

type CoursePageProps = {
  course: Course & {
    units: (Unit & { chapters: Chapter[] })[]
  }
  unit: Unit & { chapters: Chapter[] }
  chapter: Chapter
}

export function CoursePage({ course, unit, chapter }: CoursePageProps) {
  const [currentCourse, setCurrentCourse] = useState<Course & {
    units: (Unit & { chapters: Chapter[] })[]
  }>(course)
  const [showQuizModal, setShowQuizModal] = useState(false)

  const currentUnitIndex = currentCourse.units.findIndex((u) => u.id === unit.id)
  const currentChapterIndex = unit.chapters.findIndex((c) => c.id === chapter.id)
  const nextChapter = unit.chapters[currentChapterIndex + 1]
  const prevChapter = unit.chapters[currentChapterIndex - 1]

  const handleUpdateCourse = (updatedUnits: (Unit & { chapters: Chapter[] })[]) => {
    setCurrentCourse((prevCourse): Course & { units: (Unit & { chapters: Chapter[] })[] } => ({
      ...prevCourse,
      units: updatedUnits,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {currentCourse.name}
          </h1>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-4">
                <CourseSidebar
                  course={currentCourse}
                  currentChapterId={chapter.id}
                  onUpdateCourse={handleUpdateCourse}
                />
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-none shadow-lg">
              <CardContent className="p-6">
                <MainVideoSummary
                  unit={unit}
                  unitIndex={currentUnitIndex}
                  chapter={chapter}
                  chapterIndex={currentChapterIndex}
                />
                <Separator className="my-8 bg-gray-600" />
                <RevisionSection
                  chapter={chapter}
                  onStartQuiz={() => setShowQuizModal(true)}
                />
                <div className="flex justify-between mt-8">
                  {prevChapter && (
                    <Link href={`/course/${course.id}/${currentUnitIndex}/${currentChapterIndex - 1}`}>
                      <Button
                        variant="outline"
                        className="flex items-center bg-blue-500 hover:bg-blue-600 text-white border-none"
                      >
                        <ChevronLeft className="mr-2" />
                        Previous: {prevChapter.name}
                      </Button>
                    </Link>
                  )}
                  {nextChapter && (
                    <Link href={`/course/${course.id}/${currentUnitIndex}/${currentChapterIndex + 1}`}>
                      <Button
                        variant="outline"
                        className="flex items-center ml-auto bg-purple-500 hover:bg-purple-600 text-white border-none"
                      >
                        Next: {nextChapter.name}
                        <ChevronRight className="ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      {showQuizModal && (
        <QuizModal
          chapter={chapter}
          unit={unit}
          open={showQuizModal}
          onOpenChange={setShowQuizModal}
        />
      )}
    </div>
  )
}

