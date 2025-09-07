'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BookOpen, 
  Users, 
  Package, 
  Bot, 
  BarChart3, 
  Settings, 
  ExternalLink,
  Clock,
  Eye,
  ThumbsUp,
  Play,
  FileText,
  Image,
  Video
} from 'lucide-react'

interface Article {
  id: string
  title: string
  description: string
  category: 'users' | 'packages' | 'agents' | 'analytics' | 'settings'
  type: 'guide' | 'faq' | 'video' | 'diagram'
  readTime: string
  views: number
  likes: number
  tags: string[]
  lastUpdated: string
  content?: string
}

const knowledgeBaseArticles: Article[] = [
  // Users Category
  {
    id: 'user-onboarding',
    title: 'How to Onboard New Users',
    description: 'Complete guide to adding and managing new team members in ClearPath AI',
    category: 'users',
    type: 'guide',
    readTime: '5 min',
    views: 1250,
    likes: 89,
    tags: ['onboarding', 'team-management', 'getting-started'],
    lastUpdated: '2024-01-15',
    content: 'Step-by-step process for user onboarding...'
  },
  {
    id: 'user-roles-permissions',
    title: 'Understanding User Roles and Permissions',
    description: 'Learn about different user roles and how to configure permissions',
    category: 'users',
    type: 'guide',
    readTime: '7 min',
    views: 980,
    likes: 67,
    tags: ['roles', 'permissions', 'security'],
    lastUpdated: '2024-01-12',
    content: 'Detailed explanation of user roles...'
  },
  {
    id: 'team-collaboration',
    title: 'Setting Up Team Collaboration',
    description: 'Best practices for team collaboration and communication',
    category: 'users',
    type: 'video',
    readTime: '12 min',
    views: 756,
    likes: 45,
    tags: ['collaboration', 'teams', 'best-practices'],
    lastUpdated: '2024-01-10'
  },

  // Packages Category
  {
    id: 'package-tracking-basics',
    title: 'Package Tracking Fundamentals',
    description: 'Everything you need to know about tracking packages in ClearPath AI',
    category: 'packages',
    type: 'guide',
    readTime: '8 min',
    views: 2100,
    likes: 156,
    tags: ['tracking', 'packages', 'fundamentals'],
    lastUpdated: '2024-01-14',
    content: 'Comprehensive guide to package tracking...'
  },
  {
    id: 'lost-package-recovery',
    title: 'Lost Package Recovery Process',
    description: 'How our AI agents automatically recover lost packages',
    category: 'packages',
    type: 'guide',
    readTime: '6 min',
    views: 1800,
    likes: 134,
    tags: ['recovery', 'lost-packages', 'ai-agents'],
    lastUpdated: '2024-01-13'
  },
  {
    id: 'package-status-codes',
    title: 'Understanding Package Status Codes',
    description: 'Complete reference for all package status codes and their meanings',
    category: 'packages',
    type: 'faq',
    readTime: '4 min',
    views: 1456,
    likes: 98,
    tags: ['status-codes', 'reference', 'packages'],
    lastUpdated: '2024-01-11'
  },

  // AI Agents Category
  {
    id: 'ai-agent-overview',
    title: 'AI Agent System Overview',
    description: 'Understanding how AI agents work in ClearPath AI',
    category: 'agents',
    type: 'guide',
    readTime: '10 min',
    views: 1650,
    likes: 112,
    tags: ['ai-agents', 'overview', 'automation'],
    lastUpdated: '2024-01-16'
  },
  {
    id: 'anomaly-detection-thresholds',
    title: 'Understanding Anomaly Detection Thresholds',
    description: 'How to configure and interpret anomaly detection settings',
    category: 'agents',
    type: 'guide',
    readTime: '9 min',
    views: 890,
    likes: 67,
    tags: ['anomaly-detection', 'thresholds', 'configuration'],
    lastUpdated: '2024-01-09'
  },
  {
    id: 'ai-agent-training',
    title: 'Training Custom AI Agents',
    description: 'Advanced guide to training AI agents for specific workflows',
    category: 'agents',
    type: 'video',
    readTime: '15 min',
    views: 567,
    likes: 43,
    tags: ['training', 'custom-agents', 'advanced'],
    lastUpdated: '2024-01-08'
  },

  // Analytics Category
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard Guide',
    description: 'How to use the analytics dashboard effectively',
    category: 'analytics',
    type: 'guide',
    readTime: '7 min',
    views: 1340,
    likes: 89,
    tags: ['analytics', 'dashboard', 'reporting'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'exporting-reports',
    title: 'Exporting Analytics & Reports',
    description: 'Step-by-step guide to exporting data and generating reports',
    category: 'analytics',
    type: 'guide',
    readTime: '5 min',
    views: 1120,
    likes: 78,
    tags: ['export', 'reports', 'data'],
    lastUpdated: '2024-01-12'
  },
  {
    id: 'custom-metrics',
    title: 'Creating Custom Metrics',
    description: 'How to set up custom metrics and KPIs',
    category: 'analytics',
    type: 'guide',
    readTime: '8 min',
    views: 678,
    likes: 52,
    tags: ['custom-metrics', 'kpis', 'advanced'],
    lastUpdated: '2024-01-07'
  },

  // Settings Category
  {
    id: 'system-configuration',
    title: 'System Configuration Guide',
    description: 'Complete guide to configuring ClearPath AI settings',
    category: 'settings',
    type: 'guide',
    readTime: '12 min',
    views: 890,
    likes: 65,
    tags: ['configuration', 'settings', 'setup'],
    lastUpdated: '2024-01-14'
  },
  {
    id: 'integration-setup',
    title: 'Setting Up Integrations',
    description: 'How to connect ClearPath AI with your existing systems',
    category: 'settings',
    type: 'guide',
    readTime: '10 min',
    views: 1200,
    likes: 87,
    tags: ['integrations', 'api', 'setup'],
    lastUpdated: '2024-01-13'
  },
  {
    id: 'security-settings',
    title: 'Security Configuration',
    description: 'Best practices for securing your ClearPath AI instance',
    category: 'settings',
    type: 'guide',
    readTime: '9 min',
    views: 756,
    likes: 58,
    tags: ['security', 'configuration', 'best-practices'],
    lastUpdated: '2024-01-11'
  }
]

