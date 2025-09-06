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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  MapPin,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Building,
  Truck,
  BarChart3,
  Activity,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Package
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  joinedTeam: Date
  isLead: boolean
}

interface Team {
  id: string
  name: string
  description: string
  hub: string
  region: string
  lead: TeamMember
  members: TeamMember[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'inactive'
  performance: {
    packagesHandled: number
    anomaliesResolved: number
    avgResponseTime: number
    successRate: number
  }
}

interface Hub {
  id: string
  name: string
  location: string
  region: string
  capacity: number
  currentLoad: number
  status: 'operational' | 'maintenance' | 'offline'
  teams: string[]
}

export function TeamsManagement() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'teams' | 'hubs'>('teams')

  // Mock hubs data
  const hubs: Hub[] = [
    {
      id: '1',
      name: 'Chicago Hub',
      location: 'Chicago, IL',
      region: 'Midwest',
      capacity: 1000,
      currentLoad: 750,
      status: 'operational',
      teams: ['1', '2']
    },
    {
      id: '2',
      name: 'Dallas Hub',
      location: 'Dallas, TX',
      region: 'South',
      capacity: 1200,
      currentLoad: 950,
      status: 'operational',
      teams: ['3']
    },
    {
      id: '3',
      name: 'LA Hub',
      location: 'Los Angeles, CA',
      region: 'West Coast',
      capacity: 1500,
      currentLoad: 1100,
      status: 'operational',
      teams: ['4', '5']
    },
    {
      id: '4',
      name: 'Miami Hub',
      location: 'Miami, FL',
      region: 'Southeast',
      capacity: 800,
      currentLoad: 200,
      status: 'maintenance',
      teams: ['6']
    }
  ]

