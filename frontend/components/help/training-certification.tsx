'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  GraduationCap, 
  Play, 
  BookOpen, 
  Award, 
  Clock, 
  Users, 
  CheckCircle2, 
  Lock,
  Star,
  Trophy,
  Target,
  BarChart3,
  Package,
  Bot,
  Settings as SettingsIcon,
  Zap,
  Shield,
  Download,
  ExternalLink,
  Calendar,
  Video,
  FileText,
  Headphones,
  Monitor
} from 'lucide-react'

interface TrainingModule {
  id: string
  title: string
  description: string
  category: 'fundamentals' | 'advanced' | 'specialist' | 'certification'
  type: 'video' | 'interactive' | 'document' | 'hands-on'
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  topics: string[]
  completionRate: number
  isCompleted: boolean
  isLocked: boolean
  certificateEligible: boolean
  icon: any
}

interface Certification {
  id: string
  name: string
  description: string
  level: 'foundation' | 'professional' | 'expert'
  requiredModules: string[]
  examDuration: string
  passingScore: number
  validityPeriod: string
  benefits: string[]
  isEarned: boolean
  isAvailable: boolean
  earnedDate?: Date
  expiryDate?: Date
  badgeUrl?: string
}

interface LearningPath {
  id: string
  name: string
  description: string
  modules: string[]
  estimatedTime: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completedModules: number
  totalModules: number
  icon: any
}

const trainingModules: TrainingModule[] = [
  {
    id: 'intro-clearpath',
    title: 'Introduction to ClearPath AI',
    description: 'Get started with ClearPath AI platform basics and core concepts',
    category: 'fundamentals',
    type: 'video',
    duration: '45 min',
    difficulty: 'beginner',
    prerequisites: [],
    topics: ['Platform Overview', 'Navigation', 'Basic Setup'],
    completionRate: 100,
    isCompleted: true,
    isLocked: false,
    certificateEligible: true,
    icon: Play
  },
  {
    id: 'package-tracking-basics',
    title: 'Package Tracking Fundamentals',
    description: 'Learn how to effectively track and manage packages in the system',
    category: 'fundamentals',
    type: 'interactive',
    duration: '60 min',
    difficulty: 'beginner',
    prerequisites: ['intro-clearpath'],
    topics: ['Package Lifecycle', 'Status Updates', 'Tracking Methods'],
    completionRate: 85,
    isCompleted: false,
    isLocked: false,
    certificateEligible: true,
    icon: Package
  },
  {
    id: 'ai-agents-overview',
    title: 'AI Agents System Overview',
    description: 'Understanding how AI agents work to recover lost packages automatically',
    category: 'fundamentals',
    type: 'video',
    duration: '50 min',
    difficulty: 'intermediate',
    prerequisites: ['package-tracking-basics'],
    topics: ['Agent Types', 'Automation Rules', 'Recovery Process'],
    completionRate: 0,
    isCompleted: false,
    isLocked: false,
    certificateEligible: true,
    icon: Bot
  },
  {
    id: 'advanced-ai-configuration',
    title: 'Advanced AI Agent Configuration',
    description: 'Deep dive into AI agent settings, thresholds, and custom rules',
    category: 'advanced',
    type: 'hands-on',
    duration: '90 min',
    difficulty: 'advanced',
    prerequisites: ['ai-agents-overview'],
    topics: ['Threshold Tuning', 'Custom Rules', 'Performance Optimization'],
    completionRate: 0,
    isCompleted: false,
    isLocked: true,
    certificateEligible: true,
    icon: Zap
  },
  {
    id: 'analytics-reporting',
    title: 'Analytics & Reporting Mastery',
    description: 'Master the analytics dashboard and create custom reports',
    category: 'advanced',
    type: 'interactive',
    duration: '75 min',
    difficulty: 'intermediate',
    prerequisites: ['package-tracking-basics'],
    topics: ['Dashboard Navigation', 'Custom Reports', 'Data Export'],
    completionRate: 60,
    isCompleted: false,
    isLocked: false,
    certificateEligible: true,
    icon: BarChart3
  },
  {
    id: 'security-best-practices',
    title: 'Security & Compliance Best Practices',
    description: 'Learn about security features and compliance requirements',
    category: 'specialist',
    type: 'document',
    duration: '40 min',
    difficulty: 'intermediate',
    prerequisites: ['intro-clearpath'],
    topics: ['Access Control', 'Data Security', 'Compliance'],
    completionRate: 0,
    isCompleted: false,
    isLocked: false,
    certificateEligible: true,
    icon: Shield
  },
  {
    id: 'integration-apis',
    title: 'API Integration & Development',
    description: 'Build custom integrations using ClearPath AI APIs',
    category: 'specialist',
    type: 'hands-on',
    duration: '120 min',
    difficulty: 'advanced',
    prerequisites: ['intro-clearpath'],
    topics: ['REST APIs', 'Webhooks', 'Authentication'],
    completionRate: 0,
    isCompleted: false,
    isLocked: false,
    certificateEligible: true,
    icon: SettingsIcon
  },
  {
    id: 'certification-prep',
    title: 'Certification Exam Preparation',
    description: 'Prepare for your ClearPath AI certification exam',
    category: 'certification',
    type: 'interactive',
    duration: '60 min',
    difficulty: 'intermediate',
    prerequisites: ['package-tracking-basics', 'ai-agents-overview', 'analytics-reporting'],
    topics: ['Exam Format', 'Practice Questions', 'Study Tips'],
    completionRate: 0,
    isCompleted: false,
    isLocked: false,
    certificateEligible: false,
    icon: GraduationCap
  }
]

