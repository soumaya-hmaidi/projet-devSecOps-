import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export function TestimonialCard({ name, role, content, rating, avatar }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <p className="text-muted-foreground italic">"{content}"</p>

          {/* Author */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
