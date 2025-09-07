'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GradientText } from '@/components/ui/gradient-text'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { NotificationPreferences } from '@/components/notifications/notification-preferences'
import { EscalationRules } from '@/components/notifications/escalation-rules'
import { NotificationAnalytics } from '@/components/notifications/notification-analytics'
import {
  Bell,
  Search,
  Filter,
  Settings,
  BarChart3,
  Shield,
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
  Package,
  Bot,
  Users,
  Activity,
  Zap,
  Clock,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react'

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('center')

  // Mock notification stats
  const notificationStats = [
    {
      title: 'Unread Notifications',
      value: '23',
      change: '+5',
      changeType: 'increase' as const,
      icon: Bell,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Critical Alerts',
      value: '3',
      change: '-2',
      changeType: 'decrease' as const,
      icon: AlertCircle,
      color: 'from-red-600 to-red-700'
    },
    {
      title: 'Avg Response Time',
      value: '4.2min',
      change: '-30s',
      changeType: 'decrease' as const,
      icon: Clock,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Auto-Resolved',
      value: '87%',
      change: '+12%',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'from-purple-600 to-purple-700'
    }
  ]

  const categoryStats = [
    { category: 'Anomalies & Risks', count: 12, unread: 5, icon: AlertTriangle, color: 'text-red-600' },
    { category: 'AI Agent Actions', count: 8, unread: 3, icon: Bot, color: 'text-blue-600' },
    { category: 'System & Security', count: 6, unread: 2, icon: Shield, color: 'text-orange-600' },
    { category: 'Operational Updates', count: 15, unread: 8, icon: Activity, color: 'text-green-600' },
    { category: 'User Actions', count: 4, unread: 1, icon: Users, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <GradientText from="from-blue-600" to="to-purple-600">
              Notifications Center
            </GradientText>
          </h1>
          <p className="text-muted-foreground text-lg">
            Smart, actionable alerts for your logistics operations. Stay informed without the noise.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Read
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {notificationStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <Badge 
                  variant={stat.changeType === 'increase' ? 'success' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Notification Categories
          </CardTitle>
          <CardDescription>
            Overview of notifications by category with unread counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryStats.map((cat) => (
              <div key={cat.category} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${cat.color}`}>
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{cat.category}</div>
                    <div className="text-xs text-muted-foreground">
                      {cat.count} total • {cat.unread} unread
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${cat.color.replace('text-', 'bg-')}`}
                      style={{ width: `${(cat.unread / cat.count) * 100}%` }}
                    />
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {cat.unread}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                Find specific notifications across all categories and time periods
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notifications, package IDs, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="anomalies">Anomalies & Risks</SelectItem>
                  <SelectItem value="ai_agents">AI Agent Actions</SelectItem>
                  <SelectItem value="system">System & Security</SelectItem>
                  <SelectItem value="operations">Operational Updates</SelectItem>
                  <SelectItem value="users">User Actions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="center" className="flex items-center gap-2 py-3">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notification Center</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2 py-3">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Escalation Rules</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 py-3">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="center" className="space-y-6">
          <NotificationCenter 
            searchQuery={searchQuery}
            filterCategory={filterCategory}
            filterSeverity={filterSeverity}
            filterStatus={filterStatus}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="escalation" className="space-y-6">
          <EscalationRules />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <NotificationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
