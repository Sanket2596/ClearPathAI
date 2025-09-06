'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Package,
  AlertTriangle,
  Bot,
  Users,
  BarChart3,
  Settings,
  Map,
  Clock,
  ArrowRight,
  Command,
  Hash,
  User,
  Activity,
  FileText,
  Zap,
  Target,
  CheckCircle,
  TrendingUp,
  Globe,
  Calendar,
  Filter,
  Eye,
  MessageSquare,
  Bell,
  Shield,
  Palette,
  Monitor
} from 'lucide-react'

// Types
interface SearchResult {
  id: string
  type: 'package' | 'anomaly' | 'agent' | 'user' | 'page' | 'command'
  title: string
  subtitle?: string
  description?: string
  icon: React.ComponentType<any>
  href?: string
  action?: () => void
  metadata?: {
    status?: string
    priority?: string
    confidence?: number
    lastSeen?: string
  }
}

interface SearchCategory {
  label: string
  results: SearchResult[]
  icon: React.ComponentType<any>
  color: string
}

// Mock search data
const mockSearchData: SearchResult[] = [
  // Packages
  {
    id: 'pkg-1',
    type: 'package',
    title: 'PCK12345',
    subtitle: 'TechCorp Inc. → Global Solutions Ltd.',
    description: 'New York, NY → Boston, MA',
    icon: Package,
    href: '/packages',
    metadata: {
      status: 'in_transit',
      priority: 'high',
      lastSeen: '2 hours ago'
    }
  },
  {
    id: 'pkg-2',
    type: 'package',
    title: 'PCK67890',
    subtitle: 'Fashion Forward → Style Boutique',
    description: 'San Francisco, CA → Los Angeles, CA',
    icon: Package,
    href: '/packages',
    metadata: {
      status: 'investigating',
      priority: 'critical',
      lastSeen: '30 minutes ago'
    }
  },
  
  // Anomalies
  {
    id: 'anom-1',
    type: 'anomaly',
    title: 'Missed Scan Detection',
    subtitle: 'Package PCK12345 at Hub B',
    description: 'Expected scan at 12:15 PM but not recorded',
    icon: AlertTriangle,
    href: '/anomalies',
    metadata: {
      confidence: 89,
      status: 'investigating',
      lastSeen: '15 minutes ago'
    }
  },
  {
    id: 'anom-2',
    type: 'anomaly',
    title: 'Route Deviation',
    subtitle: 'Package PCK67890 off planned route',
    description: 'Detected 2.3 miles from expected path',
    icon: AlertTriangle,
    href: '/anomalies',
    metadata: {
      confidence: 94,
      status: 'resolved',
      lastSeen: '1 hour ago'
    }
  },
  
  // AI Agents
  {
    id: 'agent-1',
    type: 'agent',
    title: 'Recovery Agent',
    subtitle: 'Package recovery and rerouting specialist',
    description: 'Currently handling 3 active cases',
    icon: Bot,
    href: '/agents',
    metadata: {
      status: 'busy',
      lastSeen: 'Active now'
    }
  },
  {
    id: 'agent-2',
    type: 'agent',
    title: 'Investigator Agent',
    subtitle: 'Anomaly detection and pattern recognition',
    description: '91% accuracy rate this month',
    icon: Bot,
    href: '/agents',
    metadata: {
      status: 'active',
      lastSeen: '2 minutes ago'
    }
  },
  
  // Users
  {
    id: 'user-1',
    type: 'user',
    title: 'John Doe',
    subtitle: 'Operations Manager',
    description: 'john.doe@clearpath.ai',
    icon: User,
    href: '/settings',
    metadata: {
      status: 'online',
      lastSeen: 'Active now'
    }
  },
  {
    id: 'user-2',
    type: 'user',
    title: 'Sarah Johnson',
    subtitle: 'Senior Analyst',
    description: 'sarah.johnson@clearpath.ai',
    icon: User,
    href: '/settings',
    metadata: {
      status: 'away',
      lastSeen: '1 hour ago'
    }
  },
  
  // Pages
  {
    id: 'page-1',
    type: 'page',
    title: 'Analytics Dashboard',
    subtitle: 'View performance metrics and insights',
    description: 'KPIs, trends, and operational analytics',
    icon: BarChart3,
    href: '/analytics'
  },
  {
    id: 'page-2',
    type: 'page',
    title: 'Global Package Map',
    subtitle: 'Real-time package location visualization',
    description: 'Interactive map with live tracking',
    icon: Map,
    href: '/map'
  },
  {
    id: 'page-3',
    type: 'page',
    title: 'AI Agents Control',
    subtitle: 'Manage and monitor AI agents',
    description: 'Agent status, performance, and controls',
    icon: Bot,
    href: '/agents'
  },
  
  // Commands
  {
    id: 'cmd-1',
    type: 'command',
    title: 'Create New Package',
    subtitle: 'Add a new package to the system',
    description: 'Quick package creation workflow',
    icon: Package,
    action: () => console.log('Create package')
  },
  {
    id: 'cmd-2',
    type: 'command',
    title: 'Export Analytics Report',
    subtitle: 'Generate and download analytics report',
    description: 'PDF or CSV format available',
    icon: FileText,
    action: () => console.log('Export report')
  }
]

const searchCategories: { [key: string]: { label: string; icon: React.ComponentType<any>; color: string } } = {
  package: { label: 'Packages', icon: Package, color: 'text-blue-600' },
  anomaly: { label: 'Anomalies', icon: AlertTriangle, color: 'text-red-600' },
  agent: { label: 'AI Agents', icon: Bot, color: 'text-purple-600' },
  user: { label: 'Users', icon: Users, color: 'text-green-600' },
  page: { label: 'Pages', icon: Globe, color: 'text-orange-600' },
  command: { label: 'Commands', icon: Zap, color: 'text-yellow-600' }
}

