'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Activity,
  BarChart3,
  Bot,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Map,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Map', href: '/map', icon: Map },
  { name: 'Anomalies', href: '/anomalies', icon: AlertTriangle },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5" 
          : "bg-background/95 backdrop-blur-sm border-b border-border/30"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <GradientText 
                    from="from-blue-600" 
                    to="to-purple-600"
                    className="font-bold text-xl"
                  >
                    ClearPath AI
                  </GradientText>
                </div>
              </Link>
            </div>
            
            {/* Global Search */}
            <div className="hidden lg:flex ml-8 mr-6">
              <GlobalSearchTrigger />
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-0 lg:ml-0 md:flex md:items-center md:space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="relative">
                      {item.name}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
                      )}
                    </span>
                    
                    {item.name === 'Anomalies' && (
                      <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs shadow-sm">
                        23
                      </Badge>
                    )}
                    {item.name === 'AI Agents' && (
                      <Badge variant="success" className="ml-2 px-1.5 py-0.5 text-xs shadow-sm">
                        4
                      </Badge>
                    )}
                    {item.name === 'Map' && (
                      <Badge variant="info" className="ml-2 px-1.5 py-0.5 text-xs shadow-sm">
                        Live
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
            
            {/* Theme toggle right after navigation - separate container */}
            <div className="hidden md:flex md:items-center ml-2 bg-red-200 p-1 rounded">
              <ThemeToggle />
            </div>
          </div>


          {/* Right side items */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-3">
            {/* Theme toggle - testing in right side */}
            <div className="bg-red-200 p-1 rounded">
              <ThemeToggle />
            </div>
            
            {/* Notifications */}
            <NotificationDropdown />


            {/* User menu */}
            <div className="flex items-center space-x-3 pl-2 pr-1 py-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                  Operations Team
                </div>
                <div className="text-xs text-muted-foreground">Admin</div>
              </div>
            </div>
          </div>

          {/* Mobile search and menu buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="lg:hidden">
              <GlobalSearchTrigger />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg hover:bg-muted/50"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border bg-background/95 backdrop-blur-xl">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                  {item.name === 'Anomalies' && (
                    <Badge variant="destructive" className="ml-auto px-1.5 py-0.5 text-xs">
                      23
                    </Badge>
                  )}
                  {item.name === 'AI Agents' && (
                    <Badge variant="success" className="ml-auto px-1.5 py-0.5 text-xs">
                      4
                    </Badge>
                  )}
                  {item.name === 'Map' && (
                    <Badge variant="info" className="ml-auto px-1.5 py-0.5 text-xs">
                      Live
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5 space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Operations Team</div>
                <div className="text-xs text-muted-foreground">Admin</div>
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}