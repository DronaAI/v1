'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface CheckeredBackgroundProps {
  children: React.ReactNode
}

interface Square {
  x: number
  y: number
  opacity: number
}

export default function CheckeredBackground({ children }: CheckeredBackgroundProps) {
  const [hoveredSquares, setHoveredSquares] = useState<Square[]>([])

  const gridSize = 20
  const squareSize = 20 // in pixels
  const trailLength = 10

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / squareSize)
    const y = Math.floor((e.clientY - rect.top) / squareSize)

    setHoveredSquares(prevSquares => {
      const newSquare = { x, y, opacity: 1 }
      const updatedSquares = [newSquare, ...prevSquares.slice(0, trailLength - 1)]
      return updatedSquares
    })
  }, [squareSize])

  const handleMouseLeave = () => {
    setHoveredSquares([])
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setHoveredSquares(prevSquares =>
        prevSquares.map(square => ({
          ...square,
          opacity: Math.max(0, square.opacity - 0.1)
        })).filter(square => square.opacity > 0)
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      <div 
        className="absolute inset-0 overflow-hidden z-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${squareSize}px ${squareSize}px`
          }} 
        />
        {hoveredSquares.map((square, index) => (
          <div 
            key={index}
            className="absolute bg-white transition-opacity duration-300 ease-in-out"
            style={{
              left: square.x * squareSize,
              top: square.y * squareSize,
              width: squareSize,
              height: squareSize,
              opacity: square.opacity * 0.2
            }}
          />
        ))}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}