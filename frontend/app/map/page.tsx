'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { GradientText } from '@/components/ui/gradient-text'
import { InteractiveMap } from '@/components/map/interactive-map'
import {
  Map,
  Search,
  Filter,
  MapPin,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Eye,
  RefreshCw,
  Layers,
  Navigation,
  Globe,
  Zap,
  TrendingUp
} from 'lucide-react'

interface MapStats {
  totalPackages: number
  inTransit: number
  delivered: number
  delayed: number
  investigating: number
  activeRoutes: number
  avgDeliveryTime: string
  onTimeRate: number
}

const mockStats: MapStats = {
  totalPackages: 1247,
  inTransit: 342,
  delivered: 789,
  delayed: 89,
  investigating: 27,
  activeRoutes: 156,
  avgDeliveryTime: '2.3 days',
  onTimeRate: 94.2
}

export default function MapPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mapView, setMapView] = useState<'packages' | 'routes' | 'heatmap'>('packages')
  const [stats, setStats] = useState<MapStats>(mockStats)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId)
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="w-10 h-10 text-blue-600" />
            </motion.div>
            <GradientText from="from-blue-600" to="to-purple-600">
              Global Package Tracking
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time visualization of package locations and delivery routes
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </motion.div>
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalPackages.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.delayed}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investigating</p>
                <p className="text-2xl font-bold text-purple-600">{stats.investigating}</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Routes</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.activeRoutes}</p>
              </div>
              <Navigation className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold text-teal-600">{stats.avgDeliveryTime}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.onTimeRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Map Controls */}
      <motion.div 
        className="flex flex-col lg:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search packages, locations, or tracking numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={mapView === 'packages' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('packages')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Packages
                </Button>
                <Button
                  variant={mapView === 'routes' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('routes')}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Routes
                </Button>
                <Button
                  variant={mapView === 'heatmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('heatmap')}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Heatmap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <InteractiveMap 
              height="h-[600px]" 
              selectedPackage={selectedPackage}
              onPackageSelect={handlePackageSelect}
              showControls={true}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Package Details */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Package Details</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedPackage(null)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-medium">CP-2024-{selectedPackage.padStart(3, '0')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="mt-1">In Transit</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-medium">2024-01-15 14:30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
