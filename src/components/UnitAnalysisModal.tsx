"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricWithArrow } from './MetricWithArrow';

type UnitAnalysisModalProps = {
  unitId: string;
  unitName: string;
  onClose: () => void;
  onUpdateCourse: () => void;
};

type AnalysisType = {
  strengths: string[];
  weaknesses: string[];
  unitAnalysis: {
    unitName: string;
    score: number;
    maxScore: number;
    strengths: string[];
    weaknesses: string[];
  }[];
  courseRecommendation: {
    required: boolean;
    percentageThreshold: number;
    explanation: string;
  };
};

const loadingMessages = [
  "Analyzing course patterns...",
  "Evaluating learning outcomes...",
  "Calculating improvement metrics...",
  "Generating personalized insights...",
  "Curating recommendations...",
];

const updateMessages = [
  "Preparing course updates...",
  "Optimizing content structure...",
  "Curating enhanced materials...",
  "Understanding your patterns...",
  "Implementing improvements...",
];

export function UnitAnalysisModal({ unitId, unitName, onClose, onUpdateCourse }: UnitAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [updateMessageIndex, setUpdateMessageIndex] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isUpdating) {
      interval = setInterval(() => {
        setUpdateMessageIndex((prev) => (prev + 1) % updateMessages.length);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isUpdating]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/provideInsights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ unitId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setAnalysis(data.analysis);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setError('Failed to load insights. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [unitId]);

  const handleNextInsight = () => {
    if (analysis && currentInsightIndex < analysis.unitAnalysis.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    }
  };

  const handlePrevInsight = () => {
    if (currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1);
    }
  };

  const handleUpdateCourse = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch('/api/updateUnit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update course');
      }

      const data = await response.json();
      setUpdateMessage(data.message || 'Course updated successfully');
      onUpdateCourse();
    } catch (error) {
      console.error('Error updating course:', error);
      setUpdateMessage('Failed to update course. Please try again.');
    } finally {
      setIsUpdating(false);
      setUpdateMessageIndex(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="bg-gray-900/95 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-800"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Unit Analysis: {unitName}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </Button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-blue-500" />
            </motion.div>
            <motion.p
              key={loadingMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-blue-400 text-center"
            >
              {loadingMessages[loadingMessageIndex]}
            </motion.p>
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 bg-red-500/10 p-4 rounded-lg"
          >
            {error}
          </motion.p>
        )}

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
                  <Card className="bg-gray-800/50 border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {analysis.unitAnalysis[currentInsightIndex].unitName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white mb-2">
                        Score: {analysis.unitAnalysis[currentInsightIndex].score} / {analysis.unitAnalysis[currentInsightIndex].maxScore}
                      </p>
                      <p className="text-emerald-400 mb-2">
                        <strong>Strengths:</strong> {analysis.unitAnalysis[currentInsightIndex].strengths.join(', ')}
                      </p>
                      <p className="text-rose-400">
                        <strong>Weaknesses:</strong> {analysis.unitAnalysis[currentInsightIndex].weaknesses.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePrevInsight}
                  disabled={currentInsightIndex === 0}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleNextInsight}
                  disabled={currentInsightIndex === analysis.unitAnalysis.length - 1}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="bg-gray-800/50 border border-gray-700 mt-6">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Course Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-2">
                  {analysis.courseRecommendation.required ? 'Course update recommended' : 'No course update required'}
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
          {isUpdating ? (
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5 text-blue-400" />
              </motion.div>
              <motion.p
                key={updateMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-400"
              >
                {updateMessages[updateMessageIndex]}
              </motion.p>
            </div>
          ) : (
            <Button
              onClick={handleUpdateCourse}
              disabled={isUpdating}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              Update Course
            </Button>
          )}
        </div>

        {updateMessage && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-emerald-400 bg-emerald-500/10 p-4 rounded-lg"
          >
            {updateMessage}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}

