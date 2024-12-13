import GalleryPageClient from "./GalleryPageClient"
import { prisma } from "@/lib/db"
import React from "react"

type Props = {}

const GalleryPage = async (props: Props) => {
  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: { chapters: true },
      },
    },
  })
  
  return (
    <div className="min-h-screen bg-[#0a0b1e]">
      {/* Navbar Space */}
      <div className="h-16" />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <div className="absolute top-0 -left-4 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 -right-4 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-3/4 h-3/4 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>
      
      <div className="relative min-h-[calc(100vh-4rem)]">
        <GalleryPageClient courses={courses} />
      </div>
    </div>
  )
}

export default GalleryPage

