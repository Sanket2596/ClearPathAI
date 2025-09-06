'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GradientText } from '@/components/ui/gradient-text'
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  TiltCard,
  RippleEffect
} from '@/components/ui/motion-components'
import {
  Bot,
  Brain,
  Activity,
  RefreshCw,
  Download,
  Search,
  Filter,
  Play,
  Pause,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Package,
  MapPin,
  Zap,
  Target,
  Shield,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Cpu,
  Network,
  Timer
} from 'lucide-react'

// Types
interface Agent {
  id: string
  name: string
  role: string
  description: string
  status: 'active' | 'idle' | 'busy' | 'paused'
  avatar: string
  kpis: {
    accuracy: number
    responseTime: number
    successRate: number
    actionsToday: number
  }
  lastAction: string
  capabilities: string[]
}

interface AgentActivity {
  id: string
  agentId: string
  agentName: string
  timestamp: string
  action: string
  details: string
  confidence: number
  packageId?: string
  reasoning?: string
  status: 'success' | 'pending' | 'failed'
  collaboration?: string[]
}

interface AgentCollaboration {
  id: string
  packageId: string
  agents: {
    agentId: string
    agentName: string
    action: string
    timestamp: string
    status: 'completed' | 'in_progress' | 'pending'
  }[]
}

// Mock Data
const mockAgents: Agent[] = [
  {
    id: 'investigator-01',
    name: 'Investigator Agent',
    role: 'Anomaly Detection',
    description: 'Detects package anomalies and missing scans using pattern recognition',
    status: 'active',
    avatar: '🕵️',
    kpis: {
      accuracy: 91.2,
      responseTime: 1.3,
      successRate: 89.5,
      actionsToday: 147
    },
    lastAction: '2 minutes ago',
    capabilities: ['Pattern Recognition', 'Anomaly Detection', 'Risk Assessment']
  },
  {
    id: 'recovery-01',
    name: 'Recovery Agent',
    role: 'Package Recovery',
    description: 'Handles rerouting and recovery of packages with detected issues',
    status: 'busy',
    avatar: '🚑',
    kpis: {
      accuracy: 94.7,
      responseTime: 2.1,
      successRate: 92.3,
      actionsToday: 89
    },
    lastAction: 'Active now',
    capabilities: ['Route Optimization', 'Hub Coordination', 'Recovery Planning']
  },
  {
    id: 'customer-01',
    name: 'Customer Agent',
    role: 'Communication',
    description: 'Manages customer notifications and proactive communication',
    status: 'active',
    avatar: '📞',
    kpis: {
      accuracy: 98.1,
      responseTime: 0.8,
      successRate: 96.7,
      actionsToday: 234
    },
    lastAction: '1 minute ago',
    capabilities: ['Customer Communication', 'Notification Management', 'ETA Updates']
  },
  {
    id: 'predictor-01',
    name: 'Predictor Agent',
    role: 'Risk Forecasting',
    description: 'Forecasts risks and identifies potential hotspots before they occur',
    status: 'active',
    avatar: '🔮',
    kpis: {
      accuracy: 87.4,
      responseTime: 3.2,
      successRate: 85.1,
      actionsToday: 67
    },
    lastAction: '5 minutes ago',
    capabilities: ['Predictive Analytics', 'Risk Modeling', 'Trend Analysis']
  },
  {
    id: 'optimizer-01',
    name: 'Optimizer Agent',
    role: 'Load Balancing',
    description: 'Optimizes load distribution across drivers and fleet resources',
    status: 'idle',
    avatar: '⚖️',
    kpis: {
      accuracy: 93.6,
      responseTime: 1.9,
      successRate: 91.8,
      actionsToday: 43
    },
    lastAction: '12 minutes ago',
    capabilities: ['Load Balancing', 'Resource Optimization', 'Fleet Management']
  }
]

const mockActivities: AgentActivity[] = [
  {
    id: '1',
    agentId: 'investigator-01',
    agentName: 'Investigator Agent',
    timestamp: '12:34 PM',
    action: 'Anomaly Detected',
    details: 'Package PCK12345 missing scan at Hub B',
    confidence: 89,
    packageId: 'PCK12345',
    reasoning: 'Package was expected to scan at Hub B at 12:15 PM but no scan recorded. Previous scans show normal progression.',
    status: 'success',
    collaboration: ['recovery-01']
  },
  {
    id: '2',
    agentId: 'recovery-01',
    agentName: 'Recovery Agent',
    timestamp: '12:36 PM',
    action: 'Recovery Initiated',
    details: 'Rerouted PCK12345 via Hub C, requested rescan',
    confidence: 94,
    packageId: 'PCK12345',
    reasoning: 'Hub B conveyor maintenance detected. Alternative route via Hub C adds 2 hours but ensures delivery.',
    status: 'pending',
    collaboration: ['customer-01']
  },
  {
    id: '3',
    agentId: 'customer-01',
    agentName: 'Customer Agent',
    timestamp: '12:38 PM',
    action: 'Customer Notified',
    details: 'Sent proactive delay notification with new ETA',
    confidence: 97,
    packageId: 'PCK12345',
    reasoning: 'Customer preference shows they want proactive updates. Sent SMS and email with new ETA of 6:00 PM.',
    status: 'success'
  },
  {
    id: '4',
    agentId: 'predictor-01',
    agentName: 'Predictor Agent',
    timestamp: '12:30 PM',
    action: 'Risk Alert',
    details: 'High anomaly probability predicted for Denver Hub',
    confidence: 76,
    reasoning: 'Weather patterns and historical data suggest 23% increase in package delays at Denver Hub in next 4 hours.',
    status: 'success',
    collaboration: ['optimizer-01']
  },
  {
    id: '5',
    agentId: 'optimizer-01',
    agentName: 'Optimizer Agent',
    timestamp: '12:32 PM',
    action: 'Load Rebalanced',
    details: 'Redistributed 45 packages from Denver to Phoenix hub',
    confidence: 91,
    reasoning: 'Predictor Agent alert triggered preemptive load balancing to avoid Denver Hub congestion.',
    status: 'success'
  }
]

