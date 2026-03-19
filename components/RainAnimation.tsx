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
      thickness: number
    }> = []

    const dropCount = intensity === "light" ? 150 : intensity === "medium" ? 300 : 500
    const windAngle = 5 // Slight angle for realism

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * (canvas.width + 200) - 100,
        y: Math.random() * canvas.height - canvas.height,
        length: Math.random() * 15 + 15,
        speed: Math.random() * 3 + 8,
        opacity: Math.random() * 0.3 + 0.4,
        thickness: Math.random() * 1 + 0.5,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        // Draw rain drop with gradient for realism
        const gradient = ctx.createLinearGradient(
          drop.x, drop.y,
          drop.x + windAngle, drop.y + drop.length
        )
        gradient.addColorStop(0, `rgba(174, 194, 224, 0)`)
        gradient.addColorStop(0.5, `rgba(174, 194, 224, ${drop.opacity})`)
        gradient.addColorStop(1, `rgba(174, 194, 224, 0)`)

        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = drop.thickness
        ctx.lineCap = 'round'
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x + windAngle, drop.y + drop.length)
        ctx.stroke()

        drop.y += drop.speed
        drop.x += windAngle * 0.3

        if (drop.y > canvas.height + 10) {
          drop.y = -drop.length
          drop.x = Math.random() * (canvas.width + 200) - 100
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