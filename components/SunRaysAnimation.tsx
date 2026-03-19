"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

export function SunRaysAnimation() {
  // Generate particle positions once
  const particles = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      initialX: (i * 77) % window.innerWidth,
      initialY: (i * 53) % window.innerHeight,
      targetX: ((i * 89) % window.innerWidth),
      targetY: ((i * 61) % window.innerHeight),
      duration: 5 + (i * 7) % 10,
    }))
  , [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sun Circle */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 blur-3xl"
      />

      {/* Sun Rays */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-1 h-32 bg-gradient-to-b from-yellow-200/50 to-transparent origin-bottom"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-80px)`,
          }}
        />
      ))}

      {/* Floating Light Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
          }}
          animate={{
            y: [particle.initialY, particle.targetY],
            x: [particle.initialX, particle.targetX],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            boxShadow: "0 0 10px rgba(253, 224, 71, 0.8)",
          }}
        />
      ))}
    </div>
  )
}