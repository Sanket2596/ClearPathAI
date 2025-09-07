'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
  Zap,
  Clock,
  AlertTriangle,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  ArrowUp,
  Target,
  Timer,
  UserCheck,
  Shield
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface EscalationRule {
  id: string
  name: string
  description: string
  isActive: boolean
  triggers: {
    categories: string[]
    severities: string[]
    keywords: string[]
  }
  conditions: {
    noResponseTime: number // minutes
    noAcknowledgmentTime: number // minutes
    repeatCount: number
  }
  escalationLevels: EscalationLevel[]
  createdAt: Date
  lastTriggered?: Date
  triggerCount: number
}

interface EscalationLevel {
  id: string
  level: number
  delay: number // minutes from previous level
  actions: EscalationAction[]
}

interface EscalationAction {
  type: 'notify_user' | 'notify_team' | 'notify_manager' | 'create_ticket' | 'send_sms' | 'call_webhook'
  target: string
  message?: string
  config?: Record<string, any>
}

export function EscalationRules() {
  const [rules, setRules] = useState<EscalationRule[]>([
    {
      id: '1',
      name: 'Critical Package Loss Escalation',
      description: 'Escalate high-value package losses that are not acknowledged within 30 minutes',
      isActive: true,
      triggers: {
        categories: ['anomalies'],
        severities: ['critical'],
        keywords: ['lost', 'missing', 'high-value']
      },
      conditions: {
        noResponseTime: 30,
        noAcknowledgmentTime: 15,
        repeatCount: 1
      },
      escalationLevels: [
        {
          id: '1-1',
          level: 1,
          delay: 0,
          actions: [
            { type: 'notify_user', target: 'assigned_user', message: 'Critical package loss requires immediate attention' },
            { type: 'send_sms', target: 'assigned_user' }
          ]
        },
        {
          id: '1-2',
          level: 2,
          delay: 30,
          actions: [
            { type: 'notify_manager', target: 'operations_manager', message: 'Unacknowledged critical package loss' },
            { type: 'notify_team', target: 'operations_team' }
          ]
        },
        {
          id: '1-3',
          level: 3,
          delay: 60,
          actions: [
            { type: 'create_ticket', target: 'support_system', config: { priority: 'urgent', category: 'package_loss' } },
            { type: 'call_webhook', target: 'external_alert_system' }
          ]
        }
      ],
      createdAt: new Date(2024, 0, 15),
      lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      triggerCount: 12
    },
    {
      id: '2',
      name: 'Security Incident Escalation',
      description: 'Immediate escalation for security-related alerts',
      isActive: true,
      triggers: {
        categories: ['system'],
        severities: ['critical', 'warning'],
        keywords: ['security', 'breach', 'unauthorized', 'failed login']
      },
      conditions: {
        noResponseTime: 10,
        noAcknowledgmentTime: 5,
        repeatCount: 1
      },
      escalationLevels: [
        {
          id: '2-1',
          level: 1,
          delay: 0,
          actions: [
            { type: 'notify_user', target: 'security_team', message: 'Security incident detected' },
            { type: 'send_sms', target: 'security_lead' }
          ]
        },
        {
          id: '2-2',
          level: 2,
          delay: 10,
          actions: [
            { type: 'notify_manager', target: 'it_director', message: 'Unacknowledged security incident' },
            { type: 'call_webhook', target: 'security_siem_system' }
          ]
        }
      ],
      createdAt: new Date(2024, 0, 20),
      lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      triggerCount: 5
    },
    {
      id: '3',
      name: 'AI Agent Failure Escalation',
      description: 'Escalate when AI agents fail or require manual intervention',
      isActive: true,
      triggers: {
        categories: ['ai_agents'],
        severities: ['critical', 'warning'],
        keywords: ['failed', 'error', 'manual intervention', 'offline']
      },
      conditions: {
        noResponseTime: 45,
        noAcknowledgmentTime: 20,
        repeatCount: 2
      },
      escalationLevels: [
        {
          id: '3-1',
          level: 1,
          delay: 0,
          actions: [
            { type: 'notify_team', target: 'ai_team', message: 'AI agent requires attention' }
          ]
        },
        {
          id: '3-2',
          level: 2,
          delay: 45,
          actions: [
            { type: 'notify_manager', target: 'ai_lead', message: 'AI agent failure not resolved' },
            { type: 'create_ticket', target: 'engineering_board', config: { priority: 'high', component: 'ai_agents' } }
          ]
        }
      ],
      createdAt: new Date(2024, 1, 1),
      lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      triggerCount: 8
    }
  ])

  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<EscalationRule | null>(null)

  const getActionIcon = (actionType: EscalationAction['type']) => {
    switch (actionType) {
      case 'notify_user':
        return <UserCheck className="w-4 h-4" />
      case 'notify_team':
        return <Users className="w-4 h-4" />
      case 'notify_manager':
        return <Shield className="w-4 h-4" />
      case 'create_ticket':
        return <Target className="w-4 h-4" />
      case 'send_sms':
        return <Smartphone className="w-4 h-4" />
      case 'call_webhook':
        return <Zap className="w-4 h-4" />
    }
  }

  const getActionLabel = (actionType: EscalationAction['type']) => {
    switch (actionType) {
      case 'notify_user':
        return 'Notify User'
      case 'notify_team':
        return 'Notify Team'
      case 'notify_manager':
        return 'Notify Manager'
      case 'create_ticket':
        return 'Create Ticket'
      case 'send_sms':
        return 'Send SMS'
      case 'call_webhook':
        return 'Call Webhook'
    }
  }

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  const CreateRuleDialog = () => {
    const [newRule, setNewRule] = useState({
      name: '',
      description: '',
      triggers: { categories: [], severities: [], keywords: [] },
      conditions: { noResponseTime: 30, noAcknowledgmentTime: 15, repeatCount: 1 }
    })

    return (
      <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Escalation Rule</DialogTitle>
            <DialogDescription>
              Define when and how notifications should be escalated
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  placeholder="e.g., Critical Package Loss Escalation"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="ruleDescription">Description</Label>
                <Input
                  id="ruleDescription"
                  placeholder="Describe when this rule should trigger..."
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Trigger Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Trigger Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Categories</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anomalies">Anomalies & Risks</SelectItem>
                      <SelectItem value="ai_agents">AI Agent Actions</SelectItem>
                      <SelectItem value="system">System & Security</SelectItem>
                      <SelectItem value="operations">Operational Updates</SelectItem>
                      <SelectItem value="users">User Actions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Severities</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Keywords</Label>
                  <Input placeholder="lost, missing, error..." />
                </div>
              </div>
            </div>

            {/* Timing Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timing Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>No Response Time (minutes)</Label>
                  <Input
                    type="number"
                    value={newRule.conditions.noResponseTime}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, noResponseTime: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>No Acknowledgment Time (minutes)</Label>
                  <Input
                    type="number"
                    value={newRule.conditions.noAcknowledgmentTime}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, noAcknowledgmentTime: parseInt(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label>Repeat Count</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newRule.conditions.repeatCount}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, repeatCount: parseInt(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateRuleOpen(false)}>
                Cancel
              </Button>
              <Button>
                Create Rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Escalation Rules</h2>
          <p className="text-muted-foreground">
            Automate notification escalation when alerts are not acknowledged
          </p>
        </div>
        <Button onClick={() => setIsCreateRuleOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{rules.filter(r => r.isActive).length}</div>
                <div className="text-xs text-muted-foreground">Active Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{rules.reduce((sum, rule) => sum + rule.triggerCount, 0)}</div>
                <div className="text-xs text-muted-foreground">Total Escalations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-2xl font-bold">4.2min</div>
                <div className="text-xs text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Escalation Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Escalation Rules
          </CardTitle>
          <CardDescription>
            Manage automatic escalation rules for different types of notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Triggers</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Levels</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {rule.description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {rule.triggerCount} triggers
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {rule.triggers.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {rule.triggers.severities.map((severity) => (
                            <Badge 
                              key={severity} 
                              variant={severity === 'critical' ? 'destructive' : 'outline'} 
                              className="text-xs"
                            >
                              {severity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>No response: {rule.conditions.noResponseTime}min</div>
                        <div>No ack: {rule.conditions.noAcknowledgmentTime}min</div>
                        <div>Repeat: {rule.conditions.repeatCount}x</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {rule.escalationLevels.length} levels
                        </Badge>
                        <div className="flex gap-1">
                          {rule.escalationLevels.slice(0, 3).map((level) => (
                            <div key={level.id} className="w-2 h-2 bg-blue-500 rounded-full" />
                          ))}
                          {rule.escalationLevels.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{rule.escalationLevels.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Badge variant={rule.isActive ? 'success' : 'secondary'} className="text-xs">
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {rule.lastTriggered ? (
                          <div>
                            <div>{rule.lastTriggered.toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(rule.lastTriggered, { addSuffix: true })}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Never</span>
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedRule(rule)}>
                            <Settings className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Target className="w-4 h-4 mr-2" />
                            Test Rule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            {rule.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                            {rule.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Rule
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

      {/* Rule Details Modal */}
      <Dialog open={selectedRule !== null} onOpenChange={(open) => !open && setSelectedRule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Zap className="w-5 h-5" />
              {selectedRule?.name}
            </DialogTitle>
            <DialogDescription>
              Escalation rule configuration and execution history
            </DialogDescription>
          </DialogHeader>
          
          {selectedRule && (
            <div className="space-y-6">
              {/* Rule Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedRule.isActive ? 'success' : 'secondary'}>
                      {selectedRule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Triggers</label>
                  <div className="text-2xl font-bold mt-1">{selectedRule.triggerCount}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Triggered</label>
                  <div className="text-sm mt-1">
                    {selectedRule.lastTriggered ? selectedRule.lastTriggered.toLocaleDateString() : 'Never'}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{selectedRule.description}</p>
              </div>

              {/* Trigger Conditions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Trigger Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Categories</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRule.triggers.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Severities</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRule.triggers.severities.map((severity) => (
                        <Badge 
                          key={severity} 
                          variant={severity === 'critical' ? 'destructive' : 'outline'} 
                          className="text-xs"
                        >
                          {severity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Keywords</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRule.triggers.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Escalation Levels */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Escalation Levels</h3>
                <div className="space-y-4">
                  {selectedRule.escalationLevels.map((level, index) => (
                    <div key={level.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {level.level}
                        </div>
                        <div>
                          <div className="font-semibold">Level {level.level}</div>
                          <div className="text-sm text-muted-foreground">
                            {index === 0 ? 'Immediate' : `After ${level.delay} minutes`}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {level.actions.map((action, actionIndex) => (
                          <div key={actionIndex} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            {getActionIcon(action.type)}
                            <div>
                              <div className="text-sm font-medium">{getActionLabel(action.type)}</div>
                              <div className="text-xs text-muted-foreground">{action.target}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Test Rule
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Rule
                </Button>
                <Button>
                  {selectedRule.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {selectedRule.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateRuleDialog />
    </div>
  )
}
