'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { HeroSection } from '@/components/hero-section'
import { SimpleFAQ } from '@/components/simple-faq'
import { FooterSection } from '@/components/footer-section'
import { Package, AlertTriangle, CheckCircle, Users, Activity, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const [showHero, setShowHero] = useState(true) // Changed to true so hero shows by default with FAQ and Footer

  if (showHero) {
    return <HeroSection />
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <GradientText from="from-blue-600" to="to-purple-600">
                Operations Dashboard
              </GradientText>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Real-time logistics monitoring powered by Agentic AI
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className="px-3 py-1">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
            
            <Button 
              size="sm"
              onClick={() => setShowHero(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Show Intro
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Package className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <div className="font-bold text-2xl">12,345</div>
            <div className="text-sm text-muted-foreground">Packages in Transit</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="font-bold text-2xl">23</div>
            <div className="text-sm text-muted-foreground">Active Anomalies</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <div className="font-bold text-2xl">18</div>
            <div className="text-sm text-muted-foreground">Recovered Today</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="font-bold text-2xl">4</div>
            <div className="text-sm text-muted-foreground">AI Agents Active</div>
          </Card>
        </div>

        {/* Welcome Card */}
        <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">
              🎉 Welcome to ClearPath AI!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-6">
              Your beautiful animated logistics dashboard is now running successfully!
            </p>
            <p className="text-muted-foreground mb-8">
              This dashboard features Framer Motion animations, modern UI components, 
              and a professional design inspired by the Onlook website.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => setShowHero(true)} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Hero Section
              </Button>
              <Button variant="outline">
                Explore Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section - Integrated into dashboard */}
      <div className="mt-16">
        <SimpleFAQ />
      </div>

      {/* Footer Section - Integrated into dashboard */}
      <div className="mt-8">
        <FooterSection />
      </div>
    </>
  )
}