"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  MotionDiv,
  MotionH1,
  MotionP,
  TypewriterText,
  staggerContainer,
  staggerItem,
  fadeInUp,
  scaleIn,
  TiltCard,
  RippleEffect,
  MouseFollower,
} from "@/components/ui/motion-components";
import { Zap, Shield, TrendingUp, Bot, Sparkles, ChevronLeft, ChevronRight, Package, Truck, Globe, Clock } from "lucide-react";
import { FooterSection } from "@/components/footer-section";

const typingTexts = [
  "Lost Package Detection",
  "AI-Powered Recovery",
  "Real-time Monitoring",
  "Smart Logistics",
];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Cycle through typing texts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Bot,
      title: "AI Agents",
      description: "Autonomous investigation and recovery",
      color: "text-blue-500",
      gradient: "from-blue-500/20 to-blue-600/10",
      shadowColor: "rgba(59, 130, 246, 0.2)",
    },
    {
      icon: Zap,
      title: "Real-time",
      description: "Instant anomaly detection",
      color: "text-amber-500",
      gradient: "from-amber-500/20 to-amber-600/10",
      shadowColor: "rgba(245, 158, 11, 0.2)",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Enterprise-grade security",
      color: "text-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-600/10",
      shadowColor: "rgba(34, 197, 94, 0.2)",
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Advanced performance insights",
      color: "text-purple-500",
      gradient: "from-purple-500/20 to-purple-600/10",
      shadowColor: "rgba(147, 51, 234, 0.2)",
    },
  ];

  const carouselItems = [
    {
      icon: Package,
      title: "Package Tracking",
      description: "Real-time visibility across your entire supply chain",
      stats: "99.8% Accuracy",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-400/30"
    },
    {
      icon: Truck,
      title: "Fleet Management",
      description: "Optimize routes and reduce delivery times",
      stats: "23% Faster Delivery",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Seamless operations across 150+ countries",
      stats: "150+ Countries",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous AI surveillance and instant alerts",
      stats: "24/7 Active",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-400/30"
    }
  ];

  return (
    <div className="relative">
      <motion.div
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y, opacity }}
      >
        {/* Industrial Port Background Image */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: 'url(/images/bernd-dittrich-huciLx_BveI-unsplash.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Adaptive Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50 dark:bg-black/50" />
        </div>
        
        <AnimatedBackground />
        
        {/* Floating Industrial Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
              initial={{
                x: Math.random() * 1200,
                y: Math.random() * 800,
                opacity: 0
              }}
              animate={{
                y: [null, -150],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <MotionDiv
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header Badge */}
          <motion.div variants={staggerItem}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                variant="outline"
                className="mb-8 px-4 py-2 text-sm backdrop-blur-sm bg-primary/10 border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
              >
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
                  from="from-white"
                  to="to-blue-200"
                  animated
                  className="block drop-shadow-2xl"
                >
                  ClearPath AI
                </GradientText>
              </motion.div>
              <motion.span
                className="block text-3xl md:text-5xl mt-4 text-white drop-shadow-2xl font-semibold"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
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
                  className="text-xl md:text-2xl text-white font-mono drop-shadow-lg"
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
            <MotionP className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
              Revolutionary Agentic AI system that detects, investigates, and
              recovers lost packages in real-time. Transform your logistics
              operations with autonomous intelligence.
            </MotionP>
          </motion.div>

          {/* Feature Cards with Enhanced Interactions */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard
                  className="group relative h-full p-8 rounded-2xl backdrop-blur-md bg-card/60 border border-border/40 hover:bg-card/90 hover:border-border/60 transition-all duration-500 cursor-pointer overflow-hidden"
                  maxTilt={12}
                >
                  {/* Background Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(45deg, ${feature.shadowColor}, transparent, ${feature.shadowColor})`,
                      padding: "1px",
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 2,
                    }}
                  />

                  <RippleEffect>
                    <MouseFollower strength={0.08}>
                      <div className="relative z-10 flex flex-col items-center text-center h-full">
                        {/* Icon Container */}
                        <motion.div
                          className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 ${feature.color} shadow-lg`}
                          whileHover={{
                            scale: 1.15,
                            rotate: [0, -10, 10, 0],
                            transition: {
                              duration: 0.4,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            },
                          }}
                          animate={{
                            boxShadow: [
                              `0 0 0 0 ${feature.shadowColor}`,
                              `0 0 0 8px ${feature.shadowColor.replace("0.2", "0.1")}`,
                              `0 0 0 0 ${feature.shadowColor}`,
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.8,
                          }}
                        >
                          <feature.icon className="w-8 h-8" />

                          {/* Floating particles */}
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 bg-current rounded-full"
                            animate={{
                              y: [-4, -12, -4],
                              opacity: [0, 1, 0],
                              scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          />
                        </motion.div>

                        {/* Content */}
                        <div className="space-y-3 flex-1 flex flex-col justify-center">
                          <motion.h3
                            className="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {feature.title}
                          </motion.h3>

                          <motion.p
                            className="text-muted-foreground text-sm leading-relaxed"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {feature.description}
                          </motion.p>
                        </div>

                        {/* Bottom accent line */}
                        <motion.div
                          className={`w-0 h-0.5 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 mt-4`}
                        />
                      </div>
                    </MouseFollower>
                  </RippleEffect>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Premium Animated Carousel */}
          <motion.div
            className="mt-20 max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {/* Carousel Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                <GradientText from="from-blue-400" to="to-purple-400" animated>
                  Core Capabilities
                </GradientText>
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Discover the powerful features that make ClearPath AI the future of logistics
              </p>
            </motion.div>

            <div className="relative">
              {/* Main Carousel Container */}
              <div className="relative h-96 overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 border border-white/20 shadow-2xl">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCarouselIndex}
                    initial={{ opacity: 0, x: 100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -100, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <div className="text-center max-w-4xl">
                      {/* Premium Icon Container */}
                      <motion.div
                        className="relative mb-8"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${carouselItems[currentCarouselIndex].color} opacity-30 blur-xl`} />
                        
                        {/* Main Icon */}
                        <motion.div
                          className={`relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${carouselItems[currentCarouselIndex].color} flex items-center justify-center shadow-2xl border border-white/20`}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {(() => {
                            const IconComponent = carouselItems[currentCarouselIndex].icon;
                            return <IconComponent className="w-12 h-12 text-white" />;
                          })()}
                          
                          {/* Floating Particles around icon */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/60 rounded-full"
                              style={{
                                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 30}px`,
                                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                              }}
                              animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Title */}
                      <motion.h3
                        className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      >
                        <GradientText from="from-white" to="to-blue-200" animated>
                          {carouselItems[currentCarouselIndex].title}
                        </GradientText>
                      </motion.h3>

                      {/* Enhanced Description */}
                      <motion.p
                        className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                      >
                        {carouselItems[currentCarouselIndex].description}
                      </motion.p>

                      {/* Premium Stats Badge */}
                      <motion.div
                        className="inline-flex items-center space-x-4"
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                      >
                        <motion.div
                          className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${carouselItems[currentCarouselIndex].color} text-white font-bold text-xl shadow-2xl border border-white/20 backdrop-blur-sm`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ duration: 0.3 }}
                        >
                          {carouselItems[currentCarouselIndex].stats}
                        </motion.div>
                        
                        {/* Animated Sparkle */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-8 h-8 text-yellow-400" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Premium Navigation Arrows */}
                <motion.button
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-xl group"
                  onClick={() => setCurrentCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)}
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-7 h-7 group-hover:text-blue-400 transition-colors" />
                </motion.button>

                <motion.button
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center shadow-xl group"
                  onClick={() => setCurrentCarouselIndex((prev) => (prev + 1) % carouselItems.length)}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight className="w-7 h-7 group-hover:text-blue-400 transition-colors" />
                </motion.button>
              </div>

              {/* Premium Progress Indicator */}
              <div className="flex justify-center mt-8 space-x-4">
                {carouselItems.map((_, index) => (
                  <motion.button
                    key={index}
                    className="relative group"
                    onClick={() => setCurrentCarouselIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      index === currentCarouselIndex 
                        ? 'bg-white scale-125 shadow-lg' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`} />
                    
                    {/* Animated Ring for Active Item */}
                    {index === currentCarouselIndex && (
                      <motion.div
                        className="absolute inset-0 w-4 h-4 rounded-full border-2 border-white/60"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Slide Counter */}
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2 }}
              >
                <span className="text-white/60 text-sm font-mono">
                  {String(currentCarouselIndex + 1).padStart(2, '0')} / {String(carouselItems.length).padStart(2, '0')}
                </span>
              </motion.div>
            </div>
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
        </MotionDiv>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
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
  );
}
