'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  UserMinus,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  Zap,
  Star,
  MapPin,
  Building
} from 'lucide-react'

interface InsightMetric {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
}

interface TeamInsight {
  teamName: string
  hub: string
  memberCount: number
  productivity: number
  engagement: number
  retention: number
  trend: 'up' | 'down' | 'stable'
}

interface UserGrowth {
  month: string
  newUsers: number
  activeUsers: number
  churnRate: number
}

export function UserInsightsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [viewMode, setViewMode] = useState<'overview' | 'teams' | 'growth' | 'engagement'>('overview')

  // Mock insights data
  const keyMetrics: InsightMetric[] = [
    {
      title: 'Total Active Users',
      value: 142,
      change: '+8.2%',
      changeType: 'positive',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Avg Productivity Score',
      value: '91.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'User Engagement',
      value: '87.3%',
      change: '-1.4%',
      changeType: 'negative',
      icon: Activity,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Avg Session Duration',
      value: '4.2h',
      change: '+12min',
      changeType: 'positive',
      icon: Clock,
      color: 'from-orange-600 to-orange-700'
    },
    {
      title: 'Task Completion Rate',
      value: '94.7%',
      change: '+1.8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'from-emerald-600 to-emerald-700'
    },
    {
      title: 'Training Completion',
      value: '78.5%',
      change: '+5.2%',
      changeType: 'positive',
      icon: Award,
      color: 'from-yellow-600 to-yellow-700'
    },
    {
      title: 'Security Incidents',
      value: 3,
      change: '-2',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'from-red-600 to-red-700'
    },
    {
      title: 'User Satisfaction',
      value: '4.6/5',
      change: '+0.2',
      changeType: 'positive',
      icon: Star,
      color: 'from-pink-600 to-pink-700'
    }
  ]

  const teamInsights: TeamInsight[] = [
    {
      teamName: 'Chicago Operations Team',
      hub: 'Chicago Hub',
      memberCount: 12,
      productivity: 94,
      engagement: 89,
      retention: 96,
      trend: 'up'
    },
    {
      teamName: 'Dallas AI Team',
      hub: 'Dallas Hub',
      memberCount: 8,
      productivity: 97,
      engagement: 92,
      retention: 98,
      trend: 'up'
    },
    {
      teamName: 'LA Analytics Team',
      hub: 'LA Hub',
      memberCount: 10,
      productivity: 87,
      engagement: 84,
      retention: 91,
      trend: 'stable'
    },
    {
      teamName: 'Miami Customer Service',
      hub: 'Miami Hub',
      memberCount: 6,
      productivity: 82,
      engagement: 78,
      retention: 88,
      trend: 'down'
    },
    {
      teamName: 'Phoenix Operations',
      hub: 'Phoenix Hub',
      memberCount: 9,
      productivity: 90,
      engagement: 86,
      retention: 93,
      trend: 'up'
    }
  ]

  const userGrowthData: UserGrowth[] = [
    { month: 'Jan', newUsers: 8, activeUsers: 125, churnRate: 2.1 },
    { month: 'Feb', newUsers: 12, activeUsers: 134, churnRate: 1.8 },
    { month: 'Mar', newUsers: 15, activeUsers: 142, churnRate: 2.3 },
    { month: 'Apr', newUsers: 9, activeUsers: 138, churnRate: 3.1 },
    { month: 'May', newUsers: 18, activeUsers: 151, churnRate: 1.9 },
    { month: 'Jun', newUsers: 14, activeUsers: 159, churnRate: 2.2 }
  ]

  const departmentBreakdown = [
    { name: 'Operations', count: 45, percentage: 32, color: 'bg-blue-500' },
    { name: 'AI/ML', count: 28, percentage: 20, color: 'bg-purple-500' },
    { name: 'Analytics', count: 35, percentage: 25, color: 'bg-green-500' },
    { name: 'Customer Service', count: 18, percentage: 13, color: 'bg-orange-500' },
    { name: 'IT/Admin', count: 14, percentage: 10, color: 'bg-gray-500' }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable':
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 85) return 'text-blue-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Insights Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights about your team and user activity
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
            Export Report
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={viewMode === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('overview')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={viewMode === 'teams' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('teams')}
        >
          <Users className="w-4 h-4 mr-2" />
          Teams
        </Button>
        <Button
          variant={viewMode === 'growth' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('growth')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Growth
        </Button>
        <Button
          variant={viewMode === 'engagement' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('engagement')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Engagement
        </Button>
      </div>

      {viewMode === 'overview' && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{metric.value}</div>
                    <Badge 
                      variant={
                        metric.changeType === 'positive' ? 'success' : 
                        metric.changeType === 'negative' ? 'destructive' : 
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Department Distribution
                </CardTitle>
                <CardDescription>
                  User distribution across departments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentBreakdown.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-muted-foreground">{dept.count} users ({dept.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${dept.color} transition-all`}
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Performance Summary
                </CardTitle>
                <CardDescription>
                  Overall team performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Productivity</span>
                    <span className="text-sm font-bold text-green-600">91.4%</span>
                  </div>
                  <Progress value={91.4} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Engagement</span>
                    <span className="text-sm font-bold text-blue-600">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Training Completion</span>
                    <span className="text-sm font-bold text-purple-600">78.5%</span>
                  </div>
                  <Progress value={78.5} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-sm font-bold text-emerald-600">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {viewMode === 'teams' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Performance Insights
              </CardTitle>
              <CardDescription>
                Detailed performance metrics for each team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamInsights.map((team, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {team.teamName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {team.hub} • {team.memberCount} members
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(team.trend)}
                        <Badge variant="outline" className="text-xs">
                          Rank #{index + 1}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(team.productivity)}`}>
                          {team.productivity}%
                        </div>
                        <div className="text-xs text-muted-foreground">Productivity</div>
                        <Progress value={team.productivity} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(team.engagement)}`}>
                          {team.engagement}%
                        </div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                        <Progress value={team.engagement} className="h-1 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(team.retention)}`}>
                          {team.retention}%
                        </div>
                        <div className="text-xs text-muted-foreground">Retention</div>
                        <Progress value={team.retention} className="h-1 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'growth' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  User Growth Trends
                </CardTitle>
                <CardDescription>
                  Monthly user acquisition and retention metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowthData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{data.month}</div>
                          <div className="text-xs text-muted-foreground">
                            {data.activeUsers} active users
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">
                            +{data.newUsers} new
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {data.churnRate}% churn
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Growth Predictions
                </CardTitle>
                <CardDescription>
                  Projected user growth for next quarter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">Positive Growth Trend</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Based on current trends, we expect to reach <strong>180+ active users</strong> by end of Q4.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expected New Users (Q4)</span>
                    <span className="font-bold text-blue-600">+25-30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Projected Churn Rate</span>
                    <span className="font-bold text-orange-600">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Net Growth Rate</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <h4 className="font-medium mb-2">Key Growth Drivers</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>• Improved onboarding process</div>
                    <div>• Enhanced training programs</div>
                    <div>• Better team collaboration tools</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {viewMode === 'engagement' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">89</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+5.2% from yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Avg Session Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">4h 12m</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+8min from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Feature Adoption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">76%</div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">+3.1% this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                User Satisfaction & Feedback
              </CardTitle>
              <CardDescription>
                Recent user satisfaction scores and feedback trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Satisfaction</span>
                      <span className="text-2xl font-bold text-green-600">4.6/5</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Platform Usability</span>
                      <span className="text-lg font-bold text-blue-600">4.4/5</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Support Quality</span>
                      <span className="text-lg font-bold text-purple-600">4.7/5</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Recent Feedback Highlights</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border-l-2 border-green-500">
                      "The new dashboard is much more intuitive!" - Operations Team
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded border-l-2 border-blue-500">
                      "AI agent training tools are excellent." - AI/ML Team
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border-l-2 border-orange-500">
                      "Would love more customization options." - Analytics Team
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
