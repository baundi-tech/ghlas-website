'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface MeshGeospatialProps {
  region: string
}

export function MeshGeospatial({ region }: MeshGeospatialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Known locations in Upper West Region with coordinates
    const locations = [
      { name: 'Wa', x: 0.42, y: 0.48, population: 102000, type: 'capital' },
      { name: 'Lawra', x: 0.32, y: 0.32, population: 45000, type: 'town' },
      { name: 'Nandom', x: 0.28, y: 0.28, population: 38000, type: 'town' },
      { name: 'Jirapa', x: 0.48, y: 0.38, population: 52000, type: 'town' },
      { name: 'Tumu', x: 0.72, y: 0.58, population: 48000, type: 'town' },
      { name: 'Gwollu', x: 0.58, y: 0.68, population: 25000, type: 'village' },
      { name: 'Kaleo', x: 0.52, y: 0.45, population: 22000, type: 'village' },
      { name: 'Wechiau', x: 0.22, y: 0.72, population: 31000, type: 'town' },
      { name: 'Hamile', x: 0.18, y: 0.22, population: 15000, type: 'village' },
      { name: 'Funsi', x: 0.65, y: 0.42, population: 18000, type: 'village' },
    ]

    let time = 0
    let animationId: number

    const draw = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw mesh grid
      const cols = 25
      const rows = 18
      const cellW = canvas.width / cols
      const cellH = canvas.height / rows

      ctx.strokeStyle = 'rgba(144, 176, 144, 0.3)'
      ctx.lineWidth = 1.5

      // Draw horizontal lines
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        for (let j = 0; j <= rows; j++) {
          const x = i * cellW
          const y = j * cellH
          const noise = Math.sin(time + i * 0.3) * Math.cos(time + j * 0.3) * 8
          const noise2 = Math.sin(time * 0.8 + i * 0.2) * 3
          if (j === 0) ctx.moveTo(x + noise2, y + noise)
          else ctx.lineTo(x + noise2, y + noise)
        }
        ctx.stroke()
      }

      // Draw vertical lines
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath()
        for (let i = 0; i <= cols; i++) {
          const x = i * cellW
          const y = j * cellH
          const noise = Math.sin(time + i * 0.3) * Math.cos(time + j * 0.3) * 8
          const noise2 = Math.sin(time * 0.8 + j * 0.2) * 3
          if (i === 0) ctx.moveTo(x + noise, y + noise2)
          else ctx.lineTo(x + noise, y + noise2)
        }
        ctx.stroke()
      }

      // Draw locations with pulsing effects
      locations.forEach((loc) => {
        const x = loc.x * canvas.width
        const y = loc.y * canvas.height
        const pulse = Math.sin(time * 3) * 0.5 + 0.5
        const size = loc.type === 'capital' ? 12 : loc.type === 'town' ? 8 : 5
        
        // Outer glow
        ctx.beginPath()
        ctx.arc(x, y, size + pulse * 6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(199, 148, 62, ${0.2 + pulse * 0.2})`
        ctx.fill()
        
        // Inner circle
        ctx.beginPath()
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = '#C7943E'
        ctx.fill()
        
        // Label background
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(0,0,0,0.5)'
        ctx.fillStyle = '#FFFFFF'
        ctx.font = `bold ${loc.type === 'capital' ? '14px' : '12px'} Inter`
        ctx.fillText(loc.name, x + 12, y - 8)
        
        // Population indicator
        ctx.font = '10px Inter'
        ctx.fillStyle = '#90B090'
        ctx.fillText(`${(loc.population / 1000).toFixed(0)}k`, x + 12, y + 4)
        ctx.shadowBlur = 0
      })

      // Draw region label
      ctx.font = 'bold 24px Inter'
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.shadowBlur = 0
      ctx.fillText('UPPER WEST REGION', canvas.width / 2 - 100, canvas.height - 20)
    }

    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [region])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '400px' }}
    />
  )
}