import { useState } from 'react';
import { Priority } from '../types/task';
import './TaskForm.css';

interface TaskFormProps {
  onAdd: (title: string, priority: Priority) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), priority);
      setTitle('');
      setPriority(Priority.Medium);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="task-form__input"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="task-form__select"
      >
        <option value={Priority.Low}>Low Priority</option>
        <option value={Priority.Medium}>Medium Priority</option>
        <option value={Priority.High}>High Priority</option>
      </select>
      <button type="submit" className="task-form__button">
        Add Task
      </button>
    </form>
  );
}
