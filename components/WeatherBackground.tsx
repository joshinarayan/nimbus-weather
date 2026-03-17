"use client"

import { motion } from "framer-motion"
import { RainAnimation } from "./RainAnimation"
import { SnowAnimation } from "./SnowAnimation"
import { CloudsAnimation } from "./CloudsAnimation"
import { ThunderAnimation } from "./ThunderAnimation"
import { SunRaysAnimation } from "./SunRaysAnimation"

interface WeatherBackgroundProps {
  type: "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "clear"
}

export function WeatherBackground({ type }: WeatherBackgroundProps) {
  const getGradient = () => {
    switch (type) {
      case "sunny":
        return "from-amber-400 via-orange-500 to-pink-500"
      case "cloudy":
        return "from-slate-600 via-slate-700 to-slate-800"
      case "rainy":
        return "from-slate-800 via-blue-900 to-slate-900"
      case "stormy":
        return "from-slate-900 via-purple-900 to-slate-950"
      case "snowy":
        return "from-blue-200 via-blue-300 to-cyan-200"
      case "clear":
      default:
        return "from-blue-900 via-indigo-900 to-purple-900"
    }
  }

  return (
    <>
      {/* Base Gradient Background */}
      <motion.div
        key={type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className={`fixed inset-0 bg-gradient-to-br ${getGradient()}`}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Weather-Specific Animations */}
      {type === "sunny" && <SunRaysAnimation />}
      {type === "cloudy" && <CloudsAnimation density="medium" />}
      {type === "rainy" && (
        <>
          <CloudsAnimation density="heavy" />
          <RainAnimation intensity="medium" />
        </>
      )}
      {type === "stormy" && (
        <>
          <CloudsAnimation density="heavy" />
          <RainAnimation intensity="heavy" />
          <ThunderAnimation />
        </>
      )}
      {type === "snowy" && <SnowAnimation />}
      {type === "clear" && <CloudsAnimation density="light" />}
    </>
  )
}