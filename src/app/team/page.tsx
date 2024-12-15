'use client'


import { Metadata } from 'next'
import TeamGrid from '@/components/TeamGrid'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ValueCard from '@/components/ValueCard'
import { PersonStanding, Lightbulb, Globe } from 'lucide-react'


// export const metadata: Metadata = {
//   title: 'Our Team | Drona.AI',
//   description: 'Meet the brilliant minds behind Drona.AI',
// }

const teamMembers = [
  {
    name: "Rudransh Shinghal",
    role: "Application Developer",
    description: "As our versatile Application Developer, Rudransh brings an impressive arsenal of tech stacks to the table. His expertise spans across multiple programming languages and frameworks, allowing him to tackle diverse challenges in software development.",
    image: "./ruddy.jpg",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/rudransh-shinghal",
      github: "https://github.com/rudransh-shinghal",
      twitter: "https://twitter.com/rudransh_s"
    }
  },
  {
    name: "Aviral Shukla",
    role: "Operations & Full Stack Engineer",
    description: "Aviral is the driving force behind our operations, known for his unparalleled ability to get things done efficiently. As a multifaceted engineer, he seamlessly navigates the realms of Full Stack development, IoT, Robotics, and DevOps.",
    image: "./aviral.jpg",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/aviral-shukla",
      github: "https://github.com/aviral-shukla",
      twitter: "https://twitter.com/aviral_s"
    }
  },
  {
    name: "Aanya Jain",
    role: "Software Architect & SDLC Specialist",
    description: "Aanya is our resident expert in software architecture and the Software Development Life Cycle (SDLC). Her exceptional brainstorming skills and comprehensive understanding of software systems allow her to design elegant, efficient solutions to complex problems.",
    image: "./anya.png",
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/aanya-jain",
      github: "https://github.com/aanya-jain",
      twitter: "https://twitter.com/aanya_j"
    }
  }
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <motion.div
          className="absolute top-0 -left-4 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-3/4 h-3/4 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The brilliant minds behind Drona.AI, working tirelessly to revolutionize AI-powered learning and shape the future of education.
          </p>
        </motion.div>

        {/* Team Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-24 text-center"
        >
          <h2 className="text-3xl font-bold mb-6 inline-flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-yellow-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Our Values
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
            At Drona.AI, we're driven by innovation, collaboration, and a relentless pursuit of excellence. Our team is committed to pushing the boundaries of AI technology to create transformative learning experiences for everyone.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<PersonStanding />}
              title="Personalized Learning"
              description="We understand and cater to each student's unique needs and learning style."
            />
            <ValueCard
              icon={<Lightbulb />}
              title="AI-Powered Education"
              description="Leveraging AI to make high-quality education accessible and impactful."
            />
            <ValueCard
              icon={<Globe />}
              title="Education for All"
              description="Committed to making education a right, not a privilege, through AI-driven solutions."
            />
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <TeamGrid members={teamMembers} />
      </div>
    </div>
  )
}
