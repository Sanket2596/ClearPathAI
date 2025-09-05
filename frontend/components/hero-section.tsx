'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { 
  MotionDiv, 
  MotionH1, 
  MotionP, 
  MagneticButton, 
  TypewriterText,
  staggerContainer,
  staggerItem,
  fadeInUp,
  scaleIn,
  TiltCard,
  RippleEffect,
  MouseFollower
} from '@/components/ui/motion-components'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  TrendingUp, 
  Bot,
  Package,
  Activity,
  Sparkles
} from 'lucide-react'
import { SimpleFAQ } from '@/components/simple-faq'
import { FooterSection } from '@/components/footer-section'

const typingTexts = [
  'Lost Package Detection',
  'AI-Powered Recovery',
  'Real-time Monitoring',
  'Smart Logistics'
]

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  // Cycle through typing texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'Autonomous investigation and recovery',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Real-time',
      description: 'Instant anomaly detection',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Enterprise-grade security',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Advanced performance insights',
      color: 'text-purple-500'
    }
  ]

  return (
    <div className="relative">
      <motion.div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
        style={{ y, opacity }}
      >
        <AnimatedBackground />
        
        <MotionDiv 
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
        {/* Header Badge */}
        <motion.div variants={staggerItem}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="outline" className="mb-8 px-4 py-2 text-sm backdrop-blur-sm bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
              </motion.div>
              Powered by Advanced AI
            </Badge>
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={staggerItem}>
          <MotionH1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <GradientText 
                from="from-blue-600" 
                to="to-purple-600"
                animated
                className="block"
              >
                ClearPath AI
              </GradientText>
            </motion.div>
            <motion.span 
              className="block text-3xl md:text-5xl mt-4 text-foreground/80"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Next-Gen Logistics
            </motion.span>
          </MotionH1>
        </motion.div>

        {/* Animated Typing Text */}
        <motion.div variants={staggerItem}>
          <div className="h-16 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground font-mono"
              >
                <TypewriterText 
                  text={typingTexts[currentTextIndex]} 
                  speed={0.08}
                />
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  |
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div variants={staggerItem}>
          <MotionP className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary Agentic AI system that detects, investigates, and recovers lost packages 
            in real-time. Transform your logistics operations with autonomous intelligence.
          </MotionP>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <MagneticButton className="group px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg">
            <motion.div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Activity className="w-5 h-5 mr-2" />
              </motion.div>
              View Dashboard
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.div>
            </motion.div>
          </MagneticButton>
          
          <MagneticButton className="px-8 py-4 text-lg backdrop-blur-sm bg-background/50 hover:bg-background/80 border border-border rounded-lg font-medium">
            <motion.div className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Track Package
            </motion.div>
          </MagneticButton>
        </motion.div>

        {/* Feature Cards with Enhanced Interactions */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={staggerItem}>
              <TiltCard
                className="group p-6 rounded-xl backdrop-blur-sm bg-card/50 border border-border/50 hover:bg-card/80 transition-all duration-300 cursor-pointer"
                maxTilt={8}
              >
                <RippleEffect>
                  <MouseFollower strength={0.05}>
                    <motion.div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 ${feature.color}`}
                      whileHover={{ 
                        scale: 1.2,
                        rotate: 15,
                        transition: { duration: 0.2 }
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 0 0 ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : 
                                    feature.color.includes('yellow') ? 'rgba(245, 158, 11, 0)' : 
                                    feature.color.includes('green') ? 'rgba(34, 197, 94, 0)' : 
                                    'rgba(147, 51, 234, 0)'}`,
                          `0 0 0 10px ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 
                                       feature.color.includes('yellow') ? 'rgba(245, 158, 11, 0.1)' : 
                                       feature.color.includes('green') ? 'rgba(34, 197, 94, 0.1)' : 
                                       'rgba(147, 51, 234, 0.1)'}`,
                          `0 0 0 0 ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0)' : 
                                    feature.color.includes('yellow') ? 'rgba(245, 158, 11, 0)' : 
                                    feature.color.includes('green') ? 'rgba(34, 197, 94, 0)' : 
                                    'rgba(147, 51, 234, 0)'}`
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.5
                      }}
                    >
                      <feature.icon className="w-6 h-6" />
                    </motion.div>
                    <motion.h3 
                      className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </MouseFollower>
                </RippleEffect>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"
          animate={{
            y: [-15, 15, -15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </MotionDiv>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* FAQ Section - Integrated into hero page */}
      <motion.div 
        className="relative z-10 mt-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <SimpleFAQ />
      </motion.div>

      {/* Footer Section - Integrated into hero page */}
      <motion.div 
        className="relative z-10 mt-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <FooterSection />
      </motion.div>
    </div>
  )
}
