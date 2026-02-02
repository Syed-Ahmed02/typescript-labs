import { Task, TaskResult, TaskDisplayInfo } from '../types/task';

// Helper function to get display info from task results
// BUG 1: Missing case for 'failed' in the discriminated union
export function getTaskDisplayInfo(result: TaskResult): TaskDisplayInfo {
  switch (result.kind) {
    case 'success':
      return {
        title: result.data.title,
        status: 'completed',
        message: `Completed on ${result.data.completedAt}`,
      };
    case 'loading':
      return {
        title: 'Loading...',
        status: 'pending',
        message: 'Please wait',
      };
    // TODO: Fix - Add missing case for 'failed'
  }
}

// Helper to sort tasks by priority
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder = { low: 1, medium: 2, high: 3 };
  return [...tasks].sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// Helper to filter tasks by status
export function filterTasksByStatus(
  tasks: Task[],
  status: Task['status']
): Task[] {
  return tasks.filter((task) => task.status === status);
}
