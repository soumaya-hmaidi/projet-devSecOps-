'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, User, Play, Eye } from 'lucide-react';
import Link from 'next/link';

interface QuizCardProps {
  quiz: {
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
  };
  showActions?: boolean;
  onStartQuiz?: (quizId: number) => void;
  onViewQuiz?: (quizId: number) => void;
  completionStatus?: { completed: boolean; score?: number; attemptId: number } | null;
}

export function QuizCard({ 
  quiz, 
  showActions = true, 
  onStartQuiz, 
  onViewQuiz,
  completionStatus
}: QuizCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <Badge variant={quiz.isActive ? "default" : "secondary"}>
                {quiz.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {completionStatus?.completed && (
                <Badge 
                  variant={completionStatus.score && completionStatus.score >= 80 ? "default" : "secondary"}
                  className={
                    completionStatus.score && completionStatus.score >= 80 
                      ? "bg-green-100 text-green-800" 
                      : completionStatus.score && completionStatus.score >= 60
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  Completed ({completionStatus.score}%)
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl font-bold text-gradient mb-2">
              {quiz.title}
            </CardTitle>
            {quiz.description && (
              <CardDescription className="text-sm text-muted-foreground">
                {quiz.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Quiz Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{quiz._count?.questions || 0} questions</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(quiz.createdAt)}</span>
              </div>
            </div>
            {quiz.createdBy && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{quiz.createdBy.name}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2 pt-2">
              {completionStatus?.completed ? (
                <>
                  <Button
                    asChild
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Link href={`/quiz/${quiz.id}/results`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Results
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Link href={`/quiz/${quiz.id}`}>
                      <Play className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => onStartQuiz?.(quiz.id)}
                  >
                    <Link href={`/quiz/${quiz.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Quiz
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewQuiz?.(quiz.id)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
