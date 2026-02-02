# Lab 2: Solutions and Verification Checklist

## Overview
This checklist provides the solutions for Lab 2 React TypeScript debugging exercises. Use this to verify your fixes or if you get stuck.

---

## Bug 1: Incorrect Event Handler Type

**Location:** `src/components/TodoForm.tsx:15`
**Concept:** React Event Types (`React.FormEvent` vs DOM events)

### Problem
The `handleSubmit` function uses `MouseEvent` as the event type, which is incorrect because:
- `MouseEvent` is a native DOM event type, not a React synthetic event
- Form submit handlers receive `React.FormEvent<HTMLFormElement>`, not mouse events
- The type mismatch causes TypeScript errors when accessing React-specific event properties

### Solution
```typescript
// ❌ BROKEN
const handleSubmit = (e: MouseEvent) => {

// ✅ FIXED - Use React.FormEvent
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (text.trim()) {
    onSubmit(text.trim());
    setText('');
  }
};
```

### Alternative Solution
Using the imported type from React:
```typescript
import { useState, FormEvent } from 'react';

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (text.trim()) {
    onSubmit(text.trim());
    setText('');
  }
};
```

### Explanation
- React uses synthetic events that wrap native DOM events
- `React.FormEvent<HTMLFormElement>` is the correct type for form submit handlers
- The generic parameter `<HTMLFormElement>` specifies the target element type
- Always use React's event types (FormEvent, ChangeEvent, MouseEvent, etc.) instead of native DOM types

### Verification
- [ ] Form submits without TypeScript errors
- [ ] Todo is added to the list
- [ ] Input field clears after submission
- [ ] No `MouseEvent` type errors

---

## Bug 2: Generic Type Constraint Issue

**Location:** `src/components/UserList.tsx:14-16`
**Concept:** Generic Constraints and Unused Generics

### Problem
The file defines a generic `ListProps<T>` interface that is:
1. Never used in the component
2. Has the wrong constraint (`{ name: string }` instead of `{ id: number }`)
3. Creates a dead code issue (unused interface)

The component should ideally use generics for reusability, or remove the unused interface.

### Solution - Option 1: Make Component Generic
```typescript
// ✅ FIXED - Use the generic properly
interface ListProps<T extends { id: number }> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function UserList<T extends { id: number; name: string; email: string; role: string }>({ 
  items 
}: ListProps<T>) {
  return (
    <div className="user-list">
      {items.map(item => (
        <div key={item.id} className="user-card">
          <h3>{item.name}</h3>
          <p className="user-email">{item.email}</p>
          <span className={`user-role user-role--${item.role}`}>
            {item.role}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Solution - Option 2: Remove Unused Generic (Simpler)
```typescript
// ✅ FIXED - Remove unused generic, use concrete types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p className="user-email">{user.email}</p>
          <span className={`user-role user-role--${user.role}`}>
            {user.role}
          </span>
        </div>
      ))}
    </div>
  );
}
```

### Explanation
- Generic constraints with `extends` ensure type safety
- Unused interfaces should be removed to avoid "declared but never read" errors
- When a component is specific to one data type, concrete types are clearer than generics
- The constraint `{ id: number }` ensures all items have an `id` for the `key` prop

### Verification
- [ ] No "declared but never used" TypeScript errors
- [ ] User list renders correctly
- [ ] Each user card displays name, email, and role
- [ ] No generic type errors

---

## Bug 3: useState Type Inference Issue

**Location:** `src/components/Counter.tsx:11`
**Concept:** useState Type Inference and Union Types

### Problem
The `useState` hook is initialized with `null`, which causes TypeScript to infer the type as `null` only:
```typescript
const [count, setCount] = useState(null); // Type: null
```

This means:
- `count` can only ever be `null`
- Arithmetic operations like `count + step` fail type checking
- The updater function `c => c + step` fails because `c` is typed as `null`

### Solution - Option 1: Explicit Type with Union
```typescript
// ✅ FIXED - Explicitly type the state
const [count, setCount] = useState<number | null>(0);
const [step, setStep] = useState<number>(1);

