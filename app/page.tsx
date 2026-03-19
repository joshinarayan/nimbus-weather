"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search, Sun, Cloud, Wind } from "lucide-react"
import { WeatherBackground } from "@/components/WeatherBackground"
import { WeatherCard } from "@/components/WeatherCard"
import { ForecastCard } from "@/components/ForecastCard"
import { VoiceButton } from "@/components/VoiceButton"

interface WeatherData {
  city: string
  country: string
  temp: number
  feelsLike: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  uvIndex: number
  sunrise: string
  sunset: string
  forecast: Array<{
    day: string
    icon: string
    tempHigh: number
    tempLow: number
  }>
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [weatherType, setWeatherType] = useState<"sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "clear">("clear")

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search not supported in this browser. Please use Chrome!")
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      const cityMatch = transcript.match(/weather (?:in|for) (.+)/i) || 
                        transcript.match(/(.+) weather/i)
      
      if (cityMatch) {
        const city = cityMatch[1].trim()
        setSearchQuery(city)
        fetchWeather(city)
      } else {
        setSearchQuery(transcript)
        fetchWeather(transcript)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const fetchWeather = async (city: string) => {
    if (!city.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (response.ok) {
        setWeatherData(data)
        determineWeatherType(data.condition)
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            `The weather in ${data.city} is ${data.description} with a temperature of ${Math.round(data.temp)} degrees celsius.`
          )
          window.speechSynthesis.speak(utterance)
        }
      } else {
        alert(data.error || "Failed to fetch weather")
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
      alert("Failed to fetch weather data")
    } finally {
      setLoading(false)
    }
  }

  const determineWeatherType = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes("thunder") || lower.includes("storm")) setWeatherType("stormy")
    else if (lower.includes("rain") || lower.includes("drizzle")) setWeatherType("rainy")
    else if (lower.includes("snow")) setWeatherType("snowy")
    else if (lower.includes("cloud")) setWeatherType("cloudy")
    else if (lower.includes("clear") || lower.includes("sun")) setWeatherType("sunny")
    else setWeatherType("clear")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather(searchQuery)
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
          const data = await response.json()
          if (response.ok) {
            setWeatherData(data)
            determineWeatherType(data.condition)
          }
        } catch (error) {
          console.error("Error fetching location weather:", error)
        }
      })
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <WeatherBackground type={weatherType} />

      <div className="relative z-10 min-h-screen">
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="p-6 md:p-8"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Cloud className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl md:text-3xl font-black tracking-wider text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                NIMBUS
              </h1>
            </motion.div>

            <VoiceButton 
              isListening={isListening}
              onClick={startVoiceSearch}
            />
          </div>
        </motion.header>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="px-6 md:px-8 max-w-2xl mx-auto"
        >
          <form onSubmit={handleSearch} className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city..."
                className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 text-lg"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="submit"
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Search"}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {weatherData ? (
            <motion.div
              key="weather-data"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
              className="px-6 md:px-8 py-12 max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WeatherCard weatherData={weatherData} weatherType={weatherType} />

                <div className="grid grid-cols-2 gap-4">
                  <DetailCard 
                    icon={<Cloud className="w-6 h-6" />}
                    label="Humidity"
                    value={`${weatherData.humidity}%`}
                  />
                  <DetailCard 
                    icon={<Wind className="w-6 h-6" />}
                    label="Wind Speed"
                    value={`${weatherData.windSpeed} km/h`}
                  />
                  <DetailCard 
                    icon={<MapPin className="w-6 h-6" />}
                    label="Visibility"
                    value={`${weatherData.visibility} km`}
                  />
                  <DetailCard 
                    icon={<Sun className="w-6 h-6" />}
                    label="UV Index"
                    value={weatherData.uvIndex.toString()}
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
              >
                <div className="flex items-center justify-around text-white">
                  <div className="flex items-center gap-3">
                    <Sun className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-sm text-white/60">Sunrise</p>
                      <p className="text-xl font-bold">{weatherData.sunrise}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sun className="w-6 h-6 text-orange-400" />
                    <div>
                      <p className="text-sm text-white/60">Sunset</p>
                      <p className="text-xl font-bold">{weatherData.sunset}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} index={index} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh] text-white"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Cloud className="w-24 h-24 text-cyan-400 mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Hey there! 👋</h2>
              <p className="text-xl text-white/60 mb-4">Search for a city or use voice</p>
              <p className="text-sm text-white/40">Try: "Weather in Tokyo"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function DetailCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
    >
      <div className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  )
}