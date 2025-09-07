'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Globe, 
  Calendar, 
  ExternalLink,
  Send,
  Paperclip,
  Mic,
  Video,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  HeadphonesIcon,
  MessageSquare,
  PhoneCall
} from 'lucide-react'

interface SupportAgent {
  id: string
  name: string
  avatar?: string
  role: string
  status: 'online' | 'busy' | 'offline'
  specialties: string[]
  languages: string[]
  responseTime: string
}

interface SupportChannel {
  id: string
  name: string
  description: string
  icon: any
  availability: string
  responseTime: string
  status: 'available' | 'busy' | 'offline'
  contactInfo?: string
}

const supportAgents: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Chen',
    role: 'Senior Support Engineer',
    status: 'online',
    specialties: ['AI Agents', 'Anomaly Detection', 'System Integration'],
    languages: ['English', 'Mandarin'],
    responseTime: '< 5 min'
  },
  {
    id: 'agent-2',
    name: 'Mike Rodriguez',
    role: 'Technical Support Lead',
    status: 'online',
    specialties: ['Package Tracking', 'API Integration', 'Mobile App'],
    languages: ['English', 'Spanish'],
    responseTime: '< 3 min'
  },
  {
    id: 'agent-3',
    name: 'Alex Thompson',
    role: 'Customer Success Manager',
    status: 'busy',
    specialties: ['User Onboarding', 'Training', 'Best Practices'],
    languages: ['English', 'French'],
    responseTime: '< 10 min'
  },
  {
    id: 'agent-4',
    name: 'Lisa Wang',
    role: 'Support Engineer',
    status: 'online',
    specialties: ['Analytics', 'Reporting', 'Data Export'],
    languages: ['English', 'Mandarin', 'Japanese'],
    responseTime: '< 7 min'
  }
]

