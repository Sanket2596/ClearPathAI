'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  hub: string
  status: 'active' | 'suspended' | 'invited' | 'inactive'
  lastActive: Date
  avatar?: string
  phone?: string
  location?: string
  joinDate: Date
  permissions: string[]
  performanceScore: number
}

interface UserDirectoryProps {
  searchQuery: string
}

export function UserDirectory({ searchQuery }: UserDirectoryProps) {
  const [sortBy, setSortBy] = useState<keyof User>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock user data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@clearpath.ai',
      role: 'Operations Manager',
      department: 'Operations',
      hub: 'Chicago Hub',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      phone: '+1 (555) 123-4567',
      location: 'Chicago, IL',
      joinDate: new Date(2023, 2, 15),
      permissions: ['view_dashboard', 'manage_packages', 'approve_recovery'],
      performanceScore: 94
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@clearpath.ai',
      role: 'AI Agent Trainer',
      department: 'AI/ML',
      hub: 'Dallas Hub',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      phone: '+1 (555) 234-5678',
      location: 'Dallas, TX',
      joinDate: new Date(2023, 0, 8),
      permissions: ['view_dashboard', 'manage_agents', 'edit_models'],
      performanceScore: 97
    },
    {
      id: '3',
      name: 'Emily Chen',
      email: 'emily.chen@clearpath.ai',
      role: 'Data Analyst',
      department: 'Analytics',
      hub: 'LA Hub',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA',
      joinDate: new Date(2023, 4, 22),
      permissions: ['view_dashboard', 'view_analytics', 'export_data'],
      performanceScore: 89
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david.thompson@clearpath.ai',
      role: 'Admin',
      department: 'IT',
      hub: 'Corporate',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      joinDate: new Date(2022, 8, 10),
      permissions: ['full_access'],
      performanceScore: 92
    },
    {
      id: '5',
      name: 'Lisa Park',
      email: 'lisa.park@clearpath.ai',
      role: 'Viewer',
      department: 'Customer Service',
      hub: 'Miami Hub',
      status: 'invited',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      phone: '+1 (555) 567-8901',
      location: 'Miami, FL',
      joinDate: new Date(2023, 7, 1),
      permissions: ['view_dashboard'],
      performanceScore: 0
    },
    {
      id: '6',
      name: 'James Wilson',
      email: 'james.wilson@clearpath.ai',
      role: 'Operations Analyst',
      department: 'Operations',
      hub: 'Phoenix Hub',
      status: 'suspended',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      phone: '+1 (555) 678-9012',
      location: 'Phoenix, AZ',
      joinDate: new Date(2023, 1, 14),
      permissions: ['view_dashboard', 'view_analytics'],
      performanceScore: 76
    }
  ]

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = mockUsers.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hub.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = filterRole === 'all' || user.role === filterRole
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus
      const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'lastActive' || sortBy === 'joinDate') {
        aValue = (aValue as Date).getTime()
        bValue = (bValue as Date).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortOrder === 'asc') {
        return (aValue ?? 0) < (bValue ?? 0) ? -1 : (aValue ?? 0) > (bValue ?? 0) ? 1 : 0
      } else {
        return (aValue ?? 0) > (bValue ?? 0) ? -1 : (aValue ?? 0) < (bValue ?? 0) ? 1 : 0
      }
    })

    return filtered
  }, [mockUsers, searchQuery, sortBy, sortOrder, filterRole, filterStatus, filterDepartment])

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" className="text-xs">Active</Badge>
      case 'suspended':
        return <Badge variant="destructive" className="text-xs">Suspended</Badge>
      case 'invited':
        return <Badge variant="secondary" className="text-xs">Invited</Badge>
      case 'inactive':
        return <Badge variant="outline" className="text-xs">Inactive</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('Admin')) return <Shield className="w-4 h-4" />
    if (role.includes('Manager')) return <Users className="w-4 h-4" />
    if (role.includes('Analyst')) return <Activity className="w-4 h-4" />
    return <UserCheck className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Sorting
          </CardTitle>
          <CardDescription>
            Filter and sort users by role, status, department, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Role</label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
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
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-')
                setSortBy(field as keyof User)
                setSortOrder(order as 'asc' | 'desc')
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="lastActive-desc">Last Active (Recent)</SelectItem>
                  <SelectItem value="lastActive-asc">Last Active (Oldest)</SelectItem>
                  <SelectItem value="joinDate-desc">Join Date (Recent)</SelectItem>
                  <SelectItem value="joinDate-asc">Join Date (Oldest)</SelectItem>
                  <SelectItem value="performanceScore-desc">Performance (High-Low)</SelectItem>
                  <SelectItem value="performanceScore-asc">Performance (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Directory
              </CardTitle>
              <CardDescription>
                {filteredAndSortedUsers.length} of {mockUsers.length} users
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department/Hub</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-sm">{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{user.department}</div>
                        <div className="text-xs text-muted-foreground">{user.hub}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.performanceScore > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{user.performanceScore}%</div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                user.performanceScore >= 90 ? 'bg-green-500' :
                                user.performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${user.performanceScore}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
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
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem className="text-orange-600">
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
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

      {/* User Detail Modal */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                <AvatarFallback>
                  {selectedUser?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed information and activity for this user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.phone}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.location}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedUser.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Role & Department */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role & Department</label>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-2">
                      {getRoleIcon(selectedUser.role)}
                      {selectedUser.role}
                    </Badge>
                    <Badge variant="outline">
                      {selectedUser.department} - {selectedUser.hub}
                    </Badge>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUser.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Performance Score */}
              {selectedUser.performanceScore > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Performance Score</label>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-2xl font-bold">{selectedUser.performanceScore}%</div>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          selectedUser.performanceScore >= 90 ? 'bg-green-500' :
                          selectedUser.performanceScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedUser.performanceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button>
                  <Activity className="w-4 h-4 mr-2" />
                  View Activity
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
