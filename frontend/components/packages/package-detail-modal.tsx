'use client'

import React, { useState } from 'react'
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

interface PackageDetailModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: any
}

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  scanType: 'departure' | 'arrival' | 'in_transit' | 'delivery' | 'exception'
  aiAnalysis?: string
  confidence?: number
}

const mockTrackingEvents: TrackingEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-13 14:30:00',
    location: 'Chicago Hub',
    status: 'Exception',
    description: 'Package missed expected scan - AI investigating potential misroute',
    scanType: 'exception',
    aiAnalysis: 'Package likely diverted to overflow area due to high volume. Recovery agent deployed.',
    confidence: 82
  },
  {
    id: '2',
    timestamp: '2024-01-12 09:15:00',
    location: 'Denver Facility',
    status: 'Departed',
    description: 'Package departed facility on truck DEN-001',
    scanType: 'departure'
  },
  {
    id: '3',
    timestamp: '2024-01-12 06:45:00',
    location: 'Denver Facility',
    status: 'Arrived',
    description: 'Package arrived at sorting facility',
    scanType: 'arrival'
  },
  {
    id: '4',
    timestamp: '2024-01-11 18:22:00',
    location: 'Salt Lake City Hub',
    status: 'In Transit',
    description: 'Package in transit to Denver',
    scanType: 'in_transit'
  },
  {
    id: '5',
    timestamp: '2024-01-11 14:10:00',
    location: 'Salt Lake City Hub',
    status: 'Arrived',
    description: 'Package arrived at hub facility',
    scanType: 'arrival'
  },
  {
    id: '6',
    timestamp: '2024-01-10 16:30:00',
    location: 'San Francisco, CA',
    status: 'Picked Up',
    description: 'Package picked up from sender',
    scanType: 'departure'
  }
]

const scanTypeConfig = {
  departure: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900', icon: Truck },
  arrival: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900', icon: CheckCircle },
  in_transit: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900', icon: Activity },
  delivery: { color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900', icon: Package },
  exception: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900', icon: AlertTriangle }
}

export function PackageDetailModal({ isOpen, onClose, packageData }: PackageDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'ai' | 'documents'>('timeline')

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
                    <p className="text-muted-foreground">Package Details & Tracking</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
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
                          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-0">
                            Investigating
                          </Badge>
                          <Badge variant="outline" className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-0">
                            Critical
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
                            <span>{packageData.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Value:</span>
                            <span>{packageData.value}</span>
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
                        <div className="text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          sender@techcorp.com
                        </div>
                        <div className="text-muted-foreground flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          +1 (555) 123-4567
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Receiver
                      </h4>
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{packageData.receiver}</div>
                        <div className="text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          receiver@email.com
                        </div>
                        <div className="text-muted-foreground flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          +1 (555) 987-6543
                        </div>
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
                          {mockTrackingEvents.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <TiltCard maxTilt={2}>
                                <Card className="p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start space-x-4">
                                    <div className={`w-10 h-10 rounded-lg ${scanTypeConfig[event.scanType].bg} flex items-center justify-center`}>
                                      {React.createElement(scanTypeConfig[event.scanType].icon, {
                                        className: `w-5 h-5 ${scanTypeConfig[event.scanType].color}`
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
                          ))}
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
                                    <div className="text-2xl font-bold text-purple-600">82%</div>
                                    <div className="text-sm text-muted-foreground">AI Confidence</div>
                                  </div>
                                  <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">High</div>
                                    <div className="text-sm text-muted-foreground">Risk Level</div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Anomaly Detection</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Package missed expected scan at Chicago Hub. Analysis indicates likely misroute 
                                    due to high volume processing. Recovery probability: 94%.
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Recommended Actions</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Deploy recovery agent to Chicago Hub overflow area</li>
                                    <li>• Initiate manual scan at suspected location</li>
                                    <li>• Alert customer service for proactive communication</li>
                                    <li>• Monitor for next 4 hours for automated recovery</li>
                                  </ul>
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
