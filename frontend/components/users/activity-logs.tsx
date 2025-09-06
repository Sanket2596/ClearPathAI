'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  Package,
  AlertTriangle,
  Bot,
  Settings,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  MapPin,
  FileText,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface ActivityLog {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  category: 'user_management' | 'package_operations' | 'anomaly_resolution' | 'ai_agents' | 'system' | 'security'
  description: string
  details?: Record<string, any>
  timestamp: Date
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
  affectedResource?: {
    type: string
    id: string
    name: string
  }
}

export function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('7d')

  // Mock activity logs data
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      action: 'package_reroute',
      category: 'package_operations',
      description: 'Rerouted package PCK-2024-001234 to Dallas Hub',
      details: {
        packageId: 'PCK-2024-001234',
        fromHub: 'Chicago Hub',
        toHub: 'Dallas Hub',
        reason: 'Weather disruption in Chicago'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'package',
        id: 'PCK-2024-001234',
        name: 'Package to Miami, FL'
      }
    },
    {
      id: '2',
      userId: '2',
      userName: 'Marcus Rodriguez',
      action: 'agent_deploy',
      category: 'ai_agents',
      description: 'Deployed AI Agent v2.1.3 to Chicago Hub',
      details: {
        agentVersion: 'v2.1.3',
        hubId: 'CHI-001',
        hubName: 'Chicago Hub',
        deploymentType: 'production'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'agent',
        id: 'AGT-CHI-001',
        name: 'Chicago Hub Recovery Agent'
      }
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emily Chen',
      action: 'anomaly_resolve',
      category: 'anomaly_resolution',
      description: 'Resolved anomaly ANM-2024-000567 - Package delay at sorting facility',
      details: {
        anomalyId: 'ANM-2024-000567',
        anomalyType: 'delay',
        resolution: 'Manual intervention - expedited processing',
        timeToResolve: '23 minutes'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'anomaly',
        id: 'ANM-2024-000567',
        name: 'Package Delay Alert'
      }
    },
    {
      id: '4',
      userId: '4',
      userName: 'David Thompson',
      action: 'user_create',
      category: 'user_management',
      description: 'Created new user account for Lisa Park',
      details: {
        newUserId: '5',
        newUserName: 'Lisa Park',
        newUserEmail: 'lisa.park@clearpath.ai',
        role: 'Viewer',
        department: 'Customer Service'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'user',
        id: '5',
        name: 'Lisa Park'
      }
    },
    {
      id: '5',
      userId: '1',
      userName: 'Sarah Johnson',
      action: 'recovery_approve',
      category: 'anomaly_resolution',
      description: 'Approved AI-suggested recovery action for package PCK-2024-001235',
      details: {
        packageId: 'PCK-2024-001235',
        recoveryAction: 'Reroute via alternate hub',
        estimatedDelay: '4 hours',
        aiConfidence: '94%'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'package',
        id: 'PCK-2024-001235',
        name: 'Express Package to Seattle, WA'
      }
    },
    {
      id: '6',
      userId: '2',
      userName: 'Marcus Rodriguez',
      action: 'model_train',
      category: 'ai_agents',
      description: 'Started training session for anomaly detection model',
      details: {
        modelId: 'ADM-v3.2',
        datasetSize: '50,000 samples',
        expectedDuration: '2 hours',
        trainingType: 'incremental'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'warning',
      affectedResource: {
        type: 'model',
        id: 'ADM-v3.2',
        name: 'Anomaly Detection Model'
      }
    },
    {
      id: '7',
      userId: '5',
      userName: 'Lisa Park',
      action: 'login_failed',
      category: 'security',
      description: 'Failed login attempt - Invalid credentials',
      details: {
        attemptCount: 3,
        lockoutTriggered: false,
        lastSuccessfulLogin: '2024-01-15T10:30:00Z'
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      ipAddress: '192.168.1.120',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      status: 'failed',
      affectedResource: {
        type: 'user',
        id: '5',
        name: 'Lisa Park'
      }
    },
    {
      id: '8',
      userId: '4',
      userName: 'David Thompson',
      action: 'settings_update',
      category: 'system',
      description: 'Updated system notification settings',
      details: {
        settingsChanged: ['email_notifications', 'sms_alerts', 'anomaly_thresholds'],
        previousValues: {
          email_notifications: true,
          sms_alerts: false,
          anomaly_threshold: 85
        },
        newValues: {
          email_notifications: true,
          sms_alerts: true,
          anomaly_threshold: 90
        }
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      affectedResource: {
        type: 'system',
        id: 'notification_settings',
        name: 'Notification Settings'
      }
    }
  ]

  const getActionIcon = (category: ActivityLog['category'], action: string) => {
    switch (category) {
      case 'user_management':
        return action.includes('create') ? <UserPlus className="w-4 h-4" /> : 
               action.includes('delete') ? <UserMinus className="w-4 h-4" /> : <User className="w-4 h-4" />
      case 'package_operations':
        return <Package className="w-4 h-4" />
      case 'anomaly_resolution':
        return <AlertTriangle className="w-4 h-4" />
      case 'ai_agents':
        return <Bot className="w-4 h-4" />
      case 'system':
        return <Settings className="w-4 h-4" />
      case 'security':
        return <Shield className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: ActivityLog['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="success" className="text-xs">Success</Badge>
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>
      case 'warning':
        return <Badge variant="secondary" className="text-xs">Warning</Badge>
    }
  }

  const getCategoryBadge = (category: ActivityLog['category']) => {
    const categoryMap = {
      user_management: { label: 'Users', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      package_operations: { label: 'Packages', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      anomaly_resolution: { label: 'Anomalies', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      ai_agents: { label: 'AI Agents', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      system: { label: 'System', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      security: { label: 'Security', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
    }
    
    const categoryInfo = categoryMap[category]
    return (
      <Badge variant="outline" className={`text-xs ${categoryInfo.color}`}>
        {categoryInfo.label}
      </Badge>
    )
  }

  // Filter logs based on search and filters
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    const matchesUser = filterUser === 'all' || log.userId === filterUser
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus

    // Date range filtering
    const now = new Date()
    let matchesDate = true
    if (dateRange !== 'all') {
      const days = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 0
      if (days > 0) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        matchesDate = log.timestamp >= cutoff
      }
    }

    return matchesSearch && matchesCategory && matchesUser && matchesStatus && matchesDate
  })

  const uniqueUsers = Array.from(new Set(activityLogs.map(log => ({ id: log.userId, name: log.userName }))))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Logs & Audit Trail</h2>
          <p className="text-muted-foreground">
            Track all user actions and system events for accountability and compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter activity logs by category, user, status, and date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="user_management">User Management</SelectItem>
                  <SelectItem value="package_operations">Package Operations</SelectItem>
                  <SelectItem value="anomaly_resolution">Anomaly Resolution</SelectItem>
                  <SelectItem value="ai_agents">AI Agents</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">User</label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{filteredLogs.length}</div>
                <div className="text-xs text-muted-foreground">Total Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{filteredLogs.filter(l => l.status === 'success').length}</div>
                <div className="text-xs text-muted-foreground">Successful</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{filteredLogs.filter(l => l.status === 'failed').length}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{uniqueUsers.length}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                {filteredLogs.length} activities found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User & Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={log.userAvatar} alt={log.userName} />
                          <AvatarFallback className="text-xs">
                            {log.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{log.userName}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {getActionIcon(log.category, log.action)}
                            <span>{log.action.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(log.category)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-xs">
                        {log.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.affectedResource && (
                        <div className="text-xs">
                          <div className="font-medium">{log.affectedResource.name}</div>
                          <div className="text-muted-foreground">{log.affectedResource.type}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(log.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium">{format(log.timestamp, 'MMM d, HH:mm')}</div>
                        <div className="text-muted-foreground">
                          {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No activity logs found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
