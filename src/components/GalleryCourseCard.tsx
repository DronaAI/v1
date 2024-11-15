import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type Props = {
  course: Course & {
    units: (Unit & {
      chapters: Chapter[];
    })[];
  };
};

const GalleryCourseCard = ({ course }: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="relative">
        <Link href={`/course/${course.id}/0/0`} className="relative block">
          <Image
            src={course.image || "/placeholder.svg"}
            className="object-cover w-full h-48 transition-transform duration-300 ease-in-out transform hover:scale-110"
            width={300}
            height={200}
            alt={`Cover image for ${course.name}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end justify-start p-4">
            <h3 className="text-white text-xl font-bold">{course.name}</h3>
          </div>
        </Link>
      </div>

      <div className="p-4">
        <h4 className="text-sm text-gray-400 mb-2 font-semibold">Course Units</h4>
        <div className="space-y-1">
          {course.units.map((unit, unitIndex) => (
            <Link
              href={`/course/${course.id}/${unitIndex}/0`}
              key={unit.id}
              className="block text-blue-400 hover:text-blue-300 transition-colors duration-200 truncate"
            >
              {unit.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GalleryCourseCard;