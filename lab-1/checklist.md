# Lab 1: Solutions and Verification Checklist

## Overview
This checklist provides the solutions for Lab 1 debugging exercises. Use this to verify your fixes or if you get stuck.

---

## Bug 1: Type Guard with Incorrect Type Check

**Location:** `index.ts:40`
**Concept:** Type Guards and Type Narrowing (`value is Type` syntax)

### Problem
The `isDog` function uses `typeof animal === 'Dog'`, which is incorrect because:
- `typeof` returns `'object'` for object types, not the specific type name
- This will never return true for any valid Animal

### Solution
```typescript
function isDog(animal: Animal): animal is Dog {
  return animal.kind === 'dog'; // ✅ FIXED
}
```

### Explanation
- Use discriminant property (`kind`) to check the type
- The `value is Type` syntax tells TypeScript to narrow the type when the function returns true
- `typeof` operator is for JavaScript primitive types (string, number, boolean, etc.), not custom types

### Verification
- [ ] `isDog` correctly narrows type to Dog when true
- [ ] `getAnimalSound` compiles without errors
- [ ] All three animal types (Dog, Cat, Fish) are handled

---

## Bug 2: Generic Filter Function with Wrong Comparison Operator

**Location:** `index.ts:80`
**Concept:** Generic Constraints with `extends` and `keyof` operators

### Problem
The filter uses `!==` (not equal) instead of `===` (equal), returning items that DON'T match instead of items that DO match.

**Note:** This is a **logic bug** - it compiles without TypeScript errors but produces incorrect runtime behavior. The electronics filter returns 1 item instead of 2.

### Solution
```typescript
function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter(item => item[key] === value); // ✅ FIXED - correct operator
}
```

### Explanation
- `K extends keyof T` ensures `key` is a valid property of `T`
- `T[K]` is the indexed access type, giving the type of property `K` on `T`
- The function should filter items where the property equals the value, not excludes it
- After fix, `electronics` should contain 2 products (Laptop and Phone)

### Verification
- [ ] Filter returns items matching the property value
- [ ] `electronics` array has 2 items
- [ ] Generic constraints `K extends keyof T` are preserved

---

## Bug 3: Interface Inheritance with Conflicting Property Types

**Location:** `index.ts:88`
**Concept:** Interface Inheritance and Property Compatibility

### Problem
`UserEntity.metadata` type `{ [key: number]: string }` is not compatible with `BaseEntity.metadata` type `Record<string, string>` (which is `{ [key: string]: string }`).

### Solution
```typescript
interface UserEntity extends BaseEntity {
  name: string;
  email: string;
  metadata: Record<string, string>; // ✅ FIXED - compatible with BaseEntity
}
```

### Alternative Solution
If you need additional constraints, you can make it a subtype:
```typescript
interface UserEntity extends BaseEntity {
  name: string;
  email: string;
  metadata: Record<string, string> & { userId?: string }; // ✅ EXTENDED
}
```

### Explanation
- In TypeScript, interface extension requires property type compatibility
- `Record<string, string>` requires string keys
- `{ [key: number]: string }` requires numeric keys, which is a narrower type
- The extending interface must have a property type that is assignable to the base

### Verification
- [ ] `UserEntity` extends `BaseEntity` without errors
- [ ] `user` object compiles correctly
- [ ] `metadata` property accepts string keys (e.g., 'source', 'campaign')

---

## Bug 4: Missing Null/Undefined Checks for Optional Properties

**Location:** `index.ts:102`
**Concept:** Null Safety with Optional Properties and Optional Chaining (`?.`)

### Problem
The function directly accesses `company.address.zipCode` without checking if `address` exists or if `zipCode` is defined. This will crash at runtime if `address` is undefined.

### Solution
```typescript
function getCompanyZipCode(company: Company): string {
  return company.address?.zipCode?.toUpperCase() ?? 'N/A'; // ✅ FIXED - safe access
}
```

### Alternative Solution
Using explicit checks:
```typescript
function getCompanyZipCode(company: Company): string {
  if (!company.address?.zipCode) {
    return 'N/A';
  }
  return company.address.zipCode.toUpperCase();
}
```

### Explanation
- Optional chaining (`?.`) safely returns `undefined` if property is null/undefined
- Nullish coalescing (`??`) provides a default value when the result is null or undefined
- Without these, accessing properties on undefined throws a runtime error
- This is TypeScript's optional chaining feature: `obj?.prop?.method()`

### Verification
- [ ] `getCompanyZipCode(company1)` returns '94105'
- [ ] `getCompanyZipCode(company2)` returns 'N/A' (or doesn't crash)
- [ ] No TypeScript errors about possibly undefined values
- [ ] Optional chaining operator (`?.`) is used appropriately

---

## Summary

| Bug | Location | Concept | Key Fix |
|-----|----------|---------|---------|
| 1 | Line 41 | Type Guards | Use `animal.kind === 'dog'` instead of `typeof` |
| 2 | Line 80 | Generic Constraints | Change `!==` to `===` for filtering |
| 3 | Line 118 | Interface Inheritance | Make `metadata` type compatible with base |
| 4 | Line 138 | Null Safety | Add optional chaining and nullish coalescing |

---

## Post-Fix Verification

Run the TypeScript compiler to verify all errors are resolved:
```bash
npx tsc lab-1/index.ts --noEmit --strict
```

Expected output: No errors ✓

---

## Concepts Reinforced

1. **Type Guards** - Using discriminant properties for type narrowing with `value is Type` syntax
2. **Generic Constraints** - Using `extends` and `keyof` to constrain type parameters
3. **Interface Compatibility** - Understanding type compatibility rules in inheritance
4. **Null Safety** - Using optional chaining (`?.`) and nullish coalescing (`??`) for safe property access

*Solutions verified: February 2026*
