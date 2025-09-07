'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  Clock,
  User,
  Tag,
  Star,
  Award,
  Lightbulb,
  Zap,
  Package,
  Bot,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  ExternalLink,
  Pin,
  MessageCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    badge?: string
    reputation: number
  }
  category: 'general' | 'packages' | 'ai-agents' | 'analytics' | 'integrations' | 'feature-requests'
  tags: string[]
  upvotes: number
  downvotes: number
  replies: number
  views: number
  createdAt: Date
  lastActivity: Date
  isPinned?: boolean
  isSolved?: boolean
  userVote?: 'up' | 'down' | null
}

interface FeatureRequest {
  id: string
  title: string
  description: string
  category: 'ui-ux' | 'ai-agents' | 'analytics' | 'mobile' | 'integrations' | 'performance'
  status: 'submitted' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  upvotes: number
  author: {
    name: string
    avatar?: string
  }
  createdAt: Date
  estimatedDelivery?: Date
  tags: string[]
  comments: number
  userVote?: boolean
}

const forumPosts: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Best practices for AI agent configuration in high-volume environments',
    content: 'We\'re processing 50k+ packages daily and looking for optimal AI agent settings. What thresholds work best for your operation?',
    author: {
      name: 'Sarah Mitchell',
      badge: 'Expert',
      reputation: 2450
    },
    category: 'ai-agents',
    tags: ['configuration', 'high-volume', 'best-practices'],
    upvotes: 24,
    downvotes: 2,
    replies: 8,
    views: 156,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isPinned: true,
    isSolved: true,
    userVote: 'up'
  },
  {
    id: 'post-2',
    title: 'Integration with Shopify - Package status not syncing',
    content: 'Having issues with package status updates not reflecting in our Shopify store. The webhook seems to be working but status remains "Processing".',
    author: {
      name: 'Mike Chen',
      reputation: 890
    },
    category: 'integrations',
    tags: ['shopify', 'webhook', 'status-sync'],
    upvotes: 15,
    downvotes: 0,
    replies: 12,
    views: 89,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    isSolved: false
  },
  {
    id: 'post-3',
    title: 'Feature Request: Dark mode for mobile app',
    content: 'Would love to see dark mode support in the mobile application. Many of our warehouse staff work in low-light conditions.',
    author: {
      name: 'Alex Rodriguez',
      reputation: 1200
    },
    category: 'feature-requests',
    tags: ['mobile', 'dark-mode', 'ui-ux'],
    upvotes: 67,
    downvotes: 3,
    replies: 15,
    views: 234,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userVote: 'up'
  },
  {
    id: 'post-4',
    title: 'Analytics dashboard loading slowly after recent update',
    content: 'Since the latest update, our analytics dashboard takes 10-15 seconds to load. Anyone else experiencing this?',
    author: {
      name: 'Lisa Wang',
      badge: 'Contributor',
      reputation: 1680
    },
    category: 'analytics',
    tags: ['performance', 'dashboard', 'loading'],
    upvotes: 8,
    downvotes: 1,
    replies: 6,
    views: 45,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
]

