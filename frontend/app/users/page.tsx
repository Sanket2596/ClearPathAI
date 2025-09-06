'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GradientText } from '@/components/ui/gradient-text'
import { UserDirectory } from '@/components/users/user-directory'
import { TeamsManagement } from '@/components/users/teams-management'
import { RolesPermissions } from '@/components/users/roles-permissions'
import { ActivityLogs } from '@/components/users/activity-logs'
import { PerformanceAnalytics } from '@/components/users/performance-analytics'
import { InvitesOnboarding } from '@/components/users/invites-onboarding'
import { SecurityControls } from '@/components/users/security-controls'
import { UserInsightsDashboard } from '@/components/users/user-insights-dashboard'
import {
  Users,
  UserPlus,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck
} from 'lucide-react'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('directory')

  // Mock data for overview cards
  const overviewStats = [
    {
      title: 'Total Users',
      value: '147',
      change: '+12',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Active Today',
      value: '89',
      change: '+5',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Pending Invites',
      value: '8',
      change: '-2',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'from-orange-600 to-orange-700'
    },
    {
      title: 'Security Alerts',
      value: '3',
      change: '0',
      changeType: 'neutral' as const,
      icon: AlertCircle,
      color: 'from-red-600 to-red-700'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <GradientText from="from-blue-600" to="to-purple-600">
              User Management
            </GradientText>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage team members, roles, permissions, and monitor user activity across your logistics operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stat.value}</div>
                <Badge 
                  variant={
                    stat.changeType === 'positive' ? 'success' : 
                    stat.changeType === 'negative' ? 'destructive' : 
                    'secondary'
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Global Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Quick Search
              </CardTitle>
              <CardDescription>
                Search across users, teams, roles, and activity logs
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users, roles, teams, or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1 bg-muted/50">
          <TabsTrigger value="directory" className="flex items-center gap-2 py-3">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Directory</span>
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex items-center gap-2 py-3">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Teams</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 py-3">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2 py-3">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 py-3">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="invites" className="flex items-center gap-2 py-3">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Invites</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-3">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 py-3">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          <UserDirectory searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <TeamsManagement />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <RolesPermissions />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityLogs />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="invites" className="space-y-6">
          <InvitesOnboarding />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityControls />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <UserInsightsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
