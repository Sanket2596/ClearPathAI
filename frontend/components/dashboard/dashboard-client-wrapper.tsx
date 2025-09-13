'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWebSocket } from '@/hooks/use-websocket'
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Zap,
  RefreshCw
} from 'lucide-react'

interface DashboardStats {
  total_packages: number
  in_transit: number
  delivered: number
  delayed: number
  anomalies: number
  recovery_rate: number
}

export function DashboardClientWrapper() {
  const { isConnected, lastMessage, subscribe, unsubscribe } = useWebSocket()
  const [liveStats, setLiveStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [systemHealth, setSystemHealth] = useState({
    ai_agents: 'healthy',
    database: 'healthy',
    api: 'healthy',
    websocket: isConnected ? 'healthy' : 'disconnected'
  })

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribe('dashboard_metrics')
      subscribe('package_updates')
      subscribe('system_health')
      subscribe('agent_activity')
    }

    return () => {
      if (isConnected) {
        unsubscribe('dashboard_metrics')
        unsubscribe('package_updates')
        unsubscribe('system_health')
        unsubscribe('agent_activity')
      }
    }
  }, [isConnected, subscribe, unsubscribe])

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'dashboard_metrics':
          setLiveStats(lastMessage.data)
          break
        case 'package_update':
          handlePackageUpdate(lastMessage.data)
          break
        case 'system_health':
          handleSystemHealthUpdate(lastMessage.data)
          break
        case 'agent_activity':
          handleAgentActivity(lastMessage.data)
          break
        case 'anomaly_detected':
          handleAnomalyAlert(lastMessage.data)
          break
      }
    }
  }, [lastMessage])

  const handlePackageUpdate = (data: any) => {
    setRecentActivity(prev => [
      {
        id: Date.now(),
        type: 'package_update',
        message: `Package ${data.tracking_number} status updated to ${data.status}`,
        timestamp: new Date().toISOString(),
        data
      },
      ...prev.slice(0, 9) // Keep last 10 activities
    ])
  }

  const handleSystemHealthUpdate = (data: any) => {
    setSystemHealth(prev => ({
      ...prev,
      [data.component]: data.status
    }))
  }

  const handleAgentActivity = (data: any) => {
    setRecentActivity(prev => [
      {
        id: Date.now(),
        type: 'agent_activity',
        message: `AI Agent ${data.agent_id} performed ${data.action}`,
        timestamp: new Date().toISOString(),
        data
      },
      ...prev.slice(0, 9)
    ])
  }

  const handleAnomalyAlert = (data: any) => {
    setRecentActivity(prev => [
      {
        id: Date.now(),
        type: 'anomaly_detected',
        message: `Anomaly detected: ${data.anomaly_type} for package ${data.package_id}`,
        timestamp: new Date().toISOString(),
        data,
        severity: data.severity
      },
      ...prev.slice(0, 9)
    ])
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      case 'disconnected': return 'text-gray-500'
      default: return 'text-gray-500'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'disconnected': return <Clock className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'package_update': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'agent_activity': return <Zap className="h-4 w-4 text-purple-500" />
      case 'anomaly_detected': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Stats Overlay */}
      {liveStats && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Dashboard Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{liveStats.total_packages}</p>
                <p className="text-sm text-green-600">Total Packages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{liveStats.in_transit}</p>
                <p className="text-sm text-green-600">In Transit</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{liveStats.delivered}</p>
                <p className="text-sm text-green-600">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">{liveStats.recovery_rate.toFixed(1)}%</p>
                <p className="text-sm text-green-600">Recovery Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(systemHealth).map(([component, status]) => (
              <div key={component} className="flex items-center gap-2 p-3 border rounded-lg">
                {getHealthIcon(status)}
                <div>
                  <p className="font-medium capitalize">{component.replace('_', ' ')}</p>
                  <p className={`text-sm ${getHealthColor(status)}`}>
                    {status === 'disconnected' ? 'Disconnected' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
            {isConnected && (
              <Badge variant="outline" className="ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <p className="text-sm text-gray-400">Activity will appear here as it happens</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                    {activity.severity && (
                      <Badge 
                        variant={activity.severity === 'high' ? 'destructive' : 'secondary'}
                        className="mt-1"
                      >
                        {activity.severity} severity
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected to real-time updates' : 'Disconnected from real-time updates'}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
