'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GradientText } from '@/components/ui/gradient-text'
import { 
  MotionDiv,
  staggerContainer,
  staggerItem,
  fadeInUp,
  scaleIn
} from '@/components/ui/motion-components'
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Activity,
  Heart,
  ExternalLink,
  Users,
  Building,
  BookOpen,
  MessageCircle,
  Sparkles,
  Rocket
} from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '#', icon: Building },
    { name: 'Our Story', href: '#', icon: BookOpen },
    { name: 'Careers', href: '#', icon: Users },
    { name: 'Contact Us', href: '#', icon: MessageCircle },
  ],
  product: [
    { name: 'Dashboard', href: '#' },
    { name: 'AI Agents', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Integrations', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Support Center', href: '#' },
    { name: 'Status Page', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Security', href: '#' },
  ]
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
]

const contactInfo = [
  { icon: Mail, text: 'hello@clearpathai.com', href: 'mailto:hello@clearpathai.com' },
  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, text: 'San Francisco, CA', href: '#' },
]

export function FooterSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <footer className="relative bg-gradient-to-br from-background via-background to-primary/5 border-t border-border/50 overflow-hidden">
      {/* Enhanced Floating Background Elements - Same as Hero */}
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
        className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"
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
      <motion.div 
        className="absolute top-40 right-40 w-24 h-24 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-full blur-xl"
        animate={{
          y: [10, -25, 10],
          x: [-5, 15, -5],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Hero-style Animation */}
        <MotionDiv
          className="text-center py-16 border-b border-border/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={staggerItem}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <div className="mb-6 px-4 py-2 text-sm backdrop-blur-sm bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer rounded-full inline-flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                </motion.div>
                Ready to Transform Your Logistics?
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
            >
              <GradientText 
                from="from-blue-600" 
                to="to-purple-600"
                animated
                className="block"
              >
                Join the Future
              </GradientText>
              <motion.span 
                className="block text-3xl md:text-4xl mt-2 text-foreground/80"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                of Logistics
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Connect with thousands of companies using ClearPath AI to eliminate lost packages 
              and transform their operations with autonomous intelligence.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerItem}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <motion.div className="flex items-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                  </motion.div>
                  Start Free Trial
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" className="backdrop-blur-sm bg-background/50 hover:bg-background/80 border border-border shadow-lg">
                Schedule Demo
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </MotionDiv>

        {/* Main Footer Content */}
        <MotionDiv
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Company Info - Left Column */}
            <motion.div variants={staggerItem} className="lg:col-span-4">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.3, ease: 'easeOut' }
                }}
                className="flex items-center space-x-3 mb-6 group cursor-pointer"
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ 
                    rotate: 15,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Activity className="w-6 h-6 text-white" />
                </motion.div>
                <motion.span 
                  className="text-2xl font-bold"
                  whileHover={{ x: 5 }}
                >
                  <GradientText 
                    from="from-blue-600" 
                    to="to-purple-600"
                    animated
                  >
                    ClearPath AI
                  </GradientText>
                </motion.span>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-muted-foreground mb-6 leading-relaxed"
              >
                Revolutionizing logistics with Agentic AI. We help businesses detect, investigate, 
                and recover lost packages in real-time, transforming reactive operations into 
                proactive problem-solving.
              </motion.p>

              {/* Contact Info */}
              <motion.div variants={itemVariants} className="space-y-3 mb-6">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={contact.text}
                    href={contact.href}
                    variants={linkVariants}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="w-5 h-5 flex-shrink-0"
                    >
                      <contact.icon className="w-5 h-5" />
                    </motion.div>
                    <span className="group-hover:underline">{contact.text}</span>
                  </motion.a>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 15,
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 bg-muted/50 hover:bg-muted rounded-lg flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Navigation Links - Right Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Company Links */}
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-foreground mb-4">Company</h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      custom={index}
                    >
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <motion.div
                          whileHover={{ rotate: 15 }}
                          className="w-4 h-4"
                        >
                          <link.icon className="w-4 h-4" />
                        </motion.div>
                        <span className="group-hover:underline">{link.name}</span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Product Links */}
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-foreground mb-4">Product</h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      custom={index}
                    >
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources Links */}
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      custom={index}
                    >
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Legal Links */}
              <motion.div variants={itemVariants}>
                <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <motion.li
                      key={link.name}
                      variants={linkVariants}
                      custom={index}
                    >
                      <motion.a
                        href={link.href}
                        whileHover={{ x: 5 }}
                        className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </MotionDiv>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="py-12 border-t border-border/50"
        >
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-primary/20">
            <div className="text-center">
              <motion.h3 
                className="text-2xl md:text-3xl font-bold mb-4"
                whileHover={{ scale: 1.02 }}
              >
                Ready to transform your logistics?
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mb-6 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Join thousands of companies using ClearPath AI to eliminate lost packages 
                and improve customer satisfaction with autonomous AI agents.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg">
                    Schedule Demo
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <motion.p 
                className="text-muted-foreground text-sm"
                whileHover={{ scale: 1.05 }}
              >
                © 2024 ClearPath AI. All rights reserved.
              </motion.p>
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1" />
                All systems operational
              </Badge>
            </div>
            
            <motion.div 
              className="flex items-center space-x-2 text-sm text-muted-foreground"
              whileHover={{ scale: 1.05 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>by the ClearPath team</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
