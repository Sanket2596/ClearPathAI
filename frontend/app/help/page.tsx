'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GradientText } from '@/components/ui/gradient-text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Bot, 
  Ticket, 
  Phone, 
  Activity, 
  MessageSquare, 
  GraduationCap,
  HelpCircle,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  Users,
  Sparkles
} from 'lucide-react'

// Import components we'll create
import { KnowledgeBase } from '@/components/help/knowledge-base'
import { AISupportAssistant } from '@/components/help/ai-support-assistant'
import { TicketingSystem } from '@/components/help/ticketing-system'
import { LiveSupportOptions } from '@/components/help/live-support-options'
import { SystemStatusPage } from '@/components/help/system-status-page'
import { CommunityFeedback } from '@/components/help/community-feedback'
import { TrainingCertification } from '@/components/help/training-certification'

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('knowledge-base')

  // Quick stats for the header
  const stats = [
    { label: 'Articles', value: '150+', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Avg Response', value: '< 2h', icon: Clock, color: 'text-green-600' },
    { label: 'Satisfaction', value: '98%', icon: CheckCircle, color: 'text-purple-600' },
    { label: 'Active Users', value: '2.5k+', icon: Users, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
            <HelpCircle className="w-4 h-4 mr-2" />
            Enterprise Support Center
          </Badge>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">
          <GradientText from="from-blue-600" to="to-purple-600">
            Help & Support
          </GradientText>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get the help you need with our comprehensive self-service resources, 
          AI-powered assistance, and dedicated support team
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center border-primary/10">
              <CardContent className="p-0">
                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Support Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-muted/30">
          <TabsTrigger value="knowledge-base" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Knowledge Base</span>
            <span className="sm:hidden">Docs</span>
          </TabsTrigger>
          
          <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span className="sm:hidden">AI</span>
          </TabsTrigger>
          
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Support Tickets</span>
            <span className="sm:hidden">Tickets</span>
          </TabsTrigger>
          
          <TabsTrigger value="live-support" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Live Support</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>
          
          <TabsTrigger value="system-status" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">System Status</span>
            <span className="sm:hidden">Status</span>
          </TabsTrigger>
          
          <TabsTrigger value="community" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Community</span>
            <span className="sm:hidden">Forum</span>
          </TabsTrigger>
          
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Training</span>
            <span className="sm:hidden">Learn</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="knowledge-base" className="space-y-6">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <AISupportAssistant />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <TicketingSystem />
        </TabsContent>

        <TabsContent value="live-support" className="space-y-6">
          <LiveSupportOptions />
        </TabsContent>

        <TabsContent value="system-status" className="space-y-6">
          <SystemStatusPage />
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <CommunityFeedback />
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <TrainingCertification />
        </TabsContent>
      </Tabs>

      {/* Quick Action Cards at Bottom */}
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Sparkles className="w-5 h-5" />
              Need Immediate Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-blue-600 dark:text-blue-400 mb-4">
              Our AI assistant can help you find answers instantly, or connect you with our support team.
            </p>
            <Button 
              onClick={() => setActiveTab('ai-assistant')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Bot className="w-4 h-4 mr-2" />
              Chat with AI Assistant
            </Button>
          </CardContent>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Phone className="w-5 h-5" />
              Critical Issue?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-purple-600 dark:text-purple-400 mb-4">
              For urgent matters affecting your operations, reach out to our dedicated support team immediately.
            </p>
            <Button 
              onClick={() => setActiveTab('live-support')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact Live Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
