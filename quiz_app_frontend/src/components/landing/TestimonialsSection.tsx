import { TestimonialCard } from '@/components/shared/TestimonialCard';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <Heart className="h-3 w-3 mr-1" />
            What Parents Say
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Loved by <span className="text-gradient">Families</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what parents and children are saying about their QuizKids experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Johnson"
            role="Parent"
            content="My daughter absolutely loves QuizKids! She's learning so much and having fun at the same time. The progress tracking helps me see her improvement."
            rating={5}
          />
          <TestimonialCard
            name="Mike Chen"
            role="Teacher"
            content="As a teacher, I love how easy it is to create engaging quizzes. My students are more motivated to learn than ever before."
            rating={5}
          />
          <TestimonialCard
            name="Emma Wilson"
            role="Student"
            content="QuizKids is the best! I love earning points and badges. It makes studying feel like playing a game!"
            rating={5}
          />
        </div>
      </div>
    </section>
  );
}
