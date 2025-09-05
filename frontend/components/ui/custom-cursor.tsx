'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface CursorProps {
  children?: React.ReactNode
}

export function CustomCursor({ children }: CursorProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  const rafRef = useRef<number>()
  const lastParticleTime = useRef<number>(0)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  // Smooth spring config for cursor effects
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Add click ripple effect
  const addRipple = useCallback((x: number, y: number) => {
    const now = Date.now()
    const newRipple = {
      id: now + Math.random(),
      x,
      y,
      timestamp: now
    }
    
    setRipples(prev => {
      const filtered = prev.filter(r => now - r.timestamp < 1000)
      return [...filtered, newRipple].slice(-5)
    })
  }, [])

  // Optimized particle creation with throttling
  const addParticle = useCallback((x: number, y: number) => {
    const now = Date.now()
    // Throttle particle creation to every 80ms for smoother effect
    if (now - lastParticleTime.current < 80) return
    
    lastParticleTime.current = now
    const newParticle = {
      id: now + Math.random(),
      x,
      y,
      timestamp: now
    }
    
    setParticles(prev => {
      const filtered = prev.filter(p => now - p.timestamp < 1200)
      return [...filtered, newParticle].slice(-6) // Moderate number of particles
    })
  }, [])

  useEffect(() => {
    let isMoving = false
    
    const moveCursor = (e: MouseEvent) => {
      // Use RAF for smoother updates
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          cursorX.set(e.clientX)
          cursorY.set(e.clientY)
          
          // Add subtle particle trail when moving
          if (isMoving && !isClicking) {
            addParticle(e.clientX, e.clientY)
          }
          
          rafRef.current = undefined
        })
      }
      isMoving = true
    }

    const handleMouseStop = () => {
      isMoving = false
    }

    const handleClick = (e: MouseEvent) => {
      setIsClicking(true)
      addRipple(e.clientX, e.clientY)
      setTimeout(() => setIsClicking(false), 200)
    }
    
    // Use event delegation for better performance
    const handleInteractiveHover = (e: Event) => {
      const target = e.target as Element
      if (target.matches('button, a, [role="button"], .cursor-pointer, input, textarea, select, [data-magnetic]')) {
        if (e.type === 'mouseover') {
          setIsHovering(true)
        } else if (e.type === 'mouseout') {
          setIsHovering(false)
        }
      }
    }

    // Add optimized event listeners
    window.addEventListener('mousemove', moveCursor, { passive: true })
    window.addEventListener('click', handleClick, { passive: true })
    window.addEventListener('mouseover', handleInteractiveHover, { passive: true })
    window.addEventListener('mouseout', handleInteractiveHover, { passive: true })
    
    // Mouse stop detection
    let stopTimer: NodeJS.Timeout
    const resetStopTimer = () => {
      clearTimeout(stopTimer)
      stopTimer = setTimeout(handleMouseStop, 150)
    }
    window.addEventListener('mousemove', resetStopTimer, { passive: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mouseover', handleInteractiveHover)
      window.removeEventListener('mouseout', handleInteractiveHover)
      window.removeEventListener('mousemove', resetStopTimer)
      clearTimeout(stopTimer)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [cursorX, cursorY, addParticle, addRipple, isClicking])

  return (
    <>
      {/* Keep normal cursor - no hiding */}
      
      {/* Cursor Glow Effect - Follows normal cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9998] bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-md"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: isHovering ? 2.5 : 1.5,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 0.2,
        }}
      />

      {/* Cursor Ring Effect */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9997] border border-blue-400/30"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          borderColor: isHovering ? 'rgba(147, 51, 234, 0.5)' : 'rgba(59, 130, 246, 0.3)',
          rotate: isHovering ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 25,
          mass: 0.1,
        }}
      />

      {/* Click Ripple Effects */}
      <AnimatePresence mode="popLayout">
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed rounded-full pointer-events-none z-[9996] border-2 border-blue-400/60"
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 1,
            }}
            animate={{
              width: 60,
              height: 60,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          />
        ))}
      </AnimatePresence>

      {/* Subtle Particle Trail */}
      <AnimatePresence mode="popLayout">
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="fixed w-1.5 h-1.5 rounded-full pointer-events-none z-[9995]"
            style={{
              background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.4))',
              willChange: 'transform, opacity',
            }}
            initial={{
              x: particle.x - 3,
              y: particle.y - 3,
              scale: 1,
              opacity: 0.7,
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
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: index * 0.02,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Hover Pulse Effect */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9994] bg-gradient-to-r from-purple-400/10 to-pink-400/10"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.3, 0.6, 0.3] 
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {children}
    </>
  )
}

// Optimized Hook for magnetic effect on elements
export function useMagneticEffect(strength: number = 0.3) {
  const [isHovered, setIsHovered] = useState(false)
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!isHovered) return
    
    // Use RAF for smoother magnetic effect
    if (rafRef.current) return
    
    rafRef.current = requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      setElementPosition({ x: deltaX, y: deltaY })
      rafRef.current = undefined
    })
  }, [isHovered, strength])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setElementPosition({ x: 0, y: 0 })
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = undefined
    }
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return {
    style: {
      transform: `translate3d(${elementPosition.x}px, ${elementPosition.y}px, 0)`,
      transition: isHovered ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      willChange: isHovered ? 'transform' : 'auto',
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }
}
