'use client';

import { useState } from 'react';

/**
 * TagInput — reusable tag/skill chip input
 * Props: tags (string[]), onAdd, onRemove, placeholder
 */
export default function TagInput({ tags = [], onAdd, onRemove, placeholder = 'e.g. React', label = 'TAGS' }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onAdd(val);
      setInput('');
    }
  };

  return (
    <div>
      <label className="block text-sm text-[#005a14] mb-2">
        {'>'} {label}:
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder={placeholder}
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 border border-[#003d10] text-[#005a14] text-sm hover:border-[#00ff41] hover:text-[#00ff41] transition-all"
        >
          [+add]
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-sm text-[#00cc33] border border-[#003d10] px-3 py-1 flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                className="text-[#003d10] hover:text-[#ff0040] transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
