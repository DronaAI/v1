'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Twitter, ChevronRight, Star, LucideThermometerSnowflake } from "lucide-react"
import Image from "next/image"
import CheckeredBackground from "../components/CheckeredBackground"
import Link from 'next/link'
import acic from '../../public/acic-vgu.png'
import azure from '../../public/azure.svg'
import nav  from '../../public/nav-logo-white.svg'
import niti from '../../public/NITI_Aayog_logo.svg.png'



export default function Component() {
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const glowEffect = {
    textShadow: isHovered 
      ? "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #8899ff, 0 0 35px #8899ff, 0 0 40px #8899ff, 0 0 50px #8899ff, 0 0 75px #8899ff"
      : "none",
    transition: "text-shadow 0.3s ease-in-out"
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-[#1a2b3c] to-[#0d1520] text-white overflow-hidden">
      <CheckeredBackground>
        <main className="container mx-auto px-4 relative z-10">
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
                className="bg-gray-800 bg-opacity-50 text-white border-none hover:bg-gray-700 transition-all duration-300 rounded-full px-6 py-2"
                style={{
                  boxShadow: isHovered ? "0 0 10px rgba(136, 153, 255, 0.5)" : "none",
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease-in-out"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Star className="w-5 h-5 mr-2" />
                Star us on GitHub
              </Button>
            </motion.div>
            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              style={glowEffect}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Unlock your Potential<br />with <span className="text-[#8899ff]">Drona.AI</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
             Drona AI is your new age mentor that helps you learn , and thrive with this changing world of education , where there's always something new to learn.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex justify-center space-x-4">
              <Link href="/gallery">
              <Button 
                className="bg-white text-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
              >
                Get started
              </Button>
              </Link>
                <Link href="/create">
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
              >
                Generate course              </Button>
                </Link>
            </motion.div>
          </motion.section>

          <motion.section 
            className="py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-center text-3xl font-bold mb-12">Trusted by</h2>
            <div className="flex justify-center items-center space-x-12 flex-wrap">
              {[nav, acic, azure,niti].map((company, index) => (
                 <motion.div
                  key={company}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Image src={company} alt="Company" width={120} height={40} className="opacity-70 hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.section>

          <section className="py-20">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-bold mb-4 text-[#8899ff]">Drona</h2>
              <h3 className="text-5xl font-bold mb-4">is here to bring the best information to your focus just like arjun</h3>
              <p className="text-xl max-w-2xl mx-auto text-gray-300">
                ... so you don't have to. Whether you're a student, a professional, or just a person on the internet, we got you covered.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "/placeholder.svg", title: "Content Curation", description: "All you need to do is to tell us what you want to learn and your proficiency and we will curate the resorces ", subtext: "The internet is full of great resources to learn, but there's a problem. They are ephemeral. They come and go." },
                { icon: "/placeholder.svg", title: "Mentor in action", description: "Not yet another chat bot", subtext: "Our RAG based model is an actual mentor it understanstands your pain points based on the quizes and will answer the questions based on those checks " },
                { icon: "/placeholder.svg", title: "", description: "Life is all about the people you know.", subtext: "Tell supermemory about people you know, and when you forget, you know where to look." }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800 bg-opacity-20 border-gray-700 hover:bg-opacity-30 transition-all duration-300">
                    <CardContent className="p-6">
                      {/* <Image src={feature.icon} alt={feature.title} width={48} height={48} className="mb-4" /> */}
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-300 mb-2">{feature.description}</p>
                      <p className="text-sm text-gray-400">{feature.subtext}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Ready to supercharge your memory?</h2>
              <p className="text-xl text-gray-300 mb-8">Join thousands of users who have already transformed their digital life with Supermemory.</p>
              <Link href= "/create">
              <Button 
                className="bg-[#8899ff] text-white hover:bg-[#7788ee] transition-all duration-300 transform hover:scale-105 text-lg px-8 py-3" 
                
              >
                Get Started Now <ChevronRight className="ml-2 h-5 w-5"/>
              </Button>
              </Link>
            </div>
          </section>
        </main>

        <footer className="bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">DronaAI</h3>
                <p className="text-gray-400">Your digital Mentor, supercharged.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 DronaAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </CheckeredBackground>
    </div>
  )
}