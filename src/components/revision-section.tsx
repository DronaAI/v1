"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Brain, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { ExplanationModal } from "./explanation-modal"
import { CongratulatoryModal } from "./congratulatory-modal"

type RevisionSectionProps = {
  chapter: {
    name: string
    summary: string[]
    keyPoints: string[]
  }
  onStartQuiz: () => void
}

const explanations = {
  summary: [
    {
      title: "Introduction to Algebra",
      explanation: "Algebra is a fundamental branch of mathematics that deals with mathematical symbols and the rules for manipulating these symbols. It forms the foundation for advanced mathematics and has practical applications in various fields. In algebra, we use variables (usually letters) to represent unknown values and establish relationships between different quantities through equations.",
      flashcards: [
        {
          front: "What is Algebra?",
          back: "A branch of mathematics dealing with symbols and rules for manipulating these symbols"
        },
        {
          front: "What are variables?",
          back: "Symbols (usually letters) used to represent unknown values in mathematical expressions"
        },
        {
          front: "Why is Algebra important?",
          back: "It forms the foundation for advanced mathematics and has practical applications in various fields"
        }
      ]
    },
    {
      title: "Problem Solving with Equations",
      explanation: "Equations and variables are the core tools of algebra that allow us to represent and solve real-world problems mathematically. An equation shows that two expressions are equal, and by manipulating these equations according to mathematical rules, we can find the values of unknown variables. This process of solving equations is essential in fields ranging from physics to economics.",
      flashcards: [
        {
          front: "What is an equation?",
          back: "A mathematical statement showing that two expressions are equal"
        },
        {
          front: "How do we solve equations?",
          back: "By manipulating them according to mathematical rules to find unknown values"
        },
        {
          front: "Where are equations used?",
          back: "In various fields including physics, economics, and everyday problem-solving"
        }
      ]
    },
    {
      title: "Applications of Algebraic Thinking",
      explanation: "Algebraic thinking extends beyond just solving equations. It provides a systematic way of approaching problems, analyzing relationships between quantities, and making predictions. This type of thinking is crucial in fields like science, where we need to understand relationships between variables, and economics, where we analyze trends and make forecasts.",
      flashcards: [
        {
          front: "What is algebraic thinking?",
          back: "A systematic way of approaching problems and analyzing relationships between quantities"
        },
        {
          front: "How is algebra used in science?",
          back: "To understand relationships between variables and make predictions"
        },
        {
          front: "What role does algebra play in economics?",
          back: "It helps analyze trends and make forecasts using mathematical models"
        }
      ]
    }
  ],
  keyPoints: [
    {
      title: "Variables in Algebraic Expressions",
      explanation: "Variables are the building blocks of algebra. They are symbols, usually letters, that represent unknown values or quantities that can change. In algebraic expressions, variables can be combined with numbers and mathematical operations to represent complex relationships. Understanding how to work with variables is crucial for solving algebraic problems.",
      flashcards: [
        {
          front: "What is a variable?",
          back: "A symbol (usually a letter) that represents an unknown value or quantity that can change"
        },
        {
          front: "How are variables used in expressions?",
          back: "They combine with numbers and operations to represent relationships"
        },
        {
          front: "Why are variables important?",
          back: "They allow us to represent unknown values and solve complex problems"
        }
      ]
    }
  ]
}

export function RevisionSection({ chapter, onStartQuiz }: RevisionSectionProps) {
  const [currentSection, setCurrentSection] = useState<"summary" | "keyPoints">("summary")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedItems, setRevealedItems] = useState<boolean[]>([])
  const [showCongrats, setShowCongrats] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  const summary = Array.isArray(chapter.summary) ? chapter.summary : [
    "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols.",
    "It provides a way to represent and solve problems using equations and variables.",
    "Algebraic thinking helps in problem-solving across various fields, from science to economics."
  ]

  const keyPoints = Array.isArray(chapter.keyPoints) ? chapter.keyPoints : [
    "Variables represent unknown values in algebraic expressions",
    "Equations show the relationship between different variables",
    "Algebraic expressions can be simplified using mathematical rules",
    "The solution to an equation is the value that makes it true"
  ]

  const currentContent = currentSection === "summary" ? summary : keyPoints
  const currentExplanations = explanations[currentSection]

  useEffect(() => {
    setRevealedItems(new Array(currentContent.length).fill(false))
    setCurrentIndex(0)
    setShowCongrats(false)
  }, [currentSection, currentContent.length])

  const revealItem = () => {
    if (currentIndex < currentContent.length) {
      setRevealedItems(prev => {
        const newRevealed = [...prev]
        newRevealed[currentIndex] = true
        return newRevealed
      })
      setCurrentIndex(prev => prev + 1)
    }

    if (currentIndex === currentContent.length - 1) {
      setShowCongrats(true)
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
    setShowCongrats(false)
  }

  const handleViewOtherSection = () => {
    switchSection(currentSection === "summary" ? "keyPoints" : "summary")
  }

  const progressPercentage = (currentIndex / currentContent.length) * 100

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-none shadow-lg">
        <CardHeader>
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
            {currentContent.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: revealedItems[index] ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleItemClick(index)}
                className={cn(
                  "p-4 rounded-lg transition-all",
                  revealedItems[index] 
                    ? currentSection === "summary" 
                      ? "bg-blue-500/20 text-white cursor-pointer hover:bg-blue-500/30" 
                      : "bg-purple-500/20 text-white cursor-pointer hover:bg-purple-500/30"
                    : "bg-gray-700/50 text-gray-500"
                )}
              >
                {item}
              </motion.div>
            ))}
          </div>

          {!showCongrats && (
            <Button
              onClick={revealItem}
              disabled={currentIndex >= currentContent.length}
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
        </CardContent>
      </Card>

      <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        currentContent={currentExplanations[selectedItemIndex]}
        onPrevious={selectedItemIndex > 0 ? handlePreviousExplanation : undefined}
        onNext={selectedItemIndex < currentContent.length - 1 ? handleNextExplanation : undefined}
      />

      <CongratulatoryModal
        isOpen={showCongrats}
        onClose={() => setShowCongrats(false)}
        onStartQuiz={onStartQuiz}
        onViewOtherSection={handleViewOtherSection}
        currentSection={currentSection}
      />
    </div>
  )
}

