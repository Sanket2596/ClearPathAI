'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PackagesMapView } from '@/components/packages/packages-map-view'
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  TiltCard,
  RippleEffect,
  MouseFollower
} from '@/components/ui/motion-components'
import {
  Package,
  Search,
  Filter,
  MapPin,
  Clock,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  Download,
  RefreshCw,
  Zap,
  Bot,
  Activity,
  ArrowRight,
  Calendar,
  User,
  Building,
  Map,
  List,
  Grid3X3
} from 'lucide-react'
import { PackageDetailModal } from '@/components/packages/package-detail-modal'

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

const mockPackages: PackageData[] = [
  {
    id: '1',
    trackingNumber: 'CP-2024-001',
    sender: 'TechCorp Inc.',
    receiver: 'Global Solutions Ltd.',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    status: 'in_transit',
    priority: 'high',
    lastScan: '2 hours ago',
    expectedDelivery: '2024-01-15 14:30',
    aiConfidence: 94,
    weight: '2.5 kg',
    value: '$1,250',
    createdAt: '2024-01-14 08:15'
  },
  {
    id: '2',
    trackingNumber: 'CP-2024-002',
    sender: 'MedSupply Co.',
    receiver: 'City Hospital',
    origin: 'Philadelphia, PA',
    destination: 'Boston, MA',
    status: 'delivered',
    priority: 'critical',
    lastScan: '30 minutes ago',
    expectedDelivery: '2024-01-15 12:00',
    aiConfidence: 98,
    weight: '0.8 kg',
    value: '$3,400',
    createdAt: '2024-01-14 06:30'
  },
  {
    id: '3',
    trackingNumber: 'CP-2024-003',
    sender: 'AutoParts Direct',
    receiver: 'Midwest Motors',
    origin: 'Detroit, MI',
    destination: 'Chicago, IL',
    status: 'delayed',
    priority: 'medium',
    lastScan: '1 hour ago',
    expectedDelivery: '2024-01-15 16:45',
    anomalyType: 'Weather Delay',
    weight: '15.2 kg',
    value: '$890',
    createdAt: '2024-01-13 14:20'
  },
  {
    id: '4',
    trackingNumber: 'CP-2024-004',
    sender: 'Fashion Forward',
    receiver: 'Style Boutique',
    origin: 'San Francisco, CA',
    destination: 'Los Angeles, CA',
    status: 'investigating',
    priority: 'high',
    lastScan: '4 hours ago',
    expectedDelivery: '2024-01-15 18:00',
    anomalyType: 'Route Deviation',
    investigationStatus: 'AI Agent Assigned',
    aiConfidence: 76,
    weight: '3.1 kg',
    value: '$2,100',
    createdAt: '2024-01-14 10:45'
  }
]

const statusConfig = {
  in_transit: {
    color: 'text-blue-600',
    bgColor: '#3B82F6',
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: Truck,
    label: 'In Transit',
    badgeVariant: 'default' as const
  },
  delivered: {
    color: 'text-green-600',
    bgColor: '#10B981',
    bg: 'bg-green-100 dark:bg-green-900',
    icon: CheckCircle,
    label: 'Delivered',
    badgeVariant: 'success' as const
  },
  delayed: {
    color: 'text-yellow-600',
    bgColor: '#F59E0B',
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    icon: Clock,
    label: 'Delayed',
    badgeVariant: 'warning' as const
  },
  lost: {
    color: 'text-red-600',
    bgColor: '#EF4444',
    bg: 'bg-red-100 dark:bg-red-900',
    icon: XCircle,
    label: 'Lost',
    badgeVariant: 'destructive' as const
  },
  investigating: {
    color: 'text-purple-600',
    bgColor: '#8B5CF6',
    bg: 'bg-purple-100 dark:bg-purple-900',
    icon: Eye,
    label: 'Investigating',
    badgeVariant: 'info' as const
  }
}

