import { Button } from '@/components/ui/button';
import { Network } from 'lucide-react';

interface CTASectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

export function CTASection({ onGetStarted, onLearnMore }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Ace Your <span className="text-gradient">CCNA Exam?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Join your classmates at ESPRIT and start practicing for the Cisco CCNA 200-301 certification today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
              <Network className="h-5 w-5 mr-2" />
              Start Practicing
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
