'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
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
  Building
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
    trackingNumber: 'CP-2024-001234',
    sender: 'TechCorp Inc.',
    receiver: 'John Smith',
    origin: 'San Francisco, CA',
    destination: 'New York, NY',
    status: 'investigating',
    priority: 'high',
    lastScan: 'Chicago Hub - 2 hours ago',
    expectedDelivery: '2024-01-15',
    aiConfidence: 82,
    anomalyType: 'Missed Expected Scan',
    investigationStatus: 'AI Agent Investigating',
    weight: '2.5 kg',
    value: '$1,250',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    trackingNumber: 'CP-2024-005678',
    sender: 'Fashion Outlet',
    receiver: 'Sarah Johnson',
    origin: 'Los Angeles, CA',
    destination: 'Miami, FL',
    status: 'in_transit',
    priority: 'medium',
    lastScan: 'Phoenix Hub - 1 hour ago',
    expectedDelivery: '2024-01-14',
    weight: '1.2 kg',
    value: '$89',
    createdAt: '2024-01-11'
  },
  {
    id: '3',
    trackingNumber: 'CP-2024-009876',
    sender: 'Medical Supplies Co.',
    receiver: 'City Hospital',
    origin: 'Boston, MA',
    destination: 'Atlanta, GA',
    status: 'lost',
    priority: 'critical',
    lastScan: 'Charlotte Hub - 6 hours ago',
    expectedDelivery: '2024-01-13',
    aiConfidence: 94,
    anomalyType: 'Package Misrouted',
    investigationStatus: 'Recovery Agent Deployed',
    weight: '5.0 kg',
    value: '$2,800',
    createdAt: '2024-01-09'
  },
  {
    id: '4',
    trackingNumber: 'CP-2024-011223',
    sender: 'Electronics Hub',
    receiver: 'Mike Chen',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    status: 'delivered',
    priority: 'low',
    lastScan: 'Delivered - 3 days ago',
    expectedDelivery: '2024-01-10',
    weight: '3.1 kg',
    value: '$599',
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    trackingNumber: 'CP-2024-013456',
    sender: 'Book Store',
    receiver: 'Emma Wilson',
    origin: 'Portland, OR',
    destination: 'Austin, TX',
    status: 'delayed',
    priority: 'medium',
    lastScan: 'Dallas Hub - 4 hours ago',
    expectedDelivery: '2024-01-16',
    weight: '0.8 kg',
    value: '$45',
    createdAt: '2024-01-12'
  }
]

const statusConfig = {
  in_transit: { 
    color: 'text-blue-500', 
    bg: 'bg-blue-100 dark:bg-blue-900', 
    label: 'In Transit',
    icon: Truck
  },
  delivered: { 
    color: 'text-green-500', 
    bg: 'bg-green-100 dark:bg-green-900', 
    label: 'Delivered',
    icon: CheckCircle
  },
  delayed: { 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-100 dark:bg-yellow-900', 
    label: 'Delayed',
    icon: Clock
  },
  lost: { 
    color: 'text-red-500', 
    bg: 'bg-red-100 dark:bg-red-900', 
    label: 'Lost',
    icon: XCircle
  },
  investigating: { 
    color: 'text-purple-500', 
    bg: 'bg-purple-100 dark:bg-purple-900', 
    label: 'Investigating',
    icon: Bot
  }
}

const priorityConfig = {
  low: { color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Low' },
  medium: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900', label: 'Medium' },
  high: { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900', label: 'High' },
  critical: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900', label: 'Critical' }
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

  return (
    <div className="space-y-8 relative">
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
            Real-time package monitoring with AI-powered insights
          </p>
        </motion.div>
        
        <motion.div variants={staggerItem} className="flex items-center space-x-3">
          <Badge className="px-3 py-1">
            <Activity className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
          
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </motion.div>
            Refresh
          </Button>
        </motion.div>
      </MotionDiv>

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
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.div variants={staggerItem} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search by tracking number, sender, receiver, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Priority</option>
            {Object.entries(priorityConfig).map(([priority, config]) => (
              <option key={priority} value={priority}>{config.label}</option>
            ))}
          </select>
        </motion.div>
      </MotionDiv>

      {/* Packages Grid */}
      <MotionDiv
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid gap-6"
      >
        <AnimatePresence mode="wait">
          {filteredPackages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No packages found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <TiltCard maxTilt={3}>
                  <RippleEffect>
                    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardContent className="p-6">
                        <MouseFollower strength={0.02}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              <motion.div 
                                className={`w-12 h-12 rounded-lg ${statusConfig[pkg.status].bg} flex items-center justify-center`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                {React.createElement(statusConfig[pkg.status].icon, {
                                  className: `w-6 h-6 ${statusConfig[pkg.status].color}`
                                })}
                              </motion.div>
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{pkg.trackingNumber}</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline" className={`${statusConfig[pkg.status].bg} ${statusConfig[pkg.status].color} border-0`}>
                                    {statusConfig[pkg.status].label}
                                  </Badge>
                                  <Badge variant="outline" className={`${priorityConfig[pkg.priority].bg} ${priorityConfig[pkg.priority].color} border-0`}>
                                    {priorityConfig[pkg.priority].label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {pkg.aiConfidence && (
                                <motion.div 
                                  className="flex items-center space-x-1 text-sm text-muted-foreground"
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{pkg.sender}</div>
                                <div className="text-xs text-muted-foreground">Sender</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{pkg.receiver}</div>
                                <div className="text-xs text-muted-foreground">Receiver</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{pkg.origin}</div>
                                <div className="text-xs text-muted-foreground">Origin</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{pkg.destination}</div>
                                <div className="text-xs text-muted-foreground">Destination</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-4">
                              <span>Last Scan: {pkg.lastScan}</span>
                              <span>•</span>
                              <span>Expected: {pkg.expectedDelivery}</span>
                              <span>•</span>
                              <span>Weight: {pkg.weight}</span>
                              <span>•</span>
                              <span>Value: {pkg.value}</span>
                            </div>
                            
                            {pkg.anomalyType && (
                              <motion.div 
                                className="flex items-center space-x-1 text-orange-500"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm">{pkg.anomalyType}</span>
                              </motion.div>
                            )}
                          </div>
                          
                          {pkg.investigationStatus && (
                            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                >
                                  <Zap className="w-4 h-4 text-purple-500" />
                                </motion.div>
                                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                  {pkg.investigationStatus}
                                </span>
                              </div>
                            </div>
                          )}
                        </MouseFollower>
                      </CardContent>
                    </Card>
                  </RippleEffect>
                </TiltCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </MotionDiv>

      {/* Package Detail Modal */}
      <PackageDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        packageData={selectedPackage}
      />
    </div>
  )
}
