import { Task, TaskResult, TaskDisplayInfo } from '../types/task';

// Helper function to get display info from task results
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
    case "failed":
      return{
        title:"failed...",
        status:"failed",
        message:"Task has failed"
      }
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
