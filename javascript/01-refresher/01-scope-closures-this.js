/**
 * TOPIC: JavaScript Refresher — Scope, Closures, and `this`
 * DATE: Start here. Fill in today's date.
 *
 * WHAT IS IT (plain English):
 *   Scope defines WHERE a variable is accessible.
 *   Closures happen when an inner function remembers variables
 *   from its outer function even after that outer function has finished.
 *   `this` refers to the object that is calling a function — and it
 *   changes depending on HOW the function is called.
 *
 * JARGON:
 *   - Lexical scope:   scope is determined by where code is written
 *   - Closure:         inner function + reference to outer scope
 *   - Execution context: the environment in which code runs
 *   - `this`:          the calling object — depends on invocation pattern
 *   - Arrow function:  does NOT have its own `this` — inherits from parent
 *
 * INTERVIEW ONE-LINER:
 *   "A closure is when an inner function retains access to its outer
 *    function's variables even after the outer function has returned.
 *    This works because JavaScript uses lexical scoping — functions
 *    remember the environment they were defined in."
 *
 * REAL WORLD USE:
 *   - Data encapsulation (private variables without classes)
 *   - Factory functions (create customised functions)
 *   - Memoization (cache previous results)
 *   - Event handlers (preserve state)
 */

// ============================================================
// 1. SCOPE — var vs let vs const
// ============================================================

// var is function-scoped (ignores blocks like if/for)
function varExample() {
  if (true) {
    var x = 10;  // hoisted to function scope
  }
  console.log(x);  // 10 — accessible outside the if block
}

// let and const are block-scoped
function letExample() {
  if (true) {
    let y = 10;  // lives ONLY inside this if block
  }
  // console.log(y);  // ReferenceError — y is not defined here
}

// Hoisting: var declarations are moved to the top of their scope
console.log(hoisted);   // undefined (not an error — var is hoisted)
var hoisted = "value";

// console.log(notHoisted);  // ReferenceError — let is NOT hoisted
// let notHoisted = "value";


// ============================================================
// 2. CLOSURES
// ============================================================

// Basic closure: inner function remembers outer variable
function makeCounter() {
  let count = 0;  // this variable is "closed over"
  
  return function increment() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
// count is private — inaccessible from outside makeCounter

// Factory function using closures
function makeMultiplier(factor) {
  return function (number) {
    return number * factor;  // factor is remembered
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5));  // 10
console.log(triple(5));  // 15


// ============================================================
// 3. THE `this` KEYWORD
// ============================================================

// Rule: `this` is determined by HOW a function is CALLED, not where it is defined

// 1. Method call — `this` = the object before the dot
const user = {
  name: "Aegis",
  greet() {
    console.log(`Hello, I am ${this.name}`);  // this = user
  }
};
user.greet();  // "Hello, I am Aegis"

// 2. Regular function call — `this` = undefined (strict mode) or global
function standalone() {
  console.log(this);  // undefined in strict mode, globalThis otherwise
}

// 3. Arrow functions — `this` = inherited from enclosing scope
const timer = {
  seconds: 0,
  start() {
    // Regular function would lose `this`
    // Arrow function inherits `this` from start()
    setInterval(() => {
      this.seconds++;  // `this` correctly refers to `timer`
      console.log(this.seconds);
    }, 1000);
  }
};

// 4. Explicit binding: call, apply, bind
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}
const person = { name: "Aegis" };
greet.call(person, "Hello");     // Hello, Aegis — call invokes immediately
greet.apply(person, ["Hi"]);     // Hi, Aegis — apply uses array of args
const boundGreet = greet.bind(person);
boundGreet("Hey");               // Hey, Aegis — bind returns new function


// ============================================================
// 4. CLASSIC CLOSURE GOTCHA (Common Interview Question)
// ============================================================

// Problem: var in a loop shares the same variable
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);  // prints 3, 3, 3
  // Why? All closures reference the SAME `i`, which is 3 by the time setTimeout fires
}

// Fix 1: Use let (each iteration gets its own scope)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);  // prints 0, 1, 2
}

// Fix 2: IIFE to capture value (older pattern)
for (var k = 0; k < 3; k++) {
  ((capturedK) => {
    setTimeout(() => console.log(capturedK), 100);  // prints 0, 1, 2
  })(k);
}


// ============================================================
// EXERCISES — Complete these before moving on
// ============================================================

// Exercise 1: Write a makeAdder factory function
// makeAdder(5) should return a function that adds 5 to any number
// makeAdder(5)(3) should return 8
// YOUR CODE HERE:


// Exercise 2: Fix the `this` problem below
const button = {
  label: "Submit",
  handleClick: function() {
    // BUG: setTimeout uses `this` but loses context
    setTimeout(function() {
      console.log(`Button ${this.label} was clicked`);  // `this.label` is undefined
    }, 100);
  }
};
// Fix handleClick using an arrow function
// YOUR FIX HERE:


// Exercise 3: Explain in a comment below — what does this print and why?
let a = 1;
function outer() {
  let a = 2;
  function inner() {
    let a = 3;
    console.log(a);  // What prints?
  }
  inner();
  console.log(a);    // What prints?
}
outer();
console.log(a);      // What prints?
// YOUR EXPLANATION HERE:


// ============================================================
// MOCK INTERVIEW QUESTIONS — Answer out loud before reading on
// ============================================================

/*
Q1: "What is a closure and where would you use one in real code?"

SAMPLE ANSWER:
"A closure is when an inner function retains access to variables from
its outer function's scope even after the outer function has finished
executing. This works because JavaScript uses lexical scoping — functions
remember the environment they were created in. A practical use case is
creating private variables without classes: I can write a makeCounter
function that returns an increment function. The counter variable inside
makeCounter is inaccessible from outside, but the returned function can
still read and modify it. This is the basis for the module pattern."

---

Q2: "Why does `this` behave differently in arrow functions vs regular functions?"

SAMPLE ANSWER:
"Regular functions define their own `this` context based on how they
are called — if called as a method, `this` is the object; if called
as a standalone function, `this` is undefined in strict mode. Arrow
functions do not have their own `this` — they inherit it from the
enclosing lexical scope. This makes arrow functions useful for callbacks
inside methods, where you want to preserve the outer `this`. For example,
using a regular function in setTimeout inside a method loses the reference
to the object, but an arrow function keeps it."

---

Q3: "Explain the difference between var, let, and const."

SAMPLE ANSWER:
"var is function-scoped and hoisted — it is accessible throughout the
entire function regardless of where it is declared. let and const are
block-scoped, meaning they only exist within the curly braces where
they are declared. const additionally prevents reassignment — though for
objects and arrays, the contents can still be mutated. I use const by
default, let when I need to reassign, and I avoid var entirely in modern
code because its hoisting behaviour is a frequent source of bugs."
*/
