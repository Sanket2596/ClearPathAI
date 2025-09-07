'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Server,
  Database,
  Wifi,
  Smartphone,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Calendar,
  ExternalLink,
  RefreshCw,
  Bell,
  AlertCircle
} from 'lucide-react'

interface SystemComponent {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage'
  uptime: number
  responseTime: number
  lastChecked: Date
  icon: any
  category: 'core' | 'api' | 'infrastructure' | 'integrations'
}

const systemComponents: SystemComponent[] = [
  {
    id: 'package-tracking-api',
    name: 'Package Tracking API',
    description: 'Core package tracking and status updates',
    status: 'operational',
    uptime: 99.98,
    responseTime: 245,
    lastChecked: new Date(Date.now() - 2 * 60 * 1000),
    icon: Server,
    category: 'core'
  },
  {
    id: 'ai-agent-service',
    name: 'AI Agent Service',
    description: 'Autonomous package recovery and anomaly detection',
    status: 'operational',
    uptime: 99.95,
    responseTime: 180,
    lastChecked: new Date(Date.now() - 1 * 60 * 1000),
    icon: Zap,
    category: 'core'
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting platform',
    status: 'degraded',
    uptime: 99.87,
    responseTime: 1200,
    lastChecked: new Date(Date.now() - 3 * 60 * 1000),
    icon: BarChart3,
    category: 'core'
  }
]

const statusConfig = {
  operational: {
    label: 'Operational',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle2,
    iconColor: 'text-green-600'
  },
  degraded: {
    label: 'Degraded Performance',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600'
  },
  partial_outage: {
    label: 'Partial Outage',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    icon: AlertCircle,
    iconColor: 'text-orange-600'
  },
  major_outage: {
    label: 'Major Outage',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    icon: XCircle,
    iconColor: 'text-red-600'
  }
}

export function SystemStatusPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const filteredComponents = selectedCategory === 'all' 
    ? systemComponents 
    : systemComponents.filter(component => component.category === selectedCategory)

  const overallStatus = systemComponents.some(c => c.status === 'major_outage') ? 'major_outage' :
                       systemComponents.some(c => c.status === 'partial_outage') ? 'partial_outage' :
                       systemComponents.some(c => c.status === 'degraded') ? 'degraded' : 'operational'

  const averageUptime = systemComponents.reduce((sum, component) => sum + component.uptime, 0) / systemComponents.length

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Status</h2>
          <p className="text-muted-foreground">
            Real-time status and performance monitoring for all ClearPath AI services
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh {autoRefresh ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Subscribe to Updates
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full">
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                ClearPath AI System Status
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Operational
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">
              {averageUptime.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Overall Uptime (30 days)
            </div>
          </div>
        </div>
      </Card>

      {/* System Components */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
            <TabsTrigger value="core">Core Services</TabsTrigger>
            <TabsTrigger value="api">APIs</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          <div className="grid gap-4">
            {filteredComponents.map((component) => {
              const StatusIcon = statusConfig[component.status].icon
              const ComponentIcon = component.icon
              
              return (
                <Card key={component.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <ComponentIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium">{component.name}</h4>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-medium">{component.uptime}%</div>
                        <div className="text-xs text-muted-foreground">30-day uptime</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{component.responseTime}ms</div>
                        <div className="text-xs text-muted-foreground">Avg response</div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={statusConfig[component.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[component.status].label}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Checked {getTimeSince(component.lastChecked)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Uptime Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Uptime Progress</span>
                      <span className="text-xs text-muted-foreground">{component.uptime}%</span>
                    </div>
                    <Progress value={component.uptime} className="h-2" />
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Historical Performance */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Metrics (Last 30 Days)
          </CardTitle>
        </CardHeader>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">99.96%</div>
            <div className="text-sm text-muted-foreground">Average Uptime</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">+0.02%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">234ms</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">-12ms</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
            <div className="text-sm text-muted-foreground">Total Incidents</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">-1 from last month</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscribe to Updates */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">
              Stay Updated on System Status
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Get notified about incidents, maintenance windows, and status changes via email, SMS, or webhook.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Subscribe to Updates
          </Button>
        </div>
      </Card>
    </div>
  )
}
