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
    <div className="relative h-80 w-full max-w-2xl mx-auto perspective-1000">
      <AnimatePresence mode="wait" initial={false}>
        {!isFlipped ? (
          <motion.div
            key="front"
            className={cn(
              "absolute inset-0 h-full w-full rounded-xl p-8",
              "bg-gradient-to-br from-blue-600 to-blue-400",
              "border border-white/20 shadow-lg",
              "flex flex-col items-center justify-center text-center"
            )}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: 180 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-4 left-4 text-white/50 text-sm">
              Question {index + 1} of {total}
            </div>
            <p className="text-white text-xl font-medium max-w-lg">{front || "No question provided."}</p>
            <button
              onClick={() => setIsFlipped(true)}
              className="absolute bottom-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Flip card"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className={cn(
              "absolute inset-0 h-full w-full rounded-xl p-8",
              "bg-gradient-to-br from-blue-600 to-blue-400",
              "border border-white/20 shadow-lg",
              "flex flex-col items-center justify-center text-center"
            )}
            initial={{ rotateY: -180 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-4 left-4 text-white/50 text-sm">
              Answer {index + 1} of {total}
            </div>
            <p className="text-white text-xl font-medium max-w-lg">{back || "No answer provided."}</p>
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute bottom-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Flip card back"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

