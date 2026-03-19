"use client"

import { useEffect, useRef } from "react"

export function SnowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const snowflakes: Array<{
      x: number
      y: number
      radius: number
      speed: number
      drift: number
      opacity: number
      swaySpeed: number
      swayRange: number
    }> = []

    for (let i = 0; i < 200; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 0.8 + 0.3,
        drift: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.5,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayRange: Math.random() * 30 + 20,
      })
    }

    let frame = 0

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      snowflakes.forEach((flake) => {
        // Sway effect using sine wave
        const sway = Math.sin(frame * flake.swaySpeed) * flake.swayRange

        // Draw snowflake with soft glow
        ctx.beginPath()
        ctx.arc(flake.x + sway, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Soft glow around snowflake
        ctx.beginPath()
        ctx.arc(flake.x + sway, flake.y, flake.radius + 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.2})`
        ctx.fill()

        flake.y += flake.speed
        flake.x += flake.drift

        if (flake.y > canvas.height + 10) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}