const featureRequests: FeatureRequest[] = [
  {
    id: 'req-1',
    title: 'Bulk package import via CSV',
    description: 'Ability to import multiple packages at once using CSV file upload, including custom fields and tracking numbers.',
    category: 'ui-ux',
    status: 'planned',
    priority: 'high',
    upvotes: 156,
    author: {
      name: 'David Kim'
    },
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    tags: ['import', 'csv', 'bulk-operations'],
    comments: 23,
    userVote: true
  },
  {
    id: 'req-2',
    title: 'AI-powered delivery time predictions',
    description: 'Use machine learning to predict accurate delivery times based on historical data, weather, and traffic conditions.',
    category: 'ai-agents',
    status: 'in_progress',
    priority: 'high',
    upvotes: 234,
    author: {
      name: 'Emma Wilson'
    },
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    tags: ['ai', 'predictions', 'delivery-time'],
    comments: 41,
    userVote: true
  },
  {
    id: 'req-3',
    title: 'Custom dashboard widgets',
    description: 'Allow users to create custom widgets and arrange their dashboard layout according to their specific needs.',
    category: 'analytics',
    status: 'under_review',
    priority: 'medium',
    upvotes: 89,
    author: {
      name: 'John Thompson'
    },
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    tags: ['dashboard', 'customization', 'widgets'],
    comments: 15
  },
  {
    id: 'req-4',
    title: 'Offline mode for mobile app',
    description: 'Enable basic functionality in the mobile app when internet connection is unavailable, with sync when connection is restored.',
    category: 'mobile',
    status: 'submitted',
    priority: 'medium',
    upvotes: 67,
    author: {
      name: 'Maria Garcia'
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    tags: ['mobile', 'offline', 'sync'],
    comments: 8
  }
]

const categories = [
  { id: 'general', label: 'General Discussion', icon: MessageSquare, count: 45 },
  { id: 'packages', label: 'Package Tracking', icon: Package, count: 32 },
  { id: 'ai-agents', label: 'AI Agents', icon: Bot, count: 28 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 19 },
  { id: 'integrations', label: 'Integrations', icon: SettingsIcon, count: 15 },
  { id: 'feature-requests', label: 'Feature Requests', icon: Lightbulb, count: 67 }
]

const statusConfig = {
  submitted: { label: 'Submitted', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' },
  under_review: { label: 'Under Review', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  planned: { label: 'Planned', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' }
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' }
}

export function CommunityFeedback() {
  const [activeTab, setActiveTab] = useState('forum')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false)
  
  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general' as const,
    tags: [] as string[]
  })
  
  // New feature request form state
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'ui-ux' as const,
    priority: 'medium' as const,
    tags: [] as string[]
  })

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredRequests = featureRequests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    // In a real app, this would make an API call
    console.log(`Voted ${voteType} on post ${postId}`)
  }

  const handleFeatureVote = (requestId: string) => {
    // In a real app, this would make an API call
    console.log(`Voted on feature request ${requestId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Community & Feedback</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with other ClearPath AI users, share knowledge, ask questions, 
          and help shape the future of our platform.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="forum" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Community Forum
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Feature Requests
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {activeTab === 'forum' ? (
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="What's your question or topic?"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newPost.category} onValueChange={(value: any) => setNewPost(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center gap-2">
                                  <category.icon className="w-4 h-4" />
                                  {category.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <Input
                          placeholder="Add tags (comma separated)"
                          onChange={(e) => setNewPost(prev => ({ 
                            ...prev, 
                            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        placeholder="Provide details about your question or share your knowledge..."
                        rows={6}
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        disabled={!newPost.title || !newPost.content}
                        onClick={() => setIsCreatePostOpen(false)}
                      >
                        Create Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isCreateRequestOpen} onOpenChange={setIsCreateRequestOpen}>
                <DialogTrigger>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Submit Feature Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Feature Title</Label>
                      <Input
                        placeholder="What feature would you like to see?"
                        value={newRequest.title}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={newRequest.category} onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ui-ux">UI/UX</SelectItem>
                            <SelectItem value="ai-agents">AI Agents</SelectItem>
                            <SelectItem value="analytics">Analytics</SelectItem>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="integrations">Integrations</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={newRequest.priority} onValueChange={(value: any) => setNewRequest(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the feature in detail. How would it help you? What problem does it solve?"
                        rows={6}
                        value={newRequest.description}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateRequestOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        disabled={!newRequest.title || !newRequest.description}
                        onClick={() => setIsCreateRequestOpen(false)}
                      >
                        Submit Request
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Forum Tab */}
        <TabsContent value="forum" className="space-y-6">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                        <Badge variant="outline" className="ml-auto">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="unanswered">Unanswered</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`p-1 ${post.userVote === 'up' ? 'text-green-600' : ''}`}
                      onClick={() => handleVote(post.id, 'up')}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-sm">{post.upvotes - post.downvotes}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`p-1 ${post.userVote === 'down' ? 'text-red-600' : ''}`}
                      onClick={() => handleVote(post.id, 'down')}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.isPinned && <Pin className="w-4 h-4 text-blue-600" />}
                        {post.isSolved && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        <h3 className="font-medium text-lg">{post.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {categories.find(c => c.id === post.category)?.label}
                        </Badge>
                        {post.author.badge && (
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            <Award className="w-3 h-3 mr-1" />
                            {post.author.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{post.author.reputation}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeSince(post.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views} views
                        </span>
                        <span>Last activity {getTimeSince(post.lastActivity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Feature Requests Tab */}
        <TabsContent value="features" className="space-y-6">
          {/* Search */}
          <Card className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search feature requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select defaultValue="popular">
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Feature Requests */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`p-1 ${request.userVote ? 'text-blue-600' : ''}`}
                      onClick={() => handleFeatureVote(request.id)}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-sm">{request.upvotes}</span>
                    <span className="text-xs text-muted-foreground">votes</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-lg">{request.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[request.status].color}>
                          {statusConfig[request.status].label}
                        </Badge>
                        <Badge className={priorityConfig[request.priority].color}>
                          {priorityConfig[request.priority].label}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {request.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="w-2 h-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={request.author.avatar} />
                            <AvatarFallback>{request.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{request.author.name}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {getTimeSince(request.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {request.comments} comments
                        </span>
                      </div>
                      
                      {request.estimatedDelivery && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Est. delivery: {request.estimatedDelivery.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Community Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1,247</div>
          <div className="text-sm text-muted-foreground">Community Members</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">89</div>
          <div className="text-sm text-muted-foreground">Active Discussions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">156</div>
          <div className="text-sm text-muted-foreground">Feature Requests</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">23</div>
          <div className="text-sm text-muted-foreground">Features Delivered</div>
        </Card>
      </div>
    </div>
  )
}
