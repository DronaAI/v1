"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, MessageCircle } from "lucide-react";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import logo from "../../public/logo.svg";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";

type Props = {
  session: Session | null;
};

export default function Component({ session }: Props = { session: null }) {
  const navItems = [
    { name: "Gallery", href: "/gallery" },
    { name: "Create Course", href: "/create" },
    { name: "Settings", href: "/settings" },
    { name: "Team", href: "/team" },
  ];

  return (
    <>
      <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 px-4">
        <nav className="flex items-center justify-center w-full max-w-5xl px-6 py-2 mt-4 mb-8 bg-opacity-20 bg-cyan-900 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Image
                  src={logo}
                  alt="Drona.AI Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </motion.div>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navItems.map(({ name, href }) => (
                <motion.a
                  key={name}
                  href={href}
                  className="text-sm text-cyan-100 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {name}
                </motion.a>
              ))}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {session?.user ? (
                <UserAccountNav user={session.user} />
              ) : (
                <SignInButton />
              )}
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="https://github.com/AnonO6/DronaAI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6 text-cyan-100 hover:text-white transition-colors duration-300" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                href="https://hume-evi-next-js-starter-tau.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-cyan-100 hover:text-white border-cyan-100 hover:border-white transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Drona
                </Button>
              </Link>
            </motion.div>
          </div>
        </nav>
      </div>
      <div className="h-24"></div>{" "}
    </>
  );
}
