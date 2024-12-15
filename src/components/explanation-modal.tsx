"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { 
  ContentSchema, 
  ChapterContentSchema, 
  Content, 
  ChapterContent, 
  ContentObject,
  Flashcard
} from "./schemas"

type ExplanationModalProps = {
  isOpen: boolean
  onClose: () => void
  currentContent: unknown
  onPrevious?: () => void
  onNext?: () => void
  showNavigation?: boolean
}

export function ExplanationModal({
  isOpen,
  onClose,
  currentContent: rawCurrentContent,
  onPrevious,
  onNext,
  showNavigation = true
}: ExplanationModalProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [parsedContent, setParsedContent] = useState<Content | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])

  useEffect(() => {
    const result = ContentSchema.safeParse(rawCurrentContent)
    if (result.success) {
      setParsedContent(result.data)
      if (result.data.content && typeof result.data.content === 'object' && 'flashcards' in result.data.content) {
        setFlashcards(result.data.content.flashcards)
      }
    } else {
      console.error("Content validation failed:", result.error)
      toast({
        title: "Error",
        description: "Failed to load content. Please try again.",
        variant: "destructive",
      })
      onClose()
    }
  }, [rawCurrentContent, onClose])

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  if (!parsedContent) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl bg-gray-900/95 border-gray-800 backdrop-blur-xl p-6">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <AnimatePresence mode="wait">
            {!showFlashcards ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white">{parsedContent.chapterName}</h2>
                <div className="prose prose-invert max-w-none">
                  {typeof parsedContent.content === 'string' ? (
                    <p>{parsedContent.content}</p>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{parsedContent.content.title}</h3>
                      <p>{parsedContent.content.explanation}</p>
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4">
                  {flashcards.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowFlashcards(true)}
                      className="bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20"
                    >
                      Review Flashcards
                    </Button>
                  )}
                  {showNavigation && (
                    <div className="flex gap-2">
                      {onPrevious && (
                        <Button
                          variant="outline"
                          onClick={onPrevious}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                      )}
                      {onNext && (
                        <Button
                          variant="outline"
                          onClick={onNext}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Flashcards</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setShowFlashcards(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    Back to Explanation
                  </Button>
                </div>
                
                {flashcards.length > 0 ? (
                  <>
                    <div className="relative h-[300px] perspective-1000">
                      <motion.div
                        className="w-full h-full"
                        initial={false}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Card 
                          className="absolute inset-0 cursor-pointer bg-gradient-to-br from-slate-700 to-slate-900 border-none shadow-lg"
                          onClick={() => setIsFlipped(!isFlipped)}
                        >
                          <CardContent className="p-6 h-full flex items-center justify-center">
                            {flashcards.length > 0 ? (
                              <>
                                <div className={cn(
                                  "absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center p-6",
                                  isFlipped && "invisible"
                                )}>
                                  <p className="text-2xl font-medium text-white mb-4">
                                    {flashcards[currentCardIndex]?.front || "No question available"}
                                  </p>
                                  <p className="text-sm text-white/60">Click to flip</p>
                                </div>
                                <div className={cn(
                                  "absolute w-full h-full backface-hidden flex flex-col items-center justify-center text-center p-6 [transform:rotateY(180deg)]",
                                  !isFlipped && "invisible"
                                )}>
                                  <p className="text-2xl font-medium text-white mb-4">
                                    {flashcards[currentCardIndex]?.back || "No answer available"}
                                  </p>
                                  <p className="text-sm text-white/60">Click to flip back</p>
                                </div>
                              </>
                            ) : (
                              <div className="absolute w-full h-full flex items-center justify-center">
                                <p className="text-xl text-white">No flashcards available for this topic.</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <Progress value={(currentCardIndex + 1) / flashcards.length * 100} className="w-full" />
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={handlePreviousCard}
                          disabled={currentCardIndex === 0 || flashcards.length === 0}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous Card
                        </Button>
                        <span className="text-sm text-gray-400">
                          {flashcards.length > 0 ? `Card ${currentCardIndex + 1} of ${flashcards.length}` : "No flashcards"}
                        </span>
                        <Button
                          variant="outline"
                          onClick={handleNextCard}
                          disabled={currentCardIndex === flashcards.length - 1 || flashcards.length === 0}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          Next Card
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No flashcards available for this topic.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

