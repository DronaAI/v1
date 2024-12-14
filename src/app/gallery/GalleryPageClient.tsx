'use client'

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import GalleryCourseCard from "@/components/GalleryCourseCard"
import React, { useEffect, useState } from "react"
import { Moon, Sun, Search } from 'lucide-react'
import { Course, Unit, Chapter } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type CourseWithUnitsAndChapters = Course & {
  units: (Unit & {
    chapters: Chapter[]
  })[]
}

type Props = {
  courses: CourseWithUnitsAndChapters[]
}

const GalleryPageClient = ({ courses }: Props) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="py-8 px-8">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0"
        >
          <h1 className="text-[2.5rem] leading-tight font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your Current Courses
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[280px] pl-10 pr-4 h-10 rounded-full bg-white/5 backdrop-blur-sm border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-400/50 focus-visible:border-purple-400/50"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GalleryCourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GalleryPageClient

