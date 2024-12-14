import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface FeatureTabProps {
  title: string
  description: string
  content: string
}

export function FeatureTab({ title, description, content }: FeatureTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      <Card className="border-none shadow-none bg-transparent relative">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <p className="text-sm text-gray-500">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

