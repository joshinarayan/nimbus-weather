"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface CloudsAnimationProps {
  density?: "light" | "medium" | "heavy"
}

export function CloudsAnimation({ density = "medium" }: CloudsAnimationProps) {
  const cloudCount = density === "light" ? 3 : density === "medium" ? 5 : 8

  // Generate cloud properties once on client side
  const clouds = useMemo(() => 
    Array.from({ length: cloudCount }).map((_, i) => ({
      id: i,
      width: 150 + (i * 17) % 100,
      height: 60 + (i * 13) % 40,
      topPosition: `${(i * 23) % 50}%`,
      duration: 30 + (i * 7) % 20,
      delay: i * 3,
    }))
  , [cloudCount])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          initial={{ x: -200, opacity: 0 }}
          animate={{
            x: ["0%", "110%"],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            delay: cloud.delay,
            ease: "linear",
          }}
          className="absolute"
          style={{
            top: cloud.topPosition,
          }}
        >
          <svg
            width={cloud.width}
            height={cloud.height}
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