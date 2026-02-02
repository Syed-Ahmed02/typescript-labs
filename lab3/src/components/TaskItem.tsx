import { Task, Priority } from '../types/task';
import { getRelativeTime } from '../utils/formatters';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { title, priority, status, createdAt } = task;

  // BUG 3: Enum value mismatch - using member names instead of values
  // String enums have the value (e.g., 'low'), not the member name ('Low')
  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case Priority.Low:
        return 'priority-low'; // BUG: Should be 'priority-low' (enum value)
      case Priority.Medium:
        return 'priority-medium'; // BUG: Should be 'priority-medium'
      case Priority.High:
        return 'priority-high'; // BUG: Should be 'priority-high'
      default:
        return 'priority-unknown';
    }
  };

  const priorityClass = getPriorityClass(priority);
  const relativeTime = getRelativeTime(createdAt);

  return (
    <li className={`task-item ${status === 'completed' ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <input
          type="checkbox"
          checked={status === 'completed'}
          onChange={onToggle}
          className="task-item__checkbox"
        />
        <div className="task-item__info">
          <span className={`task-item__priority ${priorityClass}`}>
            {priority}
          </span>
          <span className={`task-item__title ${status === 'completed' ? 'task-item__title--completed' : ''}`}>
            {title}
          </span>
          <span className="task-item__time">{relativeTime}</span>
        </div>
      </div>
      <button onClick={onDelete} className="task-item__delete">
        ×
      </button>
    </li>
  );
}
