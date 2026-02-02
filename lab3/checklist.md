# Lab 3: Solutions and Verification Checklist

## Overview
This checklist provides the solutions for Lab 3 debugging exercises. Use this to verify your fixes or if you get stuck.

**Concepts Tested:**
1. Discriminated Unions - Exhaustive type checking with switch statements
2. Function Overloads - Multiple function signatures for different parameter types
3. Enum Type Safety - String enum value matching and type checking
4. Type Assertions - Unsafe `as` casting and proper type guards

---

## Bug 1: Discriminated Union - Missing Cases in Switch

**Location:** `src/utils/taskHelpers.ts:20`
**Concept:** Discriminated Unions and Exhaustive Type Checking

### Problem
The `getTaskDisplayInfo` function has a switch statement that doesn't handle all cases of the discriminated union `TaskResult`. The `failed` case is missing, which means:
- TypeScript will error when `result.kind` is `'failed'` (not handled in switch)
- The function returns `undefined` for failed tasks instead of proper error info
- No compile-time exhaustiveness checking is present

### Current Code (Broken)
```typescript
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
    // ❌ MISSING: case 'failed'
  }
}
```

### Solution
```typescript
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
    case 'failed': // ✅ FIXED - Add missing case
      return {
        title: 'Error',
        status: 'failed',
        message: result.error,
      };
    default: // ✅ Alternative: exhaustive check
      const _exhaustive: never = result;
      return _exhaustive;
  }
}
```

### Explanation
- Discriminated unions use a common property (`kind`) to distinguish between variants
- TypeScript requires all union members to be handled in switch statements
- The `default` case with `never` type provides compile-time exhaustiveness checking
- Missing cases cause TypeScript errors when strict mode is enabled
- Each variant can have different properties that are only accessible after narrowing

### Verification
- [ ] All three `TaskResult` variants handled (success, loading, failed)
- [ ] No TypeScript errors about non-exhaustive switch statements
- [ ] Failed tasks display error message properly
- [ ] Return type `TaskDisplayInfo` is always satisfied

---

## Bug 2: Incorrect Function Overload Signatures

**Location:** `src/utils/formatters.ts:15-35`
**Concept:** Function Overloads and Implementation Signature Matching

### Problem
The `formatDate` function has overload signatures that don't match the implementation:
- Overload 1: `(date: Date): string` - expects Date object
- Overload 2: `(date: string, format: string): string` - expects string + format
- Implementation signature: `(date: Date | string, format?: string): string`

The problem is that **TypeScript requires overload signatures to be assignable to the implementation signature**. The current overloads create a mismatch where:
- Calling with just a string (no format) is allowed by overloads but implementation expects format
- The overload signature `(date: string, format: string)` requires format, but implementation has it optional
- Calling `formatDate('2024-01-01')` without format will pass type check but fail at runtime

### Current Code (Broken)
```typescript
// ❌ BROKEN - Overloads don't match implementation
export function formatDate(date: Date): string;
export function formatDate(date: string, format: string): string;
export function formatDate(date: Date | string, format?: string): string {
  if (typeof date === 'string') {
    return `Formatted: ${date} with ${format}`; // format could be undefined!
  }
  return date.toLocaleDateString();
}
```

### Solution
```typescript
// ✅ FIXED - Proper overload signatures matching implementation
export function formatDate(date: Date): string;
export function formatDate(date: string, format?: string): string;
export function formatDate(date: Date | string, format?: string): string {
  if (typeof date === 'string') {
    if (!format) {
      return date; // Handle undefined format case
    }
    return `Formatted: ${date} with ${format}`;
  }
  return date.toLocaleDateString();
}
```

### Alternative Solution (Using union type instead of overloads)
```typescript
// ✅ Alternative - Single signature with union and type guards
export function formatDate(
  date: Date | string,
  format?: string
): string {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  // date is string here
  return format ? `Formatted: ${date} with ${format}` : date;
}
```

