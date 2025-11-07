'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight,
  Flag
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points: number;
  order: number;
  options?: {
    id: number;
    text: string;
    isCorrect: boolean;
    order: number;
  }[];
}

interface QuizTakingProps {
  quiz: {
    id: number;
    title: string;
    description?: string;
    questions: Question[];
  };
  attemptId: number;
  onComplete: (answers: Record<number, any>) => void;
  onExit: () => void;
  onSubmitAnswer?: (questionId: number, answer: any) => Promise<void>;
}

export function QuizTaking({ quiz, attemptId, onComplete, onExit, onSubmitAnswer }: QuizTakingProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = async (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Auto-submit answer if onSubmitAnswer is provided
    if (onSubmitAnswer) {
      setIsSubmittingAnswer(true);
      try {
        await onSubmitAnswer(questionId, answer);
      } catch (error) {
        console.error('Error submitting answer:', error);
      } finally {
        setIsSubmittingAnswer(false);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(answers);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnswered = (questionId: number) => {
    return answers[questionId] !== undefined;
  };

  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gradient mb-2">
                {quiz.title}
              </CardTitle>
              {quiz.description && (
                <p className="text-muted-foreground">{quiz.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </Badge>
              <Button variant="outline" onClick={onExit}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="text-muted-foreground">
                {answeredCount} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((question, index) => (
              <Button
                key={question.id}
                variant={index === currentQuestionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`relative ${
                  isAnswered(question.id) 
                    ? 'bg-green-100 border-green-300 text-green-700' 
                    : ''
                }`}
              >
                {index + 1}
                {isAnswered(question.id) && (
                  <CheckCircle className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Question {currentQuestionIndex + 1}</span>
            <Badge variant="secondary">{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentQuestion.question}</p>

          {/* Multiple Choice */}
          {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* True/False */}
          {currentQuestion.type === 'TRUE_FALSE' && (
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="cursor-pointer">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="cursor-pointer">False</Label>
              </div>
            </RadioGroup>
          )}

          {/* Text Answer */}
          {currentQuestion.type === 'TEXT' && (
            <Input
              placeholder="Enter your answer..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              className="w-full"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {!isLastQuestion ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              <Flag className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
