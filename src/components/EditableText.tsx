import React, { useState, useRef, useEffect } from 'react';
import { Edit2 } from 'lucide-react';
import { EditableTextProps } from '../types';

export const EditableText: React.FC<EditableTextProps> = ({ value, onSave, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (text.trim()) {
      onSave(text);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setText(value);
      setIsEditing(false);
    }
  };

  if (!isEditable || !isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">{value}</span>
        {isEditable && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={handleKeyDown}
      className="text-xl font-semibold w-full px-2 py-1 border rounded"
    />
  );
};