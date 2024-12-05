'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket, Shield, Clock } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  const benefits = [
    {
      icon: Rocket,
      text: "Get Started in Minutes"
    },
    {
      icon: Shield,
      text: "Money Back Guarantee"
    },
    {
      icon: Clock,
      text: "24/7 Support"
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and dots pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Dot pattern overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative px-4 py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-100 mb-8"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Start Your Journey Today</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your Job Search?
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto"
          >
            Create your professional CV in minutes with our easy-to-use platform. Join thousands of successful job seekers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
              asChild
            >
              <Link href="/cv/create" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-black font-bold border-white hover:bg-white/10"
              asChild
            >
              <Link href="/templates">View Templates</Link>
            </Button>
          </motion.div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-center gap-2 text-blue-100"
              >
                <benefit.icon className="h-5 w-5" />
                <span>{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute left-1/4 -top-12 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute right-1/4 -bottom-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;