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
        <DialogContent className="sm:max-w-[425px] bg-[#0a0b1e]/80 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-2">{member.name}</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl">
              <Image
                src={member.image}
                alt={member.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">{member.role}</h3>
            <p className="text-gray-300 mb-4">{member.description}</p>
            <div className="flex space-x-4">
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <LinkedinIcon size={24} />
              </a>
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <GithubIcon size={24} />
              </a>
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                <TwitterIcon size={24} />
              </a>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}

