'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  Eye,
  Settings,
  Database,
  Bot,
  BarChart3,
  Package,
  AlertTriangle,
  UserPlus,
  Crown,
  Zap
} from 'lucide-react'

interface Permission {
  id: string
  name: string
  description: string
  category: string
  icon: any
}

interface Role {
  id: string
  name: string
  description: string
  type: 'predefined' | 'custom'
  userCount: number
  permissions: string[]
  color: string
  createdAt: Date
  updatedAt: Date
}

export function RolesPermissions() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)

  // Mock permissions data
  const permissions: Permission[] = [
    // Dashboard & Overview
    { id: 'view_dashboard', name: 'View Dashboard', description: 'Access to main dashboard and overview', category: 'Dashboard', icon: BarChart3 },
    { id: 'export_data', name: 'Export Data', description: 'Export dashboard data and reports', category: 'Dashboard', icon: Database },
    
    // Package Management
    { id: 'view_packages', name: 'View Packages', description: 'View package information and tracking', category: 'Packages', icon: Package },
    { id: 'manage_packages', name: 'Manage Packages', description: 'Create, update, and delete packages', category: 'Packages', icon: Package },
    { id: 'reroute_packages', name: 'Reroute Packages', description: 'Change package routes and destinations', category: 'Packages', icon: Package },
    
    // Anomaly Management
    { id: 'view_anomalies', name: 'View Anomalies', description: 'View anomaly reports and alerts', category: 'Anomalies', icon: AlertTriangle },
    { id: 'resolve_anomalies', name: 'Resolve Anomalies', description: 'Mark anomalies as resolved', category: 'Anomalies', icon: AlertTriangle },
    { id: 'approve_recovery', name: 'Approve Recovery', description: 'Approve AI-suggested recovery actions', category: 'Anomalies', icon: AlertTriangle },
    
    // AI Agent Management
    { id: 'view_agents', name: 'View AI Agents', description: 'View AI agent status and performance', category: 'AI Agents', icon: Bot },
    { id: 'manage_agents', name: 'Manage AI Agents', description: 'Configure and deploy AI agents', category: 'AI Agents', icon: Bot },
    { id: 'train_models', name: 'Train Models', description: 'Train and update AI models', category: 'AI Agents', icon: Bot },
    { id: 'edit_models', name: 'Edit Models', description: 'Modify AI model parameters', category: 'AI Agents', icon: Bot },
    
    // Analytics
    { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and reports', category: 'Analytics', icon: BarChart3 },
    { id: 'advanced_analytics', name: 'Advanced Analytics', description: 'Access advanced analytics features', category: 'Analytics', icon: BarChart3 },
    
    // User Management
    { id: 'view_users', name: 'View Users', description: 'View user directory and profiles', category: 'Users', icon: Users },
    { id: 'manage_users', name: 'Manage Users', description: 'Create, update, and delete users', category: 'Users', icon: Users },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify user roles', category: 'Users', icon: Shield },
    { id: 'invite_users', name: 'Invite Users', description: 'Send user invitations', category: 'Users', icon: UserPlus },
    
    // System Administration
    { id: 'system_settings', name: 'System Settings', description: 'Access system configuration', category: 'System', icon: Settings },
    { id: 'security_settings', name: 'Security Settings', description: 'Manage security configurations', category: 'System', icon: Shield },
    { id: 'audit_logs', name: 'Audit Logs', description: 'View system audit logs', category: 'System', icon: Eye },
    { id: 'full_access', name: 'Full Access', description: 'Complete system access (Admin only)', category: 'System', icon: Crown },
  ]

  // Mock roles data
  const roles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access with all permissions',
      type: 'predefined',
      userCount: 3,
      permissions: ['full_access'],
      color: 'from-red-600 to-red-700',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    },
    {
      id: '2',
      name: 'Operations Manager',
      description: 'Manage packages, anomalies, and approve recovery actions',
      type: 'predefined',
      userCount: 8,
      permissions: [
        'view_dashboard', 'export_data', 'view_packages', 'manage_packages', 'reroute_packages',
        'view_anomalies', 'resolve_anomalies', 'approve_recovery', 'view_analytics', 'view_users'
      ],
      color: 'from-blue-600 to-blue-700',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    },
    {
      id: '3',
      name: 'AI Agent Trainer',
      description: 'Manage and train AI agents and models',
      type: 'predefined',
      userCount: 5,
      permissions: [
        'view_dashboard', 'view_packages', 'view_anomalies', 'view_agents', 'manage_agents',
        'train_models', 'edit_models', 'view_analytics', 'advanced_analytics'
      ],
      color: 'from-purple-600 to-purple-700',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    },
    {
      id: '4',
      name: 'Data Analyst',
      description: 'Access analytics, reports, and data export capabilities',
      type: 'predefined',
      userCount: 12,
      permissions: [
        'view_dashboard', 'export_data', 'view_packages', 'view_anomalies',
        'view_analytics', 'advanced_analytics', 'view_agents'
      ],
      color: 'from-green-600 to-green-700',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    },
    {
      id: '5',
      name: 'Operations Analyst',
      description: 'View operations data and basic analytics',
      type: 'custom',
      userCount: 15,
      permissions: [
        'view_dashboard', 'view_packages', 'view_anomalies', 'resolve_anomalies', 'view_analytics'
      ],
      color: 'from-orange-600 to-orange-700',
      createdAt: new Date(2023, 2, 15),
      updatedAt: new Date(2023, 6, 10)
    },
    {
      id: '6',
      name: 'Viewer',
      description: 'Read-only access to dashboard and basic information',
      type: 'predefined',
      userCount: 25,
      permissions: ['view_dashboard', 'view_packages', 'view_anomalies'],
      color: 'from-gray-600 to-gray-700',
      createdAt: new Date(2023, 0, 1),
      updatedAt: new Date(2023, 0, 1)
    }
  ]

  const getPermissionsByCategory = () => {
    const categories = permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
    return categories
  }

  const getRoleIcon = (role: Role) => {
    if (role.name === 'Admin') return <Crown className="w-4 h-4" />
    if (role.name.includes('Manager')) return <Users className="w-4 h-4" />
    if (role.name.includes('Trainer')) return <Bot className="w-4 h-4" />
    if (role.name.includes('Analyst')) return <BarChart3 className="w-4 h-4" />
    return <Eye className="w-4 h-4" />
  }

  const CreateRoleDialog = () => {
    const [newRole, setNewRole] = useState({
      name: '',
      description: '',
      permissions: [] as string[]
    })

    const togglePermission = (permissionId: string) => {
      setNewRole(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }))
    }

    return (
      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions for your team members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Senior Analyst"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  placeholder="Describe what this role can do..."
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <Label className="text-base font-semibold">Permissions</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Select the permissions this role should have
              </p>

              <Tabs defaultValue="Dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  {Object.keys(getPermissionsByCategory()).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                  <TabsContent key={category} value={category} className="space-y-3">
                    <div className="grid gap-3">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <permission.icon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">{permission.name}</div>
                              <div className="text-xs text-muted-foreground">{permission.description}</div>
                            </div>
                          </div>
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Handle create role logic here
                  console.log('Creating role:', newRole)
                  setIsCreateRoleOpen(false)
                  setNewRole({ name: '', description: '', permissions: [] })
                }}
                disabled={!newRole.name || newRole.permissions.length === 0}
              >
                Create Role
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
          <h2 className="text-2xl font-bold">Roles & Permissions</h2>
          <p className="text-muted-foreground">
            Manage user roles and define granular permissions for your team
          </p>
        </div>
        <Button onClick={() => setIsCreateRoleOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.color}`} />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRoleIcon(role)}
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <Badge variant={role.type === 'predefined' ? 'secondary' : 'outline'} className="text-xs">
                  {role.type === 'predefined' ? 'Built-in' : 'Custom'}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {role.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Users assigned:</span>
                <span className="font-medium">{role.userCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Permissions:</span>
                <span className="font-medium">{role.permissions.length}</span>
              </div>

              {role.permissions.includes('full_access') && (
                <Badge variant="destructive" className="w-full justify-center text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Full Access
                </Badge>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedRole(role)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                {role.type === 'custom' && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      View Users
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {role.type === 'custom' && (
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Role
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissions Matrix
          </CardTitle>
          <CardDescription>
            Overview of all permissions across different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        {getRoleIcon(role)}
                        <span className="text-xs">{role.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <permission.icon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.category}</div>
                        </div>
                      </div>
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        {role.permissions.includes('full_access') || role.permissions.includes(permission.id) ? (
                          <Check className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Detail Modal */}
      <Dialog open={selectedRole !== null} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedRole && getRoleIcon(selectedRole)}
              {selectedRole?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed view of role permissions and assigned users
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="space-y-6">
              {/* Role Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <div className="mt-1">
                    <Badge variant={selectedRole.type === 'predefined' ? 'secondary' : 'outline'}>
                      {selectedRole.type === 'predefined' ? 'Built-in Role' : 'Custom Role'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Users Assigned</label>
                  <div className="text-2xl font-bold mt-1">{selectedRole.userCount}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{selectedRole.description}</p>
              </div>

              {/* Permissions */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Permissions</label>
                <div className="mt-2 space-y-3">
                  {selectedRole.permissions.includes('full_access') ? (
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950/20">
                      <Crown className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-medium text-red-600">Full System Access</div>
                        <div className="text-xs text-red-600/80">This role has complete access to all system features</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => {
                        const rolePermissions = categoryPermissions.filter(p => selectedRole.permissions.includes(p.id))
                        if (rolePermissions.length === 0) return null

                        return (
                          <div key={category} className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">{category}</div>
                            <div className="grid gap-1 ml-4">
                              {rolePermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center gap-2 text-sm">
                                  <Check className="w-3 h-3 text-green-600" />
                                  <permission.icon className="w-3 h-3 text-muted-foreground" />
                                  <span>{permission.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View Users
                </Button>
                {selectedRole.type === 'custom' && (
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Role
                  </Button>
                )}
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Users
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreateRoleDialog />
    </div>
  )
}
