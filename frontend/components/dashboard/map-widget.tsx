'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Map,
  MapPin,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Activity,
  ExternalLink,
  Maximize2
} from 'lucide-react'

interface MiniMapPackage {
  id: string
  trackingNumber: string
  lat: number
  lng: number
  status: 'in_transit' | 'delivered' | 'delayed' | 'lost' | 'investigating'
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const mockMiniPackages: MiniMapPackage[] = [
  { id: '1', trackingNumber: 'CP-001', lat: 40.7128, lng: -74.0060, status: 'in_transit', priority: 'high' },
  { id: '2', trackingNumber: 'CP-002', lat: 42.3601, lng: -71.0589, status: 'delivered', priority: 'medium' },
  { id: '3', trackingNumber: 'CP-003', lat: 41.8781, lng: -87.6298, status: 'delayed', priority: 'critical' },
  { id: '4', trackingNumber: 'CP-004', lat: 34.0522, lng: -118.2437, status: 'investigating', priority: 'high' }
]

const statusConfig = {
  in_transit: { color: 'bg-blue-500', icon: Truck, label: 'In Transit' },
  delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
  delayed: { color: 'bg-yellow-500', icon: Clock, label: 'Delayed' },
  lost: { color: 'bg-red-500', icon: AlertTriangle, label: 'Lost' },
  investigating: { color: 'bg-purple-500', icon: Eye, label: 'Investigating' }
}

export function MapWidget() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const getMarkerPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) * 100) / 360
    const y = ((90 - lat) * 100) / 180
    return { x: `${x}%`, y: `${y}%` }
  }

  const getStatusStats = () => {
    const stats = mockMiniPackages.reduce((acc, pkg) => {
      acc[pkg.status] = (acc[pkg.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const stats = getStatusStats()

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="mr-2"
          >
            <Map className="w-5 h-5 text-blue-600" />
          </motion.div>
          Live Package Map
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge className="px-2 py-1 text-xs bg-green-500/10 text-green-700 dark:text-green-400">
            <Activity className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mini Map */}
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-border rounded-lg overflow-hidden">
            {/* Map Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" 
                   style={{
                     backgroundImage: `
                       linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                     `,
                     backgroundSize: '15px 15px'
                   }}
              />
            </div>

            {/* Package Markers */}
            {mockMiniPackages.map((pkg, index) => {
              const position = getMarkerPosition(pkg.lat, pkg.lng)
              const config = statusConfig[pkg.status]
              const isSelected = selectedPackage === pkg.id
              
              return (
                <motion.div
                  key={pkg.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  style={{ left: position.x, top: position.y }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSelected ? 1.3 : 1,
                  }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => setSelectedPackage(pkg.id === selectedPackage ? null : pkg.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`relative ${pkg.status === 'in_transit' ? 'animate-pulse' : ''}`}>
                    <div className={`w-6 h-6 ${config.color} rounded-full flex items-center justify-center shadow-lg border border-white`}>
                      <config.icon className="w-3 h-3 text-white" />
                    </div>
                    
                    {/* Pulse Ring for active packages */}
                    {pkg.status === 'in_transit' && (
                      <div className={`absolute inset-0 ${config.color} rounded-full animate-ping opacity-30`} />
                    )}
                    
                    {/* Package tooltip */}
                    {isSelected && (
                      <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-background border border-border rounded px-2 py-1 shadow-lg whitespace-nowrap z-30"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="text-xs font-medium">{pkg.trackingNumber}</div>
                        <div className="text-xs text-muted-foreground">{config.label}</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* Real-time indicator */}
            <motion.div 
              className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm border border-border rounded-full px-2 py-1 shadow-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Live</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-muted-foreground">In Transit</span>
                <span className="text-sm font-medium">{stats.in_transit || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Delivered</span>
                <span className="text-sm font-medium">{stats.delivered || 0}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Delayed</span>
                <span className="text-sm font-medium">{stats.delayed || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm text-muted-foreground">Issues</span>
                <span className="text-sm font-medium">{(stats.investigating || 0) + (stats.lost || 0)}</span>
              </div>
            </div>
          </div>

          {/* View Full Map Button */}
          <Link href="/map">
            <Button className="w-full" variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Map
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
