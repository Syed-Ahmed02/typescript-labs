import { format, parseISO, isValid } from 'date-fns';
import type { Product, Task, User } from '../types';

export const formatDate = (date: Date | string | number, formatStr: string = 'MMM dd, yyyy'): string => {
  const parsed = typeof date === 'string' ? parseISO(date) : parseISO(date.toString());
  
  if (!isValid(parsed)) {
    return 'Invalid date';
  }
  
  return format(parsed, formatStr);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPrice = (price: number, discount?: number): string => {
  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  return formatCurrency(discountedPrice);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const calculateAverageRating = (reviews: { rating: number }[]): number => {
  if (!reviews.length) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
};

export const sortProducts = <T extends { id: string }>(
  products: T[],
  sortBy: 'price' | 'name' | 'rating',
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  const sorted = [...products].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'price':
        comparison = (a as any).price - (b as any).price;
        break;
      case 'name':
        comparison = (a as any).name.localeCompare((b as any).name);
        break;
      case 'rating':
        comparison = (a as any).rating - (b as any).rating;
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};

export const filterProductsByPrice = <T extends Product>(
  products: T[],
  minPrice: number,
  maxPrice: number
): T[] => {
  return products.filter((product) => {
    const price = product.price;
    return price >= minPrice && price <= maxPrice;
  });
};

export const groupTasksByStatus = (tasks: Task[]): Record<Task['status'], Task[]> => {
  const grouped: Record<Task['status'], Task[]> = {
    pending: [],
    'in-progress': [],
    completed: [],
    cancelled: [],
  };
  
  tasks.forEach((task) => {
    grouped[task.status].push(task);
  });
  
  return grouped;
};

export const calculateTaskCompletionRate = (tasks: Task[]): number => {
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
};

export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn('localStorage not available');
    }
  },
  
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn('localStorage not available');
    }
  },
};

export const parseQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlParams.append(key, String(value));
    }
  });
  
  return urlParams.toString();
};
