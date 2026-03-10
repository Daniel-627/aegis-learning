# 🛡️ aegis-learning

> *"Every expert was once a beginner who refused to quit."*

This is my personal learning repository. Every concept i study, every problem I solve, every note I take lives here. This repo is my brain — externalised, versioned, and searchable.

---

## 📁 Repository Structure

```
aegis-learning/
│
├── javascript/
│   ├── 01-refresher/        # ES6+, scope, closures, this — the rusty parts
│   ├── 02-advanced/         # Prototypes, event loop, design patterns
│   └── 03-async/            # Promises, async/await, concurrency model
│
├── python/
│   ├── 01-basics/           # Syntax, types, control flow, functions
│   ├── 02-intermediate/     # OOP, modules, error handling, file I/O
│   └── 03-advanced/         # Decorators, generators, async, typing
│
├── dsa/
│   ├── arrays/              # Two pointers, sliding window, prefix sums
│   ├── strings/             # Pattern matching, anagrams, palindromes
│   ├── linked-lists/        # Traversal, reversal, cycle detection
│   ├── stacks-queues/       # Monotonic stack, BFS/DFS with queues
│   ├── trees/               # BST, traversals, path problems
│   ├── graphs/              # BFS, DFS, Dijkstra, Union-Find
│   ├── dynamic-programming/ # Memoization, tabulation, patterns
│   ├── sorting/             # QuickSort, MergeSort, HeapSort
│   └── searching/           # Binary search and variants
│
├── cs-fundamentals/
│   ├── memory/              # Stack vs heap, pointers, garbage collection
│   ├── networking/          # TCP/IP, HTTP, DNS, TLS
│   ├── os/                  # Processes, threads, concurrency, syscalls
│   └── databases/           # ACID, indexes, query planning, transactions
│
├── system-design/
│   ├── concepts/            # Scalability, caching, load balancing, CAP
│   └── case-studies/        # Design Twitter, Uber, WhatsApp, YouTube
│
├── leetcode/
│   ├── easy/                # Solved problems with notes
│   ├── medium/              # Solved problems with notes
│   ├── hard/                # Solved problems with notes
│   └── templates/           # Reusable patterns for each problem type
│
├── real-world-concepts/     # Idempotency, CAP theorem, rate limiting, etc.
│
└── interview-prep/          # Mock interviews, STAR answers, cheat sheets
```

---

## 🔁 The Daily Learning Loop

Every single session follows this exact sequence. Do not skip steps.

```
1. READ    → Understand the concept in plain English (no code yet)
2. DEFINE  → Write the jargon in your own words in a comment at the top of your file
3. CODE    → Implement it in JavaScript first, then Python
4. BREAK   → Deliberately break it. What happens? Why?
5. EXPLAIN → Close your editor. Explain it out loud to nobody. 2 minutes.
6. COMMIT  → git add . && git commit -m "topic: what you learned"
```

---

## 📌 Commit Convention

Every commit tells a story. Use this format:

```
type(scope): description

Types:
  learn     → new concept studied
  solve     → leetcode/problem solved
  note      → notes added or updated
  fix       → correction to previous understanding
  design    → system design notes

Examples:
  learn(js): closures and lexical scope
  solve(dsa): two sum - sliding window approach
  note(cs): TCP three-way handshake
  design(system): URL shortener design notes
```

---

## 🎯 Weekly Goals

| Week | JS Focus | Python Focus | DSA Focus | CS/Design |
|------|----------|--------------|-----------|-----------|
| 1 | Scope, closures, this | Syntax, types, functions | Arrays + Two Pointers | Memory model |
| 2 | Prototypes, classes | OOP, classes | Strings + Sliding Window | Networking basics |
| 3 | Async, Promises | Decorators, generators | Linked Lists | OS fundamentals |
| 4 | Event loop, patterns | Async Python | Trees + BST | DB internals |
| 5 | Node.js internals | Modules, packages | Graphs + BFS/DFS | System Design intro |
| 6 | Express patterns | FastAPI basics | Dynamic Programming | Design: URL shortener |
| 7 | React internals | Data pipelines | Sorting algorithms | Design: Chat system |
| 8 | Full-stack patterns | REST with Python | Advanced trees | Design: Twitter feed |

---

## 🚀 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/aegis-learning.git
cd aegis-learning

# Start with JavaScript refresher
cd javascript/01-refresher

# Create your first file
touch 01-scope-and-closures.js
```

---

## 📏 The Standard for Every File

Every code file you write must have this structure at the top:

```javascript
/**
 * TOPIC: Closures
 * DATE: YYYY-MM-DD
 *
 * WHAT IS IT (plain English):
 *   A closure is a function that remembers the variables from the scope
 *   where it was defined, even after that outer scope has finished executing.
 *
 * JARGON:
 *   - Lexical scope: scope determined by where code is written, not where it runs
 *   - Closure: inner function + reference to outer scope variables
 *
 * INTERVIEW ONE-LINER:
 *   "A closure is when an inner function retains access to its outer function's
 *    variables even after the outer function has returned."
 *
 * REAL WORLD USE:
 *   - Data privacy / encapsulation
 *   - Factory functions
 *   - Memoization
 */
```

---

*This repo is evidence. Every commit is proof that I showed up.*