const certifications: Certification[] = [
  {
    id: 'clearpath-foundation',
    name: 'ClearPath AI Foundation',
    description: 'Demonstrates basic proficiency in using ClearPath AI for package tracking and management',
    level: 'foundation',
    requiredModules: ['intro-clearpath', 'package-tracking-basics'],
    examDuration: '60 minutes',
    passingScore: 80,
    validityPeriod: '2 years',
    benefits: [
      'Official ClearPath AI Foundation certificate',
      'Digital badge for LinkedIn profile',
      'Access to exclusive foundation community',
      'Foundation certification study materials'
    ],
    isEarned: true,
    isAvailable: true,
    earnedDate: new Date('2024-01-10'),
    expiryDate: new Date('2026-01-10')
  },
  {
    id: 'clearpath-professional',
    name: 'ClearPath AI Professional',
    description: 'Advanced certification for logistics professionals managing complex operations',
    level: 'professional',
    requiredModules: ['ai-agents-overview', 'analytics-reporting', 'security-best-practices'],
    examDuration: '90 minutes',
    passingScore: 85,
    validityPeriod: '2 years',
    benefits: [
      'Professional certification with transcript',
      'Premium digital badge and certificate',
      'Access to professional community forums',
      'Priority support channel access',
      'Quarterly certification holder webinars'
    ],
    isEarned: false,
    isAvailable: true
  },
  {
    id: 'clearpath-expert',
    name: 'ClearPath AI Expert',
    description: 'Highest level certification for system administrators and integration specialists',
    level: 'expert',
    requiredModules: ['advanced-ai-configuration', 'integration-apis'],
    examDuration: '120 minutes',
    passingScore: 90,
    validityPeriod: '3 years',
    benefits: [
      'Expert certification with official transcript',
      'Premium badge with expert designation',
      'Expert advisory board invitation',
      'Early access to new features',
      'Speaking opportunities at ClearPath events',
      'Direct line to product engineering team'
    ],
    isEarned: false,
    isAvailable: false
  }
]

const learningPaths: LearningPath[] = [
  {
    id: 'logistics-operator',
    name: 'Logistics Operator',
    description: 'Perfect for warehouse managers and logistics coordinators',
    modules: ['intro-clearpath', 'package-tracking-basics', 'ai-agents-overview'],
    estimatedTime: '3-4 hours',
    difficulty: 'beginner',
    completedModules: 2,
    totalModules: 3,
    icon: Package
  },
  {
    id: 'system-administrator',
    name: 'System Administrator',
    description: 'For IT professionals managing ClearPath AI deployments',
    modules: ['intro-clearpath', 'security-best-practices', 'integration-apis', 'advanced-ai-configuration'],
    estimatedTime: '6-8 hours',
    difficulty: 'advanced',
    completedModules: 1,
    totalModules: 4,
    icon: Shield
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Focused on analytics, reporting, and business intelligence',
    modules: ['intro-clearpath', 'package-tracking-basics', 'analytics-reporting'],
    estimatedTime: '4-5 hours',
    difficulty: 'intermediate',
    completedModules: 2,
    totalModules: 3,
    icon: BarChart3
  }
]

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  advanced: { label: 'Advanced', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' }
}

