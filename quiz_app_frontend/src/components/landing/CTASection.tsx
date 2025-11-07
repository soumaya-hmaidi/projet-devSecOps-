import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface CTASectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function CTASection({ onGetStarted, onLearnMore }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-children">
      <div className="container px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Your <span className="text-gradient">Learning Adventure?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of children who are already learning and having fun with QuizKids.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              <BookOpen className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" onClick={onLearnMore} className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
