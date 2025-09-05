'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/ui/gradient-text'
import { 
  MotionDiv,
  staggerContainer,
  staggerItem,
  fadeInUp,
  scaleIn
} from '@/components/ui/motion-components'
import { Plus, Sparkles, HelpCircle, Zap } from 'lucide-react'

const faqs = [
  {
    question: "What is ClearPath AI?",
    answer: "ClearPath AI is an advanced logistics platform that uses Agentic AI to detect, investigate, and recover lost packages in real-time. Our revolutionary system transforms logistics operations with autonomous intelligence.",
    icon: Sparkles,
    color: "text-blue-500"
  },
  {
    question: "How does the AI detect lost packages?",
    answer: "Our AI continuously monitors package scans across all systems, detecting anomalies like missed scans or route deviations within minutes. Advanced algorithms analyze patterns and predict potential issues before they become problems.",
    icon: Zap,
    color: "text-yellow-500"
  },
  {
    question: "What's the recovery success rate?",
    answer: "Our AI system achieves an 85% automated recovery success rate with 94% accuracy in anomaly detection. This means faster resolutions, happier customers, and significant cost savings for your business.",
    icon: HelpCircle,
    color: "text-green-500"
  }
]

export function SimpleFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 overflow-hidden">
      {/* Floating Elements - Same as Hero */}
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
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header with Same Style as Hero */}
        <MotionDiv
          className="text-center mb-16"
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
                  <HelpCircle className="w-4 h-4 mr-2" />
                </motion.div>
                Got Questions? We've Got Answers
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
                Frequently Asked
              </GradientText>
              <motion.span 
                className="block text-3xl md:text-4xl mt-2 text-foreground/80"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                Questions
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.div variants={staggerItem}>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Everything you need to know about ClearPath AI and our revolutionary 
              logistics intelligence platform
            </motion.p>
          </motion.div>
        </MotionDiv>

        {/* FAQ Cards with Hero-style Animations */}
        <MotionDiv
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Card className="overflow-hidden backdrop-blur-sm bg-card/80 border border-border/50 hover:bg-card/90 hover:border-primary/20 transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <Button
                    variant="ghost"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full justify-between text-left p-0 h-auto hover:bg-transparent"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ${faq.color}`}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: 10,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <faq.icon className="w-5 h-5" />
                      </motion.div>
                      <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors">
                        {faq.question}
                      </CardTitle>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: openIndex === index ? 45 : 0,
                        scale: openIndex === index ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="ml-4 flex-shrink-0"
                    >
                      <Plus className="w-5 h-5 group-hover:text-primary transition-colors" />
                    </motion.div>
                  </Button>
                </CardHeader>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <CardContent className="pt-0">
                        <motion.div
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                          className="pl-14"
                        >
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </MotionDiv>
      </div>
    </section>
  )
}
