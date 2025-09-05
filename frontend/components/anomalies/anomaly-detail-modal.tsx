'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  Bot,
  User,
  Activity,
  CheckCircle,
  XCircle,
  Calendar,
  Truck,
  Eye,
  MessageSquare,
  FileText,
  Zap,
  Target,
  Shield,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react'

interface AnomalyDetailModalProps {
  isOpen: boolean
  onClose: () => void
  anomaly: {
    id: string
    packageId: string
    trackingNumber: string
    lastScan: string
    location: string
    anomalyType: string
    confidence: number
    suggestedAction: string
    status: string
    detectedAt: string
    priority: string
    aiAgent?: string
    estimatedImpact: string
    customerNotified: boolean
  } | null
}

// Mock timeline data
const mockTimeline = [
  {
    id: '1',
    timestamp: '2024-01-15 16:50:00',
    event: 'Anomaly Detected',
    description: 'AI system detected package routing anomaly',
    type: 'detection',
    agent: 'Detection-AI-01'
  },
  {
    id: '2',
    timestamp: '2024-01-15 16:52:00',
    event: 'Analysis Started',
    description: 'Recovery agent initiated detailed analysis',
    type: 'analysis',
    agent: 'Recovery-01'
  },
  {
    id: '3',
    timestamp: '2024-01-15 16:55:00',
    event: 'Root Cause Identified',
    description: 'Package was scanned to incorrect destination hub',
    type: 'identification',
    agent: 'Recovery-01'
  },
  {
    id: '4',
    timestamp: '2024-01-15 17:00:00',
    event: 'Corrective Action Initiated',
    description: 'Redirect order sent to Dallas hub',
    type: 'action',
    agent: 'Recovery-01'
  },
  {
    id: '5',
    timestamp: '2024-01-15 17:15:00',
    event: 'Customer Notification',
    description: 'Customer notified of delay and new ETA',
    type: 'notification',
    agent: 'Customer-03'
  },
  {
    id: '6',
    timestamp: '2024-01-15 17:30:00',
    event: 'Resolution Confirmed',
    description: 'Package successfully redirected to correct destination',
    type: 'resolution',
    agent: 'Recovery-01'
  }
]

// Mock customer data
const mockCustomer = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Austin, TX 78701',
  notificationPreferences: ['email', 'sms'],
  customerSince: '2022-03-15',
  totalOrders: 47,
  satisfactionScore: 4.8
}

// Mock package details
const mockPackageDetails = {
  sender: 'Amazon Fulfillment Center',
  senderAddress: '1500 S MoPac Expy, Austin, TX 78746',
  receiver: 'Sarah Johnson',
  receiverAddress: '123 Main St, Austin, TX 78701',
  weight: '2.3 lbs',
  dimensions: '12" x 8" x 4"',
  value: '$89.99',
  service: 'Ground',
  expectedDelivery: '2024-01-16 by 8:00 PM',
  actualDelivery: null,
  specialInstructions: 'Leave at front door',
  insurance: '$100',
  signature: 'Not required'
}

const eventTypeConfig = {
  detection: { color: 'bg-red-500', icon: AlertTriangle },
  analysis: { color: 'bg-yellow-500', icon: Eye },
  identification: { color: 'bg-blue-500', icon: Target },
  action: { color: 'bg-purple-500', icon: Zap },
  notification: { color: 'bg-orange-500', icon: MessageSquare },
  resolution: { color: 'bg-green-500', icon: CheckCircle }
}

export function AnomalyDetailModal({ isOpen, onClose, anomaly }: AnomalyDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!anomaly) return null

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-200'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Anomaly Details</div>
              <div className="text-sm text-muted-foreground font-normal">
                Package {anomaly.packageId}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="package">Package</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Confidence</span>
                  </div>
                  <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${getConfidenceColor(anomaly.confidence)}`}>
                    {(anomaly.confidence * 100).toFixed(0)}%
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Priority</span>
                  </div>
                  <Badge className={getPriorityColor(anomaly.priority)}>
                    {anomaly.priority.toUpperCase()}
                  </Badge>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Impact</span>
                  </div>
                  <div className="text-sm font-medium">{anomaly.estimatedImpact}</div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">AI Agent</span>
                  </div>
                  <div className="text-sm font-medium">{anomaly.aiAgent}</div>
                </Card>
              </div>

              {/* Anomaly Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                    Anomaly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Type</label>
                      <div className="mt-1 text-base font-medium capitalize">
                        {anomaly.anomalyType.replace('_', ' ')}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <Badge className="capitalize">{anomaly.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <div className="mt-1 text-base font-medium">{anomaly.location}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Scan</label>
                      <div className="mt-1 text-base font-medium">{anomaly.lastScan}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Suggested Action</label>
                    <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {anomaly.suggestedAction}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Customer Notified: {anomaly.customerNotified ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Detected: {new Date(anomaly.detectedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  Execute Suggested Action
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Notify Customer
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Package
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Investigation Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTimeline.map((event, index) => {
                      const EventIcon = eventTypeConfig[event.type as keyof typeof eventTypeConfig].icon
                      const isLast = index === mockTimeline.length - 1
                      
                      return (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full ${eventTypeConfig[event.type as keyof typeof eventTypeConfig].color} flex items-center justify-center`}>
                              <EventIcon className="w-4 h-4 text-white" />
                            </div>
                            {!isLast && <div className="w-0.5 h-8 bg-border mt-2" />}
                          </div>
                          
                          <div className="flex-1 pb-8">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{event.event}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <div className="flex items-center gap-1">
                              <Bot className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600 dark:text-blue-400">{event.agent}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="package" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Package Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tracking Number</label>
                        <div className="mt-1 font-mono text-sm bg-muted p-2 rounded">{anomaly.trackingNumber}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Weight</label>
                        <div className="mt-1">{mockPackageDetails.weight}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                        <div className="mt-1">{mockPackageDetails.dimensions}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Value</label>
                        <div className="mt-1 font-medium">{mockPackageDetails.value}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                        <div className="mt-1">{mockPackageDetails.service}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Expected Delivery</label>
                        <div className="mt-1">{mockPackageDetails.expectedDelivery}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Insurance</label>
                        <div className="mt-1">{mockPackageDetails.insurance}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Signature Required</label>
                        <div className="mt-1">{mockPackageDetails.signature}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <label className="text-sm font-medium text-muted-foreground">Special Instructions</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg">
                      {mockPackageDetails.specialInstructions}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sender</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium">{mockPackageDetails.sender}</div>
                      <div className="text-sm text-muted-foreground">{mockPackageDetails.senderAddress}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Receiver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium">{mockPackageDetails.receiver}</div>
                      <div className="text-sm text-muted-foreground">{mockPackageDetails.receiverAddress}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{mockCustomer.name}</h3>
                      <p className="text-muted-foreground">Customer since {new Date(mockCustomer.customerSince).getFullYear()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockCustomer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{mockCustomer.address}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                        <div className="mt-1 text-lg font-bold">{mockCustomer.totalOrders}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Satisfaction Score</label>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">{mockCustomer.satisfactionScore}</span>
                          <span className="text-sm text-muted-foreground">/ 5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <label className="text-sm font-medium text-muted-foreground">Notification Preferences</label>
                    <div className="mt-2 flex gap-2">
                      {mockCustomer.notificationPreferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="capitalize">
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
