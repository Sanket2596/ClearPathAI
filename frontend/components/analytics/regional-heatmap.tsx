'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface RegionData {
  id: string
  name: string
  state: string
  anomalies: number
  packages: number
  efficiency: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  lat: number
  lng: number
  change: number
}

const regionData: RegionData[] = [
  { id: 'chi', name: 'Chicago Hub', state: 'IL', anomalies: 187, packages: 12450, efficiency: 86.6, riskLevel: 'high', lat: 41.8781, lng: -87.6298, change: -12 },
  { id: 'dal', name: 'Dallas Hub', state: 'TX', anomalies: 143, packages: 15680, efficiency: 93.7, riskLevel: 'medium', lat: 32.7767, lng: -96.7970, change: 5 },
  { id: 'den', name: 'Denver Hub', state: 'CO', anomalies: 98, packages: 8930, efficiency: 90.8, riskLevel: 'medium', lat: 39.7392, lng: -104.9903, change: -8 },
  { id: 'atl', name: 'Atlanta Hub', state: 'GA', anomalies: 156, packages: 11200, efficiency: 82.1, riskLevel: 'high', lat: 33.7490, lng: -84.3880, change: 15 },
  { id: 'phx', name: 'Phoenix Hub', state: 'AZ', anomalies: 112, packages: 9870, efficiency: 90.2, riskLevel: 'medium', lat: 33.4484, lng: -112.0740, change: -3 },
  { id: 'sea', name: 'Seattle Hub', state: 'WA', anomalies: 89, packages: 7650, efficiency: 93.3, riskLevel: 'low', lat: 47.6062, lng: -122.3321, change: -18 },
  { id: 'mia', name: 'Miami Hub', state: 'FL', anomalies: 134, packages: 10200, efficiency: 88.4, riskLevel: 'medium', lat: 25.7617, lng: -80.1918, change: 7 },
  { id: 'la', name: 'Los Angeles Hub', state: 'CA', anomalies: 201, packages: 18900, efficiency: 84.2, riskLevel: 'critical', lat: 34.0522, lng: -118.2437, change: 22 },
  { id: 'nyc', name: 'New York Hub', state: 'NY', anomalies: 178, packages: 16750, efficiency: 87.9, riskLevel: 'high', lat: 40.7128, lng: -74.0060, change: -5 },
  { id: 'bos', name: 'Boston Hub', state: 'MA', anomalies: 67, packages: 6800, efficiency: 94.1, riskLevel: 'low', lat: 42.3601, lng: -71.0589, change: -15 }
]

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return 'bg-green-500'
    case 'medium': return 'bg-yellow-500'
    case 'high': return 'bg-orange-500'
    case 'critical': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getRiskBadgeVariant = (level: string) => {
  switch (level) {
    case 'low': return 'default'
    case 'medium': return 'secondary'
    case 'high': return 'destructive'
    case 'critical': return 'destructive'
    default: return 'secondary'
  }
}

export function RegionalHeatmap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)
  const [viewMode, setViewMode] = useState<'anomalies' | 'efficiency' | 'risk'>('anomalies')
  const [isMounted, setIsMounted] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const getIntensity = (region: RegionData) => {
    switch (viewMode) {
      case 'anomalies':
        const maxAnomalies = Math.max(...regionData.map(r => r.anomalies))
        return (region.anomalies / maxAnomalies) * 100
      case 'efficiency':
        return 100 - region.efficiency // Invert so lower efficiency = higher intensity
      case 'risk':
        const riskValues = { low: 25, medium: 50, high: 75, critical: 100 }
        return riskValues[region.riskLevel]
      default:
        return 50
    }
  }

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Regional Performance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">Loading heatmap...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Regional Performance Heatmap
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'anomalies' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('anomalies')}
            >
              Anomalies
            </Button>
            <Button
              variant={viewMode === 'efficiency' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('efficiency')}
            >
              Efficiency
            </Button>
            <Button
              variant={viewMode === 'risk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('risk')}
            >
              Risk
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-8 h-96 overflow-hidden">
              {/* US Map Outline (Simplified) */}
              <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full opacity-10">
                <path
                  d="M200,100 L800,100 L850,200 L800,400 L200,450 L150,300 Z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>

              {/* Regional Data Points */}
              {regionData.map((region, index) => {
                const intensity = getIntensity(region)
                const size = Math.max(20, (intensity / 100) * 40)
                
                return (
                  <motion.div
                    key={region.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${((region.lng + 125) / 60) * 100}%`,
                      top: `${((50 - region.lat) / 25) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRegion(region)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="rounded-full shadow-lg border-2 border-white dark:border-gray-800 flex items-center justify-center relative"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: `rgba(${viewMode === 'anomalies' ? '239, 68, 68' : 
                                                  viewMode === 'efficiency' ? '245, 158, 11' : 
                                                  '168, 85, 247'}, ${intensity / 100})`
                      }}
                    >
                      {/* Pulse Animation for High Risk */}
                      {region.riskLevel === 'critical' && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-red-500"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      
                      <span className="text-xs font-bold text-white drop-shadow">
                        {region.state}
                      </span>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {region.name}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {viewMode === 'anomalies' ? 'Anomalies' : 
                   viewMode === 'efficiency' ? 'Poor Efficiency' : 'Risk Level'}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-200" />
                  <span className="text-xs">Low</span>
                  <div className="w-4 h-4 rounded-full bg-blue-400" />
                  <span className="text-xs">Medium</span>
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                  <span className="text-xs">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Region Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Regional Details</h3>
            
            {selectedRegion ? (
              <motion.div
                key={selectedRegion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    {selectedRegion.name}
                    <Badge variant={getRiskBadgeVariant(selectedRegion.riskLevel)}>
                      {selectedRegion.riskLevel}
                    </Badge>
                  </h4>
                  
                  <div className="space-y-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Packages Processed</span>
                      <span className="font-medium">{selectedRegion.packages.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Anomalies Detected</span>
                      <span className="font-medium text-red-600">{selectedRegion.anomalies}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Efficiency Rate</span>
                      <span className="font-medium text-green-600">{selectedRegion.efficiency}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Change</span>
                      <div className="flex items-center gap-1">
                        {selectedRegion.change > 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-red-500" />
                            <span className="text-red-600">+{selectedRegion.change}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-green-500" />
                            <span className="text-green-600">{selectedRegion.change}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click on a region to view details</p>
              </div>
            )}

            {/* Top Performers */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Top Performers</h4>
              {regionData
                .sort((a, b) => b.efficiency - a.efficiency)
                .slice(0, 3)
                .map((region, index) => (
                  <div key={region.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getRiskColor(region.riskLevel)}`} />
                      <span className="text-sm">{region.name}</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">{region.efficiency}%</span>
                  </div>
                ))}
            </div>

            {/* Areas of Concern */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Areas of Concern</h4>
              {regionData
                .filter(region => region.riskLevel === 'high' || region.riskLevel === 'critical')
                .slice(0, 3)
                .map((region) => (
                  <div key={region.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <span className="text-sm">{region.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {region.anomalies} issues
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
