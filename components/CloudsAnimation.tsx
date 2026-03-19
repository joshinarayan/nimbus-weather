"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface CloudsAnimationProps {
  density?: "light" | "medium" | "heavy"
}

export function CloudsAnimation({ density = "medium" }: CloudsAnimationProps) {
  const cloudCount = density === "light" ? 3 : density === "medium" ? 5 : 8

  const clouds = useMemo(() => 
    Array.from({ length: cloudCount }).map((_, i) => ({
      id: i,
      width: 200 + (i * 17) % 150,
      height: 80 + (i * 13) % 60,
      topPosition: `${(i * 23) % 60}%`,
      duration: 40 + (i * 7) % 30,
      delay: i * 4,
      opacity: 0.6 + (i * 0.07) % 0.3,
    }))
  , [cloudCount])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          initial={{ x: -300, opacity: 0 }}
          animate={{
            x: ["0%", "120%"],
            opacity: [0, cloud.opacity, cloud.opacity, 0],
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
            filter: "blur(2px)",
          }}
        >
          <svg
            width={cloud.width}
            height={cloud.height}
            viewBox="0 0 300 150"
            fill="none"
          >
            {/* Multiple overlapping ellipses for fluffy clouds */}
            <defs>
              <filter id={`cloud-glow-${cloud.id}`}>
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>
            
            {/* Back layer - glow */}
            <ellipse cx="75" cy="90" rx="60" ry="45" fill="rgba(255,255,255,0.15)" filter={`url(#cloud-glow-${cloud.id})`} />
            <ellipse cx="150" cy="75" rx="80" ry="55" fill="rgba(255,255,255,0.15)" filter={`url(#cloud-glow-${cloud.id})`} />
            <ellipse cx="225" cy="90" rx="60" ry="45" fill="rgba(255,255,255,0.15)" filter={`url(#cloud-glow-${cloud.id})`} />
            
            {/* Main cloud body */}
            <ellipse cx="75" cy="90" rx="55" ry="40" fill="rgba(255,255,255,0.4)" />
            <ellipse cx="120" cy="80" rx="60" ry="45" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="150" cy="75" rx="75" ry="50" fill="rgba(255,255,255,0.45)" />
            <ellipse cx="180" cy="80" rx="60" ry="45" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="225" cy="90" rx="55" ry="40" fill="rgba(255,255,255,0.4)" />
            
            {/* Highlights for depth */}
            <ellipse cx="140" cy="65" rx="40" ry="25" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="170" cy="70" rx="35" ry="20" fill="rgba(255,255,255,0.55)" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}