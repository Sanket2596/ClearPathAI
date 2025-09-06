'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Shield,
  Key,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Clock,
  Activity,
  MoreHorizontal,
  RefreshCw,
  Download,
  Settings,
  UserX,
  LogOut,
  Plus,
  Mail,
  Phone,
  MapPin,
  Monitor,
  Wifi
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface UserSession {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  ipAddress: string
  location: string
  loginTime: Date
  lastActivity: Date
  isActive: boolean
  isCurrent: boolean
}

interface SecurityEvent {
  id: string
  userId: string
  userName: string
  eventType: 'login_success' | 'login_failed' | 'password_change' | 'mfa_enabled' | 'mfa_disabled' | 'suspicious_activity' | 'account_locked' | 'session_expired'
  description: string
  ipAddress: string
  location: string
  timestamp: Date
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  userAgent: string
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxAge: number // days
    preventReuse: number // number of previous passwords
  }
  mfaPolicy: {
    required: boolean
    allowedMethods: string[]
    gracePeriod: number // days
  }
  sessionPolicy: {
    maxDuration: number // hours
    idleTimeout: number // minutes
    maxConcurrentSessions: number
  }
  accessControl: {
    allowedIpRanges: string[]
    blockedCountries: string[]
    requireVpn: boolean
  }
}