const categories = [
  { id: 'all', label: 'All Articles', icon: BookOpen, count: knowledgeBaseArticles.length },
  { id: 'users', label: 'Users', icon: Users, count: knowledgeBaseArticles.filter(a => a.category === 'users').length },
  { id: 'packages', label: 'Packages', icon: Package, count: knowledgeBaseArticles.filter(a => a.category === 'packages').length },
  { id: 'agents', label: 'AI Agents', icon: Bot, count: knowledgeBaseArticles.filter(a => a.category === 'agents').length },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, count: knowledgeBaseArticles.filter(a => a.category === 'analytics').length },
  { id: 'settings', label: 'Settings', icon: Settings, count: knowledgeBaseArticles.filter(a => a.category === 'settings').length },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'guide': return FileText
    case 'faq': return BookOpen
    case 'video': return Video
    case 'diagram': return Image
    default: return FileText
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'guide': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    case 'faq': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    case 'video': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    case 'diagram': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const filteredArticles = useMemo(() => {
    return knowledgeBaseArticles.filter(article => {
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
      const matchesType = selectedType === 'all' || article.type === selectedType
      
      return matchesSearch && matchesCategory && matchesType
    })
  }, [searchQuery, selectedCategory, selectedType])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <p className="text-muted-foreground">
          Comprehensive guides, FAQs, and resources to help you get the most out of ClearPath AI
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            <Button
              variant={selectedType === 'guide' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('guide')}
            >
              <FileText className="w-4 h-4 mr-1" />
              Guides
            </Button>
            <Button
              variant={selectedType === 'faq' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('faq')}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              FAQs
            </Button>
            <Button
              variant={selectedType === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('video')}
            >
              <Video className="w-4 h-4 mr-1" />
              Videos
            </Button>
            <Button
              variant={selectedType === 'diagram' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('diagram')}
            >
              <Image className="w-4 h-4 mr-1" />
              Diagrams
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Sort by Relevance
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => {
            const TypeIcon = getTypeIcon(article.type)
            return (
              <Card key={article.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className={getTypeColor(article.type)}>
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {article.type.toUpperCase()}
                    </Badge>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {article.likes}
                      </span>
                    </div>
                    <span>
                      Updated {new Date(article.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedType('all')
            }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* Popular Articles */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" />
              Most Popular Articles
            </CardTitle>
          </CardHeader>
          <div className="grid gap-3 md:grid-cols-2">
            {knowledgeBaseArticles
              .sort((a, b) => b.views - a.views)
              .slice(0, 6)
              .map((article) => (
                <div key={article.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Badge className={getTypeColor(article.type)} variant="outline">
                    {article.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{article.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {article.views.toLocaleString()} views • {article.readTime}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  )
}
