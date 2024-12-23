import React, { useState } from 'react';
import type { Question } from '../types';

interface QuestionFormProps {
  onSubmit: (questions: Question[]) => void;
}

export function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [options, setOptions] = useState(['', '', '']);

  const handleOptionChange = (index: number, value: string) => {
    setOptions(prev => prev.map((opt, idx) => idx === index ? value : opt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (options.every(opt => opt.trim())) {
      const question: Question = {
        id: Date.now(),
        options: options.map(opt => opt.trim()),
        votes: new Array(options.length).fill(0)
      };
      onSubmit([question]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="glass-panel">
        <h3 className="text-2xl font-bold text-white mb-6">Nom dels Finalistes</h3>
        <div className="space-y-4">
          {options.map((option, idx) => (
            <input
              key={idx}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              placeholder={`Finalista ${idx + 1}`}
              className="input-field"
              required
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button type="submit" className="btn-primary px-12 font-bold">
          Crear votación
        </button>
      </div>
    </form>
  );
}