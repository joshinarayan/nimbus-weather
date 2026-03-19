"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ThunderAnimation() {
  const [flash, setFlash] = useState(false)
  const [boltPosition, setBoltPosition] = useState({ x: "50%", rotation: 0 })

  useEffect(() => {
    const triggerLightning = () => {
      // Random position across screen
      setBoltPosition({
        x: `${20 + Math.random() * 60}%`,
        rotation: -15 + Math.random() * 30,
      })
      
      setFlash(true)
      setTimeout(() => setFlash(false), 150)
      
      // Random next flash (2-7 seconds)
      const nextFlash = Math.random() * 5000 + 2000
      setTimeout(triggerLightning, nextFlash)
    }

    const initialDelay = Math.random() * 2000 + 1000
    const timeout = setTimeout(triggerLightning, initialDelay)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <AnimatePresence>
      {flash && (
        <>
          {/* Screen Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="fixed inset-0 bg-blue-100 pointer-events-none z-20"
            style={{ mixBlendMode: "screen" }}
          />
          
          {/* Lightning Bolt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0.7, 1, 0], scale: [0.9, 1, 1, 1, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, times: [0, 0.2, 0.4, 0.6, 1] }}
            className="fixed top-0 pointer-events-none z-20"
            style={{ 
              left: boltPosition.x,
              transform: `translateX(-50%) rotate(${boltPosition.rotation}deg)`
            }}
          >
            <svg
              width="120"
              height="500"
              viewBox="0 0 100 400"
              className="drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Main bolt */}
              <path
                d="M50 0 L48 80 L54 80 L45 160 L52 160 L42 240 L55 180 L48 180 L56 100 L50 100 Z"
                fill="rgba(200, 230, 255, 0.95)"
                filter="url(#glow)"
              />
              
              {/* Inner bright core */}
              <path
                d="M50 0 L49 80 L52 80 L46 160 L51 160 L44 240 L53 180 L49 180 L54 100 L50 100 Z"
                fill="rgba(255, 255, 255, 1)"
              />
              
              {/* Branch 1 */}
              <path
                d="M52 60 L58 70 L54 90"
                stroke="rgba(200, 230, 255, 0.8)"
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
              />
              
              {/* Branch 2 */}
              <path
                d="M46 140 L40 155 L43 170"
                stroke="rgba(200, 230, 255, 0.7)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#glow)"
              />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}