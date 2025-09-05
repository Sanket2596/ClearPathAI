'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
}

interface MouseRipple {
  id: number
  x: number
  y: number
  timestamp: number
}

export function InteractiveBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mouseRipples, setMouseRipples] = useState<MouseRipple[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const animationRef = useRef<number>()

  // Create initial particles
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // Create initial particles
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.6 + 0.2,
    }))

    setParticles(initialParticles)

    return () => {
      window.removeEventListener('resize', updateDimensions)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Create ripple effect on mouse move
      if (Math.random() > 0.8) { // Only create ripples occasionally
        const newRipple: MouseRipple = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
        }
        setMouseRipples(prev => [...prev, newRipple].slice(-10))
      }

      // Attract particles to mouse
      setParticles(prev => prev.map(particle => {
        const dx = e.clientX - particle.x
        const dy = e.clientY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 150) {
          const force = (150 - distance) / 150 * 0.02
          return {
            ...particle,
            vx: particle.vx + (dx / distance) * force,
            vy: particle.vy + (dy / distance) * force,
          }
        }
        return particle
      }))
    }

    const handleClick = (e: MouseEvent) => {
      // Create explosion effect on click
      const explosionParticles: MouseRipple[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }))
      setMouseRipples(prev => [...prev, ...explosionParticles].slice(-20))
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [mouseX, mouseY])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx
        let newY = particle.y + particle.vy
        let newVx = particle.vx * 0.99 // Friction
        let newVy = particle.vy * 0.99

        // Bounce off edges
        if (newX <= 0 || newX >= dimensions.width) {
          newVx = -newVx
          newX = Math.max(0, Math.min(dimensions.width, newX))
        }
        if (newY <= 0 || newY >= dimensions.height) {
          newVy = -newVy
          newY = Math.max(0, Math.min(dimensions.height, newY))
        }

        // Add random movement
        newVx += (Math.random() - 0.5) * 0.01
        newVy += (Math.random() - 0.5) * 0.01

        return {
          ...particle,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        }
      }))

      // Clean up old ripples
      setMouseRipples(prev => prev.filter(ripple => Date.now() - ripple.timestamp < 2000))

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}50`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Mouse Ripples */}
      <AnimatePresence>
        {mouseRipples.map((ripple, index) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border-2 border-blue-400/30"
            style={{
              x: ripple.x - 25,
              y: ripple.y - 25,
              width: 50,
              height: 50,
            }}
            initial={{
              scale: 0,
              opacity: 0.8,
              rotate: 0,
            }}
            animate={{
              scale: [0, 2, 4],
              opacity: [0.8, 0.4, 0],
              rotate: 360,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              delay: index * 0.1,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Gradient Orbs that Follow Mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
        style={{
          x: useTransform(mouseX, [0, dimensions.width], [-100, dimensions.width - 300]),
          y: useTransform(mouseY, [0, dimensions.height], [-100, dimensions.height - 300]),
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
        style={{
          x: useTransform(mouseX, [0, dimensions.width], [dimensions.width - 200, -50]),
          y: useTransform(mouseY, [0, dimensions.height], [dimensions.height - 200, -50]),
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </div>
  )
}

// Component for magnetic hover effects
interface MagneticProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 0.4, className = '' }: MagneticProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
