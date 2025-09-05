'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InteractiveMap } from '@/components/map/interactive-map'
import { PackageDetailModal } from '@/components/packages/package-detail-modal'
import {
  Map,
  List,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react'

interface PackageData {
  id: string
  trackingNumber: string
  sender: string
  receiver: string
  origin: string
  destination: string
  status: 'in_transit' | 'delivered' | 'delayed' | 'lost' | 'investigating'
  priority: 'low' | 'medium' | 'high' | 'critical'
  lastScan: string
  expectedDelivery: string
  aiConfidence?: number
  anomalyType?: string
  investigationStatus?: string
  weight: string
  value: string
  createdAt: string
}

interface PackagesMapViewProps {
  packages: PackageData[]
  onPackageSelect: (pkg: PackageData) => void
}

const statusConfig = {
  in_transit: { 
    color: 'text-blue-600', 
    bgColor: '#3B82F6',
    icon: Truck, 
    label: 'In Transit',
    badgeVariant: 'default' as const
  },
  delivered: { 
    color: 'text-green-600', 
    bgColor: '#10B981',
    icon: CheckCircle, 
    label: 'Delivered',
    badgeVariant: 'success' as const
  },
  delayed: { 
    color: 'text-yellow-600', 
    bgColor: '#F59E0B',
    icon: Clock, 
    label: 'Delayed',
    badgeVariant: 'warning' as const
  },
  lost: { 
    color: 'text-red-600', 
    bgColor: '#EF4444',
    icon: AlertTriangle, 
    label: 'Lost',
    badgeVariant: 'destructive' as const
  },
  investigating: { 
    color: 'text-purple-600', 
    bgColor: '#8B5CF6',
    icon: Eye, 
    label: 'Investigating',
    badgeVariant: 'info' as const
  }
}

export function PackagesMapView({ packages, onPackageSelect }: PackagesMapViewProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'split'>('map')

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId)
    const pkg = packages.find(p => p.id === packageId)
    if (pkg) {
      setSelectedPackage(pkg)
    }
  }

  const handlePackageView = (pkg: PackageData) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
    onPackageSelect(pkg)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPackage(null)
  }

  const getStatusStats = () => {
    const stats = packages.reduce((acc, pkg) => {
      acc[pkg.status] = (acc[pkg.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* View Controls */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <List className="w-4 h-4 mr-2" />
            Split View
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: config.bgColor }} />
              <span className="text-sm text-muted-foreground">
                {stats[status] || 0} {config.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Map/Split View */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {viewMode === 'map' ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <InteractiveMap 
                height="h-[700px]" 
                selectedPackage={selectedPackageId}
                onPackageSelect={handlePackageSelect}
                showControls={true}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Panel */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="w-5 h-5 mr-2" />
                  Live Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <InteractiveMap 
                  height="h-[500px]" 
                  selectedPackage={selectedPackageId}
                  onPackageSelect={handlePackageSelect}
                  showControls={true}
                />
              </CardContent>
            </Card>

            {/* Package List Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Package List
                  </div>
                  <Badge variant="outline">
                    {packages.length} packages
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[450px] overflow-y-auto">
                  {packages.map((pkg) => {
                    const config = statusConfig[pkg.status]
                    const isSelected = selectedPackageId === pkg.id
                    
                    return (
                      <motion.div
                        key={pkg.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => handlePackageSelect(pkg.id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <config.icon className={`w-4 h-4 ${config.color}`} />
                              <span className="font-medium text-sm">
                                {pkg.trackingNumber}
                              </span>
                              <Badge variant={config.badgeVariant} className="text-xs">
                                {config.label}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {pkg.origin} → {pkg.destination}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ETA: {pkg.expectedDelivery}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePackageView(pkg)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Selected Package Info */}
      <AnimatePresence>
        {selectedPackage && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Selected Package: {selectedPackage.trackingNumber}</span>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm"
                      onClick={() => handlePackageView(selectedPackage)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedPackage(null)}
                    >
                      ×
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={statusConfig[selectedPackage.status].badgeVariant} className="mt-1">
                      {statusConfig[selectedPackage.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="font-medium capitalize">{selectedPackage.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Scan</p>
                    <p className="font-medium">{selectedPackage.lastScan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ETA</p>
                    <p className="font-medium">{selectedPackage.expectedDelivery}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packageData={selectedPackage}
      />
    </div>
  )
}