const priorityConfig = {
  low: { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Low' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900', label: 'Medium' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900', label: 'High' },
  critical: { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900', label: 'Critical' }
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>(mockPackages)
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>(mockPackages)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  // Filter packages based on search and filters
  useEffect(() => {
    let filtered = packages

    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.priority === priorityFilter)
    }

    setFilteredPackages(filtered)
  }, [searchTerm, statusFilter, priorityFilter, packages])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getStatusStats = () => {
    const stats = packages.reduce((acc, pkg) => {
      acc[pkg.status] = (acc[pkg.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const stats = getStatusStats()

  const handleViewPackage = (pkg: PackageData) => {
    setSelectedPackage(pkg)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPackage(null)
  }

  const handlePackageSelect = (pkg: PackageData) => {
    setSelectedPackage(pkg)
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 space-y-8 pb-8">
      {/* Header */}
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="flex items-center justify-between"
      >
        <motion.div variants={staggerItem}>
          <h1 className="text-4xl font-bold tracking-tight">
            <GradientText from="from-blue-600" to="to-purple-600">
              Package Tracking
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time package monitoring with AI-powered anomaly detection
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="px-3"
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>

          <Badge className="px-3 py-1">
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
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </motion.div>
      </MotionDiv>

      {/* Map View */}
      {viewMode === 'map' ? (
        <PackagesMapView 
          packages={filteredPackages} 
          onPackageSelect={handlePackageSelect}
        />
      ) : (
        <>
          {/* Stats Cards */}
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {Object.entries(statusConfig).map(([status, config], index) => (
              <motion.div key={status} variants={staggerItem}>
                <TiltCard maxTilt={5}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                          <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <div className="font-bold text-2xl">{stats[status] || 0}</div>
                          <div className="text-sm text-muted-foreground">{config.label}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </MotionDiv>

          {/* Search and Filters */}
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-4"
          >
            <motion.div variants={staggerItem} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search packages, tracking numbers, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {Object.entries(priorityConfig).map(([priority, config]) => (
                    <SelectItem key={priority} value={priority}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
          </MotionDiv>

          {/* Package Cards Grid */}
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPackages.length === 0 ? (
                <motion.div
                  key="no-packages"
                  className="col-span-full text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No packages found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters
                  </p>
                </motion.div>
              ) : (
                filteredPackages.map((pkg, index) => (
                  <motion.div key={pkg.id} variants={staggerItem}>
                    <TiltCard maxTilt={5}>
                      <RippleEffect>
                        <MouseFollower strength={0.03}>
                          <Card className="relative overflow-hidden group cursor-pointer h-full flex flex-col min-h-[400px]">
                            {/* Priority Indicator */}
                            <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] ${
                              pkg.priority === 'critical' ? 'border-t-red-500' :
                              pkg.priority === 'high' ? 'border-t-orange-500' :
                              pkg.priority === 'medium' ? 'border-t-blue-500' : 'border-t-gray-400'
                            }`} />
                            
                            <CardContent className="p-4 flex-1 flex flex-col justify-between">
                              <div className="space-y-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">{pkg.trackingNumber}</h3>
                                    <p className="text-sm text-muted-foreground">{pkg.sender}</p>
                                  </div>
                                  <Badge variant={priorityConfig[pkg.priority].color as any} className="text-xs">
                                    {priorityConfig[pkg.priority].label}
                                  </Badge>
                                </div>

                                {/* Route */}
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span className="truncate">{pkg.origin}</span>
                                  <ArrowRight className="w-3 h-3 mx-2" />
                                  <span className="truncate">{pkg.destination}</span>
                                </div>

                                {/* Details */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Last Scan:</span>
                                    <span>{pkg.lastScan}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">ETA:</span>
                                    <span>{pkg.expectedDelivery}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Value:</span>
                                    <span className="font-medium">{pkg.value}</span>
                                  </div>
                                </div>

                                {/* Anomaly Alert */}
                                {pkg.anomalyType && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                                    <div className="flex items-center text-yellow-800 dark:text-yellow-200">
                                      <AlertTriangle className="w-4 h-4 mr-2" />
                                      <span className="text-sm font-medium">{pkg.anomalyType}</span>
                                    </div>
                                    {pkg.investigationStatus && (
                                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                        {pkg.investigationStatus}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </CardContent>

                            {/* Footer */}
                            <div className="border-t border-border p-4 mt-auto">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <motion.div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md`}
                                    style={{ backgroundColor: statusConfig[pkg.status].bgColor }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                    {React.createElement(statusConfig[pkg.status].icon, {
                                      className: `w-6 h-6 ${statusConfig[pkg.status].color}`
                                    })}
                                  </motion.div>
                                  <Badge variant={statusConfig[pkg.status].badgeVariant}>
                                    {statusConfig[pkg.status].label}
                                  </Badge>
                                </div>
                                {pkg.aiConfidence && (
                                  <motion.div
                                    className="flex items-center text-sm text-muted-foreground"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Bot className="w-4 h-4 text-purple-500" />
                                    <span>{pkg.aiConfidence}% AI</span>
                                  </motion.div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewPackage(pkg)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </MouseFollower>
                      </RippleEffect>
                    </TiltCard>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </MotionDiv>
        </>
      )}

      {/* Package Detail Modal */}
      <PackageDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packageData={selectedPackage}
      />
    </div>
  )
}