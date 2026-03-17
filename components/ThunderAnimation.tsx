"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ThunderAnimation() {
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const triggerLightning = () => {
      setFlash(true)
      setTimeout(() => setFlash(false), 200)
      
      // Random next flash (3-8 seconds)
      const nextFlash = Math.random() * 5000 + 3000
      setTimeout(triggerLightning, nextFlash)
    }

    const initialDelay = Math.random() * 3000 + 2000
    const timeout = setTimeout(triggerLightning, initialDelay)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {flash && (
        <>
          {/* Lightning Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white pointer-events-none z-20"
            style={{ mixBlendMode: "screen" }}
          />
          
          {/* Lightning Bolt SVG */}
          <motion.svg
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20"
            width="200"
            height="400"
            viewBox="0 0 100 200"
          >
            <motion.path
              d="M50 0 L45 60 L55 60 L40 120 L60 80 L50 80 L65 200"
              fill="none"
              stroke="rgba(255, 255, 150, 0.9)"
              strokeWidth="3"
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </motion.svg>
        </>
      )}
    </AnimatePresence>
  )
}