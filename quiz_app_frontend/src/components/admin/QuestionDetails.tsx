'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen,
  CheckCircle,
  Circle,
  Type,
  Hash,
  Copy,
  Calendar,
  User
} from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdBy: {
    name: string;
  };
  _count: {
    questions: number;
    attempts: number;
  };
}

interface Question {
  id: number;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  points: number;
  options?: Array<{
    id: number;
    text: string;
    isCorrect: boolean;
  }>;
  correctAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionDetailsProps {
  quiz: Quiz;
  question: Question;
  onClose: () => void;
  onEdit: () => void;
}

export function QuestionDetails({ quiz, question, onClose, onEdit }: QuestionDetailsProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete question:', question.id);
    }
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate question:', question);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'TRUE_FALSE':
        return <Circle className="h-5 w-5 text-green-600" />;
      case 'FILL_IN_BLANK':
        return <Type className="h-5 w-5 text-purple-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'TRUE_FALSE':
        return 'True/False';
      case 'FILL_IN_BLANK':
        return 'Fill in Blank';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Question Details</h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {getQuestionTypeLabel(question.type)}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {question.points} points
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={onEdit} className="bg-purple-600 hover:bg-purple-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Question
        </Button>
        
        <Button onClick={handleDuplicate} variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        
        <Button 
          onClick={handleDelete} 
          variant="outline" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {getQuestionTypeIcon(question.type)}
                <span className="ml-2">Question</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-900">{question.text}</p>
                </div>

                {/* Answer Options */}
                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Answer Options:</h4>
                    <div className="space-y-2">
                      {question.options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            option.isCorrect ? 'border-green-500 bg-green-100' : 'border-gray-300'
                          }`}>
                            {option.isCorrect && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <span className={`flex-1 ${
                            option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'
                          }`}>
                            {option.text}
                          </span>
                          {option.isCorrect && (
                            <Badge variant="default" className="text-xs">
                              Correct
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === 'TRUE_FALSE' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Correct Answer:</h4>
                    <div className="flex gap-4">
                      <div className={`px-4 py-2 rounded-lg border-2 ${
                        question.correctAnswer === 'true'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}>
                        True
                      </div>
                      <div className={`px-4 py-2 rounded-lg border-2 ${
                        question.correctAnswer === 'false'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}>
                        False
                      </div>
                    </div>
                  </div>
                )}

                {question.type === 'FILL_IN_BLANK' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Correct Answer:</h4>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="font-medium text-green-700">{question.correctAnswer}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Student View Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span className="text-sm font-medium text-blue-700">Question Preview</span>
                </div>
                
                <p className="text-gray-900 mb-4">{question.text}</p>

                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        <span className="text-gray-700">{option.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === 'TRUE_FALSE' && (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">True</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      <span className="text-gray-700">False</span>
                    </div>
                  </div>
                )}

                {question.type === 'FILL_IN_BLANK' && (
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      {question.text.replace('_____', '_____________')}
                    </p>
                    <Input placeholder="Type your answer here..." disabled />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                Question Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <div className="flex items-center mt-1">
                  {getQuestionTypeIcon(question.type)}
                  <span className="ml-2 text-sm font-medium">{getQuestionTypeLabel(question.type)}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Points</label>
                <div className="flex items-center mt-1">
                  <Hash className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-lg font-medium">{question.points}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm">{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm">{new Date(question.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quiz Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                <p className="text-xs text-gray-500">{quiz.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <Badge variant={quiz.isActive ? 'default' : 'secondary'} className="text-xs">
                  {quiz.isActive ? 'Active' : 'Draft'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Questions:</span>
                <span className="font-medium">{quiz._count.questions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Attempts:</span>
                <span className="font-medium">{quiz._count.attempts}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Question
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Preview Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
