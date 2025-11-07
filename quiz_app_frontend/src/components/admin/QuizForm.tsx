'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  BookOpen,
  Clock,
  Globe,
  Lock,
  CheckCircle,
  Type,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { quizSchema, type QuizFormData } from '@/lib/validations';
import { Quiz } from '@/types/quiz';
import { ConfirmationModal } from '@/components/shared/ConfirmationModal';
import { useDeleteQuestion } from '@/hooks/useAdmin';
import { useUpdateQuiz } from '@/hooks/useQuiz';

interface QuizFormProps {
  quiz?: Quiz | null;
  onClose: () => void;
  onSave: () => void;
}

export function QuizForm({ quiz, onClose, onSave }: QuizFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const isEditing = !!quiz;

  // Delete question mutation
  const deleteQuestionMutation = useDeleteQuestion();
  
  // Update quiz mutation
  const updateQuizMutation = useUpdateQuiz();

  const handleDeleteQuestion = (questionId: number) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  const handleEditQuestion = (questionId: number) => {
    router.push(`/admin/questions/edit/${questionId}`);
  };

  const confirmDeleteQuestion = () => {
    if (questionToDelete) {
      deleteQuestionMutation.mutate(questionToDelete, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setQuestionToDelete(null);
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

  // Helper functions for question display
  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'TRUE_FALSE':
        return <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>;
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
      case 'SHORT_ANSWER':
        return 'Short Answer';
      default:
        return 'Unknown';
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: quiz?.title || '',
      description: quiz?.description || '',
      timeLimit: 30, // Default time limit since it's not in API
      isActive: quiz?.isActive || false,
    },
  });

  const isActive = watch('isActive');

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && quiz) {
        // Update existing quiz
        await updateQuizMutation.mutateAsync({
          id: quiz.id,
          data: {
            title: data.title,
            description: data.description,
            isActive: data.isActive
          }
        });
      } else {
        // TODO: Implement create quiz functionality
        console.log('Creating new quiz:', data);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your quiz details' : 'Set up your quiz information'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter quiz title"
                    {...register('title')}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    placeholder="Describe what this quiz is about..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                    Questions ({quiz?.questions?.length || 0})
                  </div>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && quiz?.questions && quiz.questions.length > 0 ? (
                  <div className="space-y-4">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-2">
                                {getQuestionTypeIcon(question.type)}
                                <Badge variant="outline" className="text-xs">
                                  {getQuestionTypeLabel(question.type)}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {question.points} pts
                                </Badge>
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-900 mb-2">{question.question}</h4>
                            
                            {/* Question Preview */}
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
                              </div>
                            )}
                            
                            {question.type === 'SHORT_ANSWER' && (
                              <div className="mt-2">
                                <div className="text-sm text-gray-600">Short Answer Question</div>
                              </div>
                            )}
                          </div>
                          
                          {/* Question Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditQuestion(question.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deleteQuestionMutation.isPending}
                              onClick={() => {
                                handleDeleteQuestion(question.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isEditing ? 'No questions yet' : 'Add Questions'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {isEditing 
                        ? 'Add questions to make your quiz complete'
                        : 'You can add questions after creating the quiz'
                      }
                    </p>
                    {isEditing && (
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Question
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Time Limit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  Time Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Duration (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min="1"
                    max="120"
                    {...register('timeLimit', { valueAsNumber: true })}
                    className={errors.timeLimit ? 'border-red-500' : ''}
                  />
                  {errors.timeLimit && (
                    <p className="text-sm text-red-500">{errors.timeLimit.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Set how long students have to complete the quiz
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Status Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  {isActive ? (
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2 text-gray-600" />
                  )}
                  Quiz Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <Label htmlFor="isActive" className="text-base font-medium">
                        Active Quiz
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Make this quiz available for students to take
                      </p>
                    </div>
                    <div className="ml-4">
                      <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={(checked) => setValue('isActive', checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="text-sm font-medium text-primary">
                            Quiz is Active
                          </p>
                          <p className="text-xs text-primary/70">
                            Students can see and take this quiz
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isActive && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Lock className="h-5 w-5 text-gray-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Quiz is Inactive
                          </p>
                          <p className="text-xs text-gray-600">
                            This quiz is hidden from students
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting || updateQuizMutation.isPending}
                >
                  {(isSubmitting || updateQuizMutation.isPending) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditing ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update Quiz' : 'Create Quiz'}
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                  disabled={isSubmitting || updateQuizMutation.isPending}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteQuestion}
        onConfirm={confirmDeleteQuestion}
        title="Delete Question"
        message={`Are you sure you want to delete this question? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteQuestionMutation.isPending}
      />
    </div>
  );
}
