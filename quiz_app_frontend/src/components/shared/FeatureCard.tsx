import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'primary' | 'secondary' | 'accent';
}

export function FeatureCard({ icon: Icon, title, description, color = 'primary' }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary-foreground',
    accent: 'bg-accent/10 text-accent-foreground'
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
      <CardHeader className="text-center p-6">
        <div className={`mx-auto w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="w-full h-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
      </CardContent>
    </Card>
  );
}
