'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface CursorProps {
  children?: React.ReactNode
}

export function CustomCursor({ children }: CursorProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [cursorVariant, setCursorVariant] = useState('default')
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      
      // Add particle trail
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }
      
      setParticles(prev => [...prev, newParticle].slice(-15)) // Keep last 15 particles
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    
    // Add event listeners for interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, [role="button"], .cursor-pointer, input, textarea, select'
    )
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', moveCursor)

    // Cleanup particles periodically
    const cleanupInterval = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.timestamp < 1000))
    }, 100)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      clearInterval(cleanupInterval)
    }
  }, [cursorX, cursorY])

  const variants = {
    default: {
      scale: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      mixBlendMode: 'difference' as const,
    },
    hover: {
      scale: 1.5,
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      mixBlendMode: 'difference' as const,
    },
  }

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={variants}
        animate={isHovering ? 'hover' : 'default'}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Cursor Glow Effect */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9998] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />

      {/* Particle Trail */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="fixed w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full pointer-events-none z-[9997]"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: 0.8,
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 20,
              y: particle.y + (Math.random() - 0.5) * 20,
              scale: 0,
              opacity: 0,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: index * 0.02,
            }}
          />
        ))}
      </AnimatePresence>

      {children}
    </>
  )
}

// Hook for magnetic effect on elements
export function useMagneticEffect(strength: number = 0.3) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isHovered) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setElementPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setElementPosition({ x: 0, y: 0 })
  }

  return {
    style: {
      transform: `translate(${elementPosition.x}px, ${elementPosition.y}px)`,
      transition: isHovered ? 'none' : 'transform 0.3s ease-out',
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }
}