const mockCollaborations: AgentCollaboration[] = [
  {
    id: 'collab-1',
    packageId: 'PCK12345',
    agents: [
      {
        agentId: 'investigator-01',
        agentName: 'Investigator',
        action: 'Detected missing scan',
        timestamp: '12:34 PM',
        status: 'completed'
      },
      {
        agentId: 'recovery-01',
        agentName: 'Recovery',
        action: 'Initiated reroute',
        timestamp: '12:36 PM',
        status: 'in_progress'
      },
      {
        agentId: 'customer-01',
        agentName: 'Customer',
        action: 'Notify customer',
        timestamp: '12:38 PM',
        status: 'pending'
      }
    ]
  }
]

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  idle: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', icon: Clock },
  busy: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', icon: Activity },
  paused: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: Pause }
}

const activityStatusConfig = {
  success: { color: 'text-green-600', icon: CheckCircle },
  pending: { color: 'text-orange-600', icon: Clock },
  failed: { color: 'text-red-600', icon: AlertTriangle }
}

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [activities, setActivities] = useState<AgentActivity[]>(mockActivities)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'paused' : 'active' }
        : agent
    ))
  }

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAgent = selectedAgent === 'all' || activity.agentId === selectedAgent
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter
    return matchesSearch && matchesAgent && matchesStatus
  })

  const agentStats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    busy: agents.filter(a => a.status === 'busy').length,
    avgAccuracy: (agents.reduce((sum, a) => sum + a.kpis.accuracy, 0) / agents.length).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-purple-600" />
            </motion.div>
            <GradientText from="from-purple-600" to="to-blue-600">
              AI Agents Mission Control
            </GradientText>
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring and control of autonomous AI agents in the logistics network
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
            </motion.div>
            Refresh
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <MotionDiv
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="font-bold text-2xl">{agentStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Agents</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-bold text-2xl">{agentStats.active}</div>
            <div className="text-sm text-muted-foreground">Active Agents</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="font-bold text-2xl">{agentStats.busy}</div>
            <div className="text-sm text-muted-foreground">Busy Agents</div>
          </TiltCard>
        </motion.div>
        
        <motion.div variants={staggerItem}>
          <TiltCard className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="font-bold text-2xl">{agentStats.avgAccuracy}%</div>
            <div className="text-sm text-muted-foreground">Avg Accuracy</div>
          </TiltCard>
        </motion.div>
      </MotionDiv>

      {/* Agent Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Agent Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const StatusIcon = statusConfig[agent.status].icon
              return (
                <motion.div key={agent.id} whileHover={{ y: -5 }}>
                  <TiltCard>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{agent.avatar}</div>
                            <div>
                              <h3 className="font-semibold">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">{agent.role}</p>
                            </div>
                          </div>
                          <Badge className={statusConfig[agent.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {agent.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Accuracy</span>
                            <span className="font-medium text-green-600">{agent.kpis.accuracy}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Response Time</span>
                            <span className="font-medium">{agent.kpis.responseTime}s</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Success Rate</span>
                            <span className="font-medium text-blue-600">{agent.kpis.successRate}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Actions Today</span>
                            <span className="font-medium text-purple-600">{agent.kpis.actionsToday}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {agent.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Last: {agent.lastAction}</span>
                          <Button
                            size="sm"
                            variant={agent.status === 'active' ? 'outline' : 'default'}
                            onClick={() => toggleAgentStatus(agent.id)}
                          >
                            {agent.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Real-Time Activity Feed
          </CardTitle>
          
          {/* Activity Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {filteredActivities.map((activity, index) => {
                const StatusIcon = activityStatusConfig[activity.status].icon
                const isExpanded = expandedActivity === activity.id
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <StatusIcon className={`w-5 h-5 ${activityStatusConfig[activity.status].color} mt-0.5`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{activity.agentName}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                            {activity.confidence && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {activity.confidence}% confidence
                                </Badge>
                              </>
                            )}
                          </div>
                          <div className="font-medium text-sm mb-1">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.details}</div>
                          
                          {activity.collaboration && activity.collaboration.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <Network className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-muted-foreground">
                                Collaborating with {activity.collaboration.length} agent(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {activity.reasoning && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedActivity(isExpanded ? null : activity.id)}
                          >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Reasoning */}
                    <AnimatePresence>
                      {isExpanded && activity.reasoning && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pl-8 border-l-2 border-blue-200 dark:border-blue-800"
                        >
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">AI Reasoning</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.reasoning}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Agent Collaboration View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Agent Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockCollaborations.map((collab) => (
              <div key={collab.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Package {collab.packageId}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  {collab.agents.map((agent, index) => (
                    <React.Fragment key={agent.agentId}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          agent.status === 'completed' ? 'bg-green-100 text-green-600' :
                          agent.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Bot className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{agent.agentName}</div>
                          <div className="text-xs text-muted-foreground">{agent.action}</div>
                          <div className="text-xs text-muted-foreground">{agent.timestamp}</div>
                        </div>
                      </div>
                      
                      {index < collab.agents.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
