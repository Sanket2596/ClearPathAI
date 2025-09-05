'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FloatingCard } from '@/components/ui/motion-components'
import { 
  Bot, 
  Activity, 
  Pause, 
  CheckCircle,
  AlertTriangle,
  Search,
  MessageSquare,
  Eye
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  status: 'active' | 'idle' | 'error'
  currentTask: string | null
  performance: number
}

interface ActiveAgentsPanelProps {
  agents: Agent[]
}

const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Investigator Agent',
    status: 'active',
    currentTask: 'Analyzing PKG123456 routing anomaly',
    performance: 94,
  },
  {
    id: 'agent-2',
    name: 'Recovery Agent',
    status: 'active',
    currentTask: 'Coordinating reroute for 3 packages',
    performance: 87,
  },
  {
    id: 'agent-3',
    name: 'Customer Agent',
    status: 'idle',
    currentTask: null,
    performance: 96,
  },
  {
    id: 'agent-4',
    name: 'Evidence Agent',
    status: 'active',
    currentTask: 'Processing CCTV footage from Hub B',
    performance: 91,
  },
]

const agentIcons = {
  'Investigator Agent': Search,
  'Recovery Agent': CheckCircle,
  'Customer Agent': MessageSquare,
  'Evidence Agent': Eye,
}

export function ActiveAgentsPanel({ agents = mockAgents }: ActiveAgentsPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'idle':
        return 'text-yellow-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-green-500" />
      case 'idle':
        return <Pause className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Bot className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {agents.map((agent, index) => {
        const IconComponent = agentIcons[agent.name as keyof typeof agentIcons] || Bot
        
        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <FloatingCard delay={index * 0.1}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconComponent className="w-5 h-5 text-primary" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(agent.status)}
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${getStatusColor(agent.status)}`}
                          >
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPerformanceColor(agent.performance)}`}>
                        {agent.performance}%
                      </div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Performance Score</span>
                      <span className="text-sm text-muted-foreground">{agent.performance}%</span>
                    </div>
                    <Progress 
                      value={agent.performance} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Current Task</div>
                    {agent.currentTask ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3"
                      >
                        {agent.currentTask}
                        {agent.status === 'active' && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-2 text-primary"
                          >
                            ●
                          </motion.span>
                        )}
                      </motion.div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No active tasks
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {Math.floor(Math.random() * 50) + 20}
                      </div>
                      <div className="text-xs text-muted-foreground">Tasks Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {Math.floor(Math.random() * 10) + 5}m
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FloatingCard>
          </motion.div>
        )
      })}
    </div>
  )
}
