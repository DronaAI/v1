"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Sparkles,
  BookOpen,
  Brain,
  Rocket,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white overflow-hidden">
      {/* Background Effects */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
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
            repeatType: "reverse",
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
            repeatType: "reverse",
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
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Main Content */}
      <main className="relative pt-32 px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* GitHub Stars Button */}
          <motion.div {...fadeInUp} className="flex justify-center mb-16">
            <Button
              variant="outline"
              className="bg-white/5 backdrop-blur-sm text-white border-white/10 hover:bg-white/10 transition-all duration-300 rounded-full px-6 h-11 group"
            >
              <Star className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors duration-300" />
              <span>Star us on GitHub</span>
              <motion.span
                className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                1.2k
              </motion.span>
            </Button>
          </motion.div>

          {/* Hero Section */}
          <motion.div {...fadeInUp} className="text-center mb-32">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">
              <motion.span
                className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Unlock your Potential
              </motion.span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                with {"  "}
              </motion.span>
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Drona.AI
                </span>
                <motion.span
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="absolute bottom-2 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-400"
                />
              </motion.span>
            </h1>

            <motion.p
              className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Drona AI is your new age mentor that helps you learn and thrive in
              this evolving world of education, where there's always something
              new to discover.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4 items-center"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Link href="/gallery">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 h-11 transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Get started
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Link href="/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/5 backdrop-blur-sm text-white border-white/10 hover:bg-white/10 px-8 h-11 transition-all duration-300 transform hover:scale-105"
                  >
                    <BookOpen className="mr-2 h-4 w-4" /> Generate course
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-32"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Elevate Your Learning Experience
            </h2>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              {[
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Content Curation",
                  description:
                    "Tailored learning paths based on your proficiency and goals.",
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "AI-Powered Mentor",
                  description:
                    "Intelligent assistance that adapts to your unique learning style.",
                },
                {
                  icon: <Rocket className="w-8 h-8" />,
                  title: "Progress Tracking",
                  description:
                    "Interactive quizzes and personalized feedback to boost your growth.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 h-full overflow-hidden group">
                    <CardContent className="p-6 flex flex-col h-full">
                      <motion.div
                        className="mb-6 p-3 bg-purple-500/20 rounded-lg w-fit group-hover:bg-purple-500/30 transition-colors duration-300"
                        animate={
                          hoveredFeature === index
                            ? { scale: 1.1 }
                            : { scale: 1 }
                        }
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-white/60">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-32"
          >
            <div className="relative rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-12 md:p-16 text-center overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <div className="relative z-10">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-4 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Ready to transform your learning journey?
                </motion.h2>
                <motion.p
                  className="text-xl text-white/80 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Join thousands of learners who have already discovered a
                  better way to learn with Drona.AI
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link href="/create">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100 font-medium transition-all duration-300 px-8 h-11 transform hover:scale-105"
                    >
                      Get Started Now <ChevronRight className="ml-2 h-5 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {[
              {
                title: "DronaAI",
                items: [
                  { text: "Your digital mentor, supercharged.", href: "#" },
                ],
              },
              {
                title: "Product",
                items: [
                  { text: "Features", href: "#" },
                  { text: "Pricing", href: "#" },
                  { text: "FAQ", href: "#" },
                ],
              },
              {
                title: "Company",
                items: [
                  { text: "About", href: "#" },
                  { text: "Blog", href: "#" },
                  { text: "Careers", href: "#" },
                ],
              },
              {
                title: "Connect",
                items: [
                  { text: "Twitter", href: "#" },
                  { text: "LinkedIn", href: "#" },
                  { text: "GitHub", href: "#" },
                ],
              },
            ].map((column, index) => (
              <motion.div key={column.title} variants={fadeInUp}>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.items.map((item, itemIndex) => (
                    <motion.li
                      key={item.text}
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {item.text}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-12 pt-8 border-t border-white/10 text-center text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p>&copy; 2024 DronaAI. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
