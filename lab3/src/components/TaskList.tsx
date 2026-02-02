import { useState, useEffect } from 'react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { formatDate } from '../utils/formatters';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  const [isLoading, setIsLoading] = useState(true);

  // BUG 4: Unsafe type assertion when loading from localStorage
  // This assumes the data is always a valid Task array without validation
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      // BUG: Using 'as Task[]' without validation - could be anything!
      const parsed = JSON.parse(saved) as Task[];
      // This would set invalid state if localStorage has corrupted data
      console.log('Loaded tasks from storage:', parsed);
    }
    setIsLoading(false);
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  if (isLoading) {
    return <div className="task-list-loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  // Using formatDate to demonstrate the function
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  return (
    <div className="task-list">
      <div className="task-stats">
        <span>{pendingCount} pending</span>
        <span>{completedCount} completed</span>
        <span className="current-date">{formattedDate}</span>
      </div>

      <ul className="task-items">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </ul>
    </div>
  );
}
