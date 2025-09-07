'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  Bell,
  Mail,
  Smartphone,
  Slack,
  AlertTriangle,
  Info,
  AlertCircle,
  Package,
  Bot,
  Shield,
  Activity,
  Users,
  Clock,
  Volume2,
  VolumeX,
  MessageSquare,
  Webhook,
  Save,
  RefreshCw,
  TestTube
} from 'lucide-react'

interface NotificationPreference {
  id: string
  category: string
  name: string
  description: string
  icon: any
  channels: {
    inApp: boolean
    email: boolean
    sms: boolean
    slack: boolean
    webhook: boolean
  }
  severityFilter: 'all' | 'warning_critical' | 'critical_only'
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  frequency: 'immediate' | 'digest_hourly' | 'digest_daily'
}

interface DeliveryChannel {
  id: string
  name: string
  type: 'email' | 'sms' | 'slack' | 'webhook'
  description: string
  icon: any
  enabled: boolean
  config: Record<string, any>
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'anomalies',
      category: 'Anomalies & Risks',
      name: 'Package Anomalies',
      description: 'Lost packages, delays, and routing issues',
      icon: AlertTriangle,
      channels: { inApp: true, email: true, sms: true, slack: true, webhook: false },
      severityFilter: 'warning_critical',
      quietHours: { enabled: true, start: '22:00', end: '07:00' },
      frequency: 'immediate'
    },
    {
      id: 'ai_agents',
      category: 'AI Agent Actions',
      name: 'AI Agent Updates',
      description: 'Agent deployments, retraining, and automated actions',
      icon: Bot,
      channels: { inApp: true, email: false, sms: false, slack: true, webhook: true },
      severityFilter: 'all',
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
      frequency: 'digest_hourly'
    },
    {
      id: 'system_security',
      category: 'System & Security',
      name: 'Security Alerts',
      description: 'Login attempts, system changes, and security events',
      icon: Shield,
      channels: { inApp: true, email: true, sms: false, slack: false, webhook: false },
      severityFilter: 'warning_critical',
      quietHours: { enabled: false, start: '22:00', end: '07:00' },
      frequency: 'immediate'
    },
    {
      id: 'operations',
      category: 'Operational Updates',
      name: 'Hub Operations',
      description: 'Hub status, maintenance, and operational changes',
      icon: Activity,
      channels: { inApp: true, email: false, sms: false, slack: true, webhook: false },
      severityFilter: 'all',
      quietHours: { enabled: true, start: '22:00', end: '07:00' },
      frequency: 'digest_daily'
    },
    {
      id: 'user_actions',
      category: 'User Actions',
      name: 'User Management',
      description: 'User additions, role changes, and access modifications',
      icon: Users,
      channels: { inApp: true, email: true, sms: false, slack: false, webhook: false },
      severityFilter: 'all',
      quietHours: { enabled: true, start: '22:00', end: '07:00' },
      frequency: 'digest_daily'
    }
  ])

  const [deliveryChannels, setDeliveryChannels] = useState<DeliveryChannel[]>([
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      description: 'Receive notifications via email',
      icon: Mail,
      enabled: true,
      config: {
        address: 'user@clearpath.ai',
        digestFormat: 'html',
        maxPerHour: 10
      }
    },
    {
      id: 'sms',
      name: 'SMS',
      type: 'sms',
      description: 'Critical alerts via text message',
      icon: Smartphone,
      enabled: true,
      config: {
        phoneNumber: '+1 (555) 123-4567',
        criticalOnly: true
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'slack',
      description: 'Team notifications in Slack channels',
      icon: MessageSquare,
      enabled: true,
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        channel: '#operations',
        mentionOnCritical: true
      }
    },
    {
      id: 'webhook',
      name: 'Webhook',
      type: 'webhook',
      description: 'Custom webhook integrations',
      icon: Webhook,
      enabled: false,
      config: {
        url: '',
        method: 'POST',
        headers: {},
        authentication: 'none'
      }
    }
  ])

  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturb: false,
    soundEnabled: true,
    browserNotifications: true,
    emailDigestTime: '09:00',
    maxNotificationsPerHour: 20,
    autoMarkReadAfter: 24 // hours
  })

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, ...updates } : pref
    ))
  }

  const updateChannel = (id: string, updates: Partial<DeliveryChannel>) => {
    setDeliveryChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, ...updates } : channel
    ))
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'all':
        return <Badge variant="outline" className="text-xs">All Levels</Badge>
      case 'warning_critical':
        return <Badge className="text-xs bg-orange-600">Warning & Critical</Badge>
      case 'critical_only':
        return <Badge variant="destructive" className="text-xs">Critical Only</Badge>
    }
  }

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'immediate':
        return <Badge variant="default" className="text-xs">Immediate</Badge>
      case 'digest_hourly':
        return <Badge variant="secondary" className="text-xs">Hourly Digest</Badge>
      case 'digest_daily':
        return <Badge variant="outline" className="text-xs">Daily Digest</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Global Notification Settings
          </CardTitle>
          <CardDescription>
            Master controls for all notification types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="doNotDisturb" className="flex items-center gap-2">
                  <VolumeX className="w-4 h-4" />
                  Do Not Disturb
                </Label>
                <Switch
                  id="doNotDisturb"
                  checked={globalSettings.doNotDisturb}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, doNotDisturb: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="soundEnabled" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Sound Notifications
                </Label>
                <Switch
                  id="soundEnabled"
                  checked={globalSettings.soundEnabled}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, soundEnabled: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="browserNotifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Browser Push
                </Label>
                <Switch
                  id="browserNotifications"
                  checked={globalSettings.browserNotifications}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({ ...prev, browserNotifications: checked }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="emailDigestTime" className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Daily Digest Time
                </Label>
                <Input
                  id="emailDigestTime"
                  type="time"
                  value={globalSettings.emailDigestTime}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, emailDigestTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxNotifications" className="flex items-center gap-2 mb-2">
                  <Bell className="w-4 h-4" />
                  Max Notifications/Hour
                </Label>
                <Input
                  id="maxNotifications"
                  type="number"
                  min="1"
                  max="100"
                  value={globalSettings.maxNotificationsPerHour}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, maxNotificationsPerHour: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="autoMarkRead" className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  Auto-mark Read After
                </Label>
                <Select 
                  value={globalSettings.autoMarkReadAfter.toString()}
                  onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, autoMarkReadAfter: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Notification Categories</TabsTrigger>
          <TabsTrigger value="channels">Delivery Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive different types of notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {preferences.map((pref) => (
                  <div key={pref.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <pref.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{pref.name}</h3>
                          <p className="text-sm text-muted-foreground">{pref.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{pref.category}</Badge>
                            {getSeverityBadge(pref.severityFilter)}
                            {getFrequencyBadge(pref.frequency)}
                          </div>
                        </div>

                        {/* Delivery Channels */}
                        <div>
                          <Label className="text-sm font-medium mb-3 block">Delivery Channels</Label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-inapp`}
                                checked={pref.channels.inApp}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  channels: { ...pref.channels, inApp: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-inapp`} className="text-sm">In-App</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-email`}
                                checked={pref.channels.email}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  channels: { ...pref.channels, email: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-email`} className="text-sm">Email</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-sms`}
                                checked={pref.channels.sms}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  channels: { ...pref.channels, sms: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-sms`} className="text-sm">SMS</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-slack`}
                                checked={pref.channels.slack}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  channels: { ...pref.channels, slack: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-slack`} className="text-sm">Slack</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-webhook`}
                                checked={pref.channels.webhook}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  channels: { ...pref.channels, webhook: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-webhook`} className="text-sm">Webhook</Label>
                            </div>
                          </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Severity Filter</Label>
                            <Select
                              value={pref.severityFilter}
                              onValueChange={(value: any) => updatePreference(pref.id, { severityFilter: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="warning_critical">Warning & Critical</SelectItem>
                                <SelectItem value="critical_only">Critical Only</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Frequency</Label>
                            <Select
                              value={pref.frequency}
                              onValueChange={(value: any) => updatePreference(pref.id, { frequency: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="immediate">Immediate</SelectItem>
                                <SelectItem value="digest_hourly">Hourly Digest</SelectItem>
                                <SelectItem value="digest_daily">Daily Digest</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Quiet Hours</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`${pref.id}-quiet`}
                                checked={pref.quietHours.enabled}
                                onCheckedChange={(checked) => updatePreference(pref.id, {
                                  quietHours: { ...pref.quietHours, enabled: checked }
                                })}
                              />
                              <Label htmlFor={`${pref.id}-quiet`} className="text-sm">
                                {pref.quietHours.start} - {pref.quietHours.end}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Channels</CardTitle>
              <CardDescription>
                Configure how notifications are delivered to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deliveryChannels.map((channel) => (
                  <div key={channel.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <channel.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{channel.name}</h3>
                            <p className="text-sm text-muted-foreground">{channel.description}</p>
                          </div>
                          <Switch
                            checked={channel.enabled}
                            onCheckedChange={(checked) => updateChannel(channel.id, { enabled: checked })}
                          />
                        </div>

                        {channel.enabled && (
                          <div className="space-y-4 pt-4 border-t">
                            {channel.type === 'email' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Email Address</Label>
                                  <Input
                                    type="email"
                                    value={channel.config.address}
                                    onChange={(e) => updateChannel(channel.id, {
                                      config: { ...channel.config, address: e.target.value }
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Max Per Hour</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={channel.config.maxPerHour}
                                    onChange={(e) => updateChannel(channel.id, {
                                      config: { ...channel.config, maxPerHour: parseInt(e.target.value) }
                                    })}
                                  />
                                </div>
                              </div>
                            )}

                            {channel.type === 'sms' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Phone Number</Label>
                                  <Input
                                    type="tel"
                                    value={channel.config.phoneNumber}
                                    onChange={(e) => updateChannel(channel.id, {
                                      config: { ...channel.config, phoneNumber: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                  <Switch
                                    id="sms-critical"
                                    checked={channel.config.criticalOnly}
                                    onCheckedChange={(checked) => updateChannel(channel.id, {
                                      config: { ...channel.config, criticalOnly: checked }
                                    })}
                                  />
                                  <Label htmlFor="sms-critical" className="text-sm">Critical alerts only</Label>
                                </div>
                              </div>
                            )}

                            {channel.type === 'slack' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Webhook URL</Label>
                                  <Input
                                    type="url"
                                    placeholder="https://hooks.slack.com/services/..."
                                    value={channel.config.webhookUrl}
                                    onChange={(e) => updateChannel(channel.id, {
                                      config: { ...channel.config, webhookUrl: e.target.value }
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Channel</Label>
                                  <Input
                                    placeholder="#operations"
                                    value={channel.config.channel}
                                    onChange={(e) => updateChannel(channel.id, {
                                      config: { ...channel.config, channel: e.target.value }
                                    })}
                                  />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                  <Switch
                                    id="slack-mention"
                                    checked={channel.config.mentionOnCritical}
                                    onCheckedChange={(checked) => updateChannel(channel.id, {
                                      config: { ...channel.config, mentionOnCritical: checked }
                                    })}
                                  />
                                  <Label htmlFor="slack-mention" className="text-sm">@channel on critical alerts</Label>
                                </div>
                              </div>
                            )}

                            {channel.type === 'webhook' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Webhook URL</Label>
                                    <Input
                                      type="url"
                                      placeholder="https://your-api.com/webhook"
                                      value={channel.config.url}
                                      onChange={(e) => updateChannel(channel.id, {
                                        config: { ...channel.config, url: e.target.value }
                                      })}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium mb-2 block">Method</Label>
                                    <Select
                                      value={channel.config.method}
                                      onValueChange={(value) => updateChannel(channel.id, {
                                        config: { ...channel.config, method: value }
                                      })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Custom Headers (JSON)</Label>
                                  <Textarea
                                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                    rows={3}
                                    value={JSON.stringify(channel.config.headers, null, 2)}
                                    onChange={(e) => {
                                      try {
                                        const headers = JSON.parse(e.target.value)
                                        updateChannel(channel.id, {
                                          config: { ...channel.config, headers }
                                        })
                                      } catch (error) {
                                        // Invalid JSON, don't update
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              <Button variant="outline" size="sm">
                                <TestTube className="w-4 h-4 mr-2" />
                                Test {channel.name}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Settings */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
