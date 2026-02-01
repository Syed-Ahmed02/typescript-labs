import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Product, Task, ApiResponse, PaginatedResult, AsyncStatus, SearchFilters } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'electronics',
    inStock: true,
    tags: ['audio', 'wireless', 'premium'],
    createdAt: new Date('2024-01-15'),
    rating: 4.5,
    reviews: [
      { id: 'r1', userId: 'u1', rating: 5, comment: 'Great sound!', createdAt: new Date('2024-02-01') },
      { id: 'r2', userId: 'u2', rating: 4, comment: 'Good but pricey', createdAt: new Date('2024-02-15') },
    ],
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily training',
    price: 89.99,
    category: 'clothing',
    inStock: true,
    tags: ['sports', 'footwear', 'comfortable'],
    createdAt: new Date('2024-01-20'),
    rating: 4.2,
    reviews: [
      { id: 'r3', userId: 'u3', rating: 4, comment: 'Very comfortable', createdAt: new Date('2024-02-10') },
    ],
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with timer',
    price: 79.99,
    category: 'home',
    inStock: false,
    tags: ['kitchen', 'appliances', 'coffee'],
    createdAt: new Date('2024-01-25'),
    rating: 4.0,
    reviews: [],
  },
  {
    id: '4',
    name: 'Programming Book',
    description: 'Learn TypeScript and React patterns',
    price: 49.99,
    category: 'books',
    inStock: true,
    tags: ['education', 'programming', 'typescript'],
    createdAt: new Date('2024-02-01'),
    rating: 4.8,
    reviews: [
      { id: 'r4', userId: 'u4', rating: 5, comment: 'Excellent book!', createdAt: new Date('2024-02-20') },
      { id: 'r5', userId: 'u5', rating: 5, comment: 'Very helpful', createdAt: new Date('2024-02-25') },
    ],
  },
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Review product listings',
    description: 'Check all products for accuracy',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '1',
    dueDate: new Date('2024-03-15'),
  },
  {
    id: 't2',
    title: 'Update inventory',
    description: 'Sync inventory with warehouse',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-03-20'),
  },
  {
    id: 't3',
    title: 'Customer support tickets',
    description: 'Resolve pending customer issues',
    status: 'completed',
    priority: 'urgent',
    assigneeId: '1',
    dueDate: new Date('2024-03-10'),
    completedAt: new Date('2024-03-09'),
  },
];

interface UseProductsReturn {
  products: Product[];
  status: AsyncStatus;
  error: string | null;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  refetch: () => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    priceRange: [0, 1000],
    inStock: false,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  
  const limit = 10;
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setStatus('loading');
    setError(null);
    
    // Intentional race condition - no cancellation
    // abortControllerRef.current?.abort();
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filtered = MOCK_PRODUCTS;
      
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.splice(0).filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }
      
      if (filters.categories.length > 0) {
        filtered = filtered.filter((p) =>
          filters.categories.includes(p.category)
        );
      }
      
      if (filters.inStock) {
        filtered = filtered.filter((p) => p.inStock);
      }
      
      filtered = filtered.filter(
        (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
      
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'price':
            comparison = a.price - b.price;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'date':
            comparison =
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
      
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);
      
      setProducts(paginated);
      setStatus('success');
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        setStatus('error');
      }
    }
  }, [page]);

  useEffect(() => {
    fetchProducts();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const pagination = useMemo(
    () => ({
      page,
      limit,
      total: MOCK_PRODUCTS.length,
      totalPages: Math.ceil(MOCK_PRODUCTS.length / limit),
    }),
    [page, limit]
  );

  return {
    products,
    status,
    error,
    filters,
    setFilters,
    refetch,
    pagination,
    setPage,
  };
};

interface UseTasksReturn {
  tasks: Task[];
  status: AsyncStatus;
  error: string | null;
  createTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (taskData: Omit<Task, 'id'>): Promise<void> => {
    setStatus('loading');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substring(2, 15),
      };
      
      setTasks((prev) => [...prev, newTask]);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      setStatus('error');
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>): Promise<void> => {
    setStatus('loading');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        )
      );
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      setStatus('error');
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setStatus('loading');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      setStatus('error');
    }
  }, []);

  const completeTask = useCallback(async (id: string): Promise<void> => {
    setStatus('loading');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, status: 'completed', completedAt: new Date() }
            : task
        )
      );
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
      setStatus('error');
    }
  }, []);

  return {
    tasks,
    status,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};
