# Lab 3: TypeScript Debugging - Task Management App

Welcome to Lab 3! This React application has **4 intentional TypeScript bugs** that you need to fix. This is designed to take approximately 30 minutes.

## Setup

```bash
cd lab3
npm install
npm run check
```

You should see TypeScript errors. Your goal is to fix them!

## The Application

A simple Task Management app with:
- Add, toggle, and delete tasks
- Priority levels (Low, Medium, High)
- Status tracking (Pending, Completed)
- localStorage persistence
- Task result handling (loading, success, failed states)
- Date formatting utilities

## Concepts to Debug

1. **Discriminated Unions** - Handling all cases in switch statements
2. **Function Overloads** - Matching overload signatures to implementation
3. **Enum Type Safety** - String enum values vs member names
4. **Type Assertions** - Safe use of `as` keyword with validation

## Your Task

Fix all TypeScript errors while maintaining the functionality. The app should:
- Compile without TypeScript errors (`npm run check`)
- Handle all task result states (loading, success, failed)
- Format dates correctly for both Date objects and strings
- Display priority badges with correct styling
- Persist tasks to localStorage safely

## Hints

- Check `src/utils/taskHelpers.ts` for the discriminated union issue
- Look at `src/utils/formatters.ts` for the function overload problem
- Review `src/components/TaskItem.tsx` for enum usage
- Examine `src/components/TaskList.tsx` for unsafe type assertions

## Getting Help

If stuck, check `checklist.md` for detailed solutions and explanations.

Good luck! 🐛
