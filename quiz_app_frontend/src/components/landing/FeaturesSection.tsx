import { FeatureCard } from '@/components/shared/FeatureCard';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
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
            Amazing Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Kids Love <span className="text-gradient">QuizKids</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make learning fun and engaging for children of all ages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Brain}
            title="Smart Learning"
            description="AI-powered quizzes that adapt to each child's learning pace and style."
            color="primary"
          />
          <FeatureCard
            icon={Trophy}
            title="Gamification"
            description="Earn points, badges, and unlock achievements as you learn and grow."
            color="secondary"
          />
          <FeatureCard
            icon={Users}
            title="Social Learning"
            description="Challenge friends, join study groups, and learn together in a fun environment."
            color="accent"
          />
          <FeatureCard
            icon={Target}
            title="Progress Tracking"
            description="Monitor learning progress with detailed analytics and personalized insights."
            color="primary"
          />
          <FeatureCard
            icon={Clock}
            title="Flexible Timing"
            description="Learn at your own pace with quizzes that fit your schedule perfectly."
            color="secondary"
          />
          <FeatureCard
            icon={Shield}
            title="Safe Environment"
            description="Child-safe platform with parental controls and secure learning environment."
            color="accent"
          />
        </div>
      </div>
    </section>
  );
}
