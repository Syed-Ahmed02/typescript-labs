# TypeScript Concepts Tested

This document tracks which TypeScript concepts have been covered in the labs.

## Completed Labs

### Lab 1: Debugging Basics ✅
**Status:** Ready for use
**Estimated Time:** 30 minutes
**Difficulty:** Intermediate

**Concepts Tested:**
- Type Guards and Type Narrowing (`value is Type` syntax)
- Generic Constraints with `extends` and `keyof` operators
- Interface Inheritance and Property Compatibility
- Null Safety with Optional Properties
- Optional Chaining (?.)
- Type Inference with Generics
- Object Type Compatibility

**Bugs Included:**
1. Type guard with incorrect type check (typeof comparison)
2. Generic filter function with wrong comparison operator
3. Interface inheritance with conflicting property types
4. Missing null/undefined checks for optional properties

**Files:**
- `src/lab1/index.ts` - Lab file with 4 intentional bugs
- `src/lab1/checklist.md` - Solutions and verification checklist

---

## Future Labs (TODO)

### Lab 2: Advanced Generics and Conditional Types
**Concepts:**
- Conditional Types
- Mapped Types
- Template Literal Types
- Generic Defaults

### Lab 3: Type Manipulation
**Concepts:**
- `keyof` and `typeof` operators
- Indexed Access Types
- `Pick`, `Omit`, `Partial`, `Required`, `Readonly`
- Union and Intersection Types

### Lab 4: Async/Await and Promise Types
**Concepts:**
- Promise type annotations
- Async function return types
- Error handling with try/catch types
- Promise.all and tuple types

### Lab 5: React + TypeScript
**Concepts:**
- Component prop types
- useState and useRef generics
- Event handler types
- Children and render props patterns

---

*Last Updated: February 2026*