const supportChannels: SupportChannel[] = [
  {
    id: 'live-chat',
    name: 'Live Chat',
    description: 'Real-time chat with our support team for immediate assistance',
    icon: MessageCircle,
    availability: '24/7',
    responseTime: '< 2 minutes',
    status: 'available'
  },
  {
    id: 'phone-support',
    name: 'Phone Support',
    description: 'Direct phone line to our technical support team',
    icon: Phone,
    availability: '9am - 7pm EST (Mon-Fri)',
    responseTime: 'Immediate',
    status: 'available',
    contactInfo: '+1 (555) 123-4567'
  },
  {
    id: 'email-support',
    name: 'Email Support',
    description: 'Detailed support via email with comprehensive documentation',
    icon: Mail,
    availability: '24/7',
    responseTime: '< 4 hours',
    status: 'available',
    contactInfo: 'support@clearpathai.com'
  },
  {
    id: 'video-call',
    name: 'Video Support',
    description: 'Screen sharing and video calls for complex technical issues',
    icon: Video,
    availability: '9am - 6pm EST (Mon-Fri)',
    responseTime: '< 15 minutes',
    status: 'available'
  },
  {
    id: 'emergency-hotline',
    name: 'Emergency Hotline',
    description: 'Critical issues affecting operations (Premium customers only)',
    icon: AlertCircle,
    availability: '24/7',
    responseTime: '< 5 minutes',
    status: 'available',
    contactInfo: '+1 (555) 911-HELP'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'busy': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

const getChannelStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
    case 'busy': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
    case 'offline': return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
    default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function LiveSupportOptions() {
  const [selectedChannel, setSelectedChannel] = useState<SupportChannel | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<SupportAgent | null>(null)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium',
    preferredContact: 'email'
  })

  const onlineAgents = supportAgents.filter(agent => agent.status === 'online')
  const busyAgents = supportAgents.filter(agent => agent.status === 'busy')

  const handleChannelSelect = (channel: SupportChannel) => {
    setSelectedChannel(channel)
    
    if (channel.id === 'live-chat') {
      setIsChatOpen(true)
    } else if (channel.id === 'phone-support') {
      window.open(`tel:${channel.contactInfo}`)
    } else if (channel.id === 'email-support') {
      window.open(`mailto:${channel.contactInfo}`)
    }
  }

  const handleStartChat = (agent: SupportAgent) => {
    setSelectedAgent(agent)
    setIsChatOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full">
            <HeadphonesIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Live Support</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with our expert support team through multiple channels. 
          We're here to help you resolve issues quickly and efficiently.
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportChannels.map((channel) => {
          const ChannelIcon = channel.icon
          return (
            <Card 
              key={channel.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleChannelSelect(channel)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <ChannelIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <Badge className={getChannelStatusColor(channel.status)}>
                        {channel.status}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {channel.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="font-medium">{channel.availability}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-medium text-green-600">{channel.responseTime}</span>
                  </div>
                  {channel.contactInfo && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="font-medium font-mono text-sm">{channel.contactInfo}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Available Agents */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Available Support Agents
          </CardTitle>
          <p className="text-muted-foreground">
            Our expert team is ready to help you with personalized support
          </p>
        </CardHeader>
        
        <div className="space-y-6">
          {/* Online Agents */}
          {onlineAgents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-medium text-green-600">Online Now ({onlineAgents.length})</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {onlineAgents.map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-background`}></div>
                        </div>
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStartChat(agent)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Specialties: </span>
                        <span>{agent.specialties.slice(0, 2).join(', ')}</span>
                        {agent.specialties.length > 2 && <span className="text-muted-foreground"> +{agent.specialties.length - 2} more</span>}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Languages: </span>
                        <span>{agent.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Avg response: </span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {agent.responseTime}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Busy Agents */}
          {busyAgents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <h3 className="font-medium text-yellow-600">Currently Busy ({busyAgents.length})</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {busyAgents.map((agent) => (
                  <Card key={agent.id} className="p-4 opacity-75">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={agent.avatar} />
                            <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(agent.status)} rounded-full border-2 border-background`}></div>
                        </div>
                        <div>
                          <h4 className="font-medium">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="w-4 h-4 mr-1" />
                        Busy
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Specialties: </span>
                        <span>{agent.specialties.slice(0, 2).join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Expected availability: </span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          {agent.responseTime}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Contact Form */}
      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Support Team
          </CardTitle>
          <p className="text-muted-foreground">
            Can't find an available agent? Send us a message and we'll get back to you quickly.
          </p>
        </CardHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@company.com"
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={contactForm.priority} onValueChange={(value) => setContactForm(prev => ({ ...prev, priority: value }))}>
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
              
              <div className="space-y-2">
                <Label>Preferred Contact</Label>
                <Select value={contactForm.preferredContact} onValueChange={(value) => setContactForm(prev => ({ ...prev, preferredContact: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="chat">Live Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                rows={8}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Paperclip className="w-4 h-4 mr-2" />
                Attach Files
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Support Hours & SLA */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Live Chat & Phone</span>
              <Badge variant="outline">24/7</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Email Support</span>
              <Badge variant="outline">24/7</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Video Support</span>
              <Badge variant="outline">9am - 6pm EST</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Emergency Hotline</span>
              <Badge variant="outline" className="text-red-600 border-red-600">24/7</Badge>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Service Level Agreement
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Critical Issues</span>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                &lt; 1 hour
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>High Priority</span>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                &lt; 4 hours
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Medium Priority</span>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                &lt; 24 hours
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Low Priority</span>
              <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                &lt; 72 hours
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {selectedAgent ? `Chat with ${selectedAgent.name}` : 'Live Chat'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedAgent && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{selectedAgent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedAgent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAgent.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 ${getStatusColor(selectedAgent.status)} rounded-full`}></div>
                    <span className="text-xs text-muted-foreground">
                      Avg response: {selectedAgent.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-64 bg-muted/30 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Chat interface would appear here</p>
                <p className="text-sm text-muted-foreground">
                  This would integrate with your preferred chat solution
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <Button size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
