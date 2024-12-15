import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

interface ValueCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Card className="bg-white/5 border-white/10 overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300 h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <motion.div
            className="text-4xl mb-4 text-blue-400"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {icon}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

