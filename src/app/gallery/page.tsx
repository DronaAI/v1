import GalleryPageClient from "./GalleryPageClient";
import { prisma } from "@/lib/db";
import React from "react";
import CheckeredBackground from "@/components/CheckeredBackground";

type Props = {};

const GalleryPage = async (props: Props) => {
  const courses = await prisma.course.findMany({
    include: {
      units: {
        include: { chapters: true },
      },
    },
  });
  return (
    <CheckeredBackground>
      <div className="min-h-screen pt-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-50 mix-blend-soft-light"></div>
          <div className="absolute top-0 -left-4 w-3/4 h-3/4 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-3/4 h-3/4 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-3/4 h-3/4 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="relative z-10">
          <GalleryPageClient courses={courses} />
        </div>
      </div>
    </CheckeredBackground>
  );
};

export default GalleryPage;

