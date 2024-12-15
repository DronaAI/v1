"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Brain, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ExplanationModal } from "./explanation-modal"
import { toast } from "@/components/ui/use-toast"
import { Chapter } from "@prisma/client"
import { ChapterContentSchema, ChapterContent } from "./schemas"

type RevisionSectionProps = {
  chapter: Chapter
  onStartQuiz: () => void
}

export function RevisionSection({ chapter, onStartQuiz }: RevisionSectionProps) {
  const [currentSection, setCurrentSection] = useState<"summary" | "keyPoints">("summary")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedItems, setRevealedItems] = useState<boolean[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null)

  useEffect(() => {
    const fetchChapterContent = async () => {
      if (!chapter.id) {
        console.error("chapter.id is undefined")
        toast({
          title: "Error",
          description: "Failed to load chapter content. Chapter ID is missing.",
          variant: "destructive",
        })
        return
      }

      try {
        const response = await fetch(`/api/chapter/${chapter.id}/content`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        const chapterResult = ChapterContentSchema.safeParse(data)
        if (chapterResult.success) {
          setChapterContent(chapterResult.data)
          setRevealedItems(new Array(chapterResult.data[currentSection].length).fill(false))
        } else {
          console.error("Chapter content validation failed:", chapterResult.error)
          toast({
            title: "Error",
            description: "Invalid chapter content format received.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Failed to fetch chapter content:", error)
        toast({
          title: "Error",
          description: "Failed to load chapter content. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchChapterContent()
  }, [chapter.id, currentSection])

  const currentContent = chapterContent ? chapterContent[currentSection] : []

  const revealItem = () => {
    if (currentIndex < currentContent.length) {
      setRevealedItems(prev => {
        const newRevealed = [...prev]
        newRevealed[currentIndex] = true
        return newRevealed
      })
      setCurrentIndex(prev => prev + 1)

      if (typeof currentContent[currentIndex] === 'object') {
        setSelectedItemIndex(currentIndex)
        setShowExplanation(true)
      }
    }
  }

  const handleItemClick = (index: number) => {
    if (revealedItems[index]) {
      setSelectedItemIndex(index)
      setShowExplanation(true)
    }
  }

  const handlePreviousExplanation = () => {
    if (selectedItemIndex > 0) {
      setSelectedItemIndex(prev => prev - 1)
    }
  }

  const handleNextExplanation = () => {
    if (selectedItemIndex < currentContent.length - 1) {
      setSelectedItemIndex(prev => prev + 1)
    }
  }

  const switchSection = (section: "summary" | "keyPoints") => {
    setCurrentSection(section)
    setCurrentIndex(0)
    setRevealedItems(new Array(chapterContent ? chapterContent[section].length : 0).fill(false))
  }

  const progressPercentage = currentContent.length > 0 ? (currentIndex / currentContent.length) * 100 : 0

  if (!chapterContent) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-between">
            <div className="flex items-center">
              {currentSection === "summary" ? (
                <BookOpen className="mr-2 h-6 w-6 text-blue-400" />
              ) : (
                <Brain className="mr-2 h-6 w-6 text-purple-400" />
              )}
              {currentSection === "summary" ? "Chapter Summary" : "Key Concepts"}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchSection("summary")}
                className={cn(
                  "text-sm",
                  currentSection === "summary" ? "bg-blue-500/20 text-blue-400" : "text-gray-400"
                )}
              >
                Summary
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchSection("keyPoints")}
                className={cn(
                  "text-sm",
                  currentSection === "keyPoints" ? "bg-purple-500/20 text-purple-400" : "text-gray-400"
                )}
              >
                Key Points
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-gray-400">{currentIndex} / {currentContent.length}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-gray-700"
            >
              <div
                className={cn(
                  "h-full transition-all",
                  currentSection === "summary" ? "bg-blue-500" : "bg-purple-500"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </Progress>
          </div>

          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {currentContent.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: revealedItems[index] ? 1 : 0.3, 
                    y: 0,
                  }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleItemClick(index)}
                  className={cn(
                    "p-4 rounded-lg transition-all",
                    "break-words whitespace-normal",
                    revealedItems[index] 
                      ? currentSection === "summary" 
                        ? "bg-blue-500/20 text-white cursor-pointer hover:bg-blue-500/30" 
                        : "bg-purple-500/20 text-white cursor-pointer hover:bg-purple-500/30"
                      : "bg-gray-700/50 text-gray-500"
                  )}
                >
                  <div className="text-lg font-medium">
                    {typeof item === 'string' ? item : item.title}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3">
            {currentIndex < currentContent.length && (
              <Button
                onClick={revealItem}
                className={cn(
                  "w-full text-white",
                  currentSection === "summary"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                )}
              >
                Reveal Next {currentSection === "summary" ? "Summary Point" : "Concept"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={onStartQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Attempt Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        currentContent={{
          chapterId: chapter.id,
          chapterName: chapterContent.chapterName,
          content: currentContent[selectedItemIndex],
        }}
        onPrevious={selectedItemIndex > 0 ? handlePreviousExplanation : undefined}
        onNext={selectedItemIndex < currentContent.length - 1 ? handleNextExplanation : undefined}
      />
    </div>
  )
}
