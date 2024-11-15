"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Chapter } from "@prisma/client"

type QuizCardsProps = {
  chapter: Chapter & {
    questions: {
      id: string
      question: string
      options: string
      answer: string
    }[]
  }
}

export function QuizCards({ chapter }: QuizCardsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionState, setQuestionState] = useState<Record<string, boolean | null>>({})

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const checkAnswers = () => {
    const newQuestionState: Record<string, boolean> = {}
    chapter.questions.forEach((question) => {
      newQuestionState[question.id] = answers[question.id] === question.answer
    })
    setQuestionState(newQuestionState)
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-blue-300">Concept Check</h3>
      <div className="space-y-6">
        <AnimatePresence>
          {chapter.questions.map((question, index) => {
            const options = JSON.parse(question.options) as string[]
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className={cn("transition-colors", {
                    "bg-green-800 bg-opacity-50": questionState[question.id] === true,
                    "bg-red-800 bg-opacity-50": questionState[question.id] === false,
                    "bg-gray-800 bg-opacity-50": questionState[question.id] === undefined
                  })}
                >
                  <CardHeader>
                    <CardTitle className="text-white">{question.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                    >
                      {options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={option}
                            id={`${question.id}-${optionIndex}`}
                            className="border-white"
                          />
                          <Label htmlFor={`${question.id}-${optionIndex}`} className="text-gray-300">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <Button onClick={checkAnswers} className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
        Check Answers
      </Button>
    </div>
  )
}