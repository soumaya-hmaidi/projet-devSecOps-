'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TeacherLayout } from '@/components/teacher/TeacherLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { teacherAPI } from '@/lib/api/teacher';
import { toast } from 'sonner';

interface QuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: number;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points: number;
  options: QuestionOption[];
  isNew?: boolean;
}

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string, 10);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    teacherAPI.getQuiz(quizId)
      .then((res: any) => {
        const quiz = res.data.data;
        setTitle(quiz.title);
        setDescription(quiz.description || '');
        setIsActive(quiz.isActive);
        setQuestions(quiz.questions || []);
      })
      .catch(() => { toast.error('Failed to load quiz'); router.push('/teacher/quizzes'); })
      .finally(() => setIsLoading(false));
  }, [quizId]);

  const addQuestion = (type: Question['type']) => {
    const newQ: Question = {
      question: '',
      type,
      points: 1,
      isNew: true,
      options: type === 'TRUE_FALSE'
        ? [{ text: 'True', isCorrect: true }, { text: 'False', isCorrect: false }]
        : type === 'MULTIPLE_CHOICE'
          ? [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
          : []
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const removeQuestion = async (index: number) => {
    const q = questions[index];
    if (q.id) {
      if (!confirm('Delete this question? Student answers for it will also be removed.')) return;
      try {
        await teacherAPI.deleteQuestion(q.id);
        toast.success('Question deleted');
      } catch {
        toast.error('Failed to delete question');
        return;
      }
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
  };

  const addOption = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIndex ? { ...q, options: [...q.options, { text: '', isCorrect: false }] } : q
    ));
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setQuestions(prev => prev.map((q, i) =>
      i === qIndex ? { ...q, options: q.options.filter((_, oi) => oi !== oIndex) } : q
    ));
  };

  const updateOption = (qIndex: number, oIndex: number, field: keyof QuestionOption, value: any) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const options = q.options.map((opt, oi) => {
        if (oi !== oIndex) {
          return field === 'isCorrect' && value ? { ...opt, isCorrect: false } : opt;
        }
        return { ...opt, [field]: value };
      });
      return { ...q, options };
    }));
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Quiz title is required'); return; }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) { toast.error(`Question ${i + 1} text is required`); return; }
      if (q.type !== 'TEXT') {
        if (q.options.some(o => !o.text.trim())) { toast.error(`All options in question ${i + 1} must have text`); return; }
        if (!q.options.some(o => o.isCorrect)) { toast.error(`Question ${i + 1} must have a correct answer`); return; }
      }
    }

    setIsSaving(true);
    try {
      // Update quiz metadata
      await teacherAPI.updateQuiz(quizId, { title, description, isActive });

      // Save new/updated questions
      for (const q of questions) {
        if (q.isNew) {
          await teacherAPI.addQuestion(quizId, {
            question: q.question,
            type: q.type,
            points: q.points,
            options: q.options
          });
        } else if (q.id) {
          await teacherAPI.updateQuestion(q.id, {
            question: q.question,
            type: q.type,
            points: q.points,
            options: q.options
          });
        }
      }

      toast.success('Quiz saved successfully!');
      router.push('/teacher/quizzes');
    } catch {
      toast.error('Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/teacher/quizzes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Quiz</h1>
            <p className="text-gray-600">Modify quiz details and questions.</p>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Quiz Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz title" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4" />
              <Label htmlFor="isActive">Published (students can take it)</Label>
            </div>
          </CardContent>
        </Card>

        {questions.map((q, qIndex) => (
          <Card key={qIndex} className="border-l-4 border-l-teal-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>Question {qIndex + 1}</span>
                  <Badge variant="outline">{q.type.replace('_', ' ')}</Badge>
                  {q.isNew && <Badge className="bg-teal-100 text-teal-700 border-teal-300">New</Badge>}
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeQuestion(qIndex)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Text *</Label>
                <Textarea value={q.question} onChange={e => updateQuestion(qIndex, 'question', e.target.value)} placeholder="Enter question..." />
              </div>
              <div className="w-24">
                <Label>Points</Label>
                <Input type="number" min={1} value={q.points} onChange={e => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)} />
              </div>

              {q.type !== 'TEXT' && (
                <div className="space-y-2">
                  <Label>Options (check the correct answer)</Label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateOption(qIndex, oIndex, 'isCorrect', !opt.isCorrect)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${opt.isCorrect ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}
                      >
                        {opt.isCorrect && <CheckCircle className="h-4 w-4 text-white" />}
                      </button>
                      {q.type === 'TRUE_FALSE' ? (
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded text-sm">{opt.text}</span>
                      ) : (
                        <Input
                          className="flex-1"
                          value={opt.text}
                          onChange={e => updateOption(qIndex, oIndex, 'text', e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      )}
                      {q.type === 'MULTIPLE_CHOICE' && q.options.length > 2 && (
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => removeOption(qIndex, oIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {q.type === 'MULTIPLE_CHOICE' && q.options.length < 6 && (
                    <Button variant="outline" size="sm" onClick={() => addOption(qIndex)}>
                      <Plus className="h-4 w-4 mr-1" />Add Option
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-3">Add a question:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => addQuestion('MULTIPLE_CHOICE')}><Plus className="h-4 w-4 mr-2" />Multiple Choice</Button>
              <Button variant="outline" onClick={() => addQuestion('TRUE_FALSE')}><Plus className="h-4 w-4 mr-2" />True / False</Button>
              <Button variant="outline" onClick={() => addQuestion('TEXT')}><Plus className="h-4 w-4 mr-2" />Text Answer</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/teacher/quizzes')}>Cancel</Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Saving...</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Changes</>
            )}
          </Button>
        </div>
      </div>
    </TeacherLayout>
  );
}
