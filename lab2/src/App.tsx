/**
 * Lab 2: React TypeScript Debugging
 * 
 * Welcome to Lab 2! This React application contains 4 intentional TypeScript bugs.
 * Your task is to identify and fix all bugs so the code compiles and runs correctly.
 * 
 * Instructions:
 * 1. Run `npm install` to install dependencies
 * 2. Run `npm run check` to see TypeScript errors
 * 3. Fix each bug - look for comments marked with ❌ BROKEN
 * 4. Run `npm run dev` to verify the app works
 * 
 * Estimated time: 30 minutes
 * Difficulty: Intermediate
 */

import { useState } from 'react';
import { UserList } from './components/UserList';
import { TodoForm } from './components/TodoForm';
import { ProductCard } from './components/ProductCard';
import { Counter } from './components/Counter';
import './App.css';

// Test data
const USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' as const },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' as const },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' as const },
];

const PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, inStock: true },
  { id: 2, name: 'USB-C Cable', price: 15.99, inStock: false },
  { id: 3, name: 'Laptop Stand', price: 45.99, inStock: true },
];

function App() {
  const [todos, setTodos] = useState<string[]>([]);

  const handleAddTodo = (text: string) => {
    setTodos([...todos, text]);
  };

  return (
    <div className="app">
      <h1>Lab 2: React TypeScript Debugging</h1>
      
      <section>
        <h2>Bug 1: Event Handler Type</h2>
        <TodoForm onSubmit={handleAddTodo} />
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Bug 2: Generic Type Constraint</h2>
        <UserList users={USERS} />
      </section>

      <section>
        <h2>Bug 3: useState Type Inference</h2>
        <Counter />
      </section>

      <section>
        <h2>Bug 4: Component Prop Types</h2>
        <div className="product-grid">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
