'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Sparkles, Check } from "lucide-react";
import Link from "next/link";

const MotionDiv = motion.div;

const HeroSection = () => {
  const gridVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 0.3, scale: 1 }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {/* Animated background grid remains unchanged */}
      <div className="absolute inset-0 z-0">
        <MotionDiv 
          className="grid grid-cols-12 h-full w-full"
          variants={gridVariants}
          initial="initial"
          animate="animate"
        >
          {[...Array(60)].map((_, i) => (
            <MotionDiv
              key={i}
              variants={dotVariants}
              className="w-2 h-2 bg-blue-500 rounded-full m-auto opacity-[0.15]"
            />
          ))}
        </MotionDiv>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            {/* Badge */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white"
            >
              <Sparkles className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium">AI-Powered Resume Builder</span>
            </MotionDiv>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
              Create Your Future With a 
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text"> Perfect CV</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-blue-100">
              Stand out from the crowd with professionally designed templates and AI-powered tools that help you create impactful resumes and cover letters.
            </p>

            {/* Feature Bullets */}
            <div className="space-y-3 text-white">
              {[
                "AI-powered content suggestions",
                "ATS-friendly templates",
                "Real-time preview & editing"
              ].map((feature, index) => (
                <MotionDiv
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-5 w-5 text-blue-400" />
                  <span>{feature}</span>
                </MotionDiv>
              ))}
            </div>

            {/* CTA Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold" 
                asChild
              >
                <Link href="/cv/create">
                  Create Your CV
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-black border-white hover:bg-white/10 font-semibold"
              >
                View Templates
              </Button>
            </MotionDiv>
          </MotionDiv>

          {/* Right Column - Interactive Preview */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Floating CV Preview */}
            <div className="relative">
              {/* Background Blob */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full filter blur-3xl" />
              
              {/* Main Preview Card */}
              <MotionDiv
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative bg-white rounded-lg shadow-2xl p-6 transform -rotate-6"
              >
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse" />
                    <div className="h-4 w-4/6 bg-gray-300 rounded animate-pulse" />
                  </div>
                </div>
              </MotionDiv>

              {/* Floating Elements */}
              <MotionDiv
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500/20 rounded-full backdrop-blur-sm"
              />
              <MotionDiv
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full backdrop-blur-sm"
              />
            </div>

            {/* Stats Overlay */}
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4"
            >
              <div className="flex gap-6 text-gray">
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-blue-600">CVs Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm text-blue-600">Success Rate</div>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;