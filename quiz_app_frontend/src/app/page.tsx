'use client';

import { Header } from '@/components/shared/Header';
import { Hero } from '@/components/shared/Hero';
import { Footer } from '@/components/shared/Footer';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function Home() {
  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  const handleLearnMore = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleRegister = () => {
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <Hero 
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <CTASection 
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />
      </main>

      <Footer />
    </div>
  );
}