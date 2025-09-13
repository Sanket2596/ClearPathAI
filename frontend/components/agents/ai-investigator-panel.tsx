'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useWebSocket } from '@/hooks/use-websocket'
import { 
  Bot, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Brain,
  Activity,
  Zap,
  RefreshCw
} from 'lucide-react'

interface InvestigationResult {
  investigation_id: string
  package_id: string
  investigation_type: string
  findings: string[]
  recommendations: string[]
  confidence_score: number
  priority: string
  estimated_resolution_time?: string
  next_actions: string[]
  created_at: string
}

interface AgentActivity {
  agent_id: string
  action: string
  package_id?: string
  status: string
  performance_metrics?: any
}

export function AIInvestigatorPanel() {
  const { isConnected, lastMessage, subscribe, unsubscribe } = useWebSocket()
  const [investigations, setInvestigations] = useState<InvestigationResult[]>([])
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState('')
  const [investigationType, setInvestigationType] = useState('anomaly_analysis')
  const [anomalyDescription, setAnomalyDescription] = useState('')
  const [severity, setSeverity] = useState('medium')

  // Subscribe to agent activities
  useEffect(() => {
    if (isConnected) {
      subscribe('agent_activity')
      subscribe('recovery_suggestions')
    }

    return () => {
      if (isConnected) {
        unsubscribe('agent_activity')
        unsubscribe('recovery_suggestions')
      }
    }
  }, [isConnected, subscribe, unsubscribe])

  // Handle real-time messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'agent_activity':
          handleAgentActivity(lastMessage.data)
          break
        case 'recovery_suggestion':
          handleRecoverySuggestion(lastMessage.data)
          break
      }
    }
  }, [lastMessage])

  const handleAgentActivity = (data: AgentActivity) => {
    setAgentActivities(prev => [data, ...prev.slice(0, 9)]) // Keep last 10 activities
  }

  const handleRecoverySuggestion = (data: any) => {
    if (data.ai_suggestion?.agent_id === 'investigator_agent') {
      // This is an investigation result
      const investigation: InvestigationResult = {
        investigation_id: data.ai_suggestion.investigation_id,
        package_id: data.package_id,
        investigation_type: 'anomaly_analysis',
        findings: data.ai_suggestion.findings || [],
        recommendations: data.ai_suggestion.recommendations || [],
        confidence_score: data.ai_suggestion.confidence || 0,
        priority: data.ai_suggestion.priority || 'medium',
        estimated_resolution_time: data.ai_suggestion.estimated_resolution,
        next_actions: data.ai_suggestion.next_actions || [],
        created_at: new Date().toISOString()
      }
      
      setInvestigations(prev => [investigation, ...prev.slice(0, 9)]) // Keep last 10 investigations
    }
  }

  const startInvestigation = async () => {
    if (!selectedPackageId.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/agents/investigate/anomaly/' + selectedPackageId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anomaly_type: investigationType,
          severity: severity,
          description: anomalyDescription,
          current_status: 'in_transit'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setInvestigations(prev => [result, ...prev.slice(0, 9)])
        
        // Clear form
        setSelectedPackageId('')
        setAnomalyDescription('')
      } else {
        console.error('Investigation failed:', await response.text())
      }
    } catch (error) {
      console.error('Error starting investigation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Agent Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Investigator Agent
            <div className="flex items-center gap-2 ml-auto">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{investigations.length}</div>
              <div className="text-sm text-gray-600">Active Investigations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{agentActivities.length}</div>
              <div className="text-sm text-gray-600">Agent Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {investigations.length > 0 ? 
                  (investigations.reduce((sum, inv) => sum + inv.confidence_score, 0) / investigations.length * 100).toFixed(0) + '%' 
                  : '0%'
                }
              </div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Investigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Start Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Package ID</label>
                <Input
                  placeholder="Enter package ID"
                  value={selectedPackageId}
                  onChange={(e) => setSelectedPackageId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Investigation Type</label>
                <Select value={investigationType} onValueChange={setInvestigationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anomaly_analysis">Anomaly Analysis</SelectItem>
                    <SelectItem value="delay_investigation">Delay Investigation</SelectItem>
                    <SelectItem value="route_optimization">Route Optimization</SelectItem>
                    <SelectItem value="predictive_analysis">Predictive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Severity</label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Brief description of the issue"
                  value={anomalyDescription}
                  onChange={(e) => setAnomalyDescription(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              onClick={startInvestigation} 
              disabled={isLoading || !selectedPackageId.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Investigating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start AI Investigation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Investigations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Investigations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investigations.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No investigations yet</p>
                <p className="text-sm text-gray-400">Start an investigation to see results here</p>
              </div>
            ) : (
              investigations.map((investigation) => (
                <div key={investigation.investigation_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Package {investigation.package_id}</h3>
                      <Badge className={getPriorityColor(investigation.priority)}>
                        {investigation.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getConfidenceColor(investigation.confidence_score)}`}>
                        {(investigation.confidence_score * 100).toFixed(0)}% confidence
                      </span>
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(investigation.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Findings</h4>
                      <ul className="space-y-1">
                        {investigation.findings.slice(0, 3).map((finding, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-600 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {investigation.recommendations.slice(0, 3).map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {investigation.estimated_resolution_time && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Estimated resolution: {investigation.estimated_resolution_time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Agent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agentActivities.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No agent activities yet</p>
              </div>
            ) : (
              agentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.action.replace('_', ' ').toUpperCase()}
                      {activity.package_id && ` - Package ${activity.package_id}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Agent: {activity.agent_id} | Status: {activity.status}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
