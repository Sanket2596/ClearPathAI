"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
} from "@/components/ui/motion-components";
import {
  Github,
  Slack,
  Zap,
  Database,
  Cloud,
  Shield,
  Bot,
  Activity,
  Package,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";

const logisticsTools = [
  {
    name: "Package Tracking",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    name: "Fleet Management",
    icon: Truck,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    name: "Route Optimization",
    icon: MapPin,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    name: "Anomaly Detection",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    name: "Recovery System",
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    name: "Analytics Dashboard",
    icon: TrendingUp,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  {
    name: "AI Agents",
    icon: Bot,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
  },
  {
    name: "Real-time Monitoring",
    icon: Activity,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    name: "Data Integration",
    icon: Database,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },
  {
    name: "Cloud Infrastructure",
    icon: Cloud,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
  },
  {
    name: "Security & Compliance",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    name: "Automation Engine",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
];

export function ConnectedToolsSection() {
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
          {/* Left Column - Text Content */}
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
                    <Zap className="w-4 h-4 mr-2" />
                  </motion.div>
                  Seamless Integration
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
                  Everything you need,
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
                  connected
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
                Seamlessly connect your logistics operations with the tools you
                already use—no extra setup required. ClearPath AI integrates
                with your existing systems to create a unified, intelligent
                logistics ecosystem.
              </motion.p>
            </motion.div>

            {/* Feature List */}
            <MotionDiv
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              {[
                "One-click integrations with major logistics platforms",
                "Real-time data synchronization across all systems",
                "Unified dashboard for complete visibility",
                "AI-powered insights from connected data sources",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  variants={staggerItem}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.div>
              ))}
            </MotionDiv>
          </MotionDiv>

          {/* Right Column - Revolving Tools Animation */}
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative"
          >
            <motion.div
              variants={staggerItem}
              className="relative w-full h-96 flex items-center justify-center"
            >
              {/* Central Hub */}
              <motion.div
                className="absolute z-10 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>

              {/* Orbital Paths */}
              {[1, 2, 3].map((orbit, orbitIndex) => (
                <motion.div
                  key={orbit}
                  className="absolute border border-border/20 rounded-full"
                  style={{
                    width: `${120 + orbit * 80}px`,
                    height: `${120 + orbit * 80}px`,
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 15 + orbit * 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Tools on this orbit */}
                  {logisticsTools
                    .slice(orbitIndex * 4, (orbitIndex + 1) * 4)
                    .map((tool, toolIndex) => {
                      const angle = toolIndex * 90 + orbitIndex * 30;
                      const radius = 60 + orbit * 40;
                      const x = Math.cos((angle * Math.PI) / 180) * radius;
                      const y = Math.sin((angle * Math.PI) / 180) * radius;

                      return (
                        <motion.div
                          key={tool.name}
                          className="absolute w-12 h-12 rounded-xl backdrop-blur-sm border border-border/40 flex items-center justify-center cursor-pointer group"
                          style={{
                            left: `calc(50% + ${x}px - 24px)`,
                            top: `calc(50% + ${y}px - 24px)`,
                            background: `linear-gradient(135deg, ${tool.bgColor.replace("/10", "/20")}, ${tool.bgColor})`,
                          }}
                          whileHover={{
                            scale: 1.2,
                            rotate: 10,
                            transition: { duration: 0.2 },
                          }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            y: [0, -5, 0],
                            rotate: [0, 5, 0],
                          }}
                          transition={{
                            y: {
                              duration: 2 + toolIndex * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                            rotate: {
                              duration: 3 + toolIndex * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                        >
                          <tool.icon
                            className={`w-6 h-6 ${tool.color} group-hover:scale-110 transition-transform duration-200`}
                          />
                        </motion.div>
                      );
                    })}
                </motion.div>
              ))}

              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{
                    left: `${20 + i * 10}%`,
                    top: `${15 + i * 8}%`,
                  }}
                  animate={{
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}

              {/* Connection Lines */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1, duration: 2 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-px bg-gradient-to-b from-blue-500/50 to-transparent"
                    style={{
                      height: "100px",
                      left: "50%",
                      top: "50%",
                      transformOrigin: "bottom center",
                      transform: `rotate(${i * 60}deg)`,
                    }}
                    animate={{
                      scaleY: [0, 1, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
