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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0b1e]/80 backdrop-blur-md border-b border-white/10 z-50">
      <div className="h-full flex items-center justify-between max-w-[1400px] mx-auto px-4">
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
                width={32}
                height={32}
                className="rounded-full"
              />
            </motion.div>
          </Link>

          <div className="hidden md:flex space-x-4">
            {navItems.map(({ name, href }) => (
              <motion.div key={name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors duration-200">
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
              <Github className="w-5 h-5 text-white/70 hover:text-white transition-colors duration-200" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="https://hume-evi-next-js-starter-tau.vercel.app/">
              <Button
                variant="outline"
                size="sm"
                className="text-white/70 hover:text-white border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Drona
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

