"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { Course, Unit, Chapter } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CourseSidebar } from "@/components/CourseSideBar"
import { MainVideoSummary } from "@/components/MainVideoSummary"
import { QuizModal } from "@/components/quiz-modal"
import { RevisionSection } from "@/components/revision-section"
import { UnitAnalysisModal } from "@/components/UnitAnalysisModal"
import { useToast } from "@/components/ui/use-toast"

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
  const [analysisUnit, setAnalysisUnit] = useState<{ id: string, name: string } | null>(null)
  const { toast } = useToast()

  const currentUnitIndex = currentCourse.units.findIndex((u) => u.id === unit.id)
  const currentChapterIndex = unit.chapters.findIndex((c) => c.id === chapter.id)
  const nextChapter = unit.chapters[currentChapterIndex + 1]
  const prevChapter = unit.chapters[currentChapterIndex - 1]

  const handleUpdateCourse = (updatedUnits: (Unit & { chapters: Chapter[] })[]) => {
    setCurrentCourse((prevCourse) => ({
      ...prevCourse,
      units: updatedUnits,
    }))
  }

  const handleOpenAnalysis = (unitId: string, unitName: string) => {
    setAnalysisUnit({ id: unitId, name: unitName })
  }

  const handleCloseAnalysis = () => {
    setAnalysisUnit(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] flex flex-col">
      {/* Navbar Space */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <div className="w-[280px] fixed left-0 top-16 bottom-0 bg-[#0a0b1e]/95 border-r border-white/[0.08] overflow-hidden">
          <CourseSidebar
            course={currentCourse}
            currentChapterId={chapter.id}
            onOpenAnalysis={handleOpenAnalysis}
          />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 ml-[280px] min-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="max-w-[1100px] mx-auto px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-white mb-1">
                {chapter.name}
              </h1>
              <p className="text-sm text-white/60">
                Unit {currentUnitIndex + 1}, Chapter {currentChapterIndex + 1}
              </p>
            </motion.div>

            <Card className="bg-[#111332]/50 border-white/[0.08] backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <div className="aspect-video w-full bg-black/50 rounded-lg overflow-hidden mb-8">
                  <MainVideoSummary
                    unit={unit}
                    unitIndex={currentUnitIndex}
                    chapter={chapter}
                    chapterIndex={currentChapterIndex}
                  />
                </div>
                
                <Separator className="my-8 bg-white/[0.08]" />
                
                <RevisionSection
                  chapter={chapter}
                  onStartQuiz={() => setShowQuizModal(true)}
                />
                
                <div className="flex justify-between mt-8">
                  {prevChapter && (
                    <Link href={`/course/${course.id}/${currentUnitIndex}/${currentChapterIndex - 1}`}>
                      <Button
                        variant="outline"
                        className="flex items-center bg-white/5 hover:bg-white/10 text-white border-white/10"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous: {prevChapter.name}
                      </Button>
                    </Link>
                  )}
                  {nextChapter && (
                    <Link href={`/course/${course.id}/${currentUnitIndex}/${currentChapterIndex + 1}`}>
                      <Button
                        variant="outline"
                        className="flex items-center ml-auto bg-white/5 hover:bg-white/10 text-white border-white/10"
                      >
                        Next: {nextChapter.name}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showQuizModal && (
        <QuizModal
          chapter={chapter}
          unit={unit}
          open={showQuizModal}
          onOpenChange={setShowQuizModal}
        />
      )}
      {analysisUnit && (
        <UnitAnalysisModal
          unitId={analysisUnit.id}
          unitName={analysisUnit.name}
          onClose={handleCloseAnalysis}
          onUpdateCourse={() => {}}
        />
      )}
    </div>
  )
}
