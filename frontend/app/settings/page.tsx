'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GradientText } from '@/components/ui/gradient-text'
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  TiltCard
} from '@/components/ui/motion-components'
import {
  Settings,
  Users,
  Bell,
  Bot,
  Plug,
  Shield,
  Palette,
  BarChart3,
  Monitor,
  RefreshCw,
  Download,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Key,
  Lock,
  FileText,
  Upload,
  Zap,
  Activity,
  Target,
  Sliders,
  Database,
  Wifi,
  WifiOff,
  Power,
  PowerOff
} from 'lucide-react'

// Types
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'ops_team' | 'analyst' | 'customer_service'
  status: 'active' | 'inactive'
  lastLogin: string
  avatar?: string
}

interface NotificationSetting {
  id: string
  name: string
  description: string
  channels: {
    email: boolean
    sms: boolean
    slack: boolean
    teams: boolean
  }
  threshold?: number
  enabled: boolean
}

interface AIAgentSetting {
  id: string
  name: string
  enabled: boolean
  confidenceThreshold: number
  escalationAttempts: number
  safeMode: boolean
  description: string
}

interface Integration {
  id: string
  name: string
  type: 'carrier' | 'warehouse' | 'iot' | 'notification'
  status: 'connected' | 'error' | 'disconnected'
  lastSync?: string
  apiKey?: string
  description: string
}

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@clearpath.ai',
    role: 'admin',
    status: 'active',
    lastLogin: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@clearpath.ai',
    role: 'ops_team',
    status: 'active',
    lastLogin: '1 day ago'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@clearpath.ai',
    role: 'analyst',
    status: 'active',
    lastLogin: '3 hours ago'
  }
]

const mockNotifications: NotificationSetting[] = [
  {
    id: '1',
    name: 'Anomaly Detection',
    description: 'Notifications for detected package anomalies',
    channels: { email: true, sms: false, slack: true, teams: false },
    threshold: 80,
    enabled: true
  },
  {
    id: '2',
    name: 'Package Delays',
    description: 'Notifications for significant package delays',
    channels: { email: true, sms: true, slack: true, teams: false },
    threshold: 75,
    enabled: true
  },
  {
    id: '3',
    name: 'System Alerts',
    description: 'Critical system and integration failures',
    channels: { email: true, sms: true, slack: true, teams: true },
    enabled: true
  }
]

const mockAIAgents: AIAgentSetting[] = [
  {
    id: 'investigator-01',
    name: 'Investigator Agent',
    enabled: true,
    confidenceThreshold: 75,
    escalationAttempts: 3,
    safeMode: false,
    description: 'Detects package anomalies and missing scans'
  },
  {
    id: 'recovery-01',
    name: 'Recovery Agent',
    enabled: true,
    confidenceThreshold: 80,
    escalationAttempts: 2,
    safeMode: false,
    description: 'Handles package recovery and rerouting'
  },
  {
    id: 'customer-01',
    name: 'Customer Agent',
    enabled: true,
    confidenceThreshold: 90,
    escalationAttempts: 1,
    safeMode: true,
    description: 'Manages customer communications'
  }
]

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'FedEx API',
    type: 'carrier',
    status: 'connected',
    lastSync: '5 minutes ago',
    description: 'FedEx package tracking and shipping integration'
  },
  {
    id: '2',
    name: 'UPS API',
    type: 'carrier',
    status: 'connected',
    lastSync: '3 minutes ago',
    description: 'UPS package tracking and shipping integration'
  },
  {
    id: '3',
    name: 'Custom Fleet GPS',
    type: 'iot',
    status: 'error',
    lastSync: '2 hours ago',
    description: 'Real-time GPS tracking for custom fleet vehicles'
  },
  {
    id: '4',
    name: 'Slack Notifications',
    type: 'notification',
    status: 'connected',
    lastSync: '1 minute ago',
    description: 'Slack workspace integration for notifications'
  }
]

