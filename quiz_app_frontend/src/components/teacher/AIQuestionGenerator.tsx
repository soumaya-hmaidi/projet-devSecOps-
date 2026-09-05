'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { teacherAPI } from '@/lib/api/teacher';
import { toast } from 'sonner';

interface GeneratedQuestion {
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'TEXT';
  points: number;
  options: { text: string; isCorrect: boolean }[];
}

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True / False' },
  { value: 'TEXT', label: 'Text Answer' },
];

export function AIQuestionGenerator({ onQuestionsGenerated }: AIQuestionGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedTypes, setSelectedTypes] = useState(['MULTIPLE_CHOICE', 'TRUE_FALSE']);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.length > 1 ? prev.filter(t => t !== type) : prev
        : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }

    setIsGenerating(true);
    try {
      const res: any = await teacherAPI.generateQuestions({
        topic: topic.trim(),
        count,
        types: selectedTypes,
        difficulty
      });
      const questions: GeneratedQuestion[] = res.data.data;
      onQuestionsGenerated(questions);
      toast.success(`${questions.length} question${questions.length !== 1 ? 's' : ''} generated!`);
      setIsOpen(false);
      setTopic('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to generate questions';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-teal-300 bg-teal-50/50">
      <CardHeader className="pb-2">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
          onClick={() => setIsOpen(o => !o)}
        >
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <Sparkles className="h-5 w-5" />
            Generate Questions with AI
          </CardTitle>
          {isOpen ? <ChevronUp className="h-4 w-4 text-teal-600" /> : <ChevronDown className="h-4 w-4 text-teal-600" />}
        </button>
      </CardHeader>

      {isOpen && (
        <CardContent className="space-y-4 pt-0">
          <div>
            <Label htmlFor="ai-topic">Topic *</Label>
            <Input
              id="ai-topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. CCNA subnetting, OSI model, TCP/IP..."
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai-count">Number of questions</Label>
              <Input
                id="ai-count"
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={e => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                disabled={isGenerating}
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <div className="flex gap-2 mt-1">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize border transition-colors ${
                      difficulty === d
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                    }`}
                    disabled={isGenerating}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Question types</Label>
            <div className="flex gap-2 mt-1 flex-wrap">
              {QUESTION_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleType(t.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    selectedTypes.includes(t.value)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'
                  }`}
                  disabled={isGenerating}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">At least one type required</p>
          </div>

          <Button
            className="w-full bg-teal-600 hover:bg-teal-700"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" />Generate {count} Question{count !== 1 ? 's' : ''}</>
            )}
          </Button>

          {isGenerating && (
            <p className="text-xs text-center text-teal-600 animate-pulse">
              AI is writing your questions — usually takes 5–15 seconds...
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
