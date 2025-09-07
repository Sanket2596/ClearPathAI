'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  MessageCircle, 
  Paperclip, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  PlayCircle,
  Eye,
  Calendar,
  Tag,
  Upload,
  ExternalLink,
  Zap,
  Bug,
  HelpCircle,
  CreditCard,
  Settings as SettingsIcon
} from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'anomaly' | 'ai_agent' | 'user_management' | 'billing' | 'system_bug' | 'feature_request'
  assignee?: string
  reporter: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  attachments?: string[]
  comments: {
    id: string
    author: string
    content: string
    timestamp: Date
    isInternal?: boolean
  }[]
}

const sampleTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Package PCK123 showing incorrect status',
    description: 'The package tracking shows "In Transit" but the carrier confirmed delivery yesterday.',
    status: 'open',
    priority: 'high',
    type: 'anomaly',
    assignee: 'Sarah Chen',
    reporter: 'John Doe',
    createdAt: new Date('2024-01-16T10:30:00Z'),
    updatedAt: new Date('2024-01-16T14:22:00Z'),
    tags: ['package-tracking', 'status-sync'],
    attachments: ['screenshot.png', 'carrier-confirmation.pdf'],
    comments: [
      {
        id: 'c1',
        author: 'John Doe',
        content: 'This is affecting our customer satisfaction metrics. Please prioritize.',
        timestamp: new Date('2024-01-16T10:35:00Z')
      },
      {
        id: 'c2',
        author: 'Sarah Chen',
        content: 'Investigating the API sync issue. Will update shortly.',
        timestamp: new Date('2024-01-16T14:22:00Z'),
        isInternal: true
      }
    ]
  },
  {
    id: 'TKT-002',
    title: 'AI Agent not triggering for route deviations',
    description: 'AI agents should trigger alerts when packages deviate more than 5 miles from expected route, but no alerts were generated for PCK456.',
    status: 'in_progress',
    priority: 'critical',
    type: 'ai_agent',
    assignee: 'Mike Rodriguez',
    reporter: 'Lisa Wang',
    createdAt: new Date('2024-01-15T09:15:00Z'),
    updatedAt: new Date('2024-01-16T11:45:00Z'),
    tags: ['ai-agents', 'route-deviation', 'alerts'],
    comments: [
      {
        id: 'c3',
        author: 'Mike Rodriguez',
        content: 'Checking the threshold configuration and agent training data.',
        timestamp: new Date('2024-01-15T15:30:00Z')
      }
    ]
  },
  {
    id: 'TKT-003',
    title: 'Unable to invite new team members',
    description: 'Getting an error when trying to send invitations to new users. Error message: "Invalid email format" even with valid emails.',
    status: 'resolved',
    priority: 'medium',
    type: 'user_management',
    assignee: 'Alex Thompson',
    reporter: 'David Kim',
    createdAt: new Date('2024-01-14T16:20:00Z'),
    updatedAt: new Date('2024-01-15T10:15:00Z'),
    tags: ['user-invites', 'email-validation'],
    comments: [
      {
        id: 'c4',
        author: 'Alex Thompson',
        content: 'Fixed the email validation regex. Deployed in version 2.1.3.',
        timestamp: new Date('2024-01-15T10:15:00Z')
      }
    ]
  },
  {
    id: 'TKT-004',
    title: 'Request: Dark mode for mobile app',
    description: 'Users are requesting dark mode support for the mobile application to improve usability in low-light conditions.',
    status: 'open',
    priority: 'low',
    type: 'feature_request',
    reporter: 'Emma Wilson',
    createdAt: new Date('2024-01-13T12:00:00Z'),
    updatedAt: new Date('2024-01-13T12:00:00Z'),
    tags: ['mobile', 'ui-ux', 'dark-mode'],
    comments: []
  }
]

const statusConfig = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: PlayCircle },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: Clock },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300', icon: XCircle }
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' }
}

const typeConfig = {
  anomaly: { label: 'Anomaly Detection', icon: AlertCircle, color: 'text-orange-600' },
  ai_agent: { label: 'AI Agent', icon: Zap, color: 'text-purple-600' },
  user_management: { label: 'User Management', icon: User, color: 'text-blue-600' },
  billing: { label: 'Billing', icon: CreditCard, color: 'text-green-600' },
  system_bug: { label: 'System Bug', icon: Bug, color: 'text-red-600' },
  feature_request: { label: 'Feature Request', icon: HelpCircle, color: 'text-indigo-600' }
}

export function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // New ticket form state
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    type: 'system_bug' as const,
    tags: [] as string[]
  })

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  const handleCreateTicket = () => {
    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      status: 'open',
      priority: newTicket.priority,
      type: newTicket.type,
      reporter: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: newTicket.tags,
      comments: []
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({
      title: '',
      description: '',
      priority: 'medium',
      type: 'system_bug',
      tags: []
    })
    setIsCreateDialogOpen(false)
  }

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      high_priority: tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length
    }
    return stats
  }

  const stats = getTicketStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground">
            Create, track, and manage support requests
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the issue, including steps to reproduce if applicable"
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Issue Type</Label>
                  <Select value={newTicket.type} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(typeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className={`w-4 h-4 ${config.color}`} />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title || !newTicket.description}
                >
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tickets</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
          <div className="text-sm text-muted-foreground">Open</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-muted-foreground">Resolved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.high_priority}</div>
          <div className="text-sm text-muted-foreground">High Priority</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(typeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((ticket) => {
          const StatusIcon = statusConfig[ticket.status].icon
          const TypeIcon = typeConfig[ticket.type].icon
          
          return (
            <Card 
              key={ticket.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge className={statusConfig[ticket.status].color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[ticket.status].label}
                    </Badge>
                    <Badge className={priorityConfig[ticket.priority].color}>
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TypeIcon className={`w-4 h-4 ${typeConfig[ticket.type].color}`} />
                      <span className="text-sm">{typeConfig[ticket.type].label}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-1 truncate">{ticket.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {ticket.reporter}
                    </span>
                    {ticket.assignee && (
                      <span className="flex items-center gap-1">
                        <SettingsIcon className="w-3 h-3" />
                        {ticket.assignee}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {ticket.createdAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {ticket.comments.length} comments
                    </span>
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        {ticket.attachments.length} attachments
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {ticket.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{ticket.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
        
        {filteredTickets.length === 0 && (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or create a new ticket.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </Card>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {selectedTicket.id}
                </Badge>
                <DialogTitle className="flex-1">{selectedTicket.title}</DialogTitle>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge className={statusConfig[selectedTicket.status].color}>
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <Badge className={priorityConfig[selectedTicket.priority].color}>
                      {priorityConfig[selectedTicket.priority].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{typeConfig[selectedTicket.type].label}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Assignee</Label>
                    <p className="text-sm">{selectedTicket.assignee || 'Unassigned'}</p>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>
                
                {/* Tags */}
                {selectedTicket.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTicket.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Attachments */}
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Attachments</Label>
                    <div className="space-y-1 mt-1">
                      {selectedTicket.attachments.map((attachment) => (
                        <div key={attachment} className="flex items-center gap-2 text-sm">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-blue-600 hover:underline cursor-pointer">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Comments */}
                <div>
                  <Label className="text-sm font-medium">Comments ({selectedTicket.comments.length})</Label>
                  <div className="space-y-3 mt-2">
                    {selectedTicket.comments.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            {comment.isInternal && (
                              <Badge variant="outline" className="text-xs">Internal</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
