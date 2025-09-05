'use client'

import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
  animated?: boolean
}

export function GradientText({ 
  children, 
  className = '', 
  from = 'from-blue-600', 
  to = 'to-purple-600',
  animated = false 
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent font-bold',
        from,
        to,
        animated && 'animate-gradient-x',
        className
      )}
      style={animated ? {
        backgroundSize: '200% 200%',
      } : undefined}
    >
      {children}
    </span>
  )
}
