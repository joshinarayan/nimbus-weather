import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, Zap, Wind, CloudFog } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWeatherIcon(condition: string) {
  const lower = condition.toLowerCase()
  
  if (lower.includes("thunder") || lower.includes("storm")) {
    return Zap
  } else if (lower.includes("drizzle")) {
    return CloudDrizzle
  } else if (lower.includes("rain")) {
    return CloudRain
  } else if (lower.includes("snow")) {
    return CloudSnow
  } else if (lower.includes("cloud")) {
    return Cloud
  } else if (lower.includes("clear") || lower.includes("sun")) {
    return Sun
  } else if (lower.includes("mist") || lower.includes("fog") || lower.includes("haze")) {
    return CloudFog
  } else if (lower.includes("wind")) {
    return Wind
  }
  
  return Cloud // Default
}