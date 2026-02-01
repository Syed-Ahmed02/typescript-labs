export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  lastLogin: Date;
  profile: {
    avatar: string;
    bio?: string;
    preferences: UserPreferences;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  inStock: boolean;
  tags: string[];
  createdAt: Date;
  rating: number;
  reviews: Review[];
}

export type ProductCategory = 
  | 'electronics' 
  | 'clothing' 
  | 'food' 
  | 'books' 
  | 'home';

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId?: string;
  dueDate: Date;
  completedAt?: Date;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface ResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchFilters {
  query: string;
  categories: ProductCategory[];
  priceRange: [number, number];
  inStock: boolean;
  sortBy: 'price' | 'name' | 'rating' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  userId?: string;
  total: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResult<T> {
  items: T[];
  pagination: ResponseMeta;
}