// Need to handle null case
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => (c !== null ? c + step : 0));
  }, 1000);

  return () => clearInterval(interval);
}, [step]);
```

### Solution - Option 2: Remove Null (Simpler)
```typescript
// ✅ FIXED - Don't use null, just use number
const [count, setCount] = useState<number>(0);
const [step, setStep] = useState<number>(1);

useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + step);
  }, 1000);

  return () => clearInterval(interval);
}, [step]);
```

### Explanation
- `useState(null)` infers type as `null`, not `number | null`
- You must explicitly provide the generic type when the initial value is `null`
- `useState<number | null>(null)` or `useState<number>(0)` are both valid solutions
- With strict null checks enabled, accessing properties/methods on potentially null values requires checks

### Verification
- [ ] No "possibly null" TypeScript errors
- [ ] Counter increments automatically every second
- [ ] Counter increments/decrements when clicking +/- buttons
- [ ] Arithmetic operations type check correctly
- [ ] Counter resets to 0 when clicking Reset

---

## Bug 4: Incorrect Component Prop Types

**Location:** `src/components/ProductCard.tsx:14-18`
**Concept:** Component Prop Interface Matching

### Problem
The component defines `ProductCardProps` with an `item` property, but in `App.tsx` the component is called with a `product` property:
```typescript
// App.tsx
<ProductCard key={product.id} product={product} />

// ProductCard.tsx - expects item, not product
interface ProductCardProps {
  item: Product;  // ❌ BROKEN - should be 'product'
}
```

### Solution
```typescript
// ❌ BROKEN
interface ProductCardProps {
  item: Product;
}

export function ProductCard(props: ProductCardProps) {
  const { item } = props;
  // ... uses item
}

// ✅ FIXED - Match the prop name used in parent
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={`product-card ${!product.inStock ? 'product-card--out-of-stock' : ''}`}>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <span className={`product-status product-status--${product.inStock ? 'in' : 'out'}`}>
        {product.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
}
```

### Alternative Solution
Change the caller instead:
```typescript
// In App.tsx - change to match component
{PRODUCTS.map(product => (
  <ProductCard key={product.id} item={product} />
))}
```

### Explanation
- Component prop interfaces must match how the component is actually used
- TypeScript will catch mismatches between the interface and the JSX usage
- Consistent naming conventions help avoid this issue
- Destructuring props directly in function parameters is often cleaner

### Verification
- [ ] No "property does not exist" TypeScript errors
- [ ] Product cards display correctly in the grid
- [ ] Product name, price, and stock status are visible
- [ ] Out of stock products appear dimmed

---

## Summary

| Bug | Location | Concept | Key Fix |
|-----|----------|---------|---------|
| 1 | TodoForm.tsx:15 | React Event Types | Change `MouseEvent` to `React.FormEvent<HTMLFormElement>` |
| 2 | UserList.tsx:14 | Generic Constraints | Remove unused generic or make component properly generic |
| 3 | Counter.tsx:11 | useState Types | Add explicit type: `useState<number>(0)` or `useState<number \| null>(null)` |
| 4 | ProductCard.tsx:14 | Prop Interface | Match prop name: change `item` to `product` |

---

## Post-Fix Verification

### Install Dependencies
```bash
cd lab2
npm install
```

### Type Check
```bash
npm run check
```

Expected output: No errors ✓

### Run Development Server
```bash
npm run dev
```

Expected: App loads without runtime errors, all four sections work correctly

---

## Concepts Reinforced

1. **React Event Types** - Using proper React synthetic event types (FormEvent, ChangeEvent) instead of native DOM events
2. **Generic Constraints** - Understanding when to use generics vs concrete types, proper constraint syntax with `extends`
3. **useState Type Safety** - Explicitly typing state when null is involved, understanding type inference limitations
4. **Component Contracts** - Ensuring prop interfaces match actual usage, proper naming conventions

*Solutions verified: February 2026*
