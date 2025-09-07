"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  fadeInUp,
  scaleIn,
  TiltCard,
  RippleEffect,
  MouseFollower,
} from "@/components/ui/motion-components";
import {
  Bot,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";

const aiFeatures = [
  {
    title: "Real-time Package Tracking",
    description:
      "Get instant updates on your package status with AI-powered monitoring",
    icon: Globe,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    title: "Intelligent Recovery",
    description:
      "AI agents automatically investigate and recover lost packages",
    icon: Zap,
    color: "text-purple-500",
    gradient: "from-purple-500/20 to-purple-600/10",
  },
  {
    title: "Predictive Analytics",
    description: "Anticipate potential issues before they become problems",
    icon: Bot,
    color: "text-green-500",
    gradient: "from-green-500/20 to-green-600/10",
  },
];

export function AIAssistantSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
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
          ease: "easeInOut",
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
          delay: 1,
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
          delay: 2,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - AI Chat Interface */}
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={staggerItem}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Badge
                  variant="outline"
                  className="mb-6 px-4 py-2 text-sm backdrop-blur-sm bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Bot className="w-4 h-4 mr-2" />
                  </motion.div>
                  AI-Powered Logistics
                </Badge>
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
                  Chat with AI
                </GradientText>
                <motion.span
                  className="block text-3xl md:text-4xl mt-2 text-foreground/80"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  viewport={{ once: true }}
                >
                  Assistant
                </motion.span>
              </motion.h2>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.p
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
              >
                Experience the future of logistics with our intelligent AI
                assistant. Get instant answers, track packages, and resolve
                issues with conversational AI that understands your logistics
                challenges.
              </motion.p>
            </motion.div>

            {/* AI Chat Interface Mockup */}
            <motion.div variants={staggerItem}>
              <TiltCard
                className="group relative h-80 rounded-2xl backdrop-blur-md bg-card/60 border border-border/40 hover:bg-card/90 hover:border-border/60 transition-all duration-500 cursor-pointer overflow-hidden"
                maxTilt={8}
              >
                <RippleEffect>
                  <MouseFollower strength={0.08}>
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Chat Header */}
                      <div className="flex items-center justify-between p-4 border-b border-border/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                                "0 0 0 8px rgba(59, 130, 246, 0.1)",
                                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Bot className="w-4 h-4 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              ClearPath AI Assistant
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Online • Ready to help
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 p-4 space-y-4 overflow-hidden">
                        <motion.div
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-3 max-w-xs">
                            <p className="text-sm text-foreground">
                              Hi! I'm your ClearPath AI assistant. I can help
                              you track packages, investigate anomalies, and
                              optimize your logistics operations.
                            </p>
                            <motion.div
                              className="flex items-center space-x-1 mt-2"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                            </motion.div>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-start space-x-3 justify-end"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1, duration: 0.5 }}
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl rounded-tr-sm p-3 max-w-xs">
                            <p className="text-sm text-white">
                              Can you check the status of package #CP-2024-001?
                            </p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white font-semibold">
                              U
                            </span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-start space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.5, duration: 0.5 }}
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-3 max-w-xs">
                            <p className="text-sm text-foreground">
                              Package #CP-2024-001 is currently in transit and
                              on schedule. Expected delivery: Tomorrow by 3 PM.
                              Would you like me to set up real-time tracking
                              alerts?
                            </p>
                            <motion.div
                              className="flex items-center space-x-1 mt-2"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                              <div className="w-1 h-1 bg-current rounded-full"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-border/20">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted/30 rounded-full px-4 py-2 text-sm text-muted-foreground">
                            Type your message...
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                          >
                            <ArrowRight className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </MouseFollower>
                </RippleEffect>
              </TiltCard>
            </motion.div>
          </MotionDiv>

          {/* Right Column - Features and CTA */}
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={staggerItem}>
              <motion.h3
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
              >
                <GradientText from="from-blue-600" to="to-purple-600" animated>
                  Intelligent Logistics
                </GradientText>
              </motion.h3>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.p
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                ClearPath AI powers the next generation of logistics
                intelligence through world-class AI agents, real-time
                monitoring, predictive analytics, and autonomous problem-solving
                capabilities.
              </motion.p>
            </motion.div>

            {/* Feature Cards */}
            <MotionDiv
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {aiFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                  className="group"
                >
                  <Card className="p-4 backdrop-blur-sm bg-card/60 border border-border/40 hover:bg-card/90 hover:border-primary/20 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center ${feature.color} shadow-lg`}
                        whileHover={{
                          scale: 1.15,
                          rotate: 10,
                          transition: { duration: 0.2 },
                        }}
                        animate={{
                          boxShadow: [
                            `0 0 0 0 ${feature.color.replace("text-", "rgba(59, 130, 246, 0.2)")}`,
                            `0 0 0 4px ${feature.color.replace("text-", "rgba(59, 130, 246, 0.1)")}`,
                            `0 0 0 0 ${feature.color.replace("text-", "rgba(59, 130, 246, 0.2)")}`,
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      >
                        <feature.icon className="w-6 h-6" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </MotionDiv>

            {/* CTA Buttons */}
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  onClick={() => setIsChatOpen(true)}
                >
                  <motion.div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                    </motion.div>
                    Chat with AI Assistant
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
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm bg-background/50 hover:bg-background/80 border border-border shadow-lg"
                >
                  <motion.div className="flex items-center">
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    Explore Features
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
