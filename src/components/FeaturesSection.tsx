import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, Rocket } from 'lucide-react'

export function FeaturesSection({ activeTab, setActiveTab }) {
  return (
    <section className="py-20">
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold mb-4 text-indigo-900">How Drona.AI Transforms Your Learning</h2>
        <p className="text-xl max-w-2xl mx-auto text-gray-600">
          Experience a revolutionary approach to education tailored just for you.
        </p>
      </motion.div>

      <Tabs defaultValue="learn" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="learn" onClick={() => setActiveTab('learn')}>Learn</TabsTrigger>
          <TabsTrigger value="practice" onClick={() => setActiveTab('practice')}>Practice</TabsTrigger>
          <TabsTrigger value="master" onClick={() => setActiveTab('master')}>Master</TabsTrigger>
        </TabsList>
        <TabsContent value="learn" className="mt-8">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-indigo-600 mb-4" />}
            title="Personalized Learning Paths"
            description="Our AI analyzes your learning style and creates custom study plans that adapt as you progress."
          />
        </TabsContent>
        <TabsContent value="practice" className="mt-8">
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-indigo-600 mb-4" />}
            title="Interactive Exercises"
            description="Engage with dynamic quizzes and problem-solving activities that reinforce your understanding."
          />
        </TabsContent>
        <TabsContent value="master" className="mt-8">
          <FeatureCard
            icon={<Rocket className="w-12 h-12 text-indigo-600 mb-4" />}
            title="Skill Mastery Tracking"
            description="Monitor your progress with detailed analytics and celebrate your achievements as you master new skills."
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
          <h3 className="text-2xl font-semibold mb-2 text-indigo-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </motion.div>
      </CardContent>
    </Card>
  )
}

