"use client"

import { motion } from "framer-motion"
import { MapPin, Thermometer } from "lucide-react"
import { getWeatherIcon } from "@/lib/utils"

interface WeatherCardProps {
  weatherData: {
    city: string
    country: string
    temp: number
    feelsLike: number
    condition: string
    description: string
  }
  weatherType: string
}

export function WeatherCard({ weatherData, weatherType }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon(weatherData.condition)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative"
    >
      {/* Main Card */}
      <div className="p-8 md:p-12 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden group hover:bg-white/15 transition-all duration-500">
        {/* Location */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6"
        >
          <MapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">
            {weatherData.city}, {weatherData.country}
          </h2>
        </motion.div>

        {/* Weather Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            delay: 0.3,
            rotate: { duration: 1.5, ease: "easeOut" }
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <WeatherIcon className="w-32 h-32 text-yellow-300 drop-shadow-2xl" />
            </motion.div>
            <div className="absolute inset-0 blur-3xl bg-yellow-300/30 -z-10" />
          </div>
        </motion.div>

        {/* Temperature */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <motion.div
            key={weatherData.temp}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl font-black text-white mb-2"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.3)",
            }}
          >
            {Math.round(weatherData.temp)}°
          </motion.div>
          <p className="text-2xl text-white/80 capitalize font-medium">
            {weatherData.description}
          </p>
        </motion.div>

        {/* Feels Like */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-white/70"
        >
          <Thermometer className="w-5 h-5" />
          <span className="text-lg">
            Feels like {Math.round(weatherData.feelsLike)}°C
          </span>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-pink-500/20 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000" />
      </div>
    </motion.div>
  )
}