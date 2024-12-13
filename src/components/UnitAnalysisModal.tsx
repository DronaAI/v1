import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricWithArrow } from './MetricWithArrow'

type UnitAnalysisModalProps = {
  unitId: string
  unitName: string
  onClose: () => void
  onUpdateCourse: () => void
}

type AnalysisType = {
  strengths: string[]
  weaknesses: string[]
  unitAnalysis: {
    unitName: string
    score: number
    maxScore: number
    strengths: string[]
    weaknesses: string[]
  }[]
  courseRecommendation: {
    required: boolean
    percentageThreshold: number
    explanation: string
  }
}

export function UnitAnalysisModal({ unitId, unitName, onClose, onUpdateCourse }: UnitAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0)

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/provideInsights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ unitId }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch insights')
        }

        const data = await response.json()
        setAnalysis(data.analysis)
      } catch (error) {
        console.error('Error fetching insights:', error)
        setError('Failed to load insights. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInsights()
  }, [unitId])

  const handleNextInsight = () => {
    if (analysis && currentInsightIndex < analysis.unitAnalysis.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1)
    }
  }

  const handlePrevInsight = () => {
    if (currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Unit Analysis: {unitName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {isLoading && <p className="text-white">Loading insights...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {analysis && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <MetricWithArrow
                label="Overall Strength"
                value={analysis.strengths.length}
                trend="up"
              />
              <MetricWithArrow
                label="Overall Weakness"
                value={analysis.weaknesses.length}
                trend="down"
              />
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentInsightIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        {analysis.unitAnalysis[currentInsightIndex].unitName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white mb-2">
                        Score: {analysis.unitAnalysis[currentInsightIndex].score} / {analysis.unitAnalysis[currentInsightIndex].maxScore}
                      </p>
                      <p className="text-green-400 mb-2">
                        <strong>Strengths:</strong> {analysis.unitAnalysis[currentInsightIndex].strengths.join(", ")}
                      </p>
                      <p className="text-red-400">
                        <strong>Weaknesses:</strong> {analysis.unitAnalysis[currentInsightIndex].weaknesses.join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePrevInsight}
                  disabled={currentInsightIndex === 0}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleNextInsight}
                  disabled={currentInsightIndex === analysis.unitAnalysis.length - 1}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="bg-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-lg text-white">Course Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-2">
                  {analysis.courseRecommendation.required ? "Course update recommended" : "No course update required"}
                </p>
                <p className="text-white mb-2">
                  Threshold: {analysis.courseRecommendation.percentageThreshold}%
                </p>
                <p className="text-white">
                  {analysis.courseRecommendation.explanation}
                </p>
              </CardContent>
            </Card>
          </>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onUpdateCourse} className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
            Update Course
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

