'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Edit, Briefcase, Sparkles, Rocket, Target } from "lucide-react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }: any) => (
  <MotionCard
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="relative overflow-hidden group"
  >
    <CardContent className="p-8 relative z-10">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{ background: gradient }}
      />
      
      {/* Icon Container */}
      <div className="mb-6 relative">
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10"
        >
          <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
        </motion.div>
        {/* Decorative dots */}
        <div className="absolute -right-2 top-0 w-2 h-2 rounded-full bg-blue-400/30" />
        <div className="absolute -right-4 top-2 w-1 h-1 rounded-full bg-purple-400/30" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-white/80 transition-colors duration-300">
        {description}
      </p>
    </CardContent>
  </MotionCard>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart CV Builder",
      description: "Create professional CVs with AI-powered suggestions and ATS-friendly templates designed to showcase your potential.",
      gradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(67, 56, 202, 0.9) 100%)"
    },
    {
      icon: Edit,
      title: "AI Cover Letters",
      description: "Generate compelling cover letters tailored to each job using advanced AI that understands your experience and the role.",
      gradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)"
    },
    {
      icon: Target,
      title: "Application Tracking",
      description: "Streamline your job search with our intelligent tracking system that helps you manage applications and deadlines.",
      gradient: "linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(236, 72, 153, 0.9) 100%)"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent -z-10" />
      
      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-block text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Everything You Need For Your Job Search
          </h2>
          <p className="text-gray-600 text-lg">
            Powerful tools and features designed to make your job search efficient and successful
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent rounded-3xl -z-10" />
          
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;