### Explanation
- Function overloads provide multiple type signatures for a single implementation
- Each overload must be assignable to the implementation signature
- Overloads are checked top-to-bottom; first matching signature is used
- The implementation signature is not visible externally, only the overloads
- Common mistake: making parameters required in overload but optional in implementation
- When using overloads, ensure the implementation handles all overload cases

### Verification
- [ ] `formatDate(new Date())` returns formatted date string
- [ ] `formatDate('2024-01-01', 'MM/DD/YYYY')` works correctly
- [ ] `formatDate('2024-01-01')` without format doesn't crash
- [ ] No TypeScript errors about overload implementation mismatch

---

## Bug 3: Enum Value Mismatch

**Location:** `src/components/TaskItem.tsx:25`
**Concept:** String Enums and Type Safety

### Problem
The `Priority` enum uses string values, but the component tries to use the numeric enum member names instead of the string values:

```typescript
enum Priority {
  Low = 'low',
  Medium = 'medium', 
  High = 'high',
}

// ❌ BROKEN - Using Priority.Low gives 'low', not 'Low'
className={`priority-${priority === Priority.Low ? 'Low' : priority}`}
```

The issue is that string enums don't work like numeric enums. With string enums:
- `Priority.Low` evaluates to `'low'` (the value), not `'Low'` (the member name)
- The comparison `priority === Priority.Low` works (both are 'low')
- But the string literal `'Low'` doesn't match anything

### Current Code (Broken)
```typescript
const getPriorityClass = (priority: Priority) => {
  switch (priority) {
    case Priority.Low:
      return 'priority-Low'; // ❌ Inconsistent - mixing value 'low' with string 'Low'
    case Priority.Medium:
      return 'priority-Medium';
    case Priority.High:
      return 'priority-High';
    default:
      return 'priority-unknown';
  }
};

// In JSX:
className={`task-item ${getPriorityClass(priority)}`}
```

### Solution
```typescript
const getPriorityClass = (priority: Priority) => {
  switch (priority) {
    case Priority.Low:
      return 'priority-low'; // ✅ FIXED - Use lowercase matching enum value
    case Priority.Medium:
      return 'priority-medium';
    case Priority.High:
      return 'priority-high';
    default:
      return 'priority-unknown';
  }
};

// In JSX:
className={`task-item ${getPriorityClass(priority)}`}
```

### Alternative Solution (Accessing enum member names)
```typescript
// If you need the member name (e.g., 'Low'), use Object.keys or a lookup
const priorityNames: Record<Priority, string> = {
  [Priority.Low]: 'Low',
  [Priority.Medium]: 'Medium', 
  [Priority.High]: 'High',
};

const getPriorityClass = (priority: Priority) => {
  return `priority-${priority}`; // 'low', 'medium', or 'high'
};
```

### Explanation
- String enums: `enum E { A = 'a' }` means `E.A === 'a'`
- Numeric enums: `enum E { A }` means `E.A === 0` and `E[0] === 'A'`
- String enums don't have reverse mapping like numeric enums
- Always use the enum values (right side) for comparisons and logic
- CSS classes should match the actual enum values, not member names

### Verification
- [ ] Priority badges display correct color classes (low, medium, high)
- [ ] All switch cases use enum values consistently
- [ ] No TypeScript errors about unreachable code
- [ ] CSS styling applies correctly to all priority levels

---

## Bug 4: Unsafe Type Assertion with `as`

**Location:** `src/components/TaskList.tsx:28`
**Concept:** Type Assertions (`as` keyword) and Type Guards

### Problem
The component uses an unsafe type assertion `as Task[]` when getting data from localStorage:

```typescript
const saved = localStorage.getItem('tasks');
if (saved) {
  const parsed = JSON.parse(saved) as Task[]; // ❌ UNSAFE - assumes valid Task array
  setTasks(parsed);
}
```

This is dangerous because:
- `JSON.parse` returns `any`, which could be anything
- No validation that the parsed data actually matches `Task[]` structure
- Could set invalid state causing runtime errors (e.g., missing properties, wrong types)
- TypeScript trusts the assertion but runtime data might be corrupted/malformed

