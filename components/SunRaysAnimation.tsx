"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

export function SunRaysAnimation() {
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 3,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
    }))
  , [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sun Orb */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-16 right-16 md:top-24 md:right-24"
      >
        <div className="relative w-32 h-32 md:w-48 md:h-48">
          {/* Core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 blur-2xl opacity-80" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-100 to-orange-200 blur-xl" />
          <div className="absolute inset-4 rounded-full bg-white blur-lg" />
        </div>
      </motion.div>

      {/* God Rays */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          initial={{ opacity: 0.2 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
          className="absolute top-16 right-16 md:top-24 md:right-24 origin-center"
          style={{
            transform: `rotate(${i * 22.5}deg)`,
          }}
        >
          <div 
            className="w-2 h-48 md:h-72 bg-gradient-to-b from-yellow-200/40 via-yellow-300/20 to-transparent"
            style={{
              clipPath: "polygon(40% 0%, 60% 0%, 55% 100%, 45% 100%)",
            }}
          />
        </motion.div>
      ))}

      {/* Floating Light Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.startX}vw`,
            y: `${particle.startY}vh`,
            opacity: 0,
          }}
          animate={{
            x: [`${particle.startX}vw`, `${(particle.startX + 20) % 100}vw`],
            y: [`${particle.startY}vh`, `${(particle.startY - 30 + 100) % 100}vh`],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          className="absolute rounded-full bg-yellow-200"
          style={{
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 3}px rgba(253, 224, 71, 0.6)`,
          }}
        />
      ))}

      {/* Ambient Light Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-yellow-200/20 via-orange-200/10 to-transparent blur-3xl" />
    </div>
  )
}