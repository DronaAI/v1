"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Chapter, Course, Unit } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { LoadingModal } from "@/components/LoadingModal"
import { toast } from "@/components/ui/use-toast"

type CourseSidebarProps = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[]
    })[]
  }
  currentChapterId: string
}

export function CourseSidebar({ course, currentChapterId }: CourseSidebarProps) {
  const [loadingUnit, setLoadingUnit] = useState<string | null>(null)

  const handleUpdateUnit = async (unitId: string) => {
    setLoadingUnit(unitId)
    try {
      const response = await fetch('/api/updateUnit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update unit')
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: data.message,
      })
    } catch (error) {
      console.error('Error updating unit:', error)
      toast({
        title: "Error",
        description: "Failed to update unit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingUnit(null)
    }
  }

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
          <ul className="space-y-2 mb-4">
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
          <Button
            onClick={() => handleUpdateUnit(unit.id)}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
            disabled={loadingUnit === unit.id}
          >
            {loadingUnit === unit.id ? 'Updating...' : 'Update Unit'}
          </Button>
        </motion.div>
      ))}
      <AnimatePresence>
        {loadingUnit && <LoadingModal unitId={loadingUnit} />}
      </AnimatePresence>
    </nav>
  )
}

