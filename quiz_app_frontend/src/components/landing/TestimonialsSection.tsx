import { TestimonialCard } from '@/components/shared/TestimonialCard';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <GraduationCap className="h-3 w-3 mr-1" />
            Student Feedback
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by <span className="text-gradient">ESPRIT Students</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from students and professors who use CCNA Quiz to prepare for certification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Ahmed Ben Salah"
            role="Networking Student, ESPRIT"
            content="CCNA Quiz helped me identify my weak areas in subnetting and routing protocols. I passed my CCNA exam on the first attempt thanks to the practice quizzes."
            rating={5}
          />
          <TestimonialCard
            name="Prof. Nadia Hammami"
            role="Cisco Instructor, ESPRIT"
            content="As an instructor, I use this platform to create targeted quizzes for my students. The analytics help me see which topics need more coverage in class."
            rating={5}
          />
          <TestimonialCard
            name="Yassine Khelifi"
            role="IT Engineering Student"
            content="The timed quiz mode really helped me prepare for exam pressure. The questions are well-written and cover all the CCNA 200-301 domains thoroughly."
            rating={5}
          />
        </div>
      </div>
    </section>
  );
}
