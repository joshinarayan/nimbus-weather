"use client"

import { motion } from "framer-motion"
import { getWeatherIcon } from "@/lib/utils"

interface ForecastCardProps {
  forecast: {
    day: string
    icon: string
    tempHigh: number
    tempLow: number
  }
  index: number
}

export function ForecastCard({ forecast, index }: ForecastCardProps) {
  const WeatherIcon = getWeatherIcon(forecast.icon)

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { type: "spring", stiffness: 400 }
      }}
      className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group"
    >
      {/* Day */}
      <p className="text-center text-white/80 font-semibold mb-4 group-hover:text-cyan-300 transition-colors">
        {forecast.day}
      </p>

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-4"
      >
        <WeatherIcon className="w-12 h-12 text-yellow-300" />
      </motion.div>

      {/* Temperatures */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-white/60">↑</span>
          <span className="text-xl font-bold text-white">
            {forecast.tempHigh}°
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-white/60">↓</span>
          <span className="text-lg text-white/70">
            {forecast.tempLow}°
          </span>
        </div>
      </div>
    </motion.div>
  )
}