export function SecurityControls() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'events' | 'settings'>('sessions')
  const [showPasswords, setShowPasswords] = useState(false)

  // Mock user sessions data
  const userSessions: UserSession[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      deviceType: 'desktop',
      browser: 'Chrome 120.0',
      os: 'Windows 11',
      ipAddress: '192.168.1.100',
      location: 'Chicago, IL, USA',
      loginTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      lastActivity: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      isActive: true,
      isCurrent: true
    },
    {
      id: '2',
      userId: '2',
      userName: 'Marcus Rodriguez',
      deviceType: 'mobile',
      browser: 'Safari Mobile',
      os: 'iOS 17.2',
      ipAddress: '10.0.0.45',
      location: 'Dallas, TX, USA',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isActive: true,
      isCurrent: false
    },
    {
      id: '3',
      userId: '3',
      userName: 'Emily Chen',
      deviceType: 'desktop',
      browser: 'Firefox 121.0',
      os: 'macOS 14.2',
      ipAddress: '172.16.0.23',
      location: 'Los Angeles, CA, USA',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isActive: false,
      isCurrent: false
    },
    {
      id: '4',
      userId: '4',
      userName: 'David Thompson',
      deviceType: 'desktop',
      browser: 'Edge 120.0',
      os: 'Windows 11',
      ipAddress: '192.168.1.101',
      location: 'Seattle, WA, USA',
      loginTime: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isActive: true,
      isCurrent: false
    }
  ]

  // Mock security events data
  const securityEvents: SecurityEvent[] = [
    {
      id: '1',
      userId: '5',
      userName: 'Lisa Park',
      eventType: 'login_failed',
      description: 'Multiple failed login attempts detected',
      ipAddress: '203.0.113.45',
      location: 'Unknown Location',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      riskLevel: 'high',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      userId: '1',
      userName: 'Sarah Johnson',
      eventType: 'login_success',
      description: 'Successful login from new device',
      ipAddress: '192.168.1.100',
      location: 'Chicago, IL, USA',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      riskLevel: 'medium',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '3',
      userId: '2',
      userName: 'Marcus Rodriguez',
      eventType: 'mfa_enabled',
      description: 'Multi-factor authentication enabled',
      ipAddress: '10.0.0.45',
      location: 'Dallas, TX, USA',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      riskLevel: 'low',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      id: '4',
      userId: '6',
      userName: 'James Wilson',
      eventType: 'account_locked',
      description: 'Account locked due to suspicious activity',
      ipAddress: '198.51.100.22',
      location: 'Phoenix, AZ, USA',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      riskLevel: 'critical',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  ]

  // Mock security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5
    },
    mfaPolicy: {
      required: true,
      allowedMethods: ['authenticator', 'sms', 'email'],
      gracePeriod: 7
    },
    sessionPolicy: {
      maxDuration: 8,
      idleTimeout: 30,
      maxConcurrentSessions: 3
    },
    accessControl: {
      allowedIpRanges: ['192.168.0.0/16', '10.0.0.0/8'],
      blockedCountries: ['CN', 'RU', 'KP'],
      requireVpn: false
    }
  })

  const getDeviceIcon = (deviceType: UserSession['deviceType']) => {
    switch (deviceType) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />
      case 'mobile':
        return <Smartphone className="w-4 h-4" />
      case 'tablet':
        return <Smartphone className="w-4 h-4" />
    }
  }

  const getRiskBadge = (riskLevel: SecurityEvent['riskLevel']) => {
    switch (riskLevel) {
      case 'low':
        return <Badge variant="success" className="text-xs">Low</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>
      case 'critical':
        return <Badge className="text-xs bg-red-600 hover:bg-red-700">Critical</Badge>
    }
  }

  const getEventIcon = (eventType: SecurityEvent['eventType']) => {
    switch (eventType) {
      case 'login_success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'login_failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'password_change':
        return <Key className="w-4 h-4 text-blue-600" />
      case 'mfa_enabled':
        return <Shield className="w-4 h-4 text-green-600" />
      case 'mfa_disabled':
        return <Shield className="w-4 h-4 text-orange-600" />
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'account_locked':
        return <Lock className="w-4 h-4 text-red-600" />
      case 'session_expired':
        return <Clock className="w-4 h-4 text-orange-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security & Access Controls</h2>
          <p className="text-muted-foreground">
            Monitor user sessions, security events, and manage access policies
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

      {/* Tab Navigation */}
      <div className="flex items-center bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={activeTab === 'sessions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('sessions')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Active Sessions
        </Button>
        <Button
          variant={activeTab === 'events' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('events')}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Security Events
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Policies
        </Button>
      </div>

      {activeTab === 'sessions' && (
        <>
          {/* Session Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{userSessions.filter(s => s.isActive).length}</div>
                    <div className="text-xs text-muted-foreground">Active Sessions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{userSessions.filter(s => s.deviceType === 'desktop').length}</div>
                    <div className="text-xs text-muted-foreground">Desktop</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{userSessions.filter(s => s.deviceType === 'mobile').length}</div>
                    <div className="text-xs text-muted-foreground">Mobile</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{new Set(userSessions.map(s => s.location)).size}</div>
                    <div className="text-xs text-muted-foreground">Locations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Active User Sessions
              </CardTitle>
              <CardDescription>
                Monitor and manage current user sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Device & Browser</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSessions.map((session) => (
                      <TableRow key={session.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={session.userAvatar} alt={session.userName} />
                              <AvatarFallback className="text-xs">
                                {session.userName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{session.userName}</div>
                              <div className="text-xs text-muted-foreground">{session.ipAddress}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(session.deviceType)}
                            <div>
                              <div className="text-sm font-medium">{session.browser}</div>
                              <div className="text-xs text-muted-foreground">{session.os}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {session.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(session.loginTime, 'MMM d, HH:mm')}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(session.loginTime, { addSuffix: true })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDistanceToNow(session.lastActivity, { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {session.isActive ? (
                              <Badge variant="success" className="text-xs">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Idle</Badge>
                            )}
                            {session.isCurrent && (
                              <Badge variant="outline" className="text-xs">Current</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Session Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MapPin className="w-4 h-4 mr-2" />
                                View Location
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {!session.isCurrent && (
                                <DropdownMenuItem className="text-red-600">
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Terminate Session
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="w-4 h-4 mr-2" />
                                Block User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'events' && (
        <>
          {/* Security Events Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold">{securityEvents.filter(e => e.riskLevel === 'critical' || e.riskLevel === 'high').length}</div>
                    <div className="text-xs text-muted-foreground">High Risk Events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold">{securityEvents.filter(e => e.eventType === 'login_failed').length}</div>
                    <div className="text-xs text-muted-foreground">Failed Logins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{securityEvents.filter(e => e.eventType === 'account_locked').length}</div>
                    <div className="text-xs text-muted-foreground">Locked Accounts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{securityEvents.filter(e => e.eventType === 'login_success').length}</div>
                    <div className="text-xs text-muted-foreground">Successful Logins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Events Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Security Events
              </CardTitle>
              <CardDescription>
                Monitor security-related events and potential threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.eventType)}
                            <span className="text-sm font-medium">
                              {event.eventType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{event.userName}</div>
                            <div className="text-xs text-muted-foreground">{event.ipAddress}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs">{event.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            {event.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRiskBadge(event.riskLevel)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(event.timestamp, 'MMM d, HH:mm')}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="w-4 h-4 mr-2" />
                                View User Activity
                              </DropdownMenuItem>
                              {event.riskLevel === 'high' || event.riskLevel === 'critical' ? (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <UserX className="w-4 h-4 mr-2" />
                                    Block User
                                  </DropdownMenuItem>
                                </>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'settings' && (
        <>
          {/* Security Policy Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>
                  Configure password requirements and security rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minLength">Minimum Length</Label>
                    <Input
                      id="minLength"
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, minLength: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxAge">Max Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={securitySettings.passwordPolicy.maxAge}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, maxAge: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireUppercase">Require Uppercase</Label>
                    <Switch
                      id="requireUppercase"
                      checked={securitySettings.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, requireUppercase: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireNumbers">Require Numbers</Label>
                    <Switch
                      id="requireNumbers"
                      checked={securitySettings.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, requireNumbers: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireSpecial">Require Special Characters</Label>
                    <Switch
                      id="requireSpecial"
                      checked={securitySettings.passwordPolicy.requireSpecialChars}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: { ...prev.passwordPolicy, requireSpecialChars: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MFA Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Multi-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Configure MFA requirements and allowed methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfaRequired">Require MFA for all users</Label>
                  <Switch
                    id="mfaRequired"
                    checked={securitySettings.mfaPolicy.required}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
                      ...prev,
                      mfaPolicy: { ...prev.mfaPolicy, required: checked }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={securitySettings.mfaPolicy.gracePeriod}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      mfaPolicy: { ...prev.mfaPolicy, gracePeriod: parseInt(e.target.value) }
                    }))}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Allowed Methods</Label>
                  <div className="space-y-2 mt-2">
                    {['authenticator', 'sms', 'email'].map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Switch
                          id={method}
                          checked={securitySettings.mfaPolicy.allowedMethods.includes(method)}
                          onCheckedChange={(checked) => {
                            setSecuritySettings(prev => ({
                              ...prev,
                              mfaPolicy: {
                                ...prev.mfaPolicy,
                                allowedMethods: checked
                                  ? [...prev.mfaPolicy.allowedMethods, method]
                                  : prev.mfaPolicy.allowedMethods.filter(m => m !== method)
                              }
                            }))
                          }}
                        />
                        <Label htmlFor={method} className="capitalize">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Session Management
                </CardTitle>
                <CardDescription>
                  Configure session duration and idle timeout settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxDuration">Max Duration (hours)</Label>
                    <Input
                      id="maxDuration"
                      type="number"
                      value={securitySettings.sessionPolicy.maxDuration}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        sessionPolicy: { ...prev.sessionPolicy, maxDuration: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="idleTimeout">Idle Timeout (minutes)</Label>
                    <Input
                      id="idleTimeout"
                      type="number"
                      value={securitySettings.sessionPolicy.idleTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        sessionPolicy: { ...prev.sessionPolicy, idleTimeout: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxSessions">Max Concurrent Sessions</Label>
                  <Input
                    id="maxSessions"
                    type="number"
                    value={securitySettings.sessionPolicy.maxConcurrentSessions}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      sessionPolicy: { ...prev.sessionPolicy, maxConcurrentSessions: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Configure IP restrictions and geographic access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireVpn">Require VPN Connection</Label>
                  <Switch
                    id="requireVpn"
                    checked={securitySettings.accessControl.requireVpn}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({
                      ...prev,
                      accessControl: { ...prev.accessControl, requireVpn: checked }
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="allowedIps">Allowed IP Ranges</Label>
                  <div className="space-y-2 mt-2">
                    {securitySettings.accessControl.allowedIpRanges.map((range, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={range} readOnly />
                        <Button variant="outline" size="icon">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add IP Range
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Blocked Countries</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {securitySettings.accessControl.blockedCountries.map((country, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {country}
                        <XCircle className="w-3 h-3 ml-1 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Settings */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">
              Reset to Defaults
            </Button>
            <Button>
              Save Security Settings
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
