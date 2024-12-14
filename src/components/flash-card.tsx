"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCw } from 'lucide-react'
import { cn } from "@/lib/utils"

interface FlashCardProps {
  front: string
  back: string
  index: number
  total: number
}

export function FlashCard({ front, back, index, total }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative h-48 w-full perspective-1000">
      <AnimatePresence mode="wait" initial={false}>
        {!isFlipped ? (
          <motion.div
            key="front"
            className={cn(
              "absolute inset-0 h-full w-full rounded-xl p-6",
              "bg-gradient-to-br from-indigo-600 to-indigo-400",
              "border border-white/20 shadow-lg",
              "flex flex-col items-center justify-center text-center"
            )}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-2 left-2 text-white/50 text-xs">
              Question {index + 1} of {total}
            </div>
            <p className="text-white text-lg font-medium">{front || "No question provided."}</p>
            <button
              onClick={() => setIsFlipped(true)}
              className="absolute bottom-2 right-2 p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Flip card"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className={cn(
              "absolute inset-0 h-full w-full rounded-xl p-6",
              "bg-gradient-to-br from-purple-600 to-purple-400",
              "border border-white/20 shadow-lg",
              "flex flex-col items-center justify-center text-center"
            )}
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-2 left-2 text-white/50 text-xs">
              Answer {index + 1} of {total}
            </div>
            <p className="text-white text-lg font-medium">{back || "No answer provided."}</p>
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute bottom-2 right-2 p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Flip card back"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
