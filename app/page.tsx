import React from 'react';
import HeroSection from '@/components/home/hero-section';
import FeaturesSection from "@/components/home/features-section";
import HowItWorks from "@/components/home/how-it-works";
import PricingSection from "@/components/home/pricing-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />


      {/* Features Grid */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialsSection />


      {/* CTA Section */}
      <CTASection />

    </div>
  );
}