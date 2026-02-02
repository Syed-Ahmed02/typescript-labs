/**
 * Lab 1: Debugging Basics
 * 
 * Welcome to Lab 1! This file contains 4 intentional TypeScript bugs.
 * Your task is to identify and fix all bugs so the code compiles correctly.
 * 
 * Instructions:
 * 1. Read through the code and identify type errors
 * 2. Fix each bug without changing the function signatures or test cases
 * 3. Run TypeScript compiler to verify all errors are resolved
 * 
 * Estimated time: 30 minutes
 * Difficulty: Intermediate
 */

// ==========================================
// SECTION 1: Type Guards and Type Narrowing
// ==========================================



interface Dog {
  kind: 'dog';
  bark: () => string;
}

interface Cat {
  kind: 'cat';
  meow: () => string;
}

interface Fish {
  kind: 'fish';
  swim: () => string;
}
type Animal = Dog | Cat | Fish;

// BUG 1: Type guard with incorrect type check
// This type guard should narrow 'animal' to 'Dog' when it returns true
// Hint: Check what typeof returns for object types
function isDog(animal: Animal): animal is Dog {
  return animal.kind === "dog"; // ❌ BROKEN
}

// Test case - DO NOT MODIFY
function getAnimalSound(animal: Animal): string {
  if (isDog(animal)) {
    return animal.bark();
  }
  if ('meow' in animal) {
    return animal.meow();
  }
  return animal.swim();
}

// ==========================================
// SECTION 2: Generic Constraints
// ==========================================

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
}

// BUG 2: Generic filter function with wrong comparison operator
// This function should filter items by a specific property value
// Hint: The comparison operator is incorrect
function filterByProperty<T, K extends keyof T>(
  items: T[],
  key: K,
  value: T[K]
): T[] {
  return items.filter(item => item[key] === value); // ❌ BROKEN - wrong operator
}

// Test case - DO NOT MODIFY
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  { id: 2, name: 'Book', price: 29, category: 'Education' },
  { id: 3, name: 'Phone', price: 699, category: 'Electronics' },
];

const electronics = filterByProperty(products, 'category', 'Electronics');
console.log('Electronics count:', electronics.length); // Should be 2

// ==========================================
// SECTION 3: Interface Inheritance
// ==========================================

interface BaseEntity {
  id: number;
  createdAt: Date;
  metadata: Record<string, string>;
}

// BUG 3: Interface inheritance with conflicting property types
// The extending interface should be compatible with the base interface
// Hint: Check the metadata property type compatibility
interface UserEntity extends BaseEntity {
  name: string;
  email: string;
}

// Test case - DO NOT MODIFY
const user: UserEntity = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date(),
  metadata: { source: 'web', campaign: 'summer2024' },
};

// ==========================================
// SECTION 4: Null Safety with Optional Properties
// ==========================================

interface Company {
  name: string;
  address?: {
    street: string;
    city: string;
    zipCode?: string;
  };
}

// BUG 4: Missing null/undefined checks for optional properties
// This function doesn't properly handle optional chaining
// Hint: What happens if address or zipCode is undefined?
function getCompanyZipCode(company: Company): string {
  if (!company.address) return "" 
  if (!company.address.zipCode) return ""

  return company.address.zipCode.toUpperCase(); // ❌ BROKEN - no null checks
}

// Test case - DO NOT MODIFY
const company1: Company = {
  name: 'Tech Corp',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    zipCode: '94105',
  },
};

const company2: Company = {
  name: 'Virtual Inc',
  // address is missing!
};

console.log('Company 1 zip:', getCompanyZipCode(company1)); // Should work
// console.log('Company 2 zip:', getCompanyZipCode(company2)); // Would crash at runtime!

// ==========================================
// SECTION 5: Additional Practice
// ==========================================

// Bonus: Type inference with generics
// This should work once you fix the bugs above
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

const product = findById(products, 2);
console.log('Found product:', product?.name);

export { isDog, getAnimalSound, filterByProperty, getCompanyZipCode, findById };
export type { Animal, Dog, Cat, Fish, Product, User, Company, UserEntity };