  // Mock teams data
  const teams: Team[] = [
    {
      id: '1',
      name: 'Chicago Operations Team',
      description: 'Primary operations team for the Chicago hub, handling package routing and anomaly resolution.',
      hub: 'Chicago Hub',
      region: 'Midwest',
      lead: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@clearpath.ai',
        role: 'Operations Manager',
        joinedTeam: new Date(2023, 2, 15),
        isLead: true
      },
      members: [
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@clearpath.ai',
          role: 'Operations Analyst',
          joinedTeam: new Date(2023, 3, 10),
          isLead: false
        },
        {
          id: '3',
          name: 'Lisa Rodriguez',
          email: 'lisa.rodriguez@clearpath.ai',
          role: 'Data Analyst',
          joinedTeam: new Date(2023, 4, 5),
          isLead: false
        }
      ],
      createdAt: new Date(2023, 2, 1),
      updatedAt: new Date(2023, 7, 15),
      status: 'active',
      performance: {
        packagesHandled: 12450,
        anomaliesResolved: 89,
        avgResponseTime: 15.5,
        successRate: 94.2
      }
    },
    {
      id: '2',
      name: 'Chicago Night Shift',
      description: 'Night operations team covering 10PM-6AM shifts for continuous operations.',
      hub: 'Chicago Hub',
      region: 'Midwest',
      lead: {
        id: '4',
        name: 'David Park',
        email: 'david.park@clearpath.ai',
        role: 'Operations Manager',
        joinedTeam: new Date(2023, 1, 20),
        isLead: true
      },
      members: [
        {
          id: '5',
          name: 'Jennifer Wu',
          email: 'jennifer.wu@clearpath.ai',
          role: 'Operations Analyst',
          joinedTeam: new Date(2023, 2, 1),
          isLead: false
        }
      ],
      createdAt: new Date(2023, 1, 15),
      updatedAt: new Date(2023, 6, 20),
      status: 'active',
      performance: {
        packagesHandled: 8900,
        anomaliesResolved: 67,
        avgResponseTime: 18.2,
        successRate: 91.8
      }
    },
    {
      id: '3',
      name: 'Dallas AI Team',
      description: 'Specialized team focused on AI agent training and model optimization.',
      hub: 'Dallas Hub',
      region: 'South',
      lead: {
        id: '6',
        name: 'Marcus Rodriguez',
        email: 'marcus.rodriguez@clearpath.ai',
        role: 'AI Agent Trainer',
        joinedTeam: new Date(2023, 0, 8),
        isLead: true
      },
      members: [
        {
          id: '7',
          name: 'Amy Thompson',
          email: 'amy.thompson@clearpath.ai',
          role: 'AI Agent Trainer',
          joinedTeam: new Date(2023, 1, 15),
          isLead: false
        },
        {
          id: '8',
          name: 'Robert Kim',
          email: 'robert.kim@clearpath.ai',
          role: 'Data Scientist',
          joinedTeam: new Date(2023, 3, 22),
          isLead: false
        }
      ],
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 7, 10),
      status: 'active',
      performance: {
        packagesHandled: 0, // AI team doesn't handle packages directly
        anomaliesResolved: 156,
        avgResponseTime: 12.3,
        successRate: 97.1
      }
    }
  ]

  const getHubStatusBadge = (status: Hub['status']) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success" className="text-xs">Operational</Badge>
      case 'maintenance':
        return <Badge variant="secondary" className="text-xs">Maintenance</Badge>
      case 'offline':
        return <Badge variant="destructive" className="text-xs">Offline</Badge>
    }
  }

  const getLoadPercentage = (hub: Hub) => {
    return Math.round((hub.currentLoad / hub.capacity) * 100)
  }

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const CreateTeamDialog = () => {
    const [newTeam, setNewTeam] = useState({
      name: '',
      description: '',
      hub: '',
      region: '',
      leadId: ''
    })

    return (
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Set up a new team and assign it to a hub and region
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  placeholder="e.g., Phoenix Operations Team"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="teamDescription">Description</Label>
                <Textarea
                  id="teamDescription"
                  placeholder="Describe the team's responsibilities..."
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamHub">Assigned Hub</Label>
                <Select value={newTeam.hub} onValueChange={(value) => setNewTeam(prev => ({ ...prev, hub: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hub" />
                  </SelectTrigger>
                  <SelectContent>
                    {hubs.map((hub) => (
                      <SelectItem key={hub.id} value={hub.name}>
                        {hub.name} - {hub.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teamRegion">Region</Label>
                <Select value={newTeam.region} onValueChange={(value) => setNewTeam(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Midwest">Midwest</SelectItem>
                    <SelectItem value="South">South</SelectItem>
                    <SelectItem value="West Coast">West Coast</SelectItem>
                    <SelectItem value="Southeast">Southeast</SelectItem>
                    <SelectItem value="Northeast">Northeast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  console.log('Creating team:', newTeam)
                  setIsCreateTeamOpen(false)
                  setNewTeam({ name: '', description: '', hub: '', region: '', leadId: '' })
                }}
                disabled={!newTeam.name || !newTeam.hub || !newTeam.region}
              >
                Create Team
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
          <h2 className="text-2xl font-bold">Teams & Hub Management</h2>
          <p className="text-muted-foreground">
            Organize users into teams and assign them to specific hubs and regions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'teams' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('teams')}
            >
              <Users className="w-4 h-4 mr-2" />
              Teams
            </Button>
            <Button
              variant={viewMode === 'hubs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('hubs')}
            >
              <Building className="w-4 h-4 mr-2" />
              Hubs
            </Button>
          </div>
          <Button onClick={() => setIsCreateTeamOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {viewMode === 'teams' ? (
        <>
          {/* Teams Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {team.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {team.description}
                      </CardDescription>
                    </div>
                    <Badge variant={team.status === 'active' ? 'success' : 'secondary'} className="text-xs">
                      {team.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Hub & Region */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{team.hub} • {team.region}</span>
                  </div>

                  {/* Team Lead */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={team.lead.avatar} alt={team.lead.name} />
                      <AvatarFallback className="text-xs">
                        {team.lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{team.lead.name}</div>
                      <div className="text-xs text-muted-foreground">Team Lead</div>
                    </div>
                  </div>

                  {/* Team Size */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team members:</span>
                    <span className="font-medium">{team.members.length + 1}</span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/50 rounded p-2">
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-bold text-sm">{team.performance.successRate}%</div>
                    </div>
                    <div className="bg-muted/50 rounded p-2">
                      <div className="text-muted-foreground">Avg Response</div>
                      <div className="font-bold text-sm">{team.performance.avgResponseTime}min</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedTeam(team)}
                    >
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Team
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Members
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Hubs Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hubs.map((hub) => {
              const loadPercentage = getLoadPercentage(hub)
              const assignedTeams = teams.filter(team => team.hub === hub.name)
              
              return (
                <Card key={hub.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {hub.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3" />
                          {hub.location} • {hub.region}
                        </CardDescription>
                      </div>
                      {getHubStatusBadge(hub.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Capacity */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">{hub.currentLoad} / {hub.capacity} ({loadPercentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${getLoadColor(loadPercentage)}`}
                          style={{ width: `${loadPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Teams */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Assigned Teams</span>
                        <span className="font-medium">{assignedTeams.length}</span>
                      </div>
                      <div className="space-y-1">
                        {assignedTeams.map((team) => (
                          <div key={team.id} className="flex items-center gap-2 text-xs p-2 bg-muted/50 rounded">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="flex-1">{team.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {team.members.length + 1} members
                            </Badge>
                          </div>
                        ))}
                        {assignedTeams.length === 0 && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            No teams assigned
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Manage Hub
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="w-3 h-3 mr-1" />
                        Assign Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Team Details Modal */}
      <Dialog open={selectedTeam !== null} onOpenChange={(open) => !open && setSelectedTeam(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              {selectedTeam?.name}
            </DialogTitle>
            <DialogDescription>
              Team details, members, and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedTeam && (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hub & Region</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedTeam.hub} • {selectedTeam.region}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedTeam.status === 'active' ? 'success' : 'secondary'}>
                      {selectedTeam.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Team Size</label>
                  <div className="text-2xl font-bold mt-1">{selectedTeam.members.length + 1}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{selectedTeam.performance.packagesHandled.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Packages Handled</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{selectedTeam.performance.anomaliesResolved}</div>
                        <div className="text-xs text-muted-foreground">Anomalies Resolved</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold">{selectedTeam.performance.avgResponseTime}min</div>
                        <div className="text-xs text-muted-foreground">Avg Response Time</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">{selectedTeam.performance.successRate}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <Button size="sm" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined Team</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Team Lead */}
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={selectedTeam.lead.avatar} alt={selectedTeam.lead.name} />
                              <AvatarFallback>
                                {selectedTeam.lead.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{selectedTeam.lead.name}</div>
                              <div className="text-sm text-muted-foreground">{selectedTeam.lead.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="default" className="text-xs">Team Lead</Badge>
                            <span className="text-sm">{selectedTeam.lead.role}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDistanceToNow(selectedTeam.lead.joinedTeam, { addSuffix: true })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" className="text-xs">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      {/* Team Members */}
                      {selectedTeam.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{member.role}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {formatDistanceToNow(member.joinedTeam, { addSuffix: true })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-xs">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Member
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Activity className="w-4 h-4 mr-2" />
                                  View Activity
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Team
                </Button>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Members
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateTeamDialog />
    </div>
  )
}
