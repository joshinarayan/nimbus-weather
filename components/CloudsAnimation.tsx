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
      opacity: 0.5 + (i * 0.07) % 0.3,
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
            filter: "blur(1px)",
          }}
        >
          <svg
            width={cloud.width}
            height={cloud.height}
            viewBox="0 0 300 150"
            fill="none"
          >
            <defs>
              <filter id={`cloud-glow-${cloud.id}`}>
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            
            {/* Glow layer */}
            <ellipse cx="75" cy="90" rx="60" ry="45" fill="rgba(255,255,255,0.2)" filter={`url(#cloud-glow-${cloud.id})`} />
            <ellipse cx="150" cy="75" rx="80" ry="55" fill="rgba(255,255,255,0.2)" filter={`url(#cloud-glow-${cloud.id})`} />
            <ellipse cx="225" cy="90" rx="60" ry="45" fill="rgba(255,255,255,0.2)" filter={`url(#cloud-glow-${cloud.id})`} />
            
            {/* Main body - multiple ellipses for fluffy effect */}
            <ellipse cx="75" cy="90" rx="55" ry="40" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="110" cy="85" rx="50" ry="38" fill="rgba(255,255,255,0.55)" />
            <ellipse cx="140" cy="80" rx="60" ry="45" fill="rgba(255,255,255,0.6)" />
            <ellipse cx="170" cy="82" rx="58" ry="42" fill="rgba(255,255,255,0.58)" />
            <ellipse cx="200" cy="88" rx="52" ry="39" fill="rgba(255,255,255,0.53)" />
            <ellipse cx="225" cy="92" rx="50" ry="37" fill="rgba(255,255,255,0.48)" />
            
            {/* Top highlights for 3D effect */}
            <ellipse cx="130" cy="68" rx="40" ry="28" fill="rgba(255,255,255,0.7)" />
            <ellipse cx="165" cy="70" rx="38" ry="25" fill="rgba(255,255,255,0.65)" />
            <ellipse cx="150" cy="65" rx="30" ry="20" fill="rgba(255,255,255,0.75)" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}