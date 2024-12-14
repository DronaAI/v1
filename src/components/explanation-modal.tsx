"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { FlashCard } from "./flash-card"
import { 
  ContentSchema, 
  ChapterContentSchema, 
  Content, 
  ChapterContent, 
  ContentObject 
} from "./schemas" // Ensure the path is correct

type ExplanationModalProps = {
  isOpen: boolean
  onClose: () => void
  currentContent: {
    chapterId?: string
    chapterName: string
    content: string | ContentObject
  }
  onPrevious?: () => void
  onNext?: () => void
  showNavigation?: boolean
}

export function ExplanationModal({
  isOpen,
  onClose,
  currentContent,
  onPrevious,
  onNext,
  showNavigation = true
}: ExplanationModalProps) {
  const [parsedContent, setParsedContent] = useState<Content | null>(null)
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null)
  const [activeTab, setActiveTab] = useState<'summary' | 'keyPoints'>('summary')
  const [expandedPoints, setExpandedPoints] = useState<{ [key: number]: boolean }>({})

  // Validate currentContent using Zod
  useEffect(() => {
    const result = ContentSchema.safeParse(currentContent)
    if (result.success) {
      setParsedContent(result.data)
    } else {
      console.error("Content validation failed:", result.error)
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      })
      onClose()
    }
  }, [currentContent, onClose])

  // Fetch chapter content when modal is open and chapterId is available
  useEffect(() => {
    if (isOpen && parsedContent?.chapterId) {
      const fetchChapterContent = async () => {
        try {
          console.log(`Fetching content for chapterId: ${parsedContent.chapterId}`)
          const response = await fetch(`/api/chapter/${parsedContent.chapterId}/content`)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          console.log(`Received data for chapterId ${parsedContent.chapterId}:`, data)

          // Validate chapterContent
          const chapterResult = ChapterContentSchema.safeParse(data)
          if (chapterResult.success) {
            setChapterContent(chapterResult.data)
          } else {
            console.error("Chapter content validation failed:", chapterResult.error)
            toast({
              title: "Error",
              description: "Failed to load chapter content. Please try again.",
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
    }
  }, [isOpen, parsedContent?.chapterId])

  // Reset activeTab and expandedPoints when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('summary')
      setExpandedPoints({})
    }
  }, [isOpen])

  if (!parsedContent) {
    return null
  }

  const toggleExpand = (index: number) => {
    setExpandedPoints(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const renderPointCard = (point: string | ContentObject, index: number) => {
    if (typeof point === 'string') {
      return (
        <div key={index} className="bg-white/10 p-4 rounded-lg shadow-md">
          <p className="text-white">{point}</p>
        </div>
      )
    } else {
      return (
        <div key={index} className="bg-white/10 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-semibold">{point.title}</h4>
            <button onClick={() => toggleExpand(index)} aria-label="Toggle Explanation">
              {expandedPoints[index] ? <ChevronUp className="h-4 w-4 text-white" /> : <ChevronDown className="h-4 w-4 text-white" />}
            </button>
          </div>
          <AnimatePresence>
            {expandedPoints[index] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 overflow-hidden"
              >
                <p className="text-white/80">{point.explanation || "No explanation provided."}</p>
                {point.flashcards && point.flashcards.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {point.flashcards.map((flashcard, fcIndex) => (
                      <FlashCard
                        key={fcIndex}
                        front={flashcard.front}
                        back={flashcard.back}
                        index={fcIndex}
                        total={point.flashcards.length}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md bg-gray-900/95 border border-gray-700 rounded-lg backdrop-blur-lg p-6">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white/60 hover:text-white"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Modal Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">
              {parsedContent.chapterName}
            </h2>
            <p className="text-gray-400 text-sm">
              Unit 2, Chapter 1
            </p>
          </div>

          {/* Tabs for Summary and Key Points */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant={activeTab === 'summary' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('summary')}
              className={cn(
                "flex-1",
                activeTab === 'summary' ? "bg-blue-600 text-white" : "text-white/60 hover:text-white/80"
              )}
            >
              Summary
            </Button>
            <Button
              variant={activeTab === 'keyPoints' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('keyPoints')}
              className={cn(
                "flex-1",
                activeTab === 'keyPoints' ? "bg-purple-600 text-white" : "text-white/60 hover:text-white/80"
              )}
            >
              Key Points
            </Button>
          </div>

          {/* Content based on Active Tab */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {activeTab === 'summary' && chapterContent?.summary.map((point, index) => renderPointCard(point, index))}
            {activeTab === 'keyPoints' && chapterContent?.keyPoints.map((point, index) => renderPointCard(point, index))}
          </div>

          {/* Navigation Buttons */}
          {showNavigation && (
            <div className="flex justify-between items-center mt-4">
              {onPrevious && (
                <Button
                  variant="ghost"
                  onClick={onPrevious}
                  className="text-white/60 hover:text-white/90 hover:bg-white/5"
                >
                  Previous
                </Button>
              )}
              {onNext && (
                <Button
                  variant="ghost"
                  onClick={onNext}
                  className="text-white/60 hover:text-white/90 hover:bg-white/5"
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