const statusColors: { [key: string]: string } = {
  in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  investigating: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  busy: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  away: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Search function with debouncing
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150))
    
    const filtered = mockSearchData.filter(item => {
      const searchLower = searchQuery.toLowerCase()
      
      // Check for prefixed searches
      if (searchQuery.includes(':')) {
        const [prefix, term] = searchQuery.split(':').map(s => s.trim())
        if (prefix === 'package' || prefix === 'pkg') {
          return item.type === 'package' && 
                 (item.title.toLowerCase().includes(term.toLowerCase()) ||
                  item.subtitle?.toLowerCase().includes(term.toLowerCase()))
        }
        if (prefix === 'anomaly') {
          return item.type === 'anomaly' && 
                 (item.title.toLowerCase().includes(term.toLowerCase()) ||
                  item.description?.toLowerCase().includes(term.toLowerCase()))
        }
        if (prefix === 'agent') {
          return item.type === 'agent' && 
                 item.title.toLowerCase().includes(term.toLowerCase())
        }
        if (prefix === 'user') {
          return item.type === 'user' && 
                 item.title.toLowerCase().includes(term.toLowerCase())
        }
      }
      
      // General search
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.subtitle?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      )
    })
    
    setResults(filtered)
    setSelectedIndex(0)
    setIsLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            handleResultSelect(results[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  const handleResultSelect = (result: SearchResult) => {
    if (result.action) {
      result.action()
    } else if (result.href) {
      router.push(result.href)
    }
    onClose()
    setQuery('')
    setResults([])
  }

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as { [key: string]: SearchResult[] })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-[280px] bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Search Modal */}
          <div className="fixed inset-4 lg:left-[300px] z-50 flex items-start justify-center pt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-2xl border-2 border-border/50 backdrop-blur-xl bg-background/95">
                <CardContent className="p-0">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Search packages, anomalies, agents, users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="border-0 shadow-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>
                </div>

                {/* Quick Tips */}
                {!query && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border-b border-border"
                  >
                    <div className="text-sm text-muted-foreground mb-3">Quick search tips:</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">package:</Badge>
                        <span className="text-muted-foreground">PCK12345</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">anomaly:</Badge>
                        <span className="text-muted-foreground">missed scan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">agent:</Badge>
                        <span className="text-muted-foreground">Recovery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">user:</Badge>
                        <span className="text-muted-foreground">John Doe</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="p-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Searching...</p>
                  </div>
                )}

                {/* Search Results */}
                {!isLoading && query && (
                  <div className="max-h-96 overflow-y-auto">
                    {results.length === 0 ? (
                      <div className="p-8 text-center">
                        <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        {Object.entries(groupedResults).map(([category, categoryResults]) => {
                          const categoryConfig = searchCategories[category]
                          const CategoryIcon = categoryConfig.icon
                          
                          return (
                            <div key={category} className="mb-4 last:mb-0">
                              <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <CategoryIcon className={`w-3 h-3 ${categoryConfig.color}`} />
                                {categoryConfig.label}
                              </div>
                              
                              {categoryResults.map((result, index) => {
                                const globalIndex = results.indexOf(result)
                                const isSelected = globalIndex === selectedIndex
                                const ResultIcon = result.icon
                                
                                return (
                                  <motion.div
                                    key={result.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`mx-2 rounded-lg transition-all duration-200 ${
                                      isSelected ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => handleResultSelect(result)}
                                  >
                                    <div className="flex items-center gap-3 p-3 cursor-pointer">
                                      <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                        }`}>
                                          <ResultIcon className="w-4 h-4" />
                                        </div>
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-medium truncate">{result.title}</span>
                                          {result.metadata?.status && (
                                            <Badge className={`text-xs ${statusColors[result.metadata.status] || 'bg-gray-100'}`}>
                                              {result.metadata.status}
                                            </Badge>
                                          )}
                                          {result.metadata?.priority && (
                                            <Badge className={`text-xs ${statusColors[result.metadata.priority] || 'bg-gray-100'}`}>
                                              {result.metadata.priority}
                                            </Badge>
                                          )}
                                          {result.metadata?.confidence && (
                                            <Badge variant="secondary" className="text-xs">
                                              {result.metadata.confidence}%
                                            </Badge>
                                          )}
                                        </div>
                                        
                                        {result.subtitle && (
                                          <div className="text-sm text-muted-foreground truncate mb-1">
                                            {result.subtitle}
                                          </div>
                                        )}
                                        
                                        {result.description && (
                                          <div className="text-xs text-muted-foreground truncate">
                                            {result.description}
                                          </div>
                                        )}
                                        
                                        {result.metadata?.lastSeen && (
                                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {result.metadata.lastSeen}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {isSelected && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          className="flex-shrink-0"
                                        >
                                          <ArrowRight className="w-4 h-4 text-primary" />
                                        </motion.div>
                                      )}
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                {results.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
                        <span>Navigate</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">↵</kbd>
                        <span>Select</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">esc</kbd>
                        <span>Close</span>
                      </div>
                    </div>
                    <div>{results.length} results</div>
                  </div>
                )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Global Search Trigger Component (for header)
export function GlobalSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted rounded-lg min-w-[200px] justify-between group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-60 group-hover:opacity-100">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>
      
      <GlobalSearch isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
