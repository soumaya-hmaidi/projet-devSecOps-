'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, Star, Users, Trophy, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function Hero({ onGetStarted, onLearnMore }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 sm:py-20 lg:py-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Sparkles className="h-3 w-3 mr-1" />
                Cisco CCNA Certification Prep
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master Cisco
                <span className="text-gradient block">CCNA Networking</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Prepare for your CCNA certification with interactive quizzes covering
                routing, switching, network security, and IP connectivity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
                <Network className="h-5 w-5 mr-2" />
                Start Practicing
              </Button>
              <Button variant="outline" size="lg" onClick={onLearnMore} className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">CCNA Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Exam Domains</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">ESPRIT</div>
                <div className="text-sm text-muted-foreground">University</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="relative w-full h-96 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
                {/* Floating elements */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-green-100 rounded-full px-3 py-1">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Correct!</span>
                  </div>
                </div>

                <div className="absolute top-16 left-4">
                  <div className="flex items-center space-x-1 bg-blue-100 rounded-full px-3 py-1">
                    <Trophy className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Score: 85%</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-8">
                  <div className="flex items-center space-x-1 bg-purple-100 rounded-full px-3 py-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">CCNA 200-301</span>
                  </div>
                </div>

                {/* Central content */}
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Network className="h-8 w-8 text-primary-foreground" />
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Network Quiz</h3>
                    <p className="text-muted-foreground">Which layer of the OSI model handles routing?</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    <Button variant="outline" size="sm">
                      Transport
                    </Button>
                    <Button variant="outline" size="sm">
                      Data Link
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary text-primary">
                      Network
                    </Button>
                    <Button variant="outline" size="sm">
                      Session
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary rounded-full float-gentle" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-primary rounded-full float-gentle" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-accent rounded-full float-gentle" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
