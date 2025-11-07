import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Zap className="h-3 w-3 mr-1" />
            Simple Steps
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in just a few simple steps and begin your learning journey today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Sign Up</h3>
            <p className="text-muted-foreground">
              Create your account as a student or teacher and set up your profile.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-secondary-foreground">2</span>
            </div>
            <h3 className="text-xl font-semibold">Choose or Create</h3>
            <p className="text-muted-foreground">
              Select from existing quizzes or create your own custom learning content.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-accent-foreground">3</span>
            </div>
            <h3 className="text-xl font-semibold">Start Learning</h3>
            <p className="text-muted-foreground">
              Take quizzes, earn points, and watch your knowledge grow every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
