import React from 'react';
import HeroSection from '@/components/hero-section';
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import CTASection from "@/components/cta-section";

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