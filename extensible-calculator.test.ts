// extensible-calculator.test.ts
import { ExtensibleCalculator } from "./extensible-calculator.ts";
import { assertEquals } from "jsr:@std/assert";

const calc = new ExtensibleCalculator();

Deno.test("basic addition test", () => {
  assertEquals(calc.solve("1 + 2"), 3);
});
Deno.test("basic subtraction test", () => {
  assertEquals(calc.solve("5 - 3"), 2);
});
Deno.test("basic multiplication test", () => {
  assertEquals(calc.solve("4 * 2"), 8);
});
Deno.test("basic division test", () => {
  assertEquals(calc.solve("8 / 2"), 4);
  assertEquals(calc.solve("80/4"), 20);
});
Deno.test("complex expression with parentheses test", () => {
  assertEquals(calc.solve("(1 + 2) * (3 - 4)"), -3);
  assertEquals(calc.solve("(1+2)*(3-4)"), -3);
});
Deno.test("operator precedence test", () => {
  assertEquals(calc.solve("2 + 3 * 4"), 14);
});
Deno.test("complex expression test", () => {
  assertEquals(calc.solve("3 + 4 * 2 / (1 - 5) ^ 2 ^ 3"), 3.0001220703125);
});
Deno.test("mismatched parentheses test", () => {
  try {
    calc.solve("(1 + 2"); // Missing closing parenthesis
    throw new Error(
      "Test failed: Expected an error for mismatched parentheses",
    );
  } catch (e) {
    if (e instanceof Error) {
      assertEquals(e.message, "Mismatched parentheses");
    } else {
      throw e;
    }
  }
});
Deno.test("incomplete expression test", () => {
  try {
    calc.solve("2 +"); // Incomplete expression
    throw new Error(
      "Test failed: Expected an error for invalid expression",
    );
  } catch (e) {
    if (e instanceof Error) {
      assertEquals(e.message, "Invalid expression");
    } else {
      throw e;
    }
  }
});
Deno.test("invalid expression test", () => {
  try {
    calc.solve("2 ++ 2"); // Incomplete expression
    throw new Error(
      "Test failed: Expected an error for invalid expression",
    );
  } catch (e) {
    if (e instanceof Error) {
      assertEquals(e.message, "Invalid expression");
    } else {
      throw e;
    }
  }
});
Deno.test("custom operator addition test", () => {
  calc.addOperator("%", 2, "L", (a, b) => a % b);
  assertEquals(calc.solve("5 % 2"), 1);
});

Deno.test("custom operator precedence test", () => {
  calc.addOperator("!", 3, "R", (a: number) => {
    if (a < 0) {
      throw new Error("Factorial is not defined for negative numbers.");
    }
    return Array.from({ length: a }, (_, i) => i + 1).reduce(
      (acc, val) => acc * val,
      1,
    );
  }, 1);
  assertEquals(calc.solve("2!"), 2);
  assertEquals(calc.solve("9 !"), 362880);
});
