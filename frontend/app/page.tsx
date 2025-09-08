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
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [showHero, setShowHero] = useState(true) // Changed to true so hero shows by default with FAQ and Footer

  if (showHero) {
    return <HeroSection />
  }

  return (
    <>
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'url(/images/bernd-dittrich-huciLx_BveI-unsplash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 space-y-8 min-h-screen">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GradientText from="from-blue-400" to="to-purple-400">
                Operations Dashboard
              </GradientText>
            </motion.h1>
            <motion.p 
              className="text-white/90 mt-2 text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Real-time logistics monitoring powered by Agentic AI
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="px-3 py-1 bg-blue-500/20 text-blue-200 border-blue-400/30 backdrop-blur-sm">
                <Activity className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="sm"
                onClick={() => setShowHero(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white backdrop-blur-sm border border-white/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Show Intro
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* KPI Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { icon: Package, value: "12,345", label: "Packages in Transit", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-400/30" },
            { icon: AlertTriangle, value: "23", label: "Active Anomalies", color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-400/30" },
            { icon: CheckCircle, value: "18", label: "Recovered Today", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-400/30" },
            { icon: Users, value: "4", label: "AI Agents Active", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-400/30" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`p-6 text-center backdrop-blur-md bg-white/10 border ${item.borderColor} hover:shadow-2xl transition-all duration-300 hover:bg-white/20`}>
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                </motion.div>
                <motion.div 
                  className="font-bold text-2xl text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                >
                  {item.value}
                </motion.div>
                <div className="text-sm text-white/80 font-medium">{item.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <Card className="p-8 text-center backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                <CardTitle className="text-3xl mb-4 text-white">
                  🎉 Welcome to ClearPath AI!
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.p 
                className="text-lg text-white/90 mb-6 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 }}
              >
                Your beautiful animated logistics dashboard is now running successfully!
              </motion.p>
              <motion.p 
                className="text-white/80 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.4 }}
              >
                This dashboard features Framer Motion animations, modern UI components, 
                and a professional design with stunning industrial port background.
              </motion.p>
              
              <motion.div 
                className="flex justify-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => setShowHero(true)} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-sm border border-white/20"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    View Hero Section
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    className="backdrop-blur-sm border-white/30 text-white hover:bg-white/10"
                  >
                    Explore Features
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section - Integrated into dashboard */}
      <motion.div 
        className="mt-16 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.8 }}
      >
        <SimpleFAQ />
      </motion.div>

      {/* Footer Section - Integrated into dashboard */}
      <motion.div 
        className="mt-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3 }}
      >
        <FooterSection />
      </motion.div>
    </>
  )
}