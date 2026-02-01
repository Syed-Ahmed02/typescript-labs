# Lab 1 - TypeScript/React Debugging Guide

## Overview
This project contains **18 intentional errors** across various categories for debugging practice. The errors range from TypeScript type errors to React-specific issues and runtime bugs.

## Domain
An e-commerce dashboard with:
- User authentication & profiles
- Product catalog with search/filter
- Shopping cart functionality
- Task management system

---

## Error Categories

### 1. Type System Errors (4 errors)

**Error 1: Generic Constraint Violation**  
Location: `src/hooks/useProducts.ts`  
Type: **Type Error**  
Hint: Check the generic type constraint on the `sortProducts` utility function. The function assumes all products have a `price` property, but is the constraint properly defined?

**Error 2: Union Type Narrowing Failure**  
Location: `src/components/SearchFilter.tsx`  
Type: **Type Error**  
Hint: Look at the `handleSortChange` function. When splitting the select value, are the types correctly narrowed?

**Error 3: Interface Property Access**  
Location: `src/components/UserProfile.tsx`  
Type: **Type Error**  
Hint: Check the initial state setup in the `useState` hook. Is the `bio` field always accessible?

**Error 4: Optional Property Handling**  
Location: `src/utils/formatters.ts`  
Type: **Type Error**  
Hint: The `formatDate` function handles multiple input types. Check how it handles the `number` case.

---

### 2. React Hook Errors (5 errors)

**Error 5: Missing Dependency in useEffect**  
Location: `src/components/UserProfile.tsx`  
Type: **Warning/Bug**  
Hint: The `useEffect` that resets form data has a missing dependency. This could cause stale data issues.

**Error 6: Stale Closure in useCallback**  
Location: `src/hooks/useProducts.ts`  
Type: **Bug**  
Hint: The `fetchProducts` callback captures `filters` in its closure. Check if it should be in the dependency array.

**Error 7: Conditional Hook Call Pattern**  
Location: `src/components/Dashboard.tsx`  
Type: **Type Error**  
Hint: Look at the hook usage pattern. Is there a potential issue with how hooks are being called conditionally?

**Error 8: Missing Cleanup in useEffect**  
Location: `src/components/SearchFilter.tsx`  
Type: **Memory Leak**  
Hint: The debounced search creates timeouts. Is the cleanup function properly clearing them?

**Error 9: Incorrect Hook Return Type**  
Location: `src/hooks/useAuth.ts`  
Type: **Type Error**  
Hint: The hook returns a tuple-like structure. Check if the types match what consumers expect.

---

### 3. Async/Promise Errors (3 errors)

**Error 10: Unhandled Promise Rejection**  
Location: `src/context/AuthContext.tsx`  
Type: **Runtime Bug**  
Hint: The `login` function throws errors but they're not always caught by callers. Check error handling.

**Error 11: Race Condition in Search**  
Location: `src/hooks/useProducts.ts`  
Type: **Bug**  
Hint: Multiple rapid searches could result in out-of-order responses. Is the cancellation logic working correctly?

**Error 12: Missing Error State**  
Location: `src/components/Dashboard.tsx`  
Type: **UX Bug**  
Hint: When profile update fails, the UI might not reflect the error state properly.

---

### 4. State Management Errors (3 errors)

**Error 13: Direct State Mutation**  
Location: `src/hooks/useProducts.ts`  
Type: **Bug**  
Hint: Look at how the products array is being filtered. Is a new array always created?

**Error 14: Setter Function Closure**  
Location: `src/components/Dashboard.tsx`  
Type: **Bug**  
Hint: The `handleAddToCart` function uses `cartItems` from closure. Is it using the functional update pattern?

**Error 15: Derived State in Render**  
Location: `src/components/ProductList.tsx`  
Type: **Performance Issue**  
Hint: The sorting calculation happens on every render. Is `useMemo` being used correctly?

---

### 5. Component Integration Errors (3 errors)

**Error 16: Context Provider Value Type**  
Location: `src/context/AuthContext.tsx`  
Type: **Type Error**  
Hint: The context provider value object might not match the expected `AuthContextType` interface.

**Error 17: Event Handler Type Mismatch**  
Location: `src/components/ProductList.tsx`  
Type: **Type Error**  
Hint: Check the `onProductSelect` handler. Are the event types compatible?

**Error 18: Optional Prop Handling**  
Location: `src/components/UserProfile.tsx`  
Type: **Bug**  
Hint: The component assumes `onUpdateProfile` exists when checking `isEditable`. What if it's undefined?

---

## How to Use This Lab

1. **Start by running the project:**
   ```bash
   cd lab-1
   npm run dev
   ```

2. **Look for TypeScript errors:**
   ```bash
   npm run build
   # or
   npx tsc --noEmit
   ```

3. **Check for linting issues:**
   ```bash
   npm run lint
   ```

4. **Test functionality:**
   - Try logging in with test credentials
   - Search and filter products
   - Add items to cart
   - Edit user profile
   - Navigate through pagination

5. **Use the hints above** to identify and fix each error

6. **Verify fixes** by:
   - Running TypeScript checks
   - Testing the application
   - Checking browser console for errors

---

## Solutions

<details>
<summary>Click to reveal solutions (try debugging first!)</summary>

### Error 1 Solution
Change the generic constraint in `formatters.ts` sortProducts function to properly extend Product interface.

### Error 2 Solution
Add proper type assertion or type guard in the `handleSortChange` function to ensure the split values match the expected union types.

### Error 3 Solution
Use optional chaining or provide a default value when accessing `user.profile.bio` in the initial state.

### Error 4 Solution
The `number` case in `formatDate` should use `new Date(date)` instead of trying to parse it as a string.

### Error 5 Solution
Add `user` to the dependency array of the `useEffect` in UserProfile, or use a different approach to sync form data.

### Error 6 Solution
Add `filters` to the `useCallback` dependency array in `fetchProducts`, or restructure to avoid the stale closure.

### Error 7 Solution
Ensure all hooks are called unconditionally at the top level of the component.

### Error 8 Solution
Return a cleanup function from the debounced effect that clears the timeout.

### Error 9 Solution
Ensure the return type of `useAuth` matches exactly what components expect to receive.

### Error 10 Solution
Wrap the login call in a try-catch in components that use it, or handle errors in the context provider.

### Error 11 Solution
Use an AbortController or a flag to ignore stale responses in the fetchProducts effect.

### Error 12 Solution
Add error state display in the Dashboard component when profile update fails.

### Error 13 Solution
Ensure all array operations create new arrays (use spread operator or array methods that return new arrays).

### Error 14 Solution
Use the functional update form of `setCartItems` to avoid stale closure issues.

### Error 15 Solution
Memoize the sorted products calculation with proper dependencies.

### Error 16 Solution
Ensure all properties in the context value object match the AuthContextType interface.

### Error 17 Solution
Check that the event types in the component match the expected handler types in the props interface.

### Error 18 Solution
Add a null check for `onUpdateProfile` before calling it, or make the prop required.
</details>

---

## Learning Objectives

After completing this lab, you should be able to:

- Identify and fix TypeScript generic and union type issues
- Debug React hook dependency and closure problems
- Handle async operations and race conditions properly
- Manage React state without mutations
- Integrate components with proper type safety
- Use context and custom hooks effectively

## Additional Challenges

Once you've fixed all the errors, try these enhancements:

1. Add proper loading states to all async operations
2. Implement optimistic updates for the cart
3. Add form validation to the user profile edit
4. Implement proper error boundaries
5. Add pagination caching
6. Optimize re-renders with React.memo and useMemo

Good luck debugging! 🐛🔍
