'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  UserPlus,
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Download,
  Users,
  Calendar,
  Link,
  Shield,
  BookOpen,
  Video,
  FileText,
  Award,
  Settings,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface Invitation {
  id: string
  email: string
  name: string
  role: string
  department: string
  hub: string
  invitedBy: string
  invitedAt: Date
  expiresAt: Date
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  inviteLink: string
  remindersSent: number
  lastReminderAt?: Date
}

interface OnboardingTemplate {
  id: string
  name: string
  description: string
  roles: string[]
  steps: OnboardingStep[]
  estimatedDuration: number // in hours
  isActive: boolean
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'quiz' | 'task' | 'meeting'
  duration: number // in minutes
  required: boolean
  resources: string[]
}

export function InvitesOnboarding() {
  const [activeTab, setActiveTab] = useState<'invites' | 'onboarding'>('invites')
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isBulkInviteOpen, setIsBulkInviteOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)

  // Mock invitations data
  const invitations: Invitation[] = [
    {
      id: '1',
      email: 'lisa.park@clearpath.ai',
      name: 'Lisa Park',
      role: 'Viewer',
      department: 'Customer Service',
      hub: 'Miami Hub',
      invitedBy: 'David Thompson',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // 4 days from now
      status: 'pending',
      inviteLink: 'https://clearpath.ai/invite/abc123',
      remindersSent: 1,
      lastReminderAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      email: 'john.smith@clearpath.ai',
      name: 'John Smith',
      role: 'Operations Analyst',
      department: 'Operations',
      hub: 'Phoenix Hub',
      invitedBy: 'Sarah Johnson',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      status: 'pending',
      inviteLink: 'https://clearpath.ai/invite/def456',
      remindersSent: 2,
      lastReminderAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    },
    {
      id: '3',
      email: 'amy.wilson@clearpath.ai',
      name: 'Amy Wilson',
      role: 'AI Agent Trainer',
      department: 'AI/ML',
      hub: 'Seattle Hub',
      invitedBy: 'Marcus Rodriguez',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: 'accepted',
      inviteLink: 'https://clearpath.ai/invite/ghi789',
      remindersSent: 0
    },
    {
      id: '4',
      email: 'mike.brown@clearpath.ai',
      name: 'Mike Brown',
      role: 'Data Analyst',
      department: 'Analytics',
      hub: 'Boston Hub',
      invitedBy: 'Emily Chen',
      invitedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      status: 'expired',
      inviteLink: 'https://clearpath.ai/invite/jkl012',
      remindersSent: 3,
      lastReminderAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
    }
  ]

  // Mock onboarding templates
  const onboardingTemplates: OnboardingTemplate[] = [
    {
      id: '1',
      name: 'Operations Team Onboarding',
      description: 'Comprehensive onboarding for operations team members',
      roles: ['Operations Manager', 'Operations Analyst'],
      estimatedDuration: 16,
      isActive: true,
      steps: [
        {
          id: '1',
          title: 'Welcome & Company Overview',
          description: 'Introduction to ClearPath AI and our mission',
          type: 'video',
          duration: 45,
          required: true,
          resources: ['company-overview.mp4', 'mission-statement.pdf']
        },
        {
          id: '2',
          title: 'Platform Navigation',
          description: 'Learn how to navigate the ClearPath AI platform',
          type: 'video',
          duration: 60,
          required: true,
          resources: ['platform-tour.mp4', 'navigation-guide.pdf']
        },
        {
          id: '3',
          title: 'Package Management Basics',
          description: 'Understanding package tracking and management',
          type: 'document',
          duration: 90,
          required: true,
          resources: ['package-management-guide.pdf', 'best-practices.pdf']
        },
        {
          id: '4',
          title: 'Anomaly Detection & Resolution',
          description: 'How to identify and resolve package anomalies',
          type: 'video',
          duration: 75,
          required: true,
          resources: ['anomaly-training.mp4', 'resolution-flowchart.pdf']
        },
        {
          id: '5',
          title: 'Knowledge Assessment',
          description: 'Test your understanding of operations procedures',
          type: 'quiz',
          duration: 30,
          required: true,
          resources: ['operations-quiz.pdf']
        },
        {
          id: '6',
          title: 'Team Introduction Meeting',
          description: 'Meet your team members and manager',
          type: 'meeting',
          duration: 60,
          required: true,
          resources: ['team-directory.pdf']
        }
      ]
    },
    {
      id: '2',
      name: 'AI/ML Team Onboarding',
      description: 'Specialized onboarding for AI and ML team members',
      roles: ['AI Agent Trainer', 'Data Scientist'],
      estimatedDuration: 20,
      isActive: true,
      steps: [
        {
          id: '1',
          title: 'AI Architecture Overview',
          description: 'Understanding our AI system architecture',
          type: 'video',
          duration: 90,
          required: true,
          resources: ['ai-architecture.mp4', 'system-diagram.pdf']
        },
        {
          id: '2',
          title: 'Model Training Procedures',
          description: 'Learn how to train and deploy AI models',
          type: 'document',
          duration: 120,
          required: true,
          resources: ['training-guide.pdf', 'deployment-checklist.pdf']
        },
        {
          id: '3',
          title: 'Data Pipeline & Management',
          description: 'Understanding data flow and management processes',
          type: 'video',
          duration: 75,
          required: true,
          resources: ['data-pipeline.mp4', 'data-governance.pdf']
        },
        {
          id: '4',
          title: 'Technical Assessment',
          description: 'Evaluate technical knowledge and skills',
          type: 'quiz',
          duration: 45,
          required: true,
          resources: ['technical-assessment.pdf']
        }
      ]
    }
  ]

  const getStatusBadge = (status: Invitation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="text-xs">Pending</Badge>
      case 'accepted':
        return <Badge variant="success" className="text-xs">Accepted</Badge>
      case 'expired':
        return <Badge variant="destructive" className="text-xs">Expired</Badge>
      case 'revoked':
        return <Badge variant="outline" className="text-xs">Revoked</Badge>
    }
  }

  const getStepIcon = (type: OnboardingStep['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <Award className="w-4 h-4" />
      case 'task':
        return <CheckCircle className="w-4 h-4" />
      case 'meeting':
        return <Users className="w-4 h-4" />
    }
  }

  const InviteUserDialog = () => {
    const [inviteData, setInviteData] = useState({
      email: '',
      name: '',
      role: '',
      department: '',
      hub: '',
      customMessage: '',
      sendWelcomeEmail: true
    })

    return (
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your ClearPath AI team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="inviteName">Full Name</Label>
                <Input
                  id="inviteName"
                  placeholder="John Doe"
                  value={inviteData.name}
                  onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="inviteRole">Role</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    <SelectItem value="AI Agent Trainer">AI Agent Trainer</SelectItem>
                    <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                    <SelectItem value="Operations Analyst">Operations Analyst</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inviteDepartment">Department</Label>
                <Select value={inviteData.department} onValueChange={(value) => setInviteData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inviteHub">Hub Assignment</Label>
                <Select value={inviteData.hub} onValueChange={(value) => setInviteData(prev => ({ ...prev, hub: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chicago Hub">Chicago Hub</SelectItem>
                    <SelectItem value="Dallas Hub">Dallas Hub</SelectItem>
                    <SelectItem value="LA Hub">LA Hub</SelectItem>
                    <SelectItem value="Miami Hub">Miami Hub</SelectItem>
                    <SelectItem value="Phoenix Hub">Phoenix Hub</SelectItem>
                    <SelectItem value="Seattle Hub">Seattle Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Custom Message (Optional)</Label>
              <Textarea
                id="customMessage"
                placeholder="Add a personal welcome message..."
                value={inviteData.customMessage}
                onChange={(e) => setInviteData(prev => ({ ...prev, customMessage: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="welcomeEmail"
                checked={inviteData.sendWelcomeEmail}
                onCheckedChange={(checked) => setInviteData(prev => ({ ...prev, sendWelcomeEmail: checked }))}
              />
              <Label htmlFor="welcomeEmail">Send welcome email with onboarding instructions</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Sending invite:', inviteData)
                  setIsInviteDialogOpen(false)
                  setInviteData({ email: '', name: '', role: '', department: '', hub: '', customMessage: '', sendWelcomeEmail: true })
                }}
                disabled={!inviteData.email || !inviteData.name || !inviteData.role}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
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
          <h2 className="text-2xl font-bold">Invites & Onboarding</h2>
          <p className="text-muted-foreground">
            Manage user invitations and onboarding processes for new team members
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsBulkInviteOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Bulk Invite
          </Button>
          <Button size="sm" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invites" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Invitations
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Onboarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invites" className="space-y-6">
          {/* Invitations Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{invitations.filter(i => i.status === 'pending').length}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{invitations.filter(i => i.status === 'accepted').length}</div>
                    <div className="text-xs text-muted-foreground">Accepted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold">{invitations.filter(i => i.status === 'expired').length}</div>
                    <div className="text-xs text-muted-foreground">Expired</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{invitations.length}</div>
                    <div className="text-xs text-muted-foreground">Total Sent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invitations Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Recent Invitations
                  </CardTitle>
                  <CardDescription>
                    Manage and track user invitations
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role & Department</TableHead>
                      <TableHead>Hub</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Reminders</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invite) => (
                      <TableRow key={invite.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{invite.name}</div>
                            <div className="text-sm text-muted-foreground">{invite.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{invite.role}</div>
                            <div className="text-xs text-muted-foreground">{invite.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {invite.hub}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invite.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(invite.invitedAt, 'MMM d')}</div>
                            <div className="text-xs text-muted-foreground">by {invite.invitedBy}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {invite.status === 'pending' && (
                              <div className={invite.expiresAt < new Date() ? 'text-red-600' : ''}>
                                {formatDistanceToNow(invite.expiresAt, { addSuffix: true })}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{invite.remindersSent}</div>
                            {invite.lastReminderAt && (
                              <div className="text-xs text-muted-foreground">
                                Last: {formatDistanceToNow(invite.lastReminderAt, { addSuffix: true })}
                              </div>
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
                              {invite.status === 'pending' && (
                                <>
                                  <DropdownMenuItem>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Reminder
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Invite Link
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                <Link className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="w-4 h-4 mr-2" />
                                Revoke Invitation
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
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          {/* Onboarding Templates */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Onboarding Templates</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage onboarding workflows for different roles
              </p>
            </div>
            <Button size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onboardingTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant={template.isActive ? 'success' : 'secondary'} className="text-xs">
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Roles:</span>
                      <span className="font-medium">{template.roles.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{template.estimatedDuration}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Steps:</span>
                      <span className="font-medium">{template.steps.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Required:</span>
                      <span className="font-medium">{template.steps.filter(s => s.required).length}</span>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Applicable Roles</div>
                    <div className="flex flex-wrap gap-1">
                      {template.roles.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Steps Preview */}
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-2">Steps Overview</div>
                    <div className="space-y-1">
                      {template.steps.slice(0, 3).map((step) => (
                        <div key={step.id} className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded">
                          {getStepIcon(step.type)}
                          <span className="flex-1">{step.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {step.duration}min
                          </Badge>
                          {step.required && (
                            <Badge variant="destructive" className="text-xs px-1">
                              Required
                            </Badge>
                          )}
                        </div>
                      ))}
                      {template.steps.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{template.steps.length - 3} more steps
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <InviteUserDialog />
    </div>
  )
}
