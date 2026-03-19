"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Search } from "lucide-react"

interface CityResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

interface CityAutocompleteProps {
  onCitySelect: (city: string) => void
  value: string
  onChange: (value: string) => void
}

export function CityAutocomplete({ onCitySelect, value, onChange }: CityAutocompleteProps) {
  const [results, setResults] = useState<CityResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      )
      const data = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchCities(newValue)
    }, 300)
  }

  const handleCityClick = (city: CityResult) => {
    const cityName = city.state 
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`
    
    onChange(cityName)
    onCitySelect(cityName)
    setShowResults(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for a city..."
          className="w-full px-6 py-4 pl-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 text-lg"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        
        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-cyan-400 rounded-full"
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl z-50"
          >
            {results.map((city, index) => (
              <motion.button
                key={`${city.name}-${city.country}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCityClick(city)}
                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-white/10 transition-colors text-left group"
              >
                <MapPin className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-white font-semibold">
                    {city.name}
                    {city.state && <span className="text-white/60">, {city.state}</span>}
                  </p>
                  <p className="text-sm text-white/50">{city.country}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}