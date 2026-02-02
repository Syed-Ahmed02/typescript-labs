import { useState } from 'react';
import './TodoForm.css';

interface TodoFormProps {
  onSubmit: (text: string) => void;
}

// BUG 1: Incorrect event handler type
// The event parameter type is wrong - it should be a form event
// Hint: Look at what type of event a form submit handler receives
export function TodoForm({ onSubmit }: TodoFormProps) {
  const [text, setText] = useState('');

  // ❌ BROKEN - Event type is incorrect
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a todo..."
        className="todo-input"
      />
      <button type="submit" className="todo-button">
        Add Todo
      </button>
    </form>
  );
}
