'use client';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  BookOpen,
  BarChart3,
  TrendingUp,
  Calendar,
  Globe,
  Lock,
  Eye,
  Play
} from 'lucide-react';
import { QuestionManagement } from './QuestionManagement';
import { Quiz } from '@/types/quiz';

interface QuizDetailsProps {
  quiz: Quiz;
  onClose: () => void;
  onEdit: () => void;
}

export function QuizDetails({ quiz, onClose, onEdit }: QuizDetailsProps) {
  const [showQuestionManagement, setShowQuestionManagement] = useState(false);

  if (showQuestionManagement) {
    return (
      <QuestionManagement 
        quiz={quiz}
        onClose={() => setShowQuestionManagement(false)}
      />
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete quiz:', quiz.id);
    }
  };

  const handlePublish = () => {
    if (confirm('Are you sure you want to publish this quiz? It will become visible to students.')) {
      // TODO: Implement publish functionality
      console.log('Publish quiz:', quiz.id);
    }
  };

  const handleArchive = () => {
    if (confirm('Are you sure you want to archive this quiz? It will no longer be visible to students.')) {
      // TODO: Implement archive functionality
      console.log('Archive quiz:', quiz.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={quiz.isActive ? 'default' : 'secondary'}
            className="text-sm"
          >
            {quiz.isActive ? 'Active' : 'Draft'}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={onEdit} className="bg-purple-600 hover:bg-purple-700">
          <Edit className="h-4 w-4 mr-2" />
          Edit Quiz
        </Button>
        
        {!quiz.isActive && (
          <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
            <Play className="h-4 w-4 mr-2" />
            Activate Quiz
          </Button>
        )}
        
        {quiz.isActive && (
          <Button onClick={handleArchive} variant="outline">
            Deactivate Quiz
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                Quiz Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center mt-1">
                    {quiz.isActive ? (
                      <>
                        <Globe className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-lg font-medium text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-gray-600 mr-2" />
                        <span className="text-lg font-medium text-gray-600">Draft</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created By</label>
                  <div className="flex items-center mt-1">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-lg font-medium">
                      {quiz.createdBy?.name || 'Unknown User'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm">{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm">{new Date(quiz.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Questions ({quiz.questions?.length || 0})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quiz.questions?.length && quiz.questions.length > 0 ? (
                <div className="space-y-4">
                  {quiz.questions.map((question, idx) => (
                    <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{question.question}</h4>
                            <Badge variant="outline" className="text-xs">
                              {question.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.points} pts
                            </Badge>
                          </div>
                          
                          {question.type === 'MULTIPLE_CHOICE' && question.options && question.options.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm text-gray-600 mb-2">Options:</div>
                              <div className="space-y-1">
                                {question.options.map((option, oIdx) => (
                                  <div key={option.id} className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">
                                      {String.fromCharCode(65 + oIdx)}.
                                    </span>
                                    <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'}>
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
                            <div className="mt-2">
                              <div className="text-sm text-gray-600 mb-2">Answer Type:</div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                                  <span className="text-sm text-gray-700">True</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                                  <span className="text-sm text-gray-700">False</span>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Students will select either True or False
                              </div>
                            </div>
                          )}
                          
                          {question.type === 'SHORT_ANSWER' && (
                            <div className="mt-2">
                              <div className="text-sm text-gray-600">Short Answer Question</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowQuestionManagement(true)}
                    >
                      Manage Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add questions to make your quiz complete
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowQuestionManagement(true)}
                  >
                    Add Questions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Recent Attempts ({quiz._count?.attempts || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {(quiz._count?.attempts || 0) > 0 ? 'View Attempts' : 'No attempts yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {(quiz._count?.attempts || 0) > 0 
                    ? 'View detailed attempt analytics and student performance'
                    : 'Student attempts will appear here once they start taking the quiz'
                  }
                </p>
                {(quiz._count?.attempts || 0) > 0 && (
                  <Button variant="outline">
                    View Analytics
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {quiz._count?.questions || quiz.questions?.length || 0}
                </div>
                <p className="text-sm text-gray-500">Questions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {quiz._count?.attempts || 0}
                </div>
                <p className="text-sm text-gray-500">Total Attempts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quiz.isActive ? 'Active' : 'Draft'}
                </div>
                <p className="text-sm text-gray-500">Status</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {quiz.createdBy?.name?.split(' ')[0] || 'Unknown'}
                </div>
                <p className="text-sm text-gray-500">Creator</p>
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
                <Users className="h-4 w-4 mr-2" />
                View Students
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
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