const typeIcons = {
  video: Video,
  interactive: Monitor,
  document: FileText,
  'hands-on': Headphones
}

const levelConfig = {
  foundation: { label: 'Foundation', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: Award },
  professional: { label: 'Professional', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: Trophy },
  expert: { label: 'Expert', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', icon: Star }
}

export function TrainingCertification() {
  const [activeTab, setActiveTab] = useState('modules')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredModules = selectedCategory === 'all' 
    ? trainingModules 
    : trainingModules.filter(module => module.category === selectedCategory)

  const completedModules = trainingModules.filter(m => m.isCompleted).length
  const totalProgress = (completedModules / trainingModules.length) * 100

  const earnedCertifications = certifications.filter(c => c.isEarned).length
  const availableCertifications = certifications.filter(c => c.isAvailable && !c.isEarned).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-full">
            <GraduationCap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Training & Certification</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enhance your ClearPath AI skills with our comprehensive training modules 
          and earn industry-recognized certifications.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{completedModules}/{trainingModules.length}</div>
          <div className="text-sm text-muted-foreground">Modules Completed</div>
          <Progress value={totalProgress} className="mt-2 h-2" />
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{earnedCertifications}</div>
          <div className="text-sm text-muted-foreground">Certifications Earned</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{availableCertifications}</div>
          <div className="text-sm text-muted-foreground">Available Certifications</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(trainingModules.reduce((sum, m) => sum + m.completionRate, 0) / trainingModules.length)}%
          </div>
          <div className="text-sm text-muted-foreground">Average Progress</div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Training Modules
          </TabsTrigger>
          <TabsTrigger value="paths" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Learning Paths
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certifications
          </TabsTrigger>
        </TabsList>

        {/* Training Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          {/* Category Filter */}
          <Card className="p-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Modules ({trainingModules.length})
              </Button>
              <Button
                variant={selectedCategory === 'fundamentals' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('fundamentals')}
              >
                Fundamentals ({trainingModules.filter(m => m.category === 'fundamentals').length})
              </Button>
              <Button
                variant={selectedCategory === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('advanced')}
              >
                Advanced ({trainingModules.filter(m => m.category === 'advanced').length})
              </Button>
              <Button
                variant={selectedCategory === 'specialist' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('specialist')}
              >
                Specialist ({trainingModules.filter(m => m.category === 'specialist').length})
              </Button>
              <Button
                variant={selectedCategory === 'certification' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('certification')}
              >
                Certification Prep ({trainingModules.filter(m => m.category === 'certification').length})
              </Button>
            </div>
          </Card>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredModules.map((module) => {
              const ModuleIcon = module.icon
              const TypeIcon = typeIcons[module.type]
              
              return (
                <Card 
                  key={module.id} 
                  className={`p-6 ${module.isLocked ? 'opacity-60' : 'hover:shadow-lg transition-shadow cursor-pointer'}`}
                >
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${module.isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-primary/10'}`}>
                          {module.isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : module.isLocked ? (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          ) : (
                            <ModuleIcon className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={difficultyConfig[module.difficulty].color}>
                              {difficultyConfig[module.difficulty].label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {module.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {module.certificateEligible && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Award className="w-3 h-3 mr-1" />
                          Certificate
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        {module.completionRate > 0 && (
                          <span className="text-muted-foreground">
                            {module.completionRate}% complete
                          </span>
                        )}
                      </div>
                      
                      {module.completionRate > 0 && (
                        <Progress value={module.completionRate} className="h-2" />
                      )}
                      
                      {/* Prerequisites */}
                      {module.prerequisites.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Prerequisites: {module.prerequisites.join(', ')}
                        </div>
                      )}
                      
                      {/* Topics */}
                      <div className="flex flex-wrap gap-1">
                        {module.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {module.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{module.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="pt-2">
                        {module.isLocked ? (
                          <Button disabled className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Prerequisites
                          </Button>
                        ) : module.isCompleted ? (
                          <Button variant="outline" className="w-full">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Review Module
                          </Button>
                        ) : module.completionRate > 0 ? (
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" />
                            Start Module
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Learning Paths Tab */}
        <TabsContent value="paths" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Choose Your Learning Path</h3>
            <p className="text-muted-foreground">
              Structured learning journeys tailored to your role and goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {learningPaths.map((path) => {
              const PathIcon = path.icon
              const progress = (path.completedModules / path.totalModules) * 100
              
              return (
                <Card key={path.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <PathIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{path.name}</CardTitle>
                        <Badge className={difficultyConfig[path.difficulty].color}>
                          {difficultyConfig[path.difficulty].label}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {path.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {path.estimatedTime}
                        </span>
                        <span className="text-muted-foreground">
                          {path.completedModules}/{path.totalModules} modules
                        </span>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                      
                      <div className="text-xs text-muted-foreground">
                        Progress: {Math.round(progress)}% complete
                      </div>
                      
                      <Button className="w-full">
                        {progress === 0 ? (
                          <>
                            <Target className="w-4 h-4 mr-2" />
                            Start Learning Path
                          </>
                        ) : progress === 100 ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Path Completed
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continue Path
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">ClearPath AI Certifications</h3>
            <p className="text-muted-foreground">
              Validate your expertise with industry-recognized certifications
            </p>
          </div>
          
          <div className="space-y-6">
            {certifications.map((cert) => {
              const LevelIcon = levelConfig[cert.level].icon
              
              return (
                <Card key={cert.id} className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Certificate Badge */}
                    <div className="flex-shrink-0">
                      <div className={`p-4 rounded-full ${cert.isEarned ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}>
                        <LevelIcon className={`w-8 h-8 ${cert.isEarned ? 'text-green-600' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    
                    {/* Certificate Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{cert.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={levelConfig[cert.level].color}>
                              {levelConfig[cert.level].label}
                            </Badge>
                            {cert.isEarned && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Earned
                              </Badge>
                            )}
                            {!cert.isAvailable && (
                              <Badge variant="outline" className="text-muted-foreground">
                                Prerequisites Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {cert.isEarned && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </Button>
                          )}
                          {cert.isAvailable && !cert.isEarned && (
                            <Button size="sm">
                              <GraduationCap className="w-4 h-4 mr-2" />
                              Take Exam
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{cert.description}</p>
                      
                      {/* Certification Details */}
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Exam Duration:</span>
                            <span>{cert.examDuration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Passing Score:</span>
                            <span>{cert.passingScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Validity:</span>
                            <span>{cert.validityPeriod}</span>
                          </div>
                          {cert.isEarned && cert.expiryDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expires:</span>
                              <span>{cert.expiryDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Benefits:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {cert.benefits.slice(0, 3).map((benefit, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-600 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                            {cert.benefits.length > 3 && (
                              <li className="text-xs text-muted-foreground">
                                +{cert.benefits.length - 3} more benefits
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Required Modules */}
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Required Training Modules:</h4>
                        <div className="flex flex-wrap gap-2">
                          {cert.requiredModules.map((moduleId) => {
                            const module = trainingModules.find(m => m.id === moduleId)
                            if (!module) return null
                            
                            return (
                              <Badge 
                                key={moduleId} 
                                variant="outline" 
                                className={`text-xs ${module.isCompleted ? 'border-green-600 text-green-600' : ''}`}
                              >
                                {module.isCompleted && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {module.title}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-yellow-700 dark:text-yellow-300">
            Ready to Advance Your Career?
          </h3>
          <p className="text-yellow-600 dark:text-yellow-400 max-w-2xl mx-auto">
            Join thousands of logistics professionals who have enhanced their skills 
            and earned recognition through ClearPath AI certifications.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <GraduationCap className="w-4 h-4 mr-2" />
              Start Learning Today
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View All Courses
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
