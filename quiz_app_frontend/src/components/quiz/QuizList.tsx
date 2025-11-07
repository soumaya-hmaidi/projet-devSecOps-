'use client';

import { QuizCard } from './QuizCard';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Quiz {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
  _count?: {
    questions: number;
  };
  isActive?: boolean;
}

interface QuizListProps {
  quizzes: Quiz[];
  isLoading?: boolean;
  showActions?: boolean;
  onStartQuiz?: (quizId: number) => void;
  onViewQuiz?: (quizId: number) => void;
  title?: string;
  description?: string;
  getCompletionStatus?: (quizId: number) => { completed: boolean; score?: number; attemptId: number } | null;
}

export function QuizList({ 
  quizzes, 
  isLoading = false, 
  showActions = true,
  onStartQuiz,
  onViewQuiz,
  title = "Available Quizzes",
  description = "Choose a quiz to test your knowledge",
  getCompletionStatus
}: QuizListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && quiz.isActive) ||
                         (filterActive === 'inactive' && !quiz.isActive);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-gradient mb-2">No Quizzes Available</h3>
          <p className="text-muted-foreground text-center max-w-md">
            There are no quizzes available at the moment. Check back later or contact your instructor.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gradient">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filterActive === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('all')}
          >
            All
          </Button>
          <Button
            variant={filterActive === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('active')}
          >
            Active
          </Button>
          <Button
            variant={filterActive === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterActive('inactive')}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            showActions={showActions}
            onStartQuiz={onStartQuiz}
            onViewQuiz={onViewQuiz}
            completionStatus={getCompletionStatus?.(quiz.id)}
          />
        ))}
      </div>

      {filteredQuizzes.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            No quizzes match your search criteria. Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
}
