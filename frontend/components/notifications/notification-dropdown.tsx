'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Eye,
  ExternalLink,
  Settings,
  RefreshCw,
  ArrowRight,
  Zap
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface QuickNotification {
  id: string
  title: string
  message: string
  category: 'anomalies' | 'ai_agents' | 'system' | 'operations' | 'users'
  severity: 'info' | 'warning' | 'critical'
  timestamp: Date
  isRead: boolean
  suggestedAction?: {
    label: string
    action: string
    icon?: any
  }
}

interface NotificationDropdownProps {
  className?: string
  showLabel?: boolean
  isCollapsed?: boolean
}

export function NotificationDropdown({ className, showLabel = false, isCollapsed = false }: NotificationDropdownProps) {
  // Mock recent notifications for dropdown
  const [recentNotifications] = useState<QuickNotification[]>([
    {
      id: '1',
      title: 'High-Value Package Lost',
      message: 'Package PCK-2024-HV-001 missing for 6 hours',
      category: 'anomalies',
      severity: 'critical',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false,
      suggestedAction: { label: 'Escalate', action: 'escalate', icon: AlertTriangle }
    },
    {
      id: '2',
      title: 'AI Agent Deployed',
      message: 'Recovery Agent v2.1.3 active at Dallas Hub',
      category: 'ai_agents',
      severity: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      isRead: false,
      suggestedAction: { label: 'Monitor', action: 'monitor', icon: Eye }
    },
    {
      id: '3',
      title: 'Multiple Package Delays',
      message: '15 packages delayed at Chicago Hub',
      category: 'anomalies',
      severity: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      isRead: true,
      suggestedAction: { label: 'Reroute', action: 'reroute', icon: ArrowRight }
    },
    {
      id: '4',
      title: 'Security Alert',
      message: 'Failed login attempts detected',
      category: 'system',
      severity: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      isRead: false,
      suggestedAction: { label: 'Review', action: 'review', icon: Shield }
    },
    {
      id: '5',
      title: 'Hub Maintenance Complete',
      message: 'Phoenix Hub back online',
      category: 'operations',
      severity: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      isRead: true
    }
  ])

  const unreadCount = recentNotifications.filter(n => !n.isRead).length

  const getSeverityIcon = (severity: QuickNotification['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-3 h-3 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-orange-600" />
      case 'info':
        return <Info className="w-3 h-3 text-blue-600" />
    }
  }

  const getCategoryIcon = (category: QuickNotification['category']) => {
    switch (category) {
      case 'anomalies':
        return <AlertTriangle className="w-3 h-3" />
      case 'ai_agents':
        return <Bot className="w-3 h-3" />
      case 'system':
        return <Shield className="w-3 h-3" />
      case 'operations':
        return <Activity className="w-3 h-3" />
      case 'users':
        return <Users className="w-3 h-3" />
    }
  }

  const handleQuickAction = (notification: QuickNotification) => {
    if (notification.suggestedAction) {
      console.log(`Quick action: ${notification.suggestedAction.action} for ${notification.id}`)
      // Implement quick action logic here
    }
  }

  const markAllAsRead = () => {
    console.log('Marking all notifications as read')
    // Implement mark all as read logic
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={showLabel ? "default" : "icon"} 
          className={`relative hover:bg-muted/50 rounded-lg ${className}`}
        >
          <Bell className={isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} />
          {showLabel && !isCollapsed && <span>Notifications</span>}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs shadow-lg"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base">Notifications</h3>
              <p className="text-xs text-muted-foreground">
                {unreadCount} unread of {recentNotifications.length} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-3 border-b bg-muted/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-background rounded">
              <div className="text-lg font-bold text-red-600">
                {recentNotifications.filter(n => n.severity === 'critical').length}
              </div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="p-2 bg-background rounded">
              <div className="text-lg font-bold text-orange-600">
                {recentNotifications.filter(n => n.severity === 'warning').length}
              </div>
              <div className="text-xs text-muted-foreground">Warning</div>
            </div>
            <div className="p-2 bg-background rounded">
              <div className="text-lg font-bold text-blue-600">
                {recentNotifications.filter(n => n.severity === 'info').length}
              </div>
              <div className="text-xs text-muted-foreground">Info</div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="max-h-80 overflow-y-auto">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-3 border-b hover:bg-muted/50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-950/10 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSeverityIcon(notification.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getCategoryIcon(notification.category)}
                        <span className="capitalize">{notification.category.replace('_', ' ')}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                      </div>
                      {notification.suggestedAction && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs px-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleQuickAction(notification)
                          }}
                        >
                          {notification.suggestedAction.icon && (
                            <notification.suggestedAction.icon className="w-3 h-3 mr-1" />
                          )}
                          {notification.suggestedAction.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                View All Notifications
              </Button>
            </Link>
            <Link href="/notifications?tab=preferences">
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