const roleConfig = {
  admin: { label: 'Administrator', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  ops_team: { label: 'Operations Team', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  analyst: { label: 'Analyst', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  customer_service: { label: 'Customer Service', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
}

const statusConfig = {
  connected: { color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-100 dark:bg-green-900' },
  error: { color: 'text-red-600', icon: AlertTriangle, bg: 'bg-red-100 dark:bg-red-900' },
  disconnected: { color: 'text-gray-600', icon: Clock, bg: 'bg-gray-100 dark:bg-gray-800' }
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotifications)
  const [aiAgents, setAIAgents] = useState<AIAgentSetting[]>(mockAIAgents)
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const toggleAIAgent = (agentId: string) => {
    setAIAgents(agents => agents.map(agent => 
      agent.id === agentId ? { ...agent, enabled: !agent.enabled } : agent
    ))
  }

  const updateAgentThreshold = (agentId: string, threshold: number) => {
    setAIAgents(agents => agents.map(agent => 
      agent.id === agentId ? { ...agent, confidenceThreshold: threshold } : agent
    ))
  }

  const toggleSafeMode = (agentId: string) => {
    setAIAgents(agents => agents.map(agent => 
      agent.id === agentId ? { ...agent, safeMode: !agent.safeMode } : agent
    ))
  }

  const toggleNotificationChannel = (notificationId: string, channel: keyof NotificationSetting['channels']) => {
    setNotifications(notifications => notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, channels: { ...notification.channels, [channel]: !notification.channels[channel] } }
        : notification
    ))
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-8 h-8 text-blue-600" />
            </motion.div>
            <GradientText from="from-blue-600" to="to-purple-600">
              System Settings
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure system behavior, manage users, and control AI agents
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </motion.div>
            Refresh
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save All
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Agents</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="w-4 h-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Users & Role Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User & Role Management
                </CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Last Login</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={roleConfig[user.role].color}>
                            {roleConfig[user.role].label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{user.lastLogin}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{notification.name}</h3>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Button
                      variant={notification.enabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNotifications(notifications => 
                        notifications.map(n => n.id === notification.id ? { ...n, enabled: !n.enabled } : n)
                      )}
                    >
                      {notification.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={notification.channels.email ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleNotificationChannel(notification.id, 'email')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={notification.channels.sms ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleNotificationChannel(notification.id, 'sms')}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        SMS
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={notification.channels.slack ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleNotificationChannel(notification.id, 'slack')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Slack
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={notification.channels.teams ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleNotificationChannel(notification.id, 'teams')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Teams
                      </Button>
                    </div>
                  </div>
                  
                  {notification.threshold && (
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium">Confidence Threshold:</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={notification.threshold}
                          className="w-32"
                        />
                        <span className="text-sm font-medium w-12">{notification.threshold}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Agent Controls */}
        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Agent Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiAgents.map((agent) => (
                <div key={agent.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {agent.name}
                        {agent.enabled ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                    <Button
                      variant={agent.enabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleAIAgent(agent.id)}
                    >
                      {agent.enabled ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Confidence Threshold</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={agent.confidenceThreshold}
                          onChange={(e) => updateAgentThreshold(agent.id, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12">{agent.confidenceThreshold}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Escalation Attempts</label>
                      <Select value={agent.escalationAttempts.toString()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Safe Mode</label>
                      <Button
                        variant={agent.safeMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleSafeMode(agent.id)}
                        className="w-full"
                      >
                        {agent.safeMode ? (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Suggest Only
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Execute Actions
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Plug className="w-5 h-5 text-primary" />
                  System Integrations
                </CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Integration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration) => {
                  const StatusIcon = statusConfig[integration.status].icon
                  return (
                    <TiltCard key={integration.id}>
                      <Card className="h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-medium">{integration.name}</h3>
                              <p className="text-sm text-muted-foreground">{integration.description}</p>
                            </div>
                            <div className={`p-2 rounded-full ${statusConfig[integration.status].bg}`}>
                              <StatusIcon className={`w-4 h-4 ${statusConfig[integration.status].color}`} />
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Status:</span>
                              <Badge className={statusConfig[integration.status].bg}>
                                {integration.status}
                              </Badge>
                            </div>
                            {integration.lastSync && (
                              <div className="flex justify-between text-sm">
                                <span>Last Sync:</span>
                                <span className="text-muted-foreground">{integration.lastSync}</span>
                              </div>
                            )}
                          </div>
                          
                          {integration.apiKey && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">API Key</label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setShowApiKeys(prev => ({
                                    ...prev,
                                    [integration.id]: !prev[integration.id]
                                  }))}
                                >
                                  {showApiKeys[integration.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                              <Input
                                type={showApiKeys[integration.id] ? 'text' : 'password'}
                                value="sk-1234567890abcdef"
                                readOnly
                                className="font-mono text-sm"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                            {integration.status === 'error' && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">SSO Integration</h3>
                    <p className="text-sm text-muted-foreground">Google Workspace integration</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Data Retention</h3>
                  <Select defaultValue="180">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Compliance & Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">GDPR Compliance</h3>
                    <p className="text-sm text-muted-foreground">European data protection</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">CCPA Compliance</h3>
                    <p className="text-sm text-muted-foreground">California privacy rights</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Audit Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Brand Customization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Company Logo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">SVG, PNG, JPG (max. 2MB)</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg border"></div>
                    <Input value="#3B82F6" readOnly />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg border"></div>
                    <Input value="#8B5CF6" readOnly />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Timezone</label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics & Reporting */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytics & Reporting Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Scheduled Reports</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Daily Operations Report</h4>
                      <p className="text-sm text-muted-foreground">Package status, anomalies, and KPIs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Weekly Performance Summary</h4>
                      <p className="text-sm text-muted-foreground">AI agent performance and system health</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Disabled</Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Default Dashboard KPIs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Delivery Success Rate', 'Recovery Rate', 'Cost Savings', 'Customer Satisfaction', 'Agent Accuracy', 'Response Time'].map((kpi) => (
                    <div key={kpi} className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm">{kpi}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">System Health</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">API Connectivity</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Database Performance</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Slow</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Recent Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Custom Fleet GPS timeout</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">High API response time</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Error Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
