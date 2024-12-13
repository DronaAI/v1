'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Star, Sparkles, BookOpen, Brain, Rocket } from 'lucide-react'
import Link from 'next/link'
import CheckeredBackground from "@/components/CheckeredBackground"

export default function Home() {
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: "easeInOut"
      }
    })
  }, [controls])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A1B] via-[#1F0B44] to-[#421E6D] text-white overflow-hidden font-sans">
      <CheckeredBackground>
        <main className="container mx-auto px-4 relative z-10">
          <motion.section
            className="text-center py-32 md:py-40 relative overflow-hidden"
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div
              variants={fadeInUp}
              className="mb-8 flex justify-center"
            >
              <Button
                variant="outline"
                className="bg-white/5 backdrop-blur-sm text-white border-white/10 hover:bg-white/10 transition-all duration-300 rounded-full px-6 py-2 flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                <span>Star us on GitHub</span>
                <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-sm">1.2k</span>
              </Button>
            </motion.div>

            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-800/30 blur-[120px] -z-10"
              />
              <motion.h1
                variants={fadeInUp}
                className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
              >
                Unlock your Potential
                <br />
                with{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Drona.AI</span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute bottom-0 left-0 h-[4px] bg-gradient-to-r from-blue-400 to-purple-400"
                  />
                </span>
              </motion.h1>
            </div>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-gray-300 font-light leading-relaxed"
            >
              Drona AI is your new age mentor that helps you learn and thrive in this evolving world of education, where there's always something new to discover.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4 items-center"
            >
              <Link href="/gallery" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Get started
                </Button>
              </Link>
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 backdrop-blur-sm text-white border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Generate course
                </Button>
              </Link>
            </motion.div>
          </motion.section>

          <section className="py-20">
            <motion.div 
              className="text-center mb-16 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="absolute inset-0 bg-blue-500/20 blur-[120px] -z-10" 
              />
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Drona</h2>
              <h3 className="text-4xl font-bold mb-6 text-white">is here to bring the best information to your focus</h3>
              <p className="text-xl max-w-2xl mx-auto text-gray-300">
                Your personalized learning journey starts here. Let us guide you through the vast landscape of knowledge.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Content Curation",
                  description: "Tell us what you want to learn and your proficiency level",
                  subtext: "We'll curate the perfect learning path tailored just for you"
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Mentor in Action",
                  description: "Not just another chatbot - a true learning companion",
                  subtext: "Our RAG-based model understands your unique learning style"
                },
                {
                  icon: <Rocket className="w-8 h-8" />,
                  title: "Guided Progress",
                  description: "Track your learning journey with interactive quizzes",
                  subtext: "Receive personalized feedback and improvement suggestions"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 h-full overflow-hidden group">
                    <CardContent className="p-6 flex flex-col h-full relative">
                      <div className="mb-6 p-4 bg-blue-500 rounded-lg w-fit group-hover:bg-purple-500 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-300 mb-4 text-base">{feature.description}</p>
                      <p className="text-sm text-gray-400 mt-auto">{feature.subtext}</p>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20">
            <motion.div 
              className="relative rounded-3xl bg-gradient-to-r from-purple-600 to-purple-800 p-12 md:p-16 text-center overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
              <div className="relative z-10">
                <h2 className="text-4xl font-bold mb-4 text-white">Ready to transform your learning journey?</h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of learners who have already discovered a better way to learn with Drona.AI
                </p>
                <Link href="/create">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-medium transition-all duration-300 transform hover:scale-105 px-8"
                  >
                    Get Started Now <ChevronRight className="ml-2 h-5 w-4"/>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-t border-white/10 mt-20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">DronaAI</h3>
                <p className="text-gray-400">Your digital mentor, supercharged.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
              <p>&copy; 2024 DronaAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </CheckeredBackground>
    </div>
  )
}

