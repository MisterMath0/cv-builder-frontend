'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const MotionCard = motion(Card);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The AI cover letter feature saved me hours of work. The templates are modern and the interface is intuitive. Highly recommended!",
      author: "Sarah J.",
      role: "Software Engineer",
      company: "Tech Corp",
      avatar: "assets/avatars/1.png",
      gradient: "from-blue-500/10 via-indigo-500/10 to-purple-500/10"
    },
    {
      quote: "Finally found a platform that makes CV creation simple and professional. Landed my dream job within weeks of using it!",
      author: "Michael R.",
      role: "Marketing Director",
      company: "Creative Agency",
      avatar: "assets/avatars/2.png",
      gradient: "from-indigo-500/10 via-purple-500/10 to-pink-500/10"
    },
    {
      quote: "The application tracking feature helps me stay organized in my job search. The AI suggestions are spot-on and very helpful.",
      author: "Emily L.",
      role: "Product Manager",
      company: "StartUp Inc",
      avatar: "assets/avatars/3.png",
      gradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 text-lg">
            Join thousands of satisfied professionals who've transformed their career journey
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group overflow-hidden backdrop-blur-sm"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-40`} />
              
              <CardContent className="relative p-8">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="h-8 w-8" />
                </div>

                {/* Rating */}
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 relative">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </CardContent>
            </MotionCard>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mt-16 text-gray-600"
        >
          <div className="text-center">
            <div className="font-bold text-3xl text-blue-600">50K+</div>
            <div className="text-sm">Active Users</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <div className="font-bold text-3xl text-blue-600">98%</div>
            <div className="text-sm">Success Rate</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-center">
            <div className="font-bold text-3xl text-blue-600">4.9/5</div>
            <div className="text-sm">User Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;