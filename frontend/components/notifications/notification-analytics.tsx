'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Bell,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Zap,
  Target,
  Timer,
  Download,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface NotificationMetric {
  period: string
  total: number
  byCategory: Record<string, number>
  bySeverity: Record<string, number>
  responseTime: number
  acknowledgmentRate: number
  escalationRate: number
}

interface TrendData {
  metric: string
  current: number
  previous: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

export function NotificationAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Mock analytics data
  const metrics: NotificationMetric[] = [
    {
      period: '2024-01',
      total: 1247,
      byCategory: {
        anomalies: 456,
        ai_agents: 289,
        system: 167,
        operations: 234,
        users: 101
      },
      bySeverity: {
        critical: 89,
        warning: 567,
        info: 591
      },
      responseTime: 4.2,
      acknowledgmentRate: 87.3,
      escalationRate: 12.1
    }
  ]

  const currentMetric = metrics[0]

  const trendData: TrendData[] = [
    { metric: 'Total Notifications', current: 1247, previous: 1156, change: 7.9, trend: 'up' },
    { metric: 'Avg Response Time', current: 4.2, previous: 5.1, change: -17.6, trend: 'down' },
    { metric: 'Acknowledgment Rate', current: 87.3, previous: 82.4, change: 5.9, trend: 'up' },
    { metric: 'Escalation Rate', current: 12.1, previous: 15.7, change: -22.9, trend: 'down' },
    { metric: 'Critical Alerts', current: 89, previous: 124, change: -28.2, trend: 'down' },
    { metric: 'Auto-Resolved', current: 76.4, previous: 71.2, change: 7.3, trend: 'up' }
  ]

  const categoryPerformance = [
    { name: 'Anomalies & Risks', count: 456, responseTime: 3.2, ackRate: 92.1, color: 'bg-red-500' },
    { name: 'AI Agent Actions', count: 289, responseTime: 5.8, ackRate: 78.4, color: 'bg-blue-500' },
    { name: 'System & Security', count: 167, responseTime: 2.1, ackRate: 95.7, color: 'bg-orange-500' },
    { name: 'Operational Updates', count: 234, responseTime: 6.4, ackRate: 84.2, color: 'bg-green-500' },
    { name: 'User Actions', count: 101, responseTime: 4.9, ackRate: 89.3, color: 'bg-purple-500' }
  ]

  const userPerformance = [
    { name: 'Sarah Johnson', notifications: 89, avgResponse: 2.1, ackRate: 98.9 },
    { name: 'Marcus Rodriguez', notifications: 67, avgResponse: 3.4, ackRate: 94.0 },
    { name: 'Emily Chen', notifications: 54, avgResponse: 4.2, ackRate: 92.6 },
    { name: 'David Thompson', notifications: 43, avgResponse: 1.8, ackRate: 100.0 },
    { name: 'Lisa Park', notifications: 32, avgResponse: 5.7, ackRate: 87.5 }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-gray-600'
    
    const isGoodChange = (trend === 'up' && isPositive) || (trend === 'down' && !isPositive)
    return isGoodChange ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Analytics</h2>
          <p className="text-muted-foreground">
            Insights into notification patterns, response times, and team performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetric.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +7.9% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetric.responseTime}min</div>
            <p className="text-xs text-green-600">
              -17.6% improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledgment Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetric.acknowledgmentRate}%</div>
            <p className="text-xs text-green-600">
              +5.9% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetric.escalationRate}%</div>
            <p className="text-xs text-green-600">
              -22.9% reduction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trends Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            Key metrics compared to previous period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendData.map((trend) => (
              <div key={trend.metric} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{trend.metric}</span>
                  {getTrendIcon(trend.trend)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{trend.current}</span>
                  <span className={`text-sm ${getTrendColor(trend.trend, ['Acknowledgment Rate', 'Auto-Resolved'].includes(trend.metric))}`}>
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  vs {trend.previous} last period
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Notifications by Category
            </CardTitle>
            <CardDescription>
              Volume and distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.count} notifications</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.color} transition-all`}
                      style={{ width: `${(category.count / currentMetric.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{((category.count / currentMetric.total) * 100).toFixed(1)}% of total</span>
                    <span>{category.ackRate}% acknowledged</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Severity Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by notification severity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Critical
                  </span>
                  <span className="text-muted-foreground">{currentMetric.bySeverity.critical}</span>
                </div>
                <Progress value={(currentMetric.bySeverity.critical / currentMetric.total) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {((currentMetric.bySeverity.critical / currentMetric.total) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Warning
                  </span>
                  <span className="text-muted-foreground">{currentMetric.bySeverity.warning}</span>
                </div>
                <Progress value={(currentMetric.bySeverity.warning / currentMetric.total) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {((currentMetric.bySeverity.warning / currentMetric.total) * 100).toFixed(1)}% of total
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Info
                  </span>
                  <span className="text-muted-foreground">{currentMetric.bySeverity.info}</span>
                </div>
                <Progress value={(currentMetric.bySeverity.info / currentMetric.total) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {((currentMetric.bySeverity.info / currentMetric.total) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Category Performance Analysis
          </CardTitle>
          <CardDescription>
            Response times and acknowledgment rates by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryPerformance.map((category) => (
              <div key={category.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{category.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {category.count} notifications
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{category.responseTime}min</div>
                    <div className="text-xs text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{category.ackRate}%</div>
                    <div className="text-xs text-muted-foreground">Acknowledgment Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {((category.count / currentMetric.total) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Volume Share</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${category.color} transition-all`}
                      style={{ width: `${category.ackRate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top User Performance
          </CardTitle>
          <CardDescription>
            Users with the best notification response metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPerformance.map((user, index) => (
              <div key={user.name} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.notifications} notifications handled
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-600">{user.avgResponse}min</div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-600">{user.ackRate}%</div>
                  <div className="text-xs text-muted-foreground">Ack Rate</div>
                </div>
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${user.ackRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Insights & Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered insights to improve notification effectiveness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">Positive Trend</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Response times have improved by 17.6% this month. The implementation of escalation rules is working effectively.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-600">Optimization Opportunity</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                AI Agent notifications have the lowest acknowledgment rate (78.4%). Consider adjusting notification frequency or improving message clarity.
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-orange-600">Action Recommended</span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Peak notification volume occurs between 2-4 PM. Consider load balancing or increasing support during these hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
