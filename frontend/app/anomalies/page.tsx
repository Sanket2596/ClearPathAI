'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GradientText } from '@/components/ui/gradient-text'
import { RecentAnomaliesTable } from '@/components/dashboard/recent-anomalies-table'
import { AnomalyTrendsChart } from '@/components/dashboard/anomaly-trends-chart'
import { AnomalyDetailModal } from '@/components/anomalies/anomaly-detail-modal'
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  TiltCard,
  RippleEffect
} from '@/components/ui/motion-components'
import {
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  MoreHorizontal,
  Bot,
  Zap,
  Target,
  Shield,
  AlertCircle,
  XCircle
} from 'lucide-react'

interface AnomalyData {
  id: string
  packageId: string
  trackingNumber: string
  lastScan: string
  location: string
  anomalyType: 'missed_scan' | 'misrouted' | 'delayed' | 'wrong_destination' | 'lost' | 'damaged'
  confidence: number
  suggestedAction: string
  status: 'investigating' | 'action_taken' | 'resolved' | 'pending' | 'escalated'
  detectedAt: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  aiAgent?: string
  estimatedImpact: string
  customerNotified: boolean
}

const mockAnomalies: AnomalyData[] = [
  {
    id: '1',
    packageId: 'PKG123456',
    trackingNumber: '1Z999AA1234567890',
    lastScan: 'Hub A (09:12)',
    location: 'Chicago, IL',
    anomalyType: 'missed_scan',
    confidence: 0.83,
    suggestedAction: 'Rescan at next checkpoint',
    status: 'investigating',
    detectedAt: '2024-01-15 09:15:00',
    priority: 'medium',
    aiAgent: 'Investigator-01',
    estimatedImpact: '2-4 hours delay',
    customerNotified: false
  },
  {
    id: '2',
    packageId: 'PKG789012',
    trackingNumber: '1Z999BB9876543210',
    lastScan: 'Hub B (11:30)',
    location: 'Denver, CO',
    anomalyType: 'misrouted',
    confidence: 0.91,
    suggestedAction: 'Reroute via Hub C',
    status: 'action_taken',
    detectedAt: '2024-01-15 11:35:00',
    priority: 'high',
    aiAgent: 'Recovery-02',
    estimatedImpact: '1 day delay',
    customerNotified: true
  },
  {
    id: '3',
    packageId: 'PKG345678',
    trackingNumber: '1Z999CC5555666677',
    lastScan: 'Hub C (14:15)',
    location: 'Phoenix, AZ',
    anomalyType: 'delayed',
    confidence: 0.76,
    suggestedAction: 'Notify customer of delay',
    status: 'pending',
    detectedAt: '2024-01-15 14:20:00',
    priority: 'low',
    aiAgent: 'Customer-03',
    estimatedImpact: '12-24 hours delay',
    customerNotified: false
  },
  {
    id: '4',
    packageId: 'PKG567890',
    trackingNumber: '1Z999DD1111222233',
    lastScan: 'Hub D (16:45)',
    location: 'Dallas, TX',
    anomalyType: 'wrong_destination',
    confidence: 0.94,
    suggestedAction: 'Redirect to correct hub',
    status: 'resolved',
    detectedAt: '2024-01-15 16:50:00',
    priority: 'critical',
    aiAgent: 'Recovery-01',
    estimatedImpact: 'Prevented 2-day delay',
    customerNotified: true
  },
  {
    id: '5',
    packageId: 'PKG111222',
    trackingNumber: '1Z999EE7777888899',
    lastScan: 'Hub E (08:30)',
    location: 'Atlanta, GA',
    anomalyType: 'damaged',
    confidence: 0.89,
    suggestedAction: 'Inspect and repackage',
    status: 'escalated',
    detectedAt: '2024-01-15 08:35:00',
    priority: 'high',
    aiAgent: 'Investigator-02',
    estimatedImpact: 'Potential claim',
    customerNotified: true
  },
  {
    id: '6',
    packageId: 'PKG333444',
    trackingNumber: '1Z999FF4444555566',
    lastScan: 'Hub F (12:00)',
    location: 'Seattle, WA',
    anomalyType: 'lost',
    confidence: 0.67,
    suggestedAction: 'Initiate search protocol',
    status: 'investigating',
    detectedAt: '2024-01-15 12:05:00',
    priority: 'critical',
    aiAgent: 'Investigator-03',
    estimatedImpact: 'Package recovery needed',
    customerNotified: false
  }
]

