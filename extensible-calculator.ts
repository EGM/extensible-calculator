/**
 * Extensible Calculator
 *
 * This calculator supports basic arithmetic operations and allows users to add custom operators.
 * It uses the Shunting Yard algorithm to parse expressions and evaluate them in postfix notation.
 */

/**
 * Type definition for an operator in the calculator.
 * @property precedence - The precedence of the operator (higher means it binds tighter).
 * @property associativity - 'L' for left associative, 'R' for right associative.
 */
type OperatorDef = {
  precedence: number;
  associativity: "L" | "R";
  fn: ((a: number, b: number) => number) | ((a: number) => number);
  arity: 1 | 2;
};

/**
 * ExtensibleCalculator class
 *
 * This class implements a calculator that can parse and evaluate mathematical expressions.
 * It supports basic arithmetic operations and allows users to define custom operators.
 */
export class ExtensibleCalculator {
  private operators: { [key: string]: OperatorDef };

  constructor() {
    this.operators = {
      "+": { precedence: 1, associativity: "L", fn: (a, b) => a + b, arity: 2 },
      "-": { precedence: 1, associativity: "L", fn: (a, b) => a - b, arity: 2 },
      "*": { precedence: 2, associativity: "L", fn: (a, b) => a * b, arity: 2 },
      "/": { precedence: 2, associativity: "L", fn: (a, b) => a / b, arity: 2 },
      "^": {
        precedence: 3,
        associativity: "R",
        fn: (a, b) => Math.pow(a, b),
        arity: 2,
      },
    };
  }

  /**
   * Add a new operator to the calculator.
   * @param symbol The operator symbol (e.g. '%', '!')
   * @param precedence Operator precedence
   * @param associativity 'L' or 'R'
   * @param fn The function to execute. For unary, takes one argument. For binary, takes two.
   * @param arity 1 for unary, 2 for binary (default 2)
   */
  public addOperator(
    symbol: string,
    precedence: number,
    associativity: "L" | "R",
    fn: ((a: number, b: number) => number) | ((a: number) => number),
    arity: 1 | 2 = 2,
  ): void {
    if (this.operators[symbol]) {
      throw new Error(`Operator '${symbol}' already exists.`);
    }
    this.operators[symbol] = { precedence, associativity, fn, arity };
  }

  private isOperator(token: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.operators, token);
  }

  private isNumeric(token: string): boolean {
    return /^\d+(\.\d+)?$/.test(token);
  }

  // Tokenize the input string
  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let numBuffer = "";
    for (let i = 0; i < expr.length; i++) {
      const c = expr[i];
      if (c === " ") continue;
      if (this.isOperator(c) || c === "(" || c === ")") {
        if (numBuffer) {
          tokens.push(numBuffer);
          numBuffer = "";
        }
        tokens.push(c);
      } else if (/[0-9.]/.test(c)) {
        numBuffer += c;
      } else {
        throw new Error(`Invalid character: ${c}`);
      }
    }
    if (numBuffer) tokens.push(numBuffer);
    return tokens;
  }

  // Convert infix to postfix (Shunting Yard Algorithm)
  private infixToPostfix(tokens: string[]): string[] {
    const output: string[] = [];
    const stack: string[] = [];
    for (const token of tokens) {
      if (this.isNumeric(token)) {
        output.push(token);
      } else if (this.isOperator(token)) {
        while (
          stack.length &&
          this.isOperator(stack[stack.length - 1]) &&
          ((this.operators[token].associativity === "L" &&
            this.operators[token].precedence <=
              this.operators[stack[stack.length - 1]].precedence) ||
            (this.operators[token].associativity === "R" &&
              this.operators[token].precedence <
                this.operators[stack[stack.length - 1]].precedence))
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop()!);
        }
        if (stack.length === 0) throw new Error("Mismatched parentheses");
        stack.pop(); // Remove '('
      }
    }
    while (stack.length) {
      const op = stack.pop()!;
      if (op === "(" || op === ")") throw new Error("Mismatched parentheses");
      output.push(op);
    }
    return output;
  }

  // Evaluate postfix expression
  private evalPostfix(postfix: string[]): number {
    const stack: number[] = [];
    for (const token of postfix) {
      if (this.isNumeric(token)) {
        stack.push(parseFloat(token));
      } else if (this.isOperator(token)) {
        const op = this.operators[token];
        if (op.arity === 2) {
          const b = stack.pop();
          const a = stack.pop();
          if (a === undefined || b === undefined) {
            throw new Error("Invalid expression");
          }
          stack.push((op.fn as (a: number, b: number) => number)(a, b));
        } else if (op.arity === 1) {
          const a = stack.pop();
          if (a === undefined) throw new Error("Invalid expression");
          stack.push((op.fn as (a: number) => number)(a));
        } else {
          throw new Error("Unsupported operator arity");
        }
      }
    }
    if (stack.length !== 1) throw new Error("Invalid expression");
    return stack[0];
  }

  // Main function to parse and solve the equation
  public solve(expr: string): number {
    const tokens = this.tokenize(expr);
    const postfix = this.infixToPostfix(tokens);
    return this.evalPostfix(postfix);
  }
}

// Example usage:
// const calc = new ExtensibleCalculator();
// calc.addOperator('%', 2, 'L', (a, b) => a % b);
// console.log(calc.solve('3 + 4 * 2 / (1 - 5) ^ 2 ^ 3'));
// console.log(calc.solve('10 % 3'));
