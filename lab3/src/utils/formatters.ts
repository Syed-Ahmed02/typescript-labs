import { Priority } from '../types/task';

// BUG 2: Function overloads don't match implementation signature
// The overload signature requires format to be provided with string date,
// but the implementation has it optional, causing a mismatch

// Overload signatures
export function formatDate(date: Date): string;
export function formatDate(date: string, format: string): string;

// Implementation signature
export function formatDate(date: Date | string, format?: string): string {
  if (typeof date === 'string') {
    // BUG: format could be undefined here, causing runtime issues
    return `Formatted: ${date} with ${format}`;
  }
  return date.toLocaleDateString();
}

// Helper to format priority for display
export function formatPriority(priority: Priority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// Helper to get relative time string
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
