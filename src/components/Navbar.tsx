"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Github, MessageCircle } from 'lucide-react';
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";

type Props = {
  session: Session | null;
};

const Navbar = ({ session }: Props) => {
  const navItems = [
    { name: "Gallery", href: "/gallery" },
    { name: "Create Course", href: "/create" },
    { name: "Settings", href: "/settings" },
    { name: "Team", href: "/team" },
  ];

  return (
    <>
      <div className="w-full flex justify-center fixed top-0 left-0 right-0 z-50 px-4">
        <nav className="flex items-center justify-between w-full max-w-6xl px-6 py-3 mt-4 mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-filter backdrop-blur-lg rounded-full shadow-lg">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Image
                  src="/logo.svg"
                  alt="Drona.AI Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </motion.div>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navItems.map(({ name, href }) => (
                <motion.div key={name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={href} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
                    {name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {session?.user ? (
                <UserAccountNav user={session.user} />
              ) : (
                <SignInButton />
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="https://github.com/AnonO6/DronaAI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-6 h-6 text-gray-300 hover:text-white transition-colors duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="https://hume-evi-next-js-starter-tau.vercel.app/">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 hover:text-white border-gray-300 hover:border-white bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Drona
                </Button>
              </Link>
            </motion.div>
          </div>
        </nav>
      </div>
      <div className="h-24"></div>
    </>
  );
};

export default Navbar;

