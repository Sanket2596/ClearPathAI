'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk, SignInButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { GradientText } from '@/components/ui/gradient-text'
import { GlobalSearchTrigger } from '@/components/ui/global-search'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  MapPin,
  BarChart3,
  Bot,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Activity,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'Anomalies', href: '/anomalies', icon: AlertTriangle },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user, isSignedIn } = useUser()
  const { signOut } = useClerk()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg hover:bg-muted/50 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "h-screen bg-background/95 backdrop-blur-xl border-r border-border/50 shadow-xl",
          "fixed left-0 top-0 bottom-0 z-40 lg:relative lg:z-auto",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <GradientText 
                      from="from-blue-600" 
                      to="to-purple-600"
                      className="font-bold text-lg"
                    >
                      ClearPath AI
                    </GradientText>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto"
                >
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse button - hidden on mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex hover:bg-muted/50 rounded-lg"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search - only show when expanded */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-b border-border/50"
              >
                <GlobalSearchTrigger />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative',
                    isCollapsed ? 'p-3 justify-center' : 'px-3 py-2.5',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className={cn(
                    "transition-transform group-hover:scale-110",
                    isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                  )} />
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between flex-1"
                      >
                        <span>{item.name}</span>
                        
                        {/* Badges */}
                        <div className="flex items-center space-x-1">
                          {item.name === 'Anomalies' && (
                            <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                              23
                            </Badge>
                          )}
                          {item.name === 'AI Agents' && (
                            <Badge variant="success" className="px-1.5 py-0.5 text-xs">
                              4
                            </Badge>
                          )}
                          {item.name === 'Map' && (
                            <Badge variant="info" className="px-1.5 py-0.5 text-xs">
                              Live
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed state badges */}
                  {isCollapsed && (
                    <div className="absolute -top-1 -right-1">
                      {item.name === 'Anomalies' && (
                        <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          23
                        </div>
                      )}
                      {item.name === 'AI Agents' && (
                        <div className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                          4
                        </div>
                      )}
                      {item.name === 'Map' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-r-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-border/50 p-4 space-y-3">
            {/* Theme toggle */}
            <div className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              {!isCollapsed && (
                <span className="text-sm text-muted-foreground">Theme</span>
              )}
              <ThemeToggle />
            </div>

            {/* Notifications */}
            <NotificationDropdown 
              showLabel={true}
              isCollapsed={isCollapsed}
              className={cn(
                "w-full",
                isCollapsed ? "p-3 justify-center" : "justify-start px-3 py-2.5"
              )} 
            />

            {/* Help */}
            <Button
              variant="ghost"
              className={cn(
                "w-full",
                isCollapsed ? "p-3 justify-center" : "justify-start px-3 py-2.5"
              )}
            >
              <HelpCircle className={cn(
                isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
              )} />
              {!isCollapsed && <span>Help & Support</span>}
            </Button>

            {/* User profile */}
            {isSignedIn ? (
              <div className={cn(
                "flex items-center p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group border border-border/50",
                isCollapsed ? "justify-center" : "space-x-3"
              )}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                        {user?.fullName || user?.firstName || 'User'}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isCollapsed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut()}
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="default"
                  className={cn(
                    "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0",
                    isCollapsed ? "p-3 justify-center" : "justify-start px-3 py-2.5"
                  )}
                >
                  <Users className={cn(
                    isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
                  )} />
                  {!isCollapsed && <span>Sign In</span>}
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
