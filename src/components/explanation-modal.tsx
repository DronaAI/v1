"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"

const FlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
})

const ContentSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  flashcards: z.array(FlashcardSchema).optional(),
})

type Content = z.infer<typeof ContentSchema>

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

  useEffect(() => {
    const result = ContentSchema.safeParse(rawCurrentContent)
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
  }, [rawCurrentContent, onClose])

  const handleNextCard = () => {
    if (parsedContent?.flashcards && currentCardIndex < parsedContent.flashcards.length - 1) {
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
                <h2 className="text-2xl font-bold text-white">{parsedContent.title}</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    {parsedContent.explanation}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => parsedContent.flashcards && parsedContent.flashcards.length > 0 ? setShowFlashcards(true) : null}
                    className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
                    disabled={!parsedContent.flashcards || parsedContent.flashcards.length === 0}
                  >
                    Practice with Flashcards
                  </Button>
                  {showNavigation && (
                    <div className="flex gap-2">
                      {onPrevious && (
                        <Button
                          variant="outline"
                          onClick={onPrevious}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Previous Topic
                        </Button>
                      )}
                      {onNext && (
                        <Button
                          variant="outline"
                          onClick={onNext}
                          className="bg-transparent border-white/20 text-white hover:bg-white/10"
                        >
                          Next Topic
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
                
                {parsedContent.flashcards && parsedContent.flashcards.length > 0 ? (
                  <>
                    <div className="relative h-[300px]">
                      <Card 
                        className="absolute inset-0 cursor-pointer bg-gray-800/50 backdrop-blur-lg border-none"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <CardContent className="p-6 h-full flex items-center justify-center">
                          <motion.div
                            className="w-full h-full"
                            initial={false}
                            animate={{ rotateX: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring" }}
                            style={{ transformStyle: "preserve-3d" }}
                          >
                            <div className={cn(
                              "absolute w-full h-full backface-hidden flex items-center justify-center text-center p-6",
                              isFlipped && "invisible"
                            )}>
                              <p className="text-xl font-medium text-white">
                                {parsedContent.flashcards[currentCardIndex].front}
                              </p>
                            </div>
                            <div className={cn(
                              "absolute w-full h-full backface-hidden flex items-center justify-center text-center p-6 [transform:rotateX(180deg)]",
                              !isFlipped && "invisible"
                            )}>
                              <p className="text-xl font-medium text-white">
                                {parsedContent.flashcards[currentCardIndex].back}
                              </p>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handlePreviousCard}
                        disabled={currentCardIndex === 0}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous Card
                      </Button>
                      <span className="text-sm text-gray-400">
                        {currentCardIndex + 1} / {parsedContent.flashcards.length}
                      </span>
                      <Button
                        variant="outline"
                        onClick={handleNextCard}
                        disabled={currentCardIndex === parsedContent.flashcards.length - 1}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        Next Card
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
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
