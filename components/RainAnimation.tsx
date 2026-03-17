"use client"

import { useEffect, useRef } from "react"

interface RainAnimationProps {
  intensity?: "light" | "medium" | "heavy"
}

export function RainAnimation({ intensity = "medium" }: RainAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drops: Array<{
      x: number
      y: number
      length: number
      speed: number
      opacity: number
    }> = []

    const dropCount = intensity === "light" ? 100 : intensity === "medium" ? 200 : 400

    // Initialize rain drops
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 5,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`
        ctx.lineWidth = 1
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        drop.x += 0.5 // Slight angle

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}