"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { LinkedinIcon, GithubIcon, TwitterIcon } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  socialLinks: {
    linkedin: string
    github: string
    twitter: string
  }
}

interface TeamMemberModalProps {
  member: TeamMember | null
  onClose: () => void
}

export default function TeamMemberModal({ member, onClose }: TeamMemberModalProps) {
  if (!member) return null

  return (
    <AnimatePresence>
      <Dialog open={!!member} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px] bg-gradient-to-br from-[#0a0b1e]/95 to-[#1a1b3e]/95 backdrop-blur-xl border-white/10 rounded-2xl overflow-hidden p-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-10" />
            {member.image && (
              <Image
                src={member.image}
                alt={member.name}
                width={550}
                height={300}
                className="w-full h-[300px] object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {member.name}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-gray-200"
              >
                {member.role}
              </motion.p>
            </div>
          </motion.div>
          <div className="p-6">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 mb-6 leading-relaxed"
            >
              {member.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex space-x-4"
            >
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-300"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors duration-300"
              >
                <TwitterIcon size={20} />
              </a>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}
