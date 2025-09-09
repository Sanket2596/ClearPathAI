'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { 
  MotionDiv,
  TiltCard,
  RippleEffect
} from '@/components/ui/motion-components'
import {
  X,
  Package,
  MapPin,
  Clock,
  Truck,
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Weight,
  DollarSign,
  Bot,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight,
  Zap,
  Eye,
  Download,
  RefreshCw,
  Navigation,
  Camera,
  FileText
} from 'lucide-react'
import { packageAPI, TrackingEvent as ApiTrackingEvent } from '@/lib/api'

interface PackageDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh?: () => void
  packageData: {
    id: string
    trackingNumber: string
    sender: string
    receiver: string
    origin: string
    destination: string
    status: string
    priority: string
    lastScan: string
    expectedDelivery: string
    aiConfidence?: number
    anomalyType?: string
    investigationStatus?: string
    weight: string
    value: string
    sender_address?: any
    receiver_address?: any
    sender_phone?: string
    sender_email?: string
    receiver_phone?: string
    receiver_email?: string
    fragile?: boolean
    hazardous?: boolean
    insurance_required?: boolean
    signature_required?: boolean
  } | null
}

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  scanType: 'departure' | 'arrival' | 'in_transit' | 'delivery' | 'exception' | 'pickup' | 'customs'
  aiAnalysis?: string
  confidence?: number
}