### Current Code (Broken)
```typescript
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    const parsed = JSON.parse(saved) as Task[]; // ❌ No validation
    setTasks(parsed);
  }
}, []);
```

### Solution
```typescript
// ✅ FIXED - Add type guard validation
const isTask = (obj: unknown): obj is Task => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'priority' in obj &&
    'status' in obj &&
    typeof (obj as Task).id === 'string' &&
    typeof (obj as Task).title === 'string'
  );
};

const isTaskArray = (arr: unknown): arr is Task[] => {
  return Array.isArray(arr) && arr.every(isTask);
};

useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (isTaskArray(parsed)) { // ✅ Validate before asserting
        setTasks(parsed);
      } else {
        console.error('Invalid task data in localStorage');
        localStorage.removeItem('tasks');
      }
    } catch (e) {
      console.error('Failed to parse tasks:', e);
      localStorage.removeItem('tasks');
    }
  }
}, []);
```

### Alternative Solution (Simpler validation)
```typescript
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved);
      // Basic shape validation
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (t) =>
            t &&
            typeof t === 'object' &&
            typeof t.id === 'string' &&
            typeof t.title === 'string'
        )
      ) {
        setTasks(parsed as Task[]); // ✅ Safe after validation
      }
    } catch (e) {
      console.error('Failed to load tasks:', e);
    }
  }
}, []);
```

### Explanation
- Type assertions (`as Type`) tell TypeScript to treat a value as a specific type
- They don't perform any runtime validation or conversion
- Use type guards (`value is Type`) to validate unknown data at runtime
- When dealing with external data (APIs, localStorage, user input), always validate
- `unknown` is safer than `any` as it forces you to check the type before using
- JSON.parse returns `any`, but treat it as `unknown` and validate

### Verification
- [ ] localStorage data is validated before being used
- [ ] Invalid/corrupted data doesn't crash the app
- [ ] Type guard properly checks all required Task properties
- [ ] Graceful error handling for malformed JSON
- [ ] No unsafe `as Task[]` assertions on untrusted data

---

## Summary

| Bug | Location | Concept | Key Fix |
|-----|----------|---------|---------|
| 1 | src/utils/taskHelpers.ts:20 | Discriminated Unions | Add missing `case 'failed'` or use exhaustive check with `never` |
| 2 | src/utils/formatters.ts:15-35 | Function Overloads | Make overload signatures match implementation, handle optional params |
| 3 | src/components/TaskItem.tsx:25 | String Enums | Use enum values ('low', 'medium', 'high') not member names ('Low', 'Medium', 'High') |
| 4 | src/components/TaskList.tsx:28 | Type Assertions | Replace `as Task[]` with type guards when parsing external data |

---

## Post-Fix Verification

### Install Dependencies
```bash
cd lab3
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

Expected: App loads without runtime errors

### Manual Testing
1. Add a few tasks with different priorities
2. Refresh the page - tasks should persist via localStorage
3. Manually corrupt localStorage data (open DevTools > Application > Local Storage) and refresh - app should handle gracefully
4. Check that all three task statuses (loading, success, failed) display correctly
5. Verify date formatting works for both Date objects and strings

---

## Concepts Reinforced

1. **Discriminated Unions** - Using `kind` property to narrow types, exhaustive switch statements, compile-time completeness checking with `never`
2. **Function Overloads** - Creating multiple type signatures, ensuring overloads are assignable to implementation, handling optional parameters correctly
3. **String Enums** - Understanding the difference between enum member names and values, no reverse mapping for string enums
4. **Type Assertions** - When `as` is appropriate vs dangerous, using type guards for runtime validation, treating external data as `unknown`

---

## Estimated Time
- **Solving all bugs:** 20-30 minutes
- **Understanding solutions:** 10-15 minutes
- **Total:** 30-45 minutes

*Solutions verified: February 2026*
