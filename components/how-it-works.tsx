'use client';

import { motion } from "framer-motion";
import { FileText, Edit, Zap, ArrowRight, ArrowRightCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Choose Template",
      description: "Select from our professionally designed templates",
      gradient: "from-blue-500/20 to-indigo-500/20"
    },
    {
      icon: Edit,
      title: "Fill Details",
      description: "Input your information with our easy-to-use editor",
      gradient: "from-indigo-500/20 to-purple-500/20"
    },
    {
      icon: Zap,
      title: "Generate Cover Letter",
      description: "Use AI to create personalized cover letters",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: ArrowRightCircle,
      title: "Apply & Track",
      description: "Submit applications and track your progress",
      gradient: "from-pink-500/20 to-rose-500/20"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg">
            Four simple steps to create your professional CV and land your dream job
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-24 left-[25%] right-[25%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-4 text-6xl font-bold text-gray-100/80 select-none">
                {index + 1}
              </div>

              <div className="text-center relative group">
                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} 
                    p-5 relative overflow-hidden transition-all duration-300
                    before:absolute before:inset-0 before:bg-white before:rounded-2xl before:-z-10
                    group-hover:shadow-xl group-hover:shadow-blue-500/20`}
                >
                  <step.icon className="w-full h-full text-blue-600 group-hover:text-blue-700 transition-colors" />
                </motion.div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;