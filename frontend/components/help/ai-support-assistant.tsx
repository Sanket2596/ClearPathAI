'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  User, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  Copy,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  Zap,
  BookOpen,
  Package,
  Users,
  Settings,
  AlertCircle
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: {
    title: string
    url: string
    type: 'article' | 'log' | 'setting'
  }[]
  helpful?: boolean
}

interface QuickAction {
  id: string
  label: string
  icon: any
  prompt: string
  category: string
}

const quickActions: QuickAction[] = [
  {
    id: 'package-status',
    label: 'Check Package Status',
    icon: Package,
    prompt: 'How do I check the status of package PCK123?',
    category: 'packages'
  },
  {
    id: 'invite-user',
    label: 'Invite Team Member',
    icon: Users,
    prompt: 'How do I invite a new team member to ClearPath AI?',
    category: 'users'
  },
  {
    id: 'anomaly-threshold',
    label: 'Anomaly Thresholds',
    icon: AlertCircle,
    prompt: 'How do I adjust anomaly detection thresholds?',
    category: 'agents'
  },
  {
    id: 'export-report',
    label: 'Export Reports',
    icon: BookOpen,
    prompt: 'How do I export analytics reports?',
    category: 'analytics'
  },
  {
    id: 'integration-setup',
    label: 'Setup Integration',
    icon: Settings,
    prompt: 'How do I set up a new integration?',
    category: 'settings'
  },
  {
    id: 'lost-package',
    label: 'Lost Package Recovery',
    icon: Bot,
    prompt: 'How does AI agent recover lost packages?',
    category: 'agents'
  }
]

const sampleResponses = {
  'How do I check the status of package PCK123?': {
    content: `To check the status of package PCK123, you can:

1. **Navigate to the Packages tab** in your dashboard
2. **Use the search bar** to enter "PCK123"
3. **Click on the package** to view detailed status information

The package status will show:
- Current location and timestamp
- Delivery progress
- Any anomalies detected
- AI agent actions taken

You can also set up **real-time notifications** for status changes in your notification settings.`,
    sources: [
      { title: 'Package Tracking Fundamentals', url: '/help/package-tracking-basics', type: 'article' as const },
      { title: 'Package Status Codes Reference', url: '/help/package-status-codes', type: 'article' as const }
    ]
  },
  'How do I invite a new team member to ClearPath AI?': {
    content: `To invite a new team member:

1. **Go to Users tab** → **Invites & Onboarding**
2. **Click "Invite User"** button
3. **Enter their email address** and select role:
   - **Viewer**: Read-only access
   - **Operator**: Can manage packages and view reports
   - **Admin**: Full access including settings
4. **Add custom welcome message** (optional)
5. **Click "Send Invitation"**

The new user will receive an email with setup instructions. You can track invitation status in the Invites section.`,
    sources: [
      { title: 'User Onboarding Guide', url: '/help/user-onboarding', type: 'article' as const },
      { title: 'User Roles and Permissions', url: '/help/user-roles-permissions', type: 'article' as const }
    ]
  },
  'How do I adjust anomaly detection thresholds?': {
    content: `To adjust anomaly detection thresholds:

1. **Navigate to Settings** → **AI Agents**
2. **Find "Anomaly Detection"** section
3. **Configure thresholds**:
   - **Delay Threshold**: Time before flagging delays (default: 2 hours)
   - **Route Deviation**: Distance from expected route (default: 5 miles)
   - **Temperature Variance**: For sensitive packages (default: ±3°C)
4. **Test settings** with historical data
5. **Save configuration**

**Pro tip**: Start with conservative thresholds and adjust based on false positive rates.`,
    sources: [
      { title: 'Understanding Anomaly Detection Thresholds', url: '/help/anomaly-detection-thresholds', type: 'article' as const },
      { title: 'AI Agent Configuration', url: '/help/ai-agent-configuration', type: 'setting' as const }
    ]
  }
}

export function AISupportAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm your AI support assistant. I can help you with questions about ClearPath AI, from package tracking to user management. What would you like to know?",
      timestamp: new Date(),
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = sampleResponses[message as keyof typeof sampleResponses]
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response?.content || `I understand you're asking about "${message}". Let me help you with that.

This is a simulated response. In a real implementation, this would:
- Search through your knowledge base
- Check system logs for relevant information  
- Provide personalized answers based on your setup
- Offer to connect you with human support if needed

Would you like me to create a support ticket for more detailed assistance?`,
        timestamp: new Date(),
        sources: response?.sources || []
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt)
  }

  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    // In a real implementation, this would integrate with speech recognition
  }

  const handleFeedback = (messageId: string, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    )
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">AI Support Assistant</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get instant answers to your questions about ClearPath AI. I can search through documentation, 
          system logs, and provide personalized assistance.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Powered by ClearPath AI
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'assistant' && (
                      <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                        <AvatarFallback>
                          <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        
                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                            <div className="space-y-1">
                              {message.sources.map((source, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <ExternalLink className="w-3 h-3" />
                                  <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                    {source.title}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {source.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Message Actions */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        
                        {message.type === 'assistant' && (
                          <div className="flex items-center gap-2 ml-auto">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-6 px-2 ${message.helpful === true ? 'text-green-600' : ''}`}
                              onClick={() => handleFeedback(message.id, true)}
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-6 px-2 ${message.helpful === false ? 'text-red-600' : ''}`}
                              onClick={() => handleFeedback(message.id, false)}
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                      <AvatarFallback>
                        <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    placeholder="Ask me anything about ClearPath AI..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={handleVoiceToggle}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => handleQuickAction(action)}
                >
                  <action.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {action.prompt}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Assistant Stats */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Assistant Stats
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  &lt; 2 seconds
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accuracy</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  94.2%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Knowledge Base</span>
                <Badge variant="outline">
                  150+ articles
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Languages</span>
                <Badge variant="outline">
                  12 supported
                </Badge>
              </div>
            </div>
          </Card>

          {/* Need Human Help? */}
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-lg text-orange-700 dark:text-orange-300">
                Need Human Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-sm text-orange-600 dark:text-orange-400 mb-3">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Create Support Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
