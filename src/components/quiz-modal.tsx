"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2, HelpCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Chapter, Unit } from "@prisma/client"
import { toast } from "@/components/ui/use-toast"

type QuizModalProps = {
  chapter: Chapter & {
    questions: {
      id: string
      question: string
      options: string
      answer: string
    }[]
  }
  unit: Unit
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export function QuizModal({ chapter, unit }: QuizModalProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionState, setQuestionState] = useState<Record<string, boolean | null>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [isSendingReport, setIsSendingReport] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const checkAnswers = () => {
    const newQuestionState: Record<string, boolean> = {}
    let correctAnswers = 0
    chapter.questions.forEach((question) => {
      const isCorrect = answers[question.id] === question.answer
      newQuestionState[question.id] = isCorrect
      if (isCorrect) correctAnswers++
    })
    setQuestionState(newQuestionState)
    setScore(correctAnswers)
    setQuizCompleted(true)
    if (correctAnswers === chapter.questions.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < chapter.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowHint(false)
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setShowHint(false)
    }
  }

  const resetQuiz = () => {
    setAnswers({})
    setQuestionState({})
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
    setScore(0)
    setShowHint(false)
    setShowResults(false)
  }

  const sendReport = async () => {
    setIsSendingReport(true)
    try {
      const wrongAnswers = chapter.questions
        .filter((question) => answers[question.id] !== question.answer)
        .map((question) => question.question)

      const reportData = {
        unit_name: unit.name,
        chapter_wise_results: [
          {
            chapter_name: chapter.name,
            score: score,
            wrongAnswers: wrongAnswers,
          },
        ],
      }

      const response = await fetch('/api/analyzeQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error('Failed to send report')
      }

      const result = await response.json()
      toast({
        title: "Report Sent",
        description: "Your quiz results have been saved successfully.",
      })
      setShowResults(true)
    } catch (error) {
      console.error('Error sending report:', error)
      toast({
        title: "Error",
        description: "Failed to send the quiz report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingReport(false)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      resetQuiz()
    }
  }, [isOpen])

  const ScoreCard = () => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
    >
      <Card className="bg-gray-800/50 border-none shadow-lg text-white overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-4xl font-bold mb-2"
            >
              {score} / {chapter.questions.length}
            </motion.div>
            <p className="text-lg mb-4">
              {((score / chapter.questions.length) * 100).toFixed(0)}% Correct
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={resetQuiz} className="bg-blue-500 hover:bg-blue-600 text-white text-sm">
                Retry Quiz
              </Button>
              <Button 
                onClick={sendReport} 
                disabled={isSendingReport}
                className="bg-green-500 hover:bg-green-600 text-white text-sm"
              >
                {isSendingReport ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "View Detailed Results"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const ResultsView = () => (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="space-y-4"
    >
      <h2 className="text-xl font-bold text-white text-center mb-3">Detailed Results</h2>
      {chapter.questions.map((question, index) => (
        <Card key={question.id} className="bg-gray-800/50 border-none shadow-lg text-white">
          <CardHeader className="p-3">
            <CardTitle className="text-base">
              Question {index + 1}: {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <p className="mb-1 text-sm">Your answer: {answers[question.id] || "Not answered"}</p>
            <p className="font-bold text-green-400 text-sm">Correct answer: {question.answer}</p>
            <p className="mt-1 text-gray-300 text-sm">Explanation: [Placeholder for detailed explanation]</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
          Attempt Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-xl bg-gray-900/95 border-gray-800 backdrop-blur-xl p-6",
        { "sm:max-w-3xl": showResults }
      )}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-300">
            Concept Check
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {!quizCompleted && !showResults ? (
              chapter.questions.map((question, index) => {
                if (index !== currentQuestionIndex) return null
                const options = JSON.parse(question.options) as string[]
                return (
                  <motion.div
                    key={question.id}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={fadeInUp}
                  >
                    <Card className="bg-gray-800/50 border-none shadow-lg overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-white flex items-center justify-between text-lg">
                          <span>Question {index + 1} of {chapter.questions.length}</span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="text-xl"
                          >
                            🧠
                          </motion.div>
                        </CardTitle>
                        <p className="text-base text-gray-200 mt-2">{question.question}</p>
                      </CardHeader>
                      <CardContent className="p-4">
                        <RadioGroup
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          value={answers[question.id]}
                        >
                          <div className="space-y-2">
                            {options.map((option, optionIndex) => (
                              <motion.div
                                key={optionIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: optionIndex * 0.1 }}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={option}
                                    id={`${question.id}-${optionIndex}`}
                                    className="border-white"
                                  />
                                  <Label
                                    htmlFor={`${question.id}-${optionIndex}`}
                                    className="text-gray-300 text-sm"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </RadioGroup>
                        {showHint && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-3 p-2 rounded-md bg-blue-500/20 text-blue-200 text-sm"
                          >
                            <p>Hint: [Placeholder for hint text]</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowHint(!showHint)}
                        className="bg-transparent border-white/20 text-white hover:bg-white/10"
                      >
                        <HelpCircle className="mr-2" /> {showHint ? "Hide Hint" : "Show Hint"}
                      </Button>
                    </div>
                  </motion.div>
                )
              })
            ) : showResults ? (
              <ResultsView />
            ) : (
              <ScoreCard />
            )}
          </AnimatePresence>
          {!quizCompleted && !showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center mt-4"
            >
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-transparent border-white/20 text-white hover:bg-white/10 text-sm"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>
              {currentQuestionIndex === chapter.questions.length - 1 ? (
                <Button
                  onClick={checkAnswers}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm"
                >
                  Finish Quiz
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={nextQuestion}
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 text-sm"
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

