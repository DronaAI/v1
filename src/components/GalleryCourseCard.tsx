'use client'

import { Course, Unit, Chapter } from "@prisma/client"
import { motion } from "framer-motion"
import Link from "next/link"

type CourseWithUnitsAndChapters = Course & {
  units: (Unit & {
    chapters: Chapter[]
  })[]
}

type Props = {
  course: CourseWithUnitsAndChapters
}

const GalleryCourseCard = ({ course }: Props) => {
  return (
    <Link href={`/course/${course.id}/0/0`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group relative h-[360px] rounded-xl overflow-hidden bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm transition-colors hover:border-purple-400/50"
      >
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 z-10" />
          <img
            src={course.image || '/placeholder.svg'}
            alt={course.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Content */}
        <div className="p-5">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
            {course.name}
          </h3>
          
          {/* Course Units */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/60 mb-1">Course Units</p>
            {course.units.slice(0, 3).map((unit, index) => (
              <div
                key={unit.id}
                className="flex items-center text-sm text-white/80 hover:text-white transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2" />
                <span className="line-clamp-1">{unit.name}</span>
              </div>
            ))}
            {course.units.length > 3 && (
              <p className="text-sm text-white/40 pl-3">
                +{course.units.length - 3} more units
              </p>
            )}
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    </Link>
  )
}

export default GalleryCourseCard

