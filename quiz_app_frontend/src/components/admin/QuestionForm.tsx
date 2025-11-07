'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Plus,
  Trash2,
  BookOpen,
  CheckCircle,
  Circle,
  Type,
  Hash
} from 'lucide-react';
import { questionSchema, type QuestionFormData } from '@/lib/validations';
import { useUpdateQuestion, useUpdateOption, useDeleteOption } from '@/hooks/useAdmin';

interface Question {
  id: number;
  quizId: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  options?: Array<{
    id: number;
    questionId: number;
    text: string;
    isCorrect: boolean;
    order: number;
    createdAt: string;
  }>;
  quiz?: {
    id: number;
    title: string;
    createdById: number;
  };
}

interface QuestionFormProps {
  question?: Question | null;
  onClose: () => void;
  onSave: () => void;
}

export function QuestionForm({ question, onClose, onSave }: QuestionFormProps) {
  const [questionType, setQuestionType] = useState<'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK'>(
    question?.type || 'MULTIPLE_CHOICE'
  );
  const isEditing = !!question;
  
  const updateQuestionMutation = useUpdateQuestion();
  const updateOptionMutation = useUpdateOption();
  const deleteOptionMutation = useDeleteOption();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question?.question || '',
      type: question?.type || 'MULTIPLE_CHOICE',
      points: question?.points || 1,
      options: question?.options || [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const watchedOptions = watch('options');

  useEffect(() => {
    setValue('type', questionType);
  }, [questionType, setValue]);

  const onSubmit = async (data: QuestionFormData) => {
    if (!question?.id) {
      console.error('No question ID available for update');
      return;
    }

    try {
      // Prepare the data for the API
      const updateData = {
        question: data.text,
        type: data.type,
        points: data.points,
        options: data.options.map((option, index) => ({
          text: option.text,
          isCorrect: option.isCorrect,
          order: index + 1,
        })),
      };

      await updateQuestionMutation.mutateAsync({
        questionId: question.id,
        data: updateData,
      });
      
      onSave();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const addOption = () => {
    append({ text: '', isCorrect: false });
  };

  const removeOption = async (index: number) => {
    if (fields.length > 2) {
      const option = watchedOptions[index];
      
      // If this is an existing option with an ID, delete it from the API
      if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
        try {
          await deleteOptionMutation.mutateAsync(option.id);
        } catch (error) {
          console.error('Error deleting option:', error);
          return; // Don't remove from form if API call fails
        }
      }
      
      remove(index);
    }
  };

  const setCorrectOption = async (index: number) => {
    // Update all options in the form
    watchedOptions.forEach((_, i) => {
      setValue(`options.${i}.isCorrect`, i === index);
    });

    // Update existing options in the API
    for (let i = 0; i < watchedOptions.length; i++) {
      const option = watchedOptions[i];
      if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
        try {
          await updateOptionMutation.mutateAsync({
            optionId: option.id,
            data: {
              isCorrect: i === index,
            },
          });
        } catch (error) {
          console.error('Error updating option:', error);
        }
      }
    }
  };

  const updateOptionText = async (index: number, text: string) => {
    const option = watchedOptions[index];
    if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
      try {
        await updateOptionMutation.mutateAsync({
          optionId: option.id,
          data: {
            text: text,
          },
        });
      } catch (error) {
        console.error('Error updating option text:', error);
      }
    }
  };

  const updateTrueFalseOptions = async (correctIndex: number) => {
    // Update both True and False options in the API
    for (let i = 0; i < 2; i++) {
      const option = watchedOptions[i];
      if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
        try {
          await updateOptionMutation.mutateAsync({
            optionId: option.id,
            data: {
              text: i === 0 ? 'True' : 'False',
              isCorrect: i === correctIndex,
            },
          });
        } catch (error) {
          console.error('Error updating True/False option:', error);
        }
      }
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'TRUE_FALSE':
        return <Circle className="h-4 w-4 text-green-600" />;
      case 'FILL_IN_BLANK':
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
            {isEditing ? 'Edit Question' : 'Add New Question'}
          </h1>
          <p className="text-gray-600">{question?.quiz?.title || 'Quiz'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
                  Question Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: CheckCircle },
                    { type: 'TRUE_FALSE', label: 'True/False', icon: Circle },
                    { type: 'FILL_IN_BLANK', label: 'Fill in Blank', icon: Type }
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK')}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        questionType === type
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${
                          questionType === type ? 'text-purple-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            questionType === type ? 'text-purple-900' : 'text-gray-900'
                          }`}>
                            {label}
                          </p>
                          <p className={`text-sm ${
                            questionType === type ? 'text-purple-600' : 'text-gray-500'
                          }`}>
                            {type === 'MULTIPLE_CHOICE' && 'Choose one correct answer'}
                            {type === 'TRUE_FALSE' && 'True or false statement'}
                            {type === 'FILL_IN_BLANK' && 'Fill in the missing word'}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Question Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getQuestionTypeIcon(questionType)}
                  <span className="ml-2">{getQuestionTypeLabel(questionType)} Question</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Question Text *</Label>
                  <textarea
                    id="text"
                    placeholder="Enter your question..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    {...register('text')}
                  />
                  {errors.text && (
                    <p className="text-sm text-red-500">{errors.text.message}</p>
                  )}
                </div>

                {/* Question Type Specific Fields */}
                {questionType === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Answer Options</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addOption}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setCorrectOption(index)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              watchedOptions[index]?.isCorrect
                                ? 'border-green-500 bg-green-100'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {watchedOptions[index]?.isCorrect && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </button>
                          <Input
                            placeholder={`Option ${index + 1}`}
                            {...register(`options.${index}.text`)}
                            className="flex-1"
                            onChange={(e) => {
                              // Update form value
                              setValue(`options.${index}.text`, e.target.value);
                              // Update API if this is an existing option
                              const option = watchedOptions[index];
                              if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
                                updateOptionText(index, e.target.value);
                              }
                            }}
                          />
                          {fields.length > 2 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Click the circle to mark the correct answer
                    </p>
                  </div>
                )}

                {questionType === 'TRUE_FALSE' && (
                  <div className="space-y-4">
                    <Label>Correct Answer</Label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={async () => {
                          setValue('options.0.text', 'True');
                          setValue('options.0.isCorrect', true);
                          setValue('options.1.text', 'False');
                          setValue('options.1.isCorrect', false);
                          
                          // Update API for existing options
                          await updateTrueFalseOptions(0);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          watchedOptions[0]?.isCorrect
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        True
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setValue('options.0.text', 'True');
                          setValue('options.0.isCorrect', false);
                          setValue('options.1.text', 'False');
                          setValue('options.1.isCorrect', true);
                          
                          // Update API for existing options
                          await updateTrueFalseOptions(1);
                        }}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          watchedOptions[1]?.isCorrect
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        False
                      </button>
                    </div>
                  </div>
                )}

                {questionType === 'FILL_IN_BLANK' && (
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    <Input
                      id="correctAnswer"
                      placeholder="Enter the correct answer"
                      value={watchedOptions[0]?.text || ''}
                      onChange={(e) => {
                        setValue('options.0.text', e.target.value);
                        setValue('options.0.isCorrect', true);
                        
                        // Update API if this is an existing option
                        const option = watchedOptions[0];
                        if (option && typeof option === 'object' && 'id' in option && typeof option.id === 'number') {
                          updateOptionMutation.mutateAsync({
                            optionId: option.id,
                            data: {
                              text: e.target.value,
                              isCorrect: true,
                            },
                          });
                        }
                      }}
                    />
                    <p className="text-sm text-gray-500">
                      Students will need to type this exact answer
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Hash className="h-4 w-4 mr-2 text-blue-600" />
                  Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="100"
                    {...register('points', { valueAsNumber: true })}
                    className={errors.points ? 'border-red-500' : ''}
                  />
                  {errors.points && (
                    <p className="text-sm text-red-500">{errors.points.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    How many points this question is worth
                  </p>
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
                  disabled={updateQuestionMutation.isPending}
                >
                  {updateQuestionMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Question
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                  disabled={updateQuestionMutation.isPending}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
