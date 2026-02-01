# Lab 1 - TypeScript/React Debugging Practice

## Overview
Welcome to **Lab 1**! This is an intermediate-level debugging exercise designed to help you practice identifying and fixing TypeScript and React errors in a realistic e-commerce dashboard application.

## What You'll Find Here

This project contains **18 intentional errors** spanning multiple categories:
- **Type System Errors** (4 errors) - Generic constraints, union types, property access
- **React Hook Errors** (5 errors) - Dependencies, closures, cleanup, conditional hooks
- **Async/Promise Errors** (3 errors) - Error handling, race conditions, error states
- **State Management Errors** (3 errors) - Mutations, closures, derived state
- **Component Integration Errors** (3 errors) - Context, event handlers, optional props

## Project Structure

```
lab-1/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx      # Main dashboard with integration errors
│   │   ├── ProductList.tsx    # Product grid with memoization issues
│   │   ├── SearchFilter.tsx   # Search with type narrowing errors
│   │   └── UserProfile.tsx    # User profile with hook errors
│   ├── context/
│   │   └── AuthContext.tsx    # Auth context with type mismatches
│   ├── hooks/
│   │   ├── useAuth.ts         # Custom hook with return type issues
│   │   └── useProducts.ts     # Data fetching with dependency bugs
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   ├── utils/
│   │   └── formatters.ts      # Utility functions with type errors
│   └── App.tsx                # App entry point
├── error-guide.md             # Detailed error guide with hints & solutions
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn installed
- Basic knowledge of TypeScript and React
- Familiarity with React hooks (useState, useEffect, useCallback, useMemo)

### Installation

```bash
cd lab-1
npm install
```

### Running the Project

```bash
# Start the development server
npm run dev

# Check for TypeScript errors
npm run build

# Run linting
npm run lint
```

## The Application

This is an **E-Commerce Dashboard** featuring:
- User authentication (mock login)
- Product catalog with search and filtering
- Shopping cart functionality
- User profile editing
- Task management interface

### Test Credentials
- Email: `john@example.com`
- Password: `password123`

## Debugging Challenge

Your goal is to find and fix all 18 errors. See `error-guide.md` for:
- Detailed error descriptions
- File locations
- Hints for each error
- Complete solutions (hidden behind spoilers)

### Recommended Approach

1. **Start by building the project** to see TypeScript errors:
   ```bash
   npm run build
   ```

2. **Fix TypeScript errors first** - These are usually the easiest to identify

3. **Test functionality** - Try using the app:
   - Log in with test credentials
   - Search and filter products
   - Add items to cart
   - Edit your profile
   - Check the browser console for runtime errors

4. **Review the hints** in `error-guide.md` when stuck

5. **Verify your fixes** by rebuilding and testing

## Error Categories Explained

### Type System Errors
These involve TypeScript's type system - generics, union types, interfaces, and type narrowing. You'll need to understand how TypeScript validates types and fix type mismatches.

### React Hook Errors
React hooks have specific rules - they must be called unconditionally, dependencies must be complete, and cleanup functions should be provided. Watch for ESLint warnings about missing dependencies!

### Async/Promise Errors
Async operations require proper error handling, race condition prevention, and loading/error state management. Unhandled rejections can crash your app!

### State Management Errors
React state should never be mutated directly. You'll need to use functional updates, proper array/object copying, and memoization to prevent unnecessary re-renders.

### Component Integration Errors
These involve type mismatches between components, context providers, and event handlers. Props must match their type definitions exactly!

## Tips for Success

- **Read error messages carefully** - They usually tell you exactly what's wrong
- **Use TypeScript's IDE integration** - Hover over variables to see their types
- **Check the browser console** - Runtime errors appear there
- **Use React DevTools** - Inspect component props and state
- **Don't cheat!** - Try to fix errors yourself before looking at solutions
- **Take notes** - Document what you learn from each error

## Learning Objectives

After completing this lab, you'll be able to:
- Debug TypeScript generic and union type issues
- Identify and fix React hook dependency problems
- Handle async operations and prevent race conditions
- Manage React state without mutations
- Integrate components with proper type safety
- Use context and custom hooks effectively

## Extension Challenges

Once you've fixed all errors, try these enhancements:

1. **Add loading states** - Show spinners during all async operations
2. **Implement optimistic updates** - Update cart UI immediately before API confirms
3. **Add form validation** - Validate user profile edits with error messages
4. **Implement error boundaries** - Catch and handle component errors gracefully
5. **Add pagination caching** - Remember previously loaded pages
6. **Optimize performance** - Use React.memo and useMemo strategically

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Common TypeScript Errors](https://typescript.tv/errors/)

## Need Help?

Check `error-guide.md` for detailed hints and solutions. Try to solve each error yourself first - that's where the real learning happens!

---

Happy debugging!
