'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Package,
  Bot,
  Shield,
  Activity,
  Users,
  Clock,
  MapPin,
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2,
  ArrowRight,
  Zap,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  FileText
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface Notification {
  id: string
  title: string
  message: string
  category: 'anomalies' | 'ai_agents' | 'system' | 'operations' | 'users'
  severity: 'info' | 'warning' | 'critical'
  status: 'unread' | 'read' | 'acknowledged' | 'escalated'
  timestamp: Date
  userId?: string
  userName?: string
  packageId?: string
  agentId?: string
  hubId?: string
  hubName?: string
  location?: string
  suggestedActions?: SuggestedAction[]
  metadata?: Record<string, any>
  groupId?: string
  groupCount?: number
  isGrouped?: boolean
}

interface SuggestedAction {
  id: string
  label: string
  action: string
  variant: 'default' | 'destructive' | 'outline' | 'secondary'
  icon?: any
}

interface NotificationCenterProps {
  searchQuery: string
  filterCategory: string
  filterSeverity: string
  filterStatus: string
}

export function NotificationCenter({ 
  searchQuery, 
  filterCategory, 
  filterSeverity, 
  filterStatus 
}: NotificationCenterProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  // Mock notifications data with smart grouping
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Multiple Packages Delayed at Chicago Hub',
      message: '15 packages are experiencing delays due to weather conditions. Estimated delay: 2-4 hours.',
      category: 'anomalies',
      severity: 'warning',
      status: 'unread',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      hubId: 'CHI-001',
      hubName: 'Chicago Hub',
      location: 'Chicago, IL',
      groupId: 'weather-delay-chi',
      groupCount: 15,
      isGrouped: true,
      suggestedActions: [
        { id: '1', label: 'Trigger Rescan', action: 'rescan', variant: 'default', icon: RefreshCw },
        { id: '2', label: 'Reroute Packages', action: 'reroute', variant: 'outline', icon: ArrowRight },
        { id: '3', label: 'Notify Customers', action: 'notify', variant: 'secondary', icon: Bell }
      ]
    },
    {
      id: '2',
      title: 'AI Recovery Agent Deployed Successfully',
      message: 'Recovery Agent v2.1.3 has been deployed to Dallas Hub and is now actively monitoring packages.',
      category: 'ai_agents',
      severity: 'info',
      status: 'read',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      agentId: 'AGT-DAL-001',
      hubName: 'Dallas Hub',
      location: 'Dallas, TX',
      userId: '2',
      userName: 'Marcus Rodriguez',
      suggestedActions: [
        { id: '1', label: 'View Agent Status', action: 'view_agent', variant: 'outline', icon: Eye },
        { id: '2', label: 'Configure Settings', action: 'configure', variant: 'secondary', icon: Shield }
      ]
    },
    {
      id: '3',
      title: 'Critical: High-Value Package Lost',
      message: 'Package PCK-2024-HV-001 ($50,000 value) has not been scanned for 6 hours. Last location: Miami Sorting Facility.',
      category: 'anomalies',
      severity: 'critical',
      status: 'escalated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      packageId: 'PCK-2024-HV-001',
      hubName: 'Miami Hub',
      location: 'Miami, FL',
      metadata: { value: 50000, customerTier: 'Premium' },
      suggestedActions: [
        { id: '1', label: 'Escalate to Manager', action: 'escalate', variant: 'destructive', icon: AlertTriangle },
        { id: '2', label: 'Contact Facility', action: 'contact', variant: 'default', icon: ExternalLink },
        { id: '3', label: 'Initiate Search', action: 'search', variant: 'outline', icon: MapPin }
      ]
    },
    {
      id: '4',
      title: 'Anomaly Detection Model Retrained',
      message: 'AI model has been retrained with 10,000 new data points. Accuracy improved to 94.2%.',
      category: 'ai_agents',
      severity: 'info',
      status: 'read',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      agentId: 'MDL-ANOM-001',
      userId: '2',
      userName: 'Marcus Rodriguez',
      suggestedActions: [
        { id: '1', label: 'View Performance', action: 'view_performance', variant: 'outline', icon: BarChart3 },
        { id: '2', label: 'Deploy to Production', action: 'deploy', variant: 'default', icon: Play }
      ]
    },
    {
      id: '5',
      title: 'New User Account Created',
      message: 'Lisa Park has been added to the Customer Service team with Viewer permissions.',
      category: 'users',
      severity: 'info',
      status: 'read',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      userId: '4',
      userName: 'David Thompson',
      metadata: { newUserId: '5', newUserName: 'Lisa Park', role: 'Viewer' }
    },
    {
      id: '6',
      title: 'Security Alert: Failed Login Attempts',
      message: '5 failed login attempts detected for user james.wilson@clearpath.ai from unknown IP address.',
      category: 'system',
      severity: 'warning',
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      userId: '6',
      userName: 'James Wilson',
      metadata: { attemptCount: 5, ipAddress: '203.0.113.45', location: 'Unknown' },
      suggestedActions: [
        { id: '1', label: 'Block IP Address', action: 'block_ip', variant: 'destructive', icon: Shield },
        { id: '2', label: 'Reset Password', action: 'reset_password', variant: 'outline', icon: RotateCcw },
        { id: '3', label: 'Contact User', action: 'contact_user', variant: 'secondary', icon: Users }
      ]
    },
    {
      id: '7',
      title: 'Phoenix Hub Maintenance Complete',
      message: 'Scheduled maintenance at Phoenix Hub completed successfully. All systems operational.',
      category: 'operations',
      severity: 'info',
      status: 'read',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      hubName: 'Phoenix Hub',
      location: 'Phoenix, AZ'
    },
    {
      id: '8',
      title: 'SLA Risk: Package Approaching Deadline',
      message: 'Package PCK-2024-001789 is at risk of missing SLA deadline. Current delay: 18 hours.',
      category: 'anomalies',
      severity: 'warning',
      status: 'unread',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      packageId: 'PCK-2024-001789',
      hubName: 'LA Hub',
      location: 'Los Angeles, CA',
      suggestedActions: [
        { id: '1', label: 'Expedite Package', action: 'expedite', variant: 'default', icon: Zap },
        { id: '2', label: 'Update Customer', action: 'update_customer', variant: 'outline', icon: Bell },
        { id: '3', label: 'Find Alternative Route', action: 'alternative_route', variant: 'secondary', icon: MapPin }
      ]
    }
  ]

  // Filter notifications based on props
  const filteredNotifications = useMemo(() => {
    return mockNotifications.filter(notification => {
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.packageId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.userName?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = filterCategory === 'all' || notification.category === filterCategory
      const matchesSeverity = filterSeverity === 'all' || notification.severity === filterSeverity
      const matchesStatus = filterStatus === 'all' || notification.status === filterStatus

      return matchesSearch && matchesCategory && matchesSeverity && matchesStatus
    })
  }, [mockNotifications, searchQuery, filterCategory, filterSeverity, filterStatus])

  const getSeverityIcon = (severity: Notification['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />
    }
  }

  const getSeverityBadge = (severity: Notification['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Critical</Badge>
      case 'warning':
        return <Badge className="text-xs bg-orange-600 hover:bg-orange-700">Warning</Badge>
      case 'info':
        return <Badge variant="secondary" className="text-xs">Info</Badge>
    }
  }

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'anomalies':
        return <AlertTriangle className="w-4 h-4" />
      case 'ai_agents':
        return <Bot className="w-4 h-4" />
      case 'system':
        return <Shield className="w-4 h-4" />
      case 'operations':
        return <Activity className="w-4 h-4" />
      case 'users':
        return <Users className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: Notification['status']) => {
    switch (status) {
      case 'unread':
        return <Badge variant="default" className="text-xs">Unread</Badge>
      case 'read':
        return <Badge variant="outline" className="text-xs">Read</Badge>
      case 'acknowledged':
        return <Badge variant="success" className="text-xs">Acknowledged</Badge>
      case 'escalated':
        return <Badge variant="destructive" className="text-xs">Escalated</Badge>
    }
  }

  const handleAction = (notification: Notification, actionId: string) => {
    const action = notification.suggestedActions?.find(a => a.id === actionId)
    if (action) {
      console.log(`Executing action: ${action.action} for notification: ${notification.id}`)
      // Here you would implement the actual action logic
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Feed
              </CardTitle>
              <CardDescription>
                {filteredNotifications.length} notifications found
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Mark Visible as Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg hover:bg-muted/50 transition-all cursor-pointer ${
                  notification.status === 'unread' ? 'border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10' : ''
                }`}
                onClick={() => setSelectedNotification(notification)}
              >
                <div className="flex items-start gap-4">
                  {/* Severity Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(notification.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                          {notification.title}
                          {notification.isGrouped && (
                            <Badge variant="outline" className="text-xs">
                              {notification.groupCount} items
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getSeverityBadge(notification.severity)}
                        {getStatusBadge(notification.status)}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(notification.category)}
                        <span className="capitalize">{notification.category.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                      </div>
                      {notification.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{notification.location}</span>
                        </div>
                      )}
                      {notification.userName && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{notification.userName}</span>
                        </div>
                      )}
                    </div>

                    {/* Suggested Actions */}
                    {notification.suggestedActions && notification.suggestedActions.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.suggestedActions.slice(0, 3).map((action) => (
                          <Button
                            key={action.id}
                            variant={action.variant}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAction(notification, action.id)
                            }}
                          >
                            {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                            {action.label}
                          </Button>
                        ))}
                        {notification.suggestedActions.length > 3 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-7">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {notification.suggestedActions.slice(3).map((action) => (
                                <DropdownMenuItem 
                                  key={action.id}
                                  onClick={() => handleAction(notification, action.id)}
                                >
                                  {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  <div className="flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Acknowledged
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Zap className="w-4 h-4 mr-2" />
                          Escalate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Dismiss
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Detail Modal */}
      <Dialog open={selectedNotification !== null} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedNotification && getSeverityIcon(selectedNotification.severity)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              Detailed information and available actions for this notification
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-6">
              {/* Notification Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getCategoryIcon(selectedNotification.category)}
                    <span className="text-sm capitalize">{selectedNotification.category.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Severity</label>
                  <div className="mt-1">
                    {getSeverityBadge(selectedNotification.severity)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedNotification.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <div className="text-sm mt-1">
                    <div>{format(selectedNotification.timestamp, 'PPP p')}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(selectedNotification.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message</label>
                <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Additional Details */}
              {(selectedNotification.packageId || selectedNotification.hubName || selectedNotification.userName) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedNotification.packageId && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Package ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono">{selectedNotification.packageId}</span>
                      </div>
                    </div>
                  )}
                  {selectedNotification.hubName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hub</label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedNotification.hubName}</span>
                      </div>
                    </div>
                  )}
                  {selectedNotification.userName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{selectedNotification.userName}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              {selectedNotification.metadata && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(selectedNotification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Suggested Actions */}
              {selectedNotification.suggestedActions && selectedNotification.suggestedActions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-3 block">Suggested Actions</label>
                  <div className="flex flex-wrap gap-3">
                    {selectedNotification.suggestedActions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant}
                        onClick={() => handleAction(selectedNotification, action.id)}
                      >
                        {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
                <Button variant="outline">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acknowledge
                </Button>
                <Button>
                  <Zap className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
