"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

interface CloudsAnimationProps {
  density?: "light" | "medium" | "heavy"
}

export function CloudsAnimation({ density = "medium" }: CloudsAnimationProps) {
  const cloudCount = density === "light" ? 4 : density === "medium" ? 7 : 10

  const clouds = useMemo(() => 
    Array.from({ length: cloudCount }).map((_, i) => ({
      id: i,
      scale: 0.8 + (i * 0.15) % 0.6,
      topPosition: `${(i * 17) % 70}%`,
      duration: 50 + (i * 11) % 40,
      delay: i * 5,
      opacity: 0.4 + (i * 0.08) % 0.35,
      layer: i % 3, // 3 layers for depth
    }))
  , [cloudCount])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background layer clouds (furthest) */}
      {clouds.filter(c => c.layer === 0).map((cloud) => (
        <CloudSVG key={`bg-${cloud.id}`} cloud={cloud} blur={3} />
      ))}
      
      {/* Middle layer clouds */}
      {clouds.filter(c => c.layer === 1).map((cloud) => (
        <CloudSVG key={`mid-${cloud.id}`} cloud={cloud} blur={1.5} />
      ))}
      
      {/* Foreground layer clouds (closest) */}
      {clouds.filter(c => c.layer === 2).map((cloud) => (
        <CloudSVG key={`fg-${cloud.id}`} cloud={cloud} blur={0.5} />
      ))}
    </div>
  )
}

function CloudSVG({ cloud, blur }: { cloud: any; blur: number }) {
  return (
    <motion.div
      initial={{ x: "-30%", opacity: 0 }}
      animate={{
        x: ["0%", "130%"],
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
        filter: `blur(${blur}px)`,
        transform: `scale(${cloud.scale})`,
      }}
    >
      <svg
        width="350"
        height="140"
        viewBox="0 0 350 140"
        fill="none"
      >
        <defs>
          <filter id={`soft-glow-${cloud.id}`}>
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <radialGradient id={`cloud-gradient-${cloud.id}`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </radialGradient>
        </defs>
        
        {/* Soft glow base */}
        <ellipse cx="90" cy="85" rx="70" ry="50" fill="rgba(255,255,255,0.15)" filter={`url(#soft-glow-${cloud.id})`} />
        <ellipse cx="175" cy="70" rx="95" ry="60" fill="rgba(255,255,255,0.15)" filter={`url(#soft-glow-${cloud.id})`} />
        <ellipse cx="260" cy="85" rx="70" ry="50" fill="rgba(255,255,255,0.15)" filter={`url(#soft-glow-${cloud.id})`} />
        
        {/* Main cloud body with gradient */}
        <ellipse cx="80" cy="90" rx="65" ry="45" fill={`url(#cloud-gradient-${cloud.id})`} />
        <ellipse cx="125" cy="80" rx="70" ry="48" fill={`url(#cloud-gradient-${cloud.id})`} />
        <ellipse cx="165" cy="75" rx="80" ry="55" fill={`url(#cloud-gradient-${cloud.id})`} />
        <ellipse cx="205" cy="78" rx="75" ry="50" fill={`url(#cloud-gradient-${cloud.id})`} />
        <ellipse cx="245" cy="85" rx="68" ry="46" fill={`url(#cloud-gradient-${cloud.id})`} />
        <ellipse cx="275" cy="92" rx="60" ry="42" fill={`url(#cloud-gradient-${cloud.id})`} />
        
        {/* Bright highlights on top */}
        <ellipse cx="155" cy="58" rx="50" ry="32" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="190" cy="62" rx="45" ry="28" fill="rgba(255,255,255,0.75)" />
        <ellipse cx="175" cy="55" rx="35" ry="22" fill="rgba(255,255,255,0.95)" />
        
        {/* Small puffs for detail */}
        <ellipse cx="110" cy="70" rx="28" ry="20" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="230" cy="72" rx="32" ry="22" fill="rgba(255,255,255,0.65)" />
      </svg>
    </motion.div>
  )
}