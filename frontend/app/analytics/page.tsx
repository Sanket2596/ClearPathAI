'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GradientText } from '@/components/ui/gradient-text'
import { RegionalHeatmap } from '@/components/analytics/regional-heatmap'
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  TiltCard,
  MagneticButton
} from '@/components/ui/motion-components'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Shield,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  MapPin,
  Calendar,
  Activity,
  Zap,
  Brain,
  Eye,
  Award,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Map
} from 'lucide-react'

// Mock data for analytics
const kpiData = {
  onTimeDelivery: 92.4,
  recoverySuccess: 87.2,
  avgRecoveryTime: 1.4,
  costSavings: 1200000,
  anomaliesDetected: 1247,
  anomaliesResolved: 1087,
  customerSatisfaction: 4.8,
  proactiveNotifications: 94.1
}

const trendsData = [
  { date: '2024-01-01', detected: 45, resolved: 38, cost: 12500 },
  { date: '2024-01-02', detected: 52, resolved: 47, cost: 8200 },
  { date: '2024-01-03', detected: 38, resolved: 35, cost: 6800 },
  { date: '2024-01-04', detected: 61, resolved: 54, cost: 15300 },
  { date: '2024-01-05', detected: 43, resolved: 41, cost: 4200 },
  { date: '2024-01-06', detected: 29, resolved: 28, cost: 2100 },
  { date: '2024-01-07', detected: 67, resolved: 59, cost: 18900 },
  { date: '2024-01-08', detected: 55, resolved: 51, cost: 9400 },
  { date: '2024-01-09', detected: 41, resolved: 39, cost: 5600 },
  { date: '2024-01-10', detected: 48, resolved: 44, cost: 7800 },
  { date: '2024-01-11', detected: 33, resolved: 31, cost: 4100 },
  { date: '2024-01-12', detected: 58, resolved: 52, cost: 11200 },
  { date: '2024-01-13', detected: 44, resolved: 42, cost: 6300 },
  { date: '2024-01-14', detected: 39, resolved: 37, cost: 5100 },
  { date: '2024-01-15', detected: 63, resolved: 55, cost: 14100 },
  { date: '2024-01-16', detected: 47, resolved: 43, cost: 7800 },
  { date: '2024-01-17', detected: 54, resolved: 49, cost: 9500 },
  { date: '2024-01-18', detected: 41, resolved: 38, cost: 6200 },
  { date: '2024-01-19', detected: 59, resolved: 54, cost: 12300 },
  { date: '2024-01-20', detected: 46, resolved: 42, cost: 7600 }
]

const hubPerformanceData = [
  { hub: 'Chicago Hub', anomalies: 187, resolved: 162, efficiency: 86.6, region: 'Midwest' },
  { hub: 'Dallas Hub', anomalies: 143, resolved: 134, efficiency: 93.7, region: 'South' },
  { hub: 'Denver Hub', anomalies: 98, resolved: 89, efficiency: 90.8, region: 'West' },
  { hub: 'Atlanta Hub', anomalies: 156, resolved: 128, efficiency: 82.1, region: 'Southeast' },
  { hub: 'Phoenix Hub', anomalies: 112, resolved: 101, efficiency: 90.2, region: 'Southwest' },
  { hub: 'Seattle Hub', anomalies: 89, resolved: 83, efficiency: 93.3, region: 'Northwest' },
  { hub: 'Miami Hub', anomalies: 134, resolved: 118, efficiency: 88.1, region: 'Southeast' },
  { hub: 'Los Angeles Hub', anomalies: 201, resolved: 178, efficiency: 88.6, region: 'West' }
]

const rootCauseData = [
  { cause: 'Scanning Errors', count: 342, percentage: 42.1, color: '#ef4444' },
  { cause: 'Routing Mistakes', count: 287, percentage: 35.3, color: '#f97316' },
  { cause: 'Driver Issues', count: 123, percentage: 15.1, color: '#eab308' },
  { cause: 'System Failures', count: 61, percentage: 7.5, color: '#06b6d4' }
]

