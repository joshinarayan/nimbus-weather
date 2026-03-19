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
        return "from-sky-400 via-blue-300 to-cyan-200"
      case "cloudy":
        return "from-slate-500 via-gray-600 to-slate-700"
      case "rainy":
        return "from-slate-700 via-slate-800 to-gray-900"
      case "stormy":
        return "from-gray-900 via-slate-900 to-black"
      case "snowy":
        return "from-slate-200 via-blue-100 to-cyan-50"
      case "clear":
      default:
        return "from-indigo-900 via-blue-800 to-purple-900"
    }
  }

  return (
    <>
      {/* Animated Gradient Background */}
      <motion.div
        key={type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className={`fixed inset-0 bg-gradient-to-br ${getGradient()}`}
      />

      {/* Atmospheric overlay with radial gradient */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-black/5 to-black/20 pointer-events-none" />

      {/* Subtle animated grain texture */}
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
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

      {/* Vignette effect */}
      <div className="fixed inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.3)] pointer-events-none" />
    </>
  )
}