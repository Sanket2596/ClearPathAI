'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  glowEffect?: boolean
}

export function FloatingCard({ 
  children, 
  className = '', 
  hoverEffect = true,
  glowEffect = false 
}: FloatingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-out',
        'backdrop-blur-sm bg-card/80 border border-border/50',
        hoverEffect && 'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10',
        hoverEffect && 'hover:-translate-y-1',
        glowEffect && isHovered && 'animate-glow',
        'group cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        {glowEffect && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </Card>
  )
}
