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
        return "from-sky-400 via-orange-300 to-yellow-200"
      case "cloudy":
        return "from-slate-600 via-gray-700 to-slate-800"
      case "rainy":
        return "from-slate-700 via-blue-900 to-slate-900"
      case "stormy":
        return "from-slate-900 via-purple-950 to-black"
      case "snowy":
        return "from-slate-200 via-cyan-100 to-blue-50"
      case "clear":
      default:
        return "from-indigo-900 via-purple-900 to-slate-900"
    }
  }

  return (
    <>
      {/* Main Gradient */}
      <motion.div
        key={type}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className={`fixed inset-0 bg-gradient-to-br ${getGradient()}`}
      />

      {/* Atmospheric depth overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(0,0,0,0.2)_100%)] pointer-events-none" />

      {/* Animated grain */}
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="fixed inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* Weather Animations */}
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

      {/* Vignette */}
      <div className="fixed inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.4)] pointer-events-none" />
    </>
  )
}