const predictiveData = [
  { region: 'Chicago', riskScore: 7.2, predictedAnomalies: 23, confidence: 89 },
  { region: 'Dallas', riskScore: 4.1, predictedAnomalies: 15, confidence: 94 },
  { region: 'Denver', riskScore: 5.8, predictedAnomalies: 18, confidence: 87 },
  { region: 'Atlanta', riskScore: 8.4, predictedAnomalies: 28, confidence: 92 },
  { region: 'Phoenix', riskScore: 3.9, predictedAnomalies: 12, confidence: 91 },
  { region: 'Seattle', riskScore: 2.7, predictedAnomalies: 9, confidence: 96 }
]

const comparisonData = [
  { period: 'Pre-AI (Q3)', efficiency: 67, cost: 2400000, recovery: 34, satisfaction: 3.2 },
  { period: 'Post-AI (Q4)', efficiency: 92, cost: 1200000, recovery: 87, satisfaction: 4.8 }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('anomalies')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen pt-20 space-y-8 pb-8">
      <div className="w-full space-y-8">
      {/* Header - Scrollable with content */}
      <div className="pb-6 mb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <GradientText from="from-purple-600" to="to-pink-600">
              Analytics Dashboard
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered insights and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <MagneticButton
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </MagneticButton>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-4 sm:px-6 lg:px-8">
        <MotionDiv
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="font-bold text-2xl text-green-600">{kpiData.onTimeDelivery}%</div>
            <div className="text-sm text-muted-foreground">On-Time Delivery</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+2.4% from last month</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <div className="font-bold text-2xl text-blue-600">{kpiData.recoverySuccess}%</div>
            <div className="text-sm text-muted-foreground">Recovery Success</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
              <span className="text-xs text-blue-600">+5.1% from last month</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div className="font-bold text-2xl text-amber-600">{kpiData.avgRecoveryTime}h</div>
            <div className="text-sm text-muted-foreground">Avg Recovery Time</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600">-0.3h from last month</span>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
            <div className="font-bold text-2xl text-purple-600">{formatCurrency(kpiData.costSavings)}</div>
            <div className="text-sm text-muted-foreground">Annual Savings</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-3 h-3 text-purple-500 mr-1" />
              <span className="text-xs text-purple-600">+18% from last year</span>
            </div>
          </TiltCard>
        </motion.div>
        </MotionDiv>
      </div>

      {/* Main Charts Row */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Anomalies Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Anomalies Detection & Resolution Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="detected"
                    stroke="#ef4444"
                    fill="rgba(239, 68, 68, 0.1)"
                    name="Detected"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Resolved"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hub Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Hub Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hubPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="hub" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="efficiency" 
                    fill="url(#hubGradient)"
                    radius={[0, 4, 4, 0]}
                    name="Efficiency %"
                  />
                  <defs>
                    <linearGradient id="hubGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Root Cause Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Root Cause Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rootCauseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {rootCauseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {rootCauseData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.cause}</span>
                  </div>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Predictive Risk Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Predictive Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveData.map((region, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.region}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={region.riskScore > 7 ? 'destructive' : region.riskScore > 5 ? 'secondary' : 'default'}>
                        Risk: {region.riskScore}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{region.confidence}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        region.riskScore > 7 ? 'bg-red-500' : 
                        region.riskScore > 5 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(region.riskScore / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Predicted anomalies: {region.predictedAnomalies}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Impact Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Impact Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={comparisonData}>
                  <RadialBar
                    dataKey="efficiency"
                    cornerRadius={10}
                    fill="url(#comparisonGradient)"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Efficiency Improvement:</span>
                <span className="font-bold text-green-600">+37%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cost Reduction:</span>
                <span className="font-bold text-green-600">-50%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Recovery Rate:</span>
                <span className="font-bold text-green-600">+156%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Regional Heatmap */}
      <div className="mt-8">
        <RegionalHeatmap />
      </div>

      {/* Customer Experience Metrics */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8">
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Customer Experience Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{kpiData.customerSatisfaction}</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              <div className="flex items-center justify-center mt-2">
                <Award className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">+1.6 points</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{kpiData.proactiveNotifications}%</div>
              <div className="text-sm text-muted-foreground">Proactive Notifications</div>
              <div className="flex items-center justify-center mt-2">
                <Eye className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Issues caught early</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">847</div>
              <div className="text-sm text-muted-foreground">Issues Prevented</div>
              <div className="flex items-center justify-center mt-2">
                <Shield className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">Before customer impact</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">2.1k</div>
              <div className="text-sm text-muted-foreground">Customer Complaints</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">-67% reduction</span>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
