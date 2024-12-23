import React, { useState } from 'react';
import type { Question } from '../types';

interface QuestionFormProps {
  onSubmit: (questions: Question[]) => void;
}

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, options: ['', '', ''], votes: [0, 0, 0] }
  ]);

  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.every(q => q.options.every(opt => opt))) {
      onSubmit(questions);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((question) => (
        <div key={`question-${question.id}`} className="glass-panel">
          <h3 className="text-2xl font-bold text-white mb-6">Nom dels Finalistes</h3>
          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <input
                key={`question-${question.id}-option-${idx}`}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                placeholder={`Finalista ${idx + 1}`}
                className="input-field"
                required
              />
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-center">
        <button type="submit" className="btn-primary px-12 font-bold">
          Crear votación
        </button>
      </div>
    </form>
  );
}