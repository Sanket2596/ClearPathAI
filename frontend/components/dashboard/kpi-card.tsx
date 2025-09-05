

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'stable'
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend = 'stable',
  variant = 'default',
  className,
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return TrendingUp
      case 'down':
        return TrendingDown
      default:
        return Minus
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return variant === 'destructive' ? 'text-red-500' : 'text-green-500'
      case 'down':
        return variant === 'destructive' ? 'text-green-500' : 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getCardVariant = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      case 'destructive':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      default:
        return ''
    }
  }

  const TrendIcon = getTrendIcon()

  return (
    <Card className={cn(getCardVariant(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendIcon className={cn('h-3 w-3', getTrendColor())} />
                <span>{description}</span>
              </div>
            )}
          </div>
          {variant !== 'default' && (
            <Badge 
              variant={
                variant === 'success' ? 'success' :
                variant === 'warning' ? 'warning' :
                variant === 'destructive' ? 'destructive' : 'default'
              }
              className="text-xs"
            >
              {variant === 'success' ? 'Good' :
               variant === 'warning' ? 'Alert' :
               variant === 'destructive' ? 'Critical' : 'Normal'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
