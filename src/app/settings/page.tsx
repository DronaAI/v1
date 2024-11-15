"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const createdCourses = [
  { name: 'Frontend Web Development', units: 5, progress: 80 },
  { name: 'Advanced Mathematics', units: 4, progress: 60 },
  { name: 'Machine Learning Basics', units: 6, progress: 40 },
  { name: 'Data Structures and Algorithms', units: 8, progress: 75 },
]

const performanceData = [
  { course: 'Frontend Web Development', score: 85 },
  { course: 'Advanced Mathematics', score: 72 },
  { course: 'Machine Learning Basics', score: 68 },
  { course: 'Data Structures and Algorithms', score: 90 },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function SettingsPage() {
  const [freeGenerations, setFreeGenerations] = useState(7)
  const maxGenerations = 10

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0b14] to-[#1a1b2e] text-white p-8">
      <motion.main 
        className="max-w-6xl mx-auto space-y-8"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          variants={fadeInUp}
        >
          Your Learning Journey with Drona.AI
        </motion.h1>
        
        <motion.div variants={fadeInUp}>
          <Card className="bg-[#0f1017] border-[#1e2029] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Created Courses</CardTitle>
              <CardDescription>Your progress in courses you've created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {createdCourses.map((course, index) => (
                  <motion.div 
                    key={course.name} 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-blue-400">{course.units} units</span>
                    </div>
                    <Progress value={course.progress} className="w-full h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-[#0f1017] border-[#1e2029] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Performance Overview</CardTitle>
              <CardDescription>Your scores across different courses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2029" />
                    <XAxis dataKey="course" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }} 
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-[#0f1017] border-[#1e2029] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Free Generations</CardTitle>
              <CardDescription>Upgrade to unlock unlimited generations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={(freeGenerations / maxGenerations) * 100} className="w-full h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg">{freeGenerations} / {maxGenerations} Free Generations</span>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-blue-500 hover:bg-blue-600 text-white border-none"
                  >
                    Upgrade
                    <Zap className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.main>
    </div>
  )
}















// import SubscriptionButton from "@/components/SubscriptionButton";
// import { checkSubscription } from "@/lib/subscription";
// import React from "react";

// type Props = {};

// const SettingsPage = async (props: Props) => {
//   const isPro = await checkSubscription();
//   return (
//     <div className="py-8 mx-auto max-w-7xl">
//       <h1 className="text-3xl font-bold">Settings</h1>
//       {isPro ? (
//         <p className="text-xl text-secondary-foreground/60">
//           You are a pro user!
//         </p>
//       ) : (
//         <p className="text-xl text-secondary-foreground/60">
//           You are a free user
//         </p>
//       )}

//       <SubscriptionButton isPro={isPro} />
//     </div>
//   );
// };

// export default SettingsPage;