const anomalyTypeConfig = {
  missed_scan: { label: 'Missed Scan', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  misrouted: { label: 'Misrouted', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: AlertTriangle },
  delayed: { label: 'Delayed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  wrong_destination: { label: 'Wrong Destination', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: Target },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
  damaged: { label: 'Damaged', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: AlertCircle }
}

const statusConfig = {
  investigating: { label: 'Investigating', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertTriangle },
  action_taken: { label: 'Action Taken', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: Package },
  escalated: { label: 'Escalated', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertCircle }
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
}

// Mock trend data
const trendData = [
  { time: '00:00', anomalies: 12, resolved: 8 },
  { time: '04:00', anomalies: 8, resolved: 6 },
  { time: '08:00', anomalies: 25, resolved: 18 },
  { time: '12:00', anomalies: 32, resolved: 28 },
  { time: '16:00', anomalies: 18, resolved: 15 },
  { time: '20:00', anomalies: 14, resolved: 12 },
  { time: '24:00', anomalies: 9, resolved: 7 }
]

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyData[]>(mockAnomalies)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('detectedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter and sort anomalies
  const filteredAnomalies = anomalies
    .filter(anomaly => {
      const matchesSearch = anomaly.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           anomaly.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           anomaly.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || anomaly.status === statusFilter
      const matchesType = typeFilter === 'all' || anomaly.anomalyType === typeFilter
      const matchesPriority = priorityFilter === 'all' || anomaly.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof AnomalyData]
      let bValue: any = b[sortBy as keyof AnomalyData]
      
      if (sortBy === 'confidence') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  // Calculate stats
  const stats = {
    total: anomalies.length,
    investigating: anomalies.filter(a => a.status === 'investigating').length,
    resolved: anomalies.filter(a => a.status === 'resolved').length,
    critical: anomalies.filter(a => a.priority === 'critical').length,
    avgConfidence: (anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <GradientText from="from-red-600" to="to-orange-600">
              Anomaly Detection Center
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered anomaly detection and resolution system
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
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
        </div>
      </div>

      {/* Stats Cards */}
      <MotionDiv
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="font-bold text-2xl">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Anomalies</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="font-bold text-2xl">{stats.investigating}</div>
            <div className="text-sm text-muted-foreground">Investigating</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-bold text-2xl">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="font-bold text-2xl">{stats.critical}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="font-bold text-2xl">{stats.avgConfidence}%</div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </TiltCard>
        </motion.div>
      </MotionDiv>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Anomaly Trends (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnomalyTrendsChart data={trendData} />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search packages, tracking numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="action_taken">Action Taken</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="missed_scan">Missed Scan</SelectItem>
                <SelectItem value="misrouted">Misrouted</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="wrong_destination">Wrong Destination</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detectedAt">Detection Time</SelectItem>
                <SelectItem value="confidence">Confidence</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Active Anomalies ({filteredAnomalies.length})
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1"
            >
              {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Package</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">AI Agent</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAnomalies.map((anomaly, index) => {
                    const TypeIcon = anomalyTypeConfig[anomaly.anomalyType].icon
                    const StatusIcon = statusConfig[anomaly.status].icon
                    
                    return (
                      <motion.tr
                        key={anomaly.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{anomaly.packageId}</div>
                            <div className="text-sm text-muted-foreground">{anomaly.trackingNumber}</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <Badge className={`${anomalyTypeConfig[anomaly.anomalyType].color} flex items-center gap-1 w-fit`}>
                            <TypeIcon className="w-3 h-3" />
                            {anomalyTypeConfig[anomaly.anomalyType].label}
                          </Badge>
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{anomaly.location}</div>
                            <div className="text-sm text-muted-foreground">{anomaly.lastScan}</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`font-medium ${
                              anomaly.confidence >= 0.8 ? 'text-green-600' :
                              anomaly.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {(anomaly.confidence * 100).toFixed(0)}%
                            </div>
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  anomaly.confidence >= 0.8 ? 'bg-green-500' :
                                  anomaly.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${anomaly.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <Badge className={priorityConfig[anomaly.priority].color}>
                            {priorityConfig[anomaly.priority].label}
                          </Badge>
                        </td>
                        
                        <td className="p-4">
                          <Badge className={`${statusConfig[anomaly.status].color} flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[anomaly.status].label}
                          </Badge>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Bot className="w-3 h-3 text-blue-500" />
                            <span className="text-sm">{anomaly.aiAgent}</span>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAnomaly(anomaly)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" size="sm" className="px-3 py-1 text-xs">
                              {anomaly.suggestedAction}
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredAnomalies.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">No anomalies found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'All packages are tracking normally'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Anomaly Detail Modal */}
      <AnomalyDetailModal
        isOpen={selectedAnomaly !== null}
        onClose={() => setSelectedAnomaly(null)}
        anomaly={selectedAnomaly}
      />
    </div>
  )
}
