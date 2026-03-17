"use client"

import { motion } from "framer-motion"

interface CloudsAnimationProps {
  density?: "light" | "medium" | "heavy"
}

export function CloudsAnimation({ density = "medium" }: CloudsAnimationProps) {
  const cloudCount = density === "light" ? 3 : density === "medium" ? 5 : 8

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: cloudCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -200, opacity: 0 }}
          animate={{
            x: ["0%", "110%"],
            y: [
              `${Math.random() * 60}%`,
              `${Math.random() * 60}%`,
            ],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 30 + Math.random() * 20,
            repeat: Infinity,
            delay: i * 3,
            ease: "linear",
          }}
          className="absolute"
          style={{
            top: `${Math.random() * 50}%`,
          }}
        >
          <svg
            width={150 + Math.random() * 100}
            height={60 + Math.random() * 40}
            viewBox="0 0 200 100"
            fill="none"
          >
            <ellipse cx="50" cy="60" rx="50" ry="35" fill="rgba(255,255,255,0.3)" />
            <ellipse cx="100" cy="50" rx="60" ry="40" fill="rgba(255,255,255,0.3)" />
            <ellipse cx="150" cy="60" rx="50" ry="35" fill="rgba(255,255,255,0.3)" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}