'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Star,
  Zap,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface UserPerformance {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  metrics: {
    packagesProcessed: number
    anomaliesResolved: number
    avgResponseTime: number // in minutes
    successRate: number // percentage
    slaCompliance: number // percentage
    productivityScore: number // 0-100
    qualityScore: number // 0-100
    collaborationScore: number // 0-100
  }
  trends: {
    packagesProcessed: 'up' | 'down' | 'stable'
    anomaliesResolved: 'up' | 'down' | 'stable'
    responseTime: 'up' | 'down' | 'stable'
    successRate: 'up' | 'down' | 'stable'
  }
  achievements: string[]
  lastActive: Date
  joinDate: Date
}

interface TeamPerformance {
  id: string
  name: string
  hub: string
  memberCount: number
  metrics: {
    totalPackages: number
    totalAnomalies: number
    avgResponseTime: number
    teamSuccessRate: number
    teamProductivity: number
  }
  ranking: number
}

export function PerformanceAnalytics() {
  const [viewMode, setViewMode] = useState<'individual' | 'team' | 'leaderboard'>('individual')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [sortBy, setSortBy] = useState<string>('productivityScore')

  // Mock user performance data
  const userPerformances: UserPerformance[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@clearpath.ai',
      role: 'Operations Manager',
      department: 'Operations',
      metrics: {
        packagesProcessed: 1247,
        anomaliesResolved: 89,
        avgResponseTime: 12.5,
        successRate: 94.2,
        slaCompliance: 96.8,
        productivityScore: 94,
        qualityScore: 92,
        collaborationScore: 88
      },
      trends: {
        packagesProcessed: 'up',
        anomaliesResolved: 'up',
        responseTime: 'down',
        successRate: 'up'
      },
      achievements: ['Top Performer', 'SLA Champion', 'Team Player'],
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
      joinDate: new Date(2023, 2, 15)
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      email: 'marcus.rodriguez@clearpath.ai',
      role: 'AI Agent Trainer',
      department: 'AI/ML',
      metrics: {
        packagesProcessed: 0, // AI trainers don't process packages directly
        anomaliesResolved: 156,
        avgResponseTime: 8.3,
        successRate: 97.1,
        slaCompliance: 98.5,
        productivityScore: 97,
        qualityScore: 96,
        collaborationScore: 91
      },
      trends: {
        packagesProcessed: 'stable',
        anomaliesResolved: 'up',
        responseTime: 'down',
        successRate: 'up'
      },
      achievements: ['AI Expert', 'Innovation Leader', 'Quality Master'],
      lastActive: new Date(Date.now() - 1000 * 60 * 120),
      joinDate: new Date(2023, 0, 8)
    },
    {
      id: '3',
      name: 'Emily Chen',
      email: 'emily.chen@clearpath.ai',
      role: 'Data Analyst',
      department: 'Analytics',
      metrics: {
        packagesProcessed: 0,
        anomaliesResolved: 67,
        avgResponseTime: 15.2,
        successRate: 89.4,
        slaCompliance: 92.1,
        productivityScore: 89,
        qualityScore: 91,
        collaborationScore: 95
      },
      trends: {
        packagesProcessed: 'stable',
        anomaliesResolved: 'stable',
        responseTime: 'up',
        successRate: 'down'
      },
      achievements: ['Data Wizard', 'Insight Generator'],
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
      joinDate: new Date(2023, 4, 22)
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david.thompson@clearpath.ai',
      role: 'Admin',
      department: 'IT',
      metrics: {
        packagesProcessed: 234,
        anomaliesResolved: 45,
        avgResponseTime: 18.7,
        successRate: 92.3,
        slaCompliance: 94.2,
        productivityScore: 92,
        qualityScore: 89,
        collaborationScore: 87
      },
      trends: {
        packagesProcessed: 'down',
        anomaliesResolved: 'stable',
        responseTime: 'stable',
        successRate: 'up'
      },
      achievements: ['System Guardian', 'Reliability Expert'],
      lastActive: new Date(Date.now() - 1000 * 60 * 5),
      joinDate: new Date(2022, 8, 10)
    }
  ]

  // Mock team performance data
  const teamPerformances: TeamPerformance[] = [
    {
      id: '1',
      name: 'Chicago Operations Team',
      hub: 'Chicago Hub',
      memberCount: 8,
      metrics: {
        totalPackages: 12450,
        totalAnomalies: 234,
        avgResponseTime: 14.2,
        teamSuccessRate: 93.8,
        teamProductivity: 91
      },
      ranking: 1
    },
    {
      id: '2',
      name: 'Dallas AI Team',
      hub: 'Dallas Hub',
      memberCount: 5,
      metrics: {
        totalPackages: 0,
        totalAnomalies: 189,
        avgResponseTime: 9.8,
        teamSuccessRate: 96.2,
        teamProductivity: 94
      },
      ranking: 2
    },
    {
      id: '3',
      name: 'LA Analytics Team',
      hub: 'LA Hub',
      memberCount: 6,
      metrics: {
        totalPackages: 8900,
        totalAnomalies: 156,
        avgResponseTime: 16.5,
        teamSuccessRate: 89.4,
        teamProductivity: 87
      },
      ranking: 3
    }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-600" />
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-600" />
      case 'stable':
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-blue-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 95) return 'bg-green-500'
    if (score >= 85) return 'bg-blue-500'
    if (score >= 75) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const sortedUsers = [...userPerformances].sort((a, b) => {
    const aValue = a.metrics[sortBy as keyof typeof a.metrics] || 0
    const bValue = b.metrics[sortBy as keyof typeof b.metrics] || 0
    return (bValue as number) - (aValue as number)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Track user productivity, quality metrics, and team performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={viewMode === 'individual' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('individual')}
        >
          <Users className="w-4 h-4 mr-2" />
          Individual
        </Button>
        <Button
          variant={viewMode === 'team' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('team')}
        >
          <Target className="w-4 h-4 mr-2" />
          Team
        </Button>
        <Button
          variant={viewMode === 'leaderboard' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('leaderboard')}
        >
          <Trophy className="w-4 h-4 mr-2" />
          Leaderboard
        </Button>
      </div>

      {viewMode === 'individual' && (
        <>
          {/* Individual Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPerformances.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {user.role} • {user.department}
                      </CardDescription>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(user.metrics.productivityScore)}`}>
                      {user.metrics.productivityScore}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{user.metrics.successRate}%</span>
                        {getTrendIcon(user.trends.successRate)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SLA Compliance</span>
                      <span className="font-medium">{user.metrics.slaCompliance}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Avg Response</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{user.metrics.avgResponseTime}min</span>
                        {getTrendIcon(user.trends.responseTime)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Anomalies</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{user.metrics.anomaliesResolved}</span>
                        {getTrendIcon(user.trends.anomaliesResolved)}
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Productivity</span>
                      <span className="font-medium">{user.metrics.productivityScore}%</span>
                    </div>
                    <Progress value={user.metrics.productivityScore} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs">
                      <span>Quality</span>
                      <span className="font-medium">{user.metrics.qualityScore}%</span>
                    </div>
                    <Progress value={user.metrics.qualityScore} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs">
                      <span>Collaboration</span>
                      <span className="font-medium">{user.metrics.collaborationScore}%</span>
                    </div>
                    <Progress value={user.metrics.collaborationScore} className="h-2" />
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Achievements</div>
                    <div className="flex flex-wrap gap-1">
                      {user.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {viewMode === 'team' && (
        <>
          {/* Team Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamPerformances.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white font-bold text-sm">
                          #{team.ranking}
                        </div>
                        {team.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {team.hub} • {team.memberCount} members
                      </CardDescription>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(team.metrics.teamProductivity)}`}>
                      {team.metrics.teamProductivity}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Team Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="text-xl font-bold">{team.metrics.teamSuccessRate}%</div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-muted-foreground">Avg Response</div>
                      <div className="text-xl font-bold">{team.metrics.avgResponseTime}min</div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-muted-foreground">Packages</div>
                      <div className="text-xl font-bold">{team.metrics.totalPackages.toLocaleString()}</div>
                    </div>
                    <div className="bg-muted/50 rounded p-3">
                      <div className="text-muted-foreground">Anomalies</div>
                      <div className="text-xl font-bold">{team.metrics.totalAnomalies}</div>
                    </div>
                  </div>

                  {/* Team Productivity */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Team Productivity</span>
                      <span className="font-medium">{team.metrics.teamProductivity}%</span>
                    </div>
                    <Progress value={team.metrics.teamProductivity} className="h-3" />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {viewMode === 'leaderboard' && (
        <>
          {/* Leaderboard Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold">Performance Leaderboard</span>
              </div>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="productivityScore">Productivity Score</SelectItem>
                <SelectItem value="qualityScore">Quality Score</SelectItem>
                <SelectItem value="successRate">Success Rate</SelectItem>
                <SelectItem value="slaCompliance">SLA Compliance</SelectItem>
                <SelectItem value="anomaliesResolved">Anomalies Resolved</SelectItem>
                <SelectItem value="packagesProcessed">Packages Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performers
              </CardTitle>
              <CardDescription>
                Ranked by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Productivity</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>SLA Compliance</TableHead>
                      <TableHead>Achievements</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.map((user, index) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {index === 0 && <Trophy className="w-5 h-5 text-yellow-600" />}
                            {index === 1 && <Award className="w-5 h-5 text-gray-500" />}
                            {index === 2 && <Award className="w-5 h-5 text-orange-600" />}
                            {index > 2 && <span className="font-bold text-muted-foreground">#{index + 1}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {user.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getScoreBackground(user.metrics.productivityScore)}`}
                                style={{ width: `${user.metrics.productivityScore}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(user.metrics.productivityScore)}`}>
                              {user.metrics.productivityScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getScoreBackground(user.metrics.qualityScore)}`}
                                style={{ width: `${user.metrics.qualityScore}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getScoreColor(user.metrics.qualityScore)}`}>
                              {user.metrics.qualityScore}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getScoreColor(user.metrics.successRate)}`}>
                            {user.metrics.successRate}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getScoreColor(user.metrics.slaCompliance)}`}>
                            {user.metrics.slaCompliance}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.achievements.slice(0, 2).map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                <Star className="w-2 h-2 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                            {user.achievements.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.achievements.length - 2}
                              </Badge>
                            )}
                          </div>
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
    </div>
  )
}