const scanTypeConfig = {
  departure: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900', icon: Truck },
  arrival: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900', icon: CheckCircle },
  in_transit: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900', icon: Activity },
  delivery: { color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900', icon: Package },
  exception: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900', icon: AlertTriangle },
  pickup: { color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900', icon: Package },
  customs: { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900', icon: FileText }
}

export function PackageDetailModal({ isOpen, onClose, onRefresh, packageData }: PackageDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'ai' | 'documents'>('timeline')
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch tracking events when modal opens
  useEffect(() => {
    if (isOpen && packageData?.id) {
      fetchTrackingEvents()
    }
  }, [isOpen, packageData?.id])

  const fetchTrackingEvents = async () => {
    if (!packageData?.id) return
    
    setIsLoading(true)
    setError(null)
    try {
      const events = await packageAPI.getPackageTrackingEvents(packageData.id)
      setTrackingEvents(events.map(event => ({
        id: event.id,
        timestamp: new Date(event.timestamp).toLocaleString(),
        location: event.location,
        status: event.status,
        description: event.description,
        scanType: event.scan_type,
        aiAnalysis: event.ai_analysis,
        confidence: event.ai_confidence
      })))
    } catch (err) {
      console.error('Failed to fetch tracking events:', err)
      setError('Failed to load tracking events')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    if (!packageData) return
    
    try {
      // Create a comprehensive package report
      const reportData = {
        package: {
          trackingNumber: packageData.trackingNumber,
          sender: packageData.sender,
          receiver: packageData.receiver,
          origin: packageData.origin,
          destination: packageData.destination,
          status: packageData.status,
          priority: packageData.priority,
          weight: packageData.weight,
          value: packageData.value,
          expectedDelivery: packageData.expectedDelivery,
          aiConfidence: packageData.aiConfidence,
          anomalyType: packageData.anomalyType,
          investigationStatus: packageData.investigationStatus
        },
        trackingEvents: trackingEvents,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `package-${packageData.trackingNumber}-report.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to export package data:', err)
    }
  }

  if (!packageData) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Package className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        <GradientText from="from-blue-600" to="to-purple-600">
                          {packageData.trackingNumber}
                        </GradientText>
                      </h2>
                      <p className="text-muted-foreground">{packageData.sender} → {packageData.receiver}</p>
                    </div>
                  </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={async () => {
                    await fetchTrackingEvents()
                    onRefresh?.()
                  }} disabled={isLoading}>
                    <motion.div
                      animate={isLoading ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                    </motion.div>
                    Refresh
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 border-r border-border p-6 overflow-y-auto">
                  {/* Package Status */}
                  <div className="mb-6">
                    <TiltCard maxTilt={3}>
                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className={`${
                            packageData.status === 'delivered' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                            packageData.status === 'in_transit' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                            packageData.status === 'delayed' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                            packageData.status === 'lost' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                            'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                          } border-0`}>
                            {packageData.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={`${
                            packageData.priority === 'critical' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                            packageData.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                            packageData.priority === 'medium' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                            'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                          } border-0`}>
                            {packageData.priority.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {packageData.aiConfidence && (
                          <div className="flex items-center space-x-2 mb-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Bot className="w-4 h-4 text-purple-500" />
                            </motion.div>
                            <span className="text-sm font-medium">AI Confidence: {packageData.aiConfidence}%</span>
                          </div>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Scan:</span>
                            <span>{packageData.lastScan}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected:</span>
                            <span>{packageData.expectedDelivery}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="font-medium">{packageData.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-medium">{packageData.value}</span>
                          </div>
                        </div>
                      </Card>
                    </TiltCard>
                  </div>

                  {/* Route Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Navigation className="w-4 h-4 mr-2" />
                      Route Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-0.5">
                          <MapPin className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{packageData.origin}</div>
                          <div className="text-sm text-muted-foreground">Origin</div>
                        </div>
                      </div>
                      
                      <div className="ml-4 border-l-2 border-dashed border-muted-foreground/30 h-8"></div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{packageData.destination}</div>
                          <div className="text-sm text-muted-foreground">Destination</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sender & Receiver */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Sender
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{packageData.sender}</div>
                        {packageData.sender_email && (
                          <div className="text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {packageData.sender_email}
                          </div>
                        )}
                        {packageData.sender_phone && (
                          <div className="text-muted-foreground flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {packageData.sender_phone}
                          </div>
                        )}
                        {packageData.sender_address && (
                          <div className="text-muted-foreground text-xs mt-1">
                            {packageData.sender_address.street}, {packageData.sender_address.city}, {packageData.sender_address.state} {packageData.sender_address.zip_code}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Receiver
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{packageData.receiver}</div>
                        {packageData.receiver_email && (
                          <div className="text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {packageData.receiver_email}
                          </div>
                        )}
                        {packageData.receiver_phone && (
                          <div className="text-muted-foreground flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {packageData.receiver_phone}
                          </div>
                        )}
                        {packageData.receiver_address && (
                          <div className="text-muted-foreground text-xs mt-1">
                            {packageData.receiver_address.street}, {packageData.receiver_address.city}, {packageData.receiver_address.state} {packageData.receiver_address.zip_code}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-border">
                    {[
                      { id: 'timeline', label: 'Tracking Timeline', icon: Clock },
                      { id: 'details', label: 'Package Details', icon: Package },
                      { id: 'ai', label: 'AI Analysis', icon: Bot },
                      { id: 'documents', label: 'Documents', icon: FileText }
                    ].map(tab => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'timeline' && (
                        <motion.div
                          key="timeline"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                              />
                              <span className="ml-2 text-muted-foreground">Loading tracking events...</span>
                            </div>
                          ) : error ? (
                            <div className="text-center py-8">
                              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                              <p className="text-red-600 mb-4">{error}</p>
                              <Button onClick={fetchTrackingEvents} variant="outline">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                              </Button>
                            </div>
                          ) : trackingEvents.length === 0 ? (
                            <div className="text-center py-8">
                              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">No tracking events available</p>
                            </div>
                          ) : (
                            trackingEvents.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TiltCard maxTilt={2}>
                                <Card className="p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start space-x-4">
                                    <div className={`w-10 h-10 rounded-lg ${scanTypeConfig[event.scanType]?.bg || 'bg-gray-100 dark:bg-gray-900'} flex items-center justify-center`}>
                                      {React.createElement(scanTypeConfig[event.scanType]?.icon || Package, {
                                        className: `w-5 h-5 ${scanTypeConfig[event.scanType]?.color || 'text-gray-500'}`
                                      })}
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{event.status}</h4>
                                        <span className="text-sm text-muted-foreground">{event.timestamp}</span>
                                      </div>
                                      
                                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                      <p className="text-sm font-medium text-blue-600">{event.location}</p>
                                      
                                      {event.aiAnalysis && (
                                        <motion.div 
                                          className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg"
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          transition={{ delay: 0.2 }}
                                        >
                                          <div className="flex items-center space-x-2 mb-2">
                                            <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            >
                                              <Zap className="w-4 h-4 text-purple-500" />
                                            </motion.div>
                                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                              AI Analysis ({event.confidence}% confidence)
                                            </span>
                                          </div>
                                          <p className="text-sm text-purple-600 dark:text-purple-400">{event.aiAnalysis}</p>
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              </TiltCard>
                            </motion.div>
                            ))
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <TiltCard>
                            <Card className="p-6">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-500" />
                                Package Information
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Physical Properties</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Weight:</span>
                                        <span className="font-medium">{packageData.weight}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Value:</span>
                                        <span className="font-medium">{packageData.value}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Expected Delivery:</span>
                                        <span className="font-medium">{packageData.expectedDelivery}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Special Handling</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {packageData.fragile && (
                                        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                                          Fragile
                                        </Badge>
                                      )}
                                      {packageData.hazardous && (
                                        <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                                          Hazardous
                                        </Badge>
                                      )}
                                      {packageData.insurance_required && (
                                        <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                          Insured
                                        </Badge>
                                      )}
                                      {packageData.signature_required && (
                                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                          Signature Required
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">AI Analysis</h4>
                                    <div className="space-y-2 text-sm">
                                      {packageData.aiConfidence && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">AI Confidence:</span>
                                          <span className="font-medium">{packageData.aiConfidence}%</span>
                                        </div>
                                      )}
                                      {packageData.anomalyType && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Anomaly:</span>
                                          <span className="font-medium text-orange-600">{packageData.anomalyType}</span>
                                        </div>
                                      )}
                                      {packageData.investigationStatus && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Investigation:</span>
                                          <span className="font-medium text-purple-600">{packageData.investigationStatus}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </TiltCard>
                        </motion.div>
                      )}

                      {activeTab === 'ai' && (
                        <motion.div
                          key="ai"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <TiltCard>
                            <Card className="p-6">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Bot className="w-5 h-5 mr-2 text-purple-500" />
                                AI Investigation Report
                              </h3>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {packageData.aiConfidence || 0}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">AI Confidence</div>
                                  </div>
                                  <div className={`p-4 rounded-lg ${
                                    packageData.priority === 'critical' ? 'bg-red-50 dark:bg-red-950/20' :
                                    packageData.priority === 'high' ? 'bg-orange-50 dark:bg-orange-950/20' :
                                    packageData.priority === 'medium' ? 'bg-blue-50 dark:bg-blue-950/20' :
                                    'bg-gray-50 dark:bg-gray-950/20'
                                  }`}>
                                    <div className={`text-2xl font-bold ${
                                      packageData.priority === 'critical' ? 'text-red-600' :
                                      packageData.priority === 'high' ? 'text-orange-600' :
                                      packageData.priority === 'medium' ? 'text-blue-600' :
                                      'text-gray-600'
                                    }`}>
                                      {packageData.priority.toUpperCase()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Risk Level</div>
                                  </div>
                                </div>
                                
                                {packageData.anomalyType && (
                                  <div>
                                    <h4 className="font-medium mb-2">Anomaly Detection</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {packageData.anomalyType}
                                      {packageData.investigationStatus && ` - ${packageData.investigationStatus}`}
                                    </p>
                                  </div>
                                )}
                                
                                <div>
                                  <h4 className="font-medium mb-2">Package Status</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Current status: <span className="font-medium">{packageData.status.replace('_', ' ').toUpperCase()}</span>
                                    {packageData.lastScan && ` • Last scan: ${packageData.lastScan}`}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Special Handling Requirements</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {packageData.fragile && (
                                      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                                        Fragile Handling Required
                                      </Badge>
                                    )}
                                    {packageData.hazardous && (
                                      <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                                        Hazardous Materials
                                      </Badge>
                                    )}
                                    {packageData.insurance_required && (
                                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                        Insured Package
                                      </Badge>
                                    )}
                                    {packageData.signature_required && (
                                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                                        Signature Required
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </TiltCard>
                        </motion.div>
                      )}

                      {activeTab === 'documents' && (
                        <motion.div
                          key="documents"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <TiltCard>
                            <Card className="p-6">
                              <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                                Package Documents
                              </h3>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Shipping Label</h4>
                                        <p className="text-sm text-muted-foreground">Generated on pickup</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-green-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Package Photos</h4>
                                        <p className="text-sm text-muted-foreground">Condition verification</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {packageData.insurance_required && (
                                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                          <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Insurance Certificate</h4>
                                          <p className="text-sm text-muted-foreground">Coverage documentation</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {packageData.signature_required && (
                                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                          <User className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium">Delivery Receipt</h4>
                                          <p className="text-sm text-muted-foreground">Signature confirmation</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="pt-4 border-t border-border">
                                  <Button variant="outline" className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download All Documents
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          </TiltCard>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
