import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting (simple version)
const requestLog = new Map<string, number[]>()

// Rate limit: 60 requests per hour per IP
const RATE_LIMIT = 60
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

// Cache weather data for 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = requestLog.get(ip) || []
  
  // Remove old requests outside the time window
  const recentRequests = requests.filter(time => now - time < RATE_WINDOW)
  
  if (recentRequests.length >= RATE_LIMIT) {
    return false // Rate limit exceeded
  }
  
  recentRequests.push(now)
  requestLog.set(ip, recentRequests)
  return true
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const lat = searchParams.get('lat')
    const lon = searchParams.get('lon')

    if (!city && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Please provide either city name or coordinates' },
        { status: 400 }
      )
    }

    // Check cache
    const cacheKey = city || `${lat},${lon}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data)
    }

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

    if (!apiKey) {
      console.error('Weather API key not configured')
      return NextResponse.json(
        { error: 'Weather service temporarily unavailable' },
        { status: 500 }
      )
    }

    // Build API URL
    let weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?'
    let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?'
    
    if (city) {
      weatherUrl += `q=${encodeURIComponent(city)}`
      forecastUrl += `q=${encodeURIComponent(city)}`
    } else {
      weatherUrl += `lat=${lat}&lon=${lon}`
      forecastUrl += `lat=${lat}&lon=${lon}`
    }
    
    weatherUrl += `&appid=${apiKey}&units=metric`
    forecastUrl += `&appid=${apiKey}&units=metric`

    // Fetch current weather
    const weatherResponse = await fetch(weatherUrl)
    
    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return NextResponse.json(
          { error: 'City not found. Please check the spelling and try again.' },
          { status: 404 }
        )
      }
      throw new Error('Weather API error')
    }

    const weatherData = await weatherResponse.json()

    // Fetch 5-day forecast
    const forecastResponse = await fetch(forecastUrl)
    const forecastData = await forecastResponse.json()

    // Process forecast data (get one per day at noon)
    const dailyForecasts = forecastData.list
      .filter((item: any) => item.dt_txt.includes('12:00:00'))
      .slice(0, 5)
      .map((item: any) => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        icon: item.weather[0].main,
        tempHigh: Math.round(item.main.temp_max),
        tempLow: Math.round(item.main.temp_min),
      }))

    // Format response
    const response = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temp: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // m/s to km/h
      visibility: Math.round(weatherData.visibility / 1000), // meters to km
      uvIndex: 5, // Note: UV index requires separate API call or upgrade
      sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true
}),
sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: true
}),
      forecast: dailyForecasts,
    }

    // Cache the response
    cache.set(cacheKey, { data: response, timestamp: Date.now() })

    return NextResponse.json(response)

  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weather data. Please try again.' },
      { status: 500 }
    )
  }
}