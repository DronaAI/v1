import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'
import Link from 'next/link'

export function HeroSection({ controls }) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <motion.section 
      className="text-center py-20"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
    >
      <motion.div 
        variants={fadeInUp} 
        className="mb-8"
        animate={controls}
      >
        <Button 
          variant="outline" 
          className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-all duration-300 rounded-full px-6 py-2"
        >
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Join our learning community
        </Button>
      </motion.div>
      <motion.h1 
        variants={fadeInUp} 
        className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-indigo-900"
      >
        Empower Your Mind with <span className="text-indigo-600">Drona.AI</span>
      </motion.h1>
      <motion.p variants={fadeInUp} className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
        Drona AI is your personalized learning companion, adapting to your unique style and pace to help you master any subject.
      </motion.p>
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center space-x-4">
        <Link href="/gallery">
          <Button 
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Start Learning Now
          </Button>
        </Link>
        <Link href="/create">
          <Button 
            variant="outline" 
            className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
          >
            Create Your Course              
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  )
}

