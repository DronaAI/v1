"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Chapter, Course, Unit } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { LoadingModal } from "@/components/LoadingModal"
import { toast } from "@/components/ui/use-toast"
import { BarChart2, ChevronDown, ChevronUp } from 'lucide-react'

type CourseSidebarProps = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[]
    })[]
  }
  currentChapterId: string
  onOpenAnalysis: (unitId: string, unitName: string) => void
}

export function CourseSidebar({ course, currentChapterId, onOpenAnalysis }: CourseSidebarProps) {
  const [loadingUnit, setLoadingUnit] = useState<string | null>(null)
  const [expandedUnits, setExpandedUnits] = useState<string[]>([])

  const toggleUnitExpansion = (unitId: string) => {
    setExpandedUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    )
  }

  return (
    <nav className="h-full overflow-y-auto">
      <div className="p-4 space-y-2">
        {course.units.map((unit, unitIndex) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: unitIndex * 0.1 }}
            className="rounded-lg overflow-hidden"
          >
            <div 
              className={cn(
                "p-4 flex items-center justify-between cursor-pointer rounded-lg transition-all duration-200",
                expandedUnits.includes(unit.id)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : "bg-white/5 hover:bg-white/10"
              )}
              onClick={() => toggleUnitExpansion(unit.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {unitIndex + 1}
                  </span>
                </div>
                <h2 className="text-sm font-medium text-white">
                  {unit.name}
                </h2>
              </div>
              {expandedUnits.includes(unit.id) ? (
                <ChevronUp className="w-4 h-4 text-white/70" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/70" />
              )}
            </div>
            <AnimatePresence>
              {expandedUnits.includes(unit.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="py-2 px-4">
                    <div className="space-y-1">
                      {unit.chapters.map((chapter, chapterIndex) => (
                        <Link
                          key={chapter.id}
                          href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                        >
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={cn(
                              "px-4 py-2 rounded-md text-sm transition-colors",
                              chapter.id === currentChapterId
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                          >
                            {chapter.name}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                    <Button
                      onClick={() => onOpenAnalysis(unit.id, unit.name)}
                      className="w-full mt-3 bg-white/5 hover:bg-white/10 text-white/90 hover:text-white flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
                      variant="ghost"
                      size="sm"
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span className="text-xs">View Analysis</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      {loadingUnit && <LoadingModal unitId={loadingUnit} />}
    </nav>
  )
}

