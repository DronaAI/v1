"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Chapter, Unit } from "@prisma/client"

type MainVideoSummaryProps = {
  unit: Unit
  unitIndex: number
  chapter: Chapter
  chapterIndex: number
}

export function MainVideoSummary({
  unit,
  unitIndex,
  chapter,
  chapterIndex,
}: MainVideoSummaryProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
     
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <iframe
          title="chapter video"
          className="w-full aspect-video"
          src={`https://www.youtube.com/embed/${chapter.videoId}`}
          allowFullScreen
        />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 bg-purple-500 hover:bg-purple-600 text-white"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
      </div>
     
    </motion.div>
  )
}