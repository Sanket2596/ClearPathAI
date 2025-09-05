'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Minus, ArrowRight } from 'lucide-react'
import { GradientText } from '@/components/ui/gradient-text'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What kinds of packages can ClearPath AI track?",
    answer: "ClearPath AI can track all types of packages across multiple carriers including FedEx, UPS, DHL, and USPS. Our system integrates with warehouse management systems, GPS tracking, and RFID/barcode scanners to provide comprehensive coverage for e-commerce, retail, healthcare, and industrial shipments."
  },
  {
    question: "How does the AI detect lost or misrouted packages?",
    answer: "Our Agentic AI continuously monitors package scans across all systems in real-time. It uses machine learning algorithms to detect anomalies like missed scans, unexpected route deviations, or delayed arrivals. The system cross-references GPS data, warehouse logs, and historical patterns to identify issues within minutes rather than days."
  },
  {
    question: "What happens when a package anomaly is detected?",
    answer: "When an anomaly is detected, our AI agents immediately spring into action. The Investigator Agent analyzes the situation, the Recovery Agent coordinates with drivers and warehouses, and the Customer Agent proactively updates customers with detailed explanations and new delivery estimates. Most issues are resolved automatically without human intervention."
  },
  {
    question: "How accurate is the AI-powered recovery system?",
    answer: "Our AI system achieves a 94% accuracy rate in anomaly detection with an 85% automated recovery success rate. The system learns from each case, continuously improving its performance. False positive rates are kept below 3%, ensuring efficient operations without unnecessary alerts."
  },
  {
    question: "Can ClearPath AI integrate with existing logistics systems?",
    answer: "Yes! ClearPath AI is designed for seamless integration with existing warehouse management systems, carrier APIs, GPS tracking, CCTV systems, and customer notification platforms. Our API-first architecture supports both cloud and on-premise deployments with minimal disruption to current operations."
  },
  {
    question: "What makes ClearPath AI different from traditional tracking?",
    answer: "Unlike traditional tracking that simply reports package status, ClearPath AI proactively investigates and resolves issues. Our Agentic AI doesn't just tell you a package is lost – it finds out why, where it likely is, and automatically takes action to recover it. This transforms reactive logistics into proactive problem-solving."
  }
]

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const answerVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      marginTop: 16,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <GradientText from="from-blue-600" to="to-purple-600">
              Frequently
            </GradientText>
            <br />
            <span className="text-foreground">asked questions</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="ghost" 
              className="group text-muted-foreground hover:text-foreground transition-colors"
            >
              Read our complete documentation
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4 ml-2" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-card/80 border-border/50 hover:border-primary/20 transition-all duration-300">
                  <motion.button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-lg"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground pr-8">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: openItems.includes(index) ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex-shrink-0"
                      >
                        <Plus className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openItems.includes(index) && (
                      <motion.div
                        variants={answerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="px-6 pb-6"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="text-muted-foreground leading-relaxed"
                        >
                          {item.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Decorative Elements */}
          <div className="relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="relative">
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [-20, 20, -20],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                />
                
                <motion.div
                  animate={{
                    y: [20, -20, 20],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl"
                />

                {/* Main Decorative Card */}
                <motion.div
                  whileHover={{ 
                    y: -10,
                    rotateY: 5,
                    rotateX: 5,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <Card className="p-8 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-primary/20">
                    <div className="space-y-6">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center"
                        >
                          <span className="text-2xl">🤖</span>
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                        <p className="text-muted-foreground text-sm">
                          Get instant answers about your logistics operations
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { label: "Detection Speed", value: "< 2 minutes" },
                          { label: "Recovery Rate", value: "85% automated" },
                          { label: "Accuracy", value: "94.2%" },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
                          >
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                            <span className="font-semibold text-primary">{stat.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
