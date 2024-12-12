import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function CategoryCard({ icon, title, description }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-none bg-transparent hover:bg-white transition-colors duration-300 group">
        <CardContent className="p-6">
          <div className="mb-4 text-gray-900 group-hover:text-orange-500 transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

