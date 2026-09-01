import { FeatureCard } from '@/components/shared/FeatureCard';
import { Badge } from '@/components/ui/badge';
import {
  Network,
  Trophy,
  Users,
  Target,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Students Choose <span className="text-gradient">CCNA Quiz</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to prepare for the Cisco CCNA 200-301 certification exam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Network}
            title="Exam Simulation"
            description="Practice with questions that mirror the real CCNA 200-301 exam format and difficulty."
            color="primary"
          />
          <FeatureCard
            icon={Trophy}
            title="Score Tracking"
            description="Track your progress across all CCNA domains and identify areas that need improvement."
            color="secondary"
          />
          <FeatureCard
            icon={Users}
            title="Peer Practice"
            description="Compare your scores with classmates and study together for better results."
            color="accent"
          />
          <FeatureCard
            icon={Target}
            title="Topic Coverage"
            description="Complete coverage of all 6 CCNA exam domains: Network Fundamentals, Access, IP Connectivity, Services, Security, and Automation."
            color="primary"
          />
          <FeatureCard
            icon={Clock}
            title="Timed Quizzes"
            description="Practice under exam conditions with timed quizzes to build speed and confidence."
            color="secondary"
          />
          <FeatureCard
            icon={Shield}
            title="University-Backed"
            description="Created and maintained by ESPRIT University networking professors and Cisco instructors."
            color="accent"
          />
        </div>
      </div>
    </section>
  );
}
