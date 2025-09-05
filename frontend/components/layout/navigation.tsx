'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Activity,
  Settings,
  Users,
  BarChart3,
  Menu,
  X,
  Bot,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Anomalies', href: '/anomalies', icon: AlertTriangle },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">ClearPath AI</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-primary text-foreground'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.name === 'Anomalies' && (
                      <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                        23
                      </Badge>
                    )}
                    {item.name === 'AI Agents' && (
                      <Badge variant="success" className="ml-2 px-1.5 py-0.5 text-xs">
                        4
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side items */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </Button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* User menu */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium">Operations Team</div>
                <div className="text-xs text-muted-foreground">Admin</div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border bg-background">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
                </Link>
              )
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5 space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
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
