'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen,
  CheckCircle,
  Type,
  Hash,
  MoreHorizontal,
  Eye,
  Copy
} from 'lucide-react';
// import { QuestionForm } from './QuestionForm';
// import { QuestionDetails } from './QuestionDetails';
import { Question, Quiz } from '@/types/quiz';
import { useDeleteQuestion } from '@/hooks/useAdmin';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';

interface QuestionManagementProps {
  quiz: Quiz;
  onClose: () => void;
}

export function QuestionManagement({ quiz, onClose }: QuestionManagementProps) {
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  // Use actual questions from quiz data
  const questions: Question[] = quiz.questions || [];
  
  // Delete question mutation
  const deleteQuestionMutation = useDeleteQuestion();

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setShowQuestionDetails(true);
  };

  const handleDeleteQuestion = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setQuestionToDelete(question);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteQuestion = () => {
    if (questionToDelete) {
      deleteQuestionMutation.mutate(questionToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setQuestionToDelete(null);
          // If we're in question details view, go back to questions list
          if (showQuestionDetails) {
            setShowQuestionDetails(false);
            setSelectedQuestion(null);
          }
          console.log('Question deleted successfully');
        },
        onError: (error) => {
          console.error('Failed to delete question:', error);
        }
      });
    }
  };

  const cancelDeleteQuestion = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const handleDuplicateQuestion = (question: Question) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate question:', question);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'TRUE_FALSE':
        return <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>;
      case 'FILL_IN_BLANK':
        return <Type className="h-4 w-4 text-purple-600" />;
      case 'SHORT_ANSWER':
        return <Type className="h-4 w-4 text-purple-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />;
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

  if (showQuestionForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowQuestionForm(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h1>
              <p className="text-gray-600">Create or modify a question for &quot;{quiz.title}&quot;</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Question Form Coming Soon
              </h3>
              <p className="text-gray-600 mb-4">
                The question form will allow you to create and edit questions with multiple choice options, true/false, and short answer types.
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setShowQuestionForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // TODO: Implement save functionality
                    setShowQuestionForm(false);
                    setEditingQuestion(null);
                  }}
                >
                  Save Question
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuestionDetails && selectedQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setShowQuestionDetails(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Questions
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Question Details</h1>
              <p className="text-gray-600">View and manage question details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowQuestionDetails(false);
                handleEditQuestion(selectedQuestion);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={deleteQuestionMutation.isPending}
              onClick={() => {
                setQuestionToDelete(selectedQuestion);
                setShowDeleteModal(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getQuestionTypeIcon(selectedQuestion.type)}
              Question #{selectedQuestion.order}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Question Text</label>
              <p className="text-lg font-medium text-gray-900 mt-1">{selectedQuestion.question}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-sm text-gray-900 mt-1">{selectedQuestion.type.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Points</label>
                <p className="text-sm text-gray-900 mt-1">{selectedQuestion.points}</p>
              </div>
            </div>

            {selectedQuestion.type === 'MULTIPLE_CHOICE' && selectedQuestion.options && selectedQuestion.options.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Options</label>
                <div className="mt-2 space-y-2">
                  {selectedQuestion.options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-sm text-gray-900">{option.text}</span>
                      </div>
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

            {selectedQuestion.type === 'TRUE_FALSE' && (
              <div>
                <label className="text-sm font-medium text-gray-500">Answer Type</label>
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-3">Students will select one option:</div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-white flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-base font-medium text-green-700">True</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-base font-medium text-red-700">False</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <strong>Note:</strong> This is a binary choice question where students must select either True or False as their answer.
                  </div>
                </div>
              </div>
            )}

            {selectedQuestion.type === 'SHORT_ANSWER' && (
              <div>
                <label className="text-sm font-medium text-gray-500">Answer Type</label>
                <p className="text-sm text-gray-900 mt-1">Short Answer Question</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
            <p className="text-gray-600">{quiz.title}</p>
          </div>
        </div>
        <Button onClick={handleCreateQuestion} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Quiz Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span className="font-medium">{questions.length} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{questions.reduce((sum, q) => sum + q.points, 0)} Total Points</span>
              </div>
            </div>
            <Badge variant={quiz.isActive ? 'default' : 'secondary'}>
              {quiz.isActive ? 'Active Quiz' : 'Draft Quiz'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                {/* Left side - Question Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getQuestionTypeIcon(question.type)}
                        <Badge variant="outline" className="text-xs">
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.points} points
                        </Badge>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {question.question}
                      </h3>
                      
                      {/* Question Preview */}
                      <div className="mt-3">
                        {question.type === 'MULTIPLE_CHOICE' && question.options && (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <div key={option.id} className="flex items-center gap-2 text-sm">
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  option.isCorrect ? 'border-green-500 bg-green-100' : 'border-gray-300'
                                }`}>
                                  {option.isCorrect && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-0.5"></div>
                                  )}
                                </div>
                                <span className={option.isCorrect ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                  {option.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'TRUE_FALSE' && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-2">Answer Options:</div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                                <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-white flex items-center justify-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium text-green-700">True</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                                <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-white flex items-center justify-center">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-sm font-medium text-red-700">False</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Students select one option
                            </div>
                          </div>
                        )}
                        
                        {question.type === 'SHORT_ANSWER' && (
                          <div className="text-sm">
                            <span className="text-gray-600">Short Answer Question</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2 ml-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewQuestion(question)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditQuestion(question)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateQuestion(question)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={deleteQuestionMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {questions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Add questions to make your quiz complete
            </p>
            <Button onClick={handleCreateQuestion} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Question
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteQuestion}
        onConfirm={confirmDeleteQuestion}
        title="Delete Question"
        message={`Are you sure you want to delete "${questionToDelete?.question}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteQuestionMutation.isPending}
      />
    </div>
  );
}
