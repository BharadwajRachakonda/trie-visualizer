"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { geistSans } from "./ui/fonts";

export default function Home() {
  const text = "Welcome to the Trie Visualizer";
  return (
    <div className="mt-5 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="font-extrabold md:text-5xl text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        {text.split("").map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            style={{ transformOrigin: "bottom" }}
            animate={{
              fontWeight: [300, 700, 300],
              scaleY: [1, 1.15, 1],
              color: ["#000", "#fff", "#000"],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: index * 0.08,
              repeatDelay: 0,
              ease: [0.4, 0, 0.6, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
      <motion.div
        className={`${geistSans.className} max-w-5xl text-justify `}
        animate={{ opacity: 1, position: "relative", top: 0 }}
        initial={{ opacity: 0, position: "relative", top: 20 }}
        transition={{ duration: 0.5, ease: "easeInOut", type: "spring" }}
      >
        Built with problem identification and solution in mind, this Trie
        Visualizer is designed to help you understand how tries work through
        interactive visualizations. The problem was identified when I was not
        able to debug my trie easyly and I was forced to draw tries on paper.
        since trie can contain 26 letters, it is hard to visualize them on
        paper, feel free to contribute to the project on my github <br />
        <br />
        <div className="grid place-items-center">
          <div>
            <a
              href="https://github.com/BharadwajRachakonda"
              className="coursor-pointer rounded-4xl border-2 border-white hover:bg-gray-100 hover:text-black transition-all duration-300 px-4 py-2 font-semibold m-2"
            >
              GitHub
            </a>
            <Link
              href="/debug"
              className="coursor-pointer rounded-4xl border-2 border-white hover:bg-gray-100 hover:text-black transition-all duration-300 px-4 py-2 font-semibold m-2"
            >
              Debug
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
