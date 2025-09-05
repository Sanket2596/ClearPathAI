'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { USMapSVG } from './us-map-svg'
import {
  MapPin,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Search,
  Eye,
  Route,
  Activity
} from 'lucide-react'

interface PackageLocation {
  id: string
  trackingNumber: string
  lat: number
  lng: number
  status: 'in_transit' | 'delivered' | 'delayed' | 'lost' | 'investigating'
  lastUpdate: string
  destination: string
  origin: string
  estimatedArrival: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface RoutePoint {
  lat: number
  lng: number
  timestamp: string
  location: string
  status: string
}

const mockPackageLocations: PackageLocation[] = [
  {
    id: '1',
    trackingNumber: 'CP-2024-001',
    lat: 40.7128,
    lng: -74.0060,
    status: 'in_transit',
    lastUpdate: '2 hours ago',
    destination: 'Boston, MA',
    origin: 'New York, NY',
    estimatedArrival: '2024-01-15 14:30',
    priority: 'high'
  },
  {
    id: '2',
    trackingNumber: 'CP-2024-002',
    lat: 42.3601,
    lng: -71.0589,
    status: 'delivered',
    lastUpdate: '30 minutes ago',
    destination: 'Boston, MA',
    origin: 'Philadelphia, PA',
    estimatedArrival: '2024-01-15 12:00',
    priority: 'medium'
  },
  {
    id: '3',
    trackingNumber: 'CP-2024-003',
    lat: 41.8781,
    lng: -87.6298,
    status: 'delayed',
    lastUpdate: '1 hour ago',
    destination: 'Chicago, IL',
    origin: 'Detroit, MI',
    estimatedArrival: '2024-01-15 16:45',
    priority: 'critical'
  },
  {
    id: '4',
    trackingNumber: 'CP-2024-004',
    lat: 34.0522,
    lng: -118.2437,
    status: 'investigating',
    lastUpdate: '4 hours ago',
    destination: 'Los Angeles, CA',
    origin: 'San Francisco, CA',
    estimatedArrival: '2024-01-15 18:00',
    priority: 'high'
  }
]

const statusConfig = {
  in_transit: { 
    color: 'bg-blue-500', 
    icon: Truck, 
    label: 'In Transit',
    pulse: 'animate-pulse'
  },
  delivered: { 
    color: 'bg-green-500', 
    icon: CheckCircle, 
    label: 'Delivered',
    pulse: ''
  },
  delayed: { 
    color: 'bg-yellow-500', 
    icon: Clock, 
    label: 'Delayed',
    pulse: 'animate-bounce'
  },
  lost: { 
    color: 'bg-red-500', 
    icon: AlertTriangle, 
    label: 'Lost',
    pulse: 'animate-ping'
  },
  investigating: { 
    color: 'bg-purple-500', 
    icon: Eye, 
    label: 'Investigating',
    pulse: 'animate-pulse'
  }
}

interface InteractiveMapProps {
  height?: string
  showControls?: boolean
  selectedPackage?: string | null
  onPackageSelect?: (packageId: string) => void
}

export function InteractiveMap({ 
  height = 'h-96', 
  showControls = true,
  selectedPackage = null,
  onPackageSelect 
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }) // Center of USA
  const [zoom, setZoom] = useState(4)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(selectedPackage)
  const [showRoutes, setShowRoutes] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredPackages = mockPackageLocations.filter(pkg => 
    filterStatus === 'all' || pkg.status === filterStatus
  )

  const handleMarkerClick = (packageId: string) => {
    setSelectedMarker(packageId)
    onPackageSelect?.(packageId)
  }

  const handleZoomIn = () => setZoom(Math.min(zoom + 1, 18))
  const handleZoomOut = () => setZoom(Math.max(zoom - 1, 2))
  const handleReset = () => {
    setMapCenter({ lat: 39.8283, lng: -98.5795 })
    setZoom(4)
    setSelectedMarker(null)
  }

  const getMarkerPosition = (lat: number, lng: number) => {
    // US-focused projection (approximate Mercator for continental US)
    // US bounds: lat 24-49, lng -125 to -66
    const minLat = 24, maxLat = 49
    const minLng = -125, maxLng = -66
    
    // Clamp coordinates to US bounds
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat))
    const clampedLng = Math.max(minLng, Math.min(maxLng, lng))
    
    // Convert to percentage with padding for map margins
    const x = ((clampedLng - minLng) / (maxLng - minLng)) * 80 + 10 // 10% padding on sides
    const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 70 + 15 // 15% padding top/bottom
    
    return { x: `${x}%`, y: `${y}%` }
  }

  return (
    <div className="relative">
      {/* Map Controls */}
      {showControls && (
        <motion.div 
          className="absolute top-4 right-4 z-10 flex flex-col space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
            <Button 
              variant={showRoutes ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setShowRoutes(!showRoutes)}
            >
              <Route className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Filter Controls */}
      {showControls && (
        <motion.div 
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent text-sm border-none outline-none"
              >
                <option value="all">All Packages</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
                <option value="investigating">Investigating</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Container */}
      <motion.div 
        ref={mapRef}
        className={`relative ${height} bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-border rounded-lg overflow-hidden`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* US Map Background */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <USMapSVG 
            className="w-full h-full max-w-none object-contain"
            fillColor="rgba(59, 130, 246, 0.15)"
            strokeColor="rgba(59, 130, 246, 0.3)"
            strokeWidth={1}
          />
        </div>
        
        {/* Subtle grid overlay for coordinates */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" 
               style={{
                 backgroundImage: `
                   linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                 `,
                 backgroundSize: '50px 50px'
               }}
          />
        </div>

        {/* Package Markers */}
        <AnimatePresence>
          {filteredPackages.map((pkg, index) => {
            const position = getMarkerPosition(pkg.lat, pkg.lng)
            const config = statusConfig[pkg.status]
            const isSelected = selectedMarker === pkg.id
            
            return (
              <motion.div
                key={pkg.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                style={{ left: position.x, top: position.y }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: isSelected ? 1.2 : 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => handleMarkerClick(pkg.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Marker */}
                <div className={`relative ${config.pulse}`}>
                  <div className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                    <config.icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Pulse Ring */}
                  {pkg.status === 'in_transit' && (
                    <div className={`absolute inset-0 ${config.color} rounded-full animate-ping opacity-30`} />
                  )}
                  
                  {/* Package Info Tooltip */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <Card className="shadow-xl border-2 border-primary/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center justify-between">
                              <span>{pkg.trackingNumber}</span>
                              <Badge variant={pkg.priority === 'critical' ? 'destructive' : 'default'}>
                                {pkg.priority}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-2">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              {pkg.origin} → {pkg.destination}
                            </div>
                            <div className="flex items-center text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              ETA: {pkg.estimatedArrival}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {pkg.lastUpdate}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Route Lines (when enabled) */}
        {showRoutes && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {filteredPackages.map((pkg, index) => {
              if (index === 0) return null
              const prevPkg = filteredPackages[index - 1]
              const start = getMarkerPosition(prevPkg.lat, prevPkg.lng)
              const end = getMarkerPosition(pkg.lat, pkg.lng)
              
              return (
                <motion.line
                  key={`route-${pkg.id}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="url(#routeGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              )
            })}
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Map Legend */}
        <motion.div 
          className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs font-medium mb-2">Package Status</div>
          <div className="space-y-1">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${config.color} rounded-full`} />
                <span className="text-xs">{config.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Activity Indicator */}
        <motion.div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm border border-border rounded-full px-3 py-1 shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Live Tracking</span>
            <Activity className="w-3 h-3" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
