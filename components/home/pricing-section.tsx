'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const MotionCard = motion(Card);

const PricingSection = () => {
  const plans = [
    {
      title: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "1 Professional CV template",
        "Basic CV editor",
        "PDF export",
        "Save up to 2 versions",
        "Email support"
      ],
      buttonText: "Get Started",
      popular: false,
      gradient: "from-gray-100 to-gray-50"
    },
    {
      title: "Pro",
      price: "9.99",
      description: "Best for job seekers",
      features: [
        "All premium templates",
        "AI cover letter generator",
        "Application tracking",
        "Priority email support",
        "Unlimited CV versions",
        "Multiple export formats",
        "AI content suggestions"
      ],
      buttonText: "Try Pro",
      popular: true,
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      title: "Enterprise",
      price: "29.99",
      description: "For teams and businesses",
      features: [
        "Custom branding",
        "Team collaboration",
        "API access",
        "Dedicated support",
        "Admin dashboard",
        "Analytics & reporting",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-gray-100 to-gray-50"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-blue-600 font-semibold text-sm tracking-wider uppercase mb-4">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {plans.map((plan, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative group ${
                plan.popular ? 'shadow-2xl shadow-blue-500/20' : 'shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <CardContent className={`p-8 h-full ${
                plan.popular ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : ''
              }`}>
                <div className={`space-y-6 ${plan.popular ? 'text-white' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
                    <p className="text-sm opacity-80 mb-4">{plan.description}</p>
                    <div className="flex items-end justify-center gap-1 mb-6">
                      <span className="text-5xl font-bold">${plan.price}</span>
                      <span className="text-lg opacity-80">/month</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={`rounded-full p-1 ${
                          plan.popular ? 'bg-white/20' : 'bg-blue-100'
                        }`}>
                          <Check className={`h-4 w-4 ${
                            plan.popular ? 'text-white' : 'text-blue-600'
                          }`} />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-white text-blue-600 hover:bg-blue-50' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'
                    }`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg" />
            </MotionCard>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-gray-600"
        >
          <p className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>14-day money-back guarantee • No credit card required</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;