export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export type TaskStatus = 'pending' | 'completed' | "failed";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: Date;
}

// Discriminated union for task results
export interface TaskSuccess {
  kind: 'success';
  data: {
    id: string;
    title: string;
    completedAt: string;
  };
}

export interface TaskLoading {
  kind: 'loading';
}

export interface TaskFailed {
  kind: 'failed';
  error: string;
}

export type TaskResult = TaskSuccess | TaskLoading | TaskFailed;

export interface TaskDisplayInfo {
  title: string;
  status: TaskStatus;
  message: string;
}
