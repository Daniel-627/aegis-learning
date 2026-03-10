# 🧠 The LeetCode Methodology
## How to Actually Solve Problems — Not Just Memorise Solutions

> *"The goal is not to solve THIS problem. The goal is to build a mind that solves ALL problems."*

---

## The Brutal Truth First

Most people fail LeetCode not because they lack intelligence.  
They fail because they open a problem, stare at it for 10 minutes, give up, and read the solution.  
Then they do it again. And again. And learn nothing.

**The methodology below fixes that.**

---

## The 8-Step Framework (Use Every Single Time)

### STEP 1 — READ SLOWLY (3 minutes, no code)
Read the problem twice. Do not rush. Most bugs come from misreading.

Ask yourself:
- What is the input? What type is it? (array, string, integer, tree?)
- What is the output? What type?
- What does "return" mean here — modify in place or return a new value?
- What are the constraints? (array length, value range, time limit?)

**Do not write code yet.**

---

### STEP 2 — WORK A CONCRETE EXAMPLE BY HAND
Take the given example. Trace through it manually on paper or in comments.

```
Example: Two Sum
Input: nums = [2, 7, 11, 15], target = 9
By hand: 2 + 7 = 9 ✓  → return [0, 1]
         2 + 11 = 13 ✗
         2 + 15 = 17 ✗
```

Then make your **own** example. One normal case, one edge case.

```
My example: nums = [3, 3], target = 6 → return [0, 1]
Edge case:  nums = [1], target = 1    → return [] (no pair possible)
```

**This step catches 40% of bugs before you write a single line.**

---

### STEP 3 — IDENTIFY THE PATTERN

Every LeetCode problem belongs to a **pattern family**. Once you see the pattern, the solution follows naturally.

| If the problem involves... | Think... |
|---------------------------|----------|
| Sorted array, find pair/target | Two Pointers |
| Subarray of fixed or variable size | Sliding Window |
| Finding duplicates or fast lookup | Hash Map |
| Tree traversal / path | DFS or BFS |
| "Minimum/maximum subproblem" | Dynamic Programming |
| Sorted array, find position/value | Binary Search |
| Balance of brackets/operations | Stack |
| Shortest path in graph | BFS / Dijkstra |
| Connected components | Union-Find |
| Combinations/permutations | Backtracking |

Ask yourself: **Which pattern fits this problem?**

---

### STEP 4 — THINK BRUTE FORCE FIRST (out loud)

Always think of the simplest, slowest solution first. This does two things:
1. It proves you understand the problem
2. It gives you a baseline to optimise from

```
Brute Force for Two Sum:
  For every pair (i, j) where i ≠ j:
    if nums[i] + nums[j] === target → return [i, j]
  Time: O(n²)   Space: O(1)
```

**Say it out loud: "The brute force is... O(n²) because..."**

---

### STEP 5 — OPTIMISE (the insight moment)

Ask: **What is the bottleneck? What repeated work is happening?**

```
Two Sum bottleneck: checking every pair twice
Insight: Instead of searching for the complement every time,
         store what we've seen in a hash map.
         For each num, ask: "Is (target - num) already in the map?"

Optimised:
  map = {}
  for each num at index i:
    complement = target - num
    if complement in map → return [map[complement], i]
    map[num] = i
  Time: O(n)   Space: O(n)
```

---

### STEP 6 — CODE THE SOLUTION (clean, not clever)

Write readable code first. Comments are allowed and encouraged.

```javascript
// JavaScript
function twoSum(nums, target) {
  const seen = new Map(); // { value: index }

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return []; // no solution found
}
```

```python
# Python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # { value: index }

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []  # no solution found
```

---

### STEP 7 — ANALYSE COMPLEXITY (mandatory)

You **will** be asked this in every interview. Never skip it.

```
Time Complexity:  O(n)  — one pass through the array
Space Complexity: O(n)  — hash map stores at most n entries

Why O(n) time?
  We visit each element exactly once.
  Hash map lookup is O(1) average.
  So: n elements × O(1) per element = O(n)

Why O(n) space?
  Worst case: no pair found until the last element.
  We store n-1 elements in the map before finding the answer.
```

---

### STEP 8 — TEST YOUR CODE MENTALLY

Run through your examples **in your head** using the code, not the logic.

```
Test 1: nums=[2,7,11,15], target=9
  i=0: complement=7, seen={} → not found. seen={2:0}
  i=1: complement=2, seen={2:0} → FOUND! return [0,1] ✓

Test 2: nums=[3,3], target=6
  i=0: complement=3, seen={} → not found. seen={3:0}
  i=1: complement=3, seen={3:0} → FOUND! return [0,1] ✓

Edge: nums=[1], target=1
  i=0: complement=0, seen={} → not found. seen={1:0}
  loop ends. return [] ✓
```

---

## The Pattern Cheat Sheet

### 🔵 Two Pointers
**When:** Array/string, sorted or symmetry-based, find pair or check condition
**Template:**
```javascript
let left = 0, right = arr.length - 1;
while (left < right) {
  if (condition) return result;
  else if (needBigger) left++;
  else right--;
}
```

---

### 🟢 Sliding Window
**When:** Subarray/substring of size k, or longest/shortest subarray meeting condition
**Template:**
```javascript
let left = 0, maxLen = 0;
const window = new Map();
for (let right = 0; right < s.length; right++) {
  // add s[right] to window
  while (windowInvalid) {
    // remove s[left] from window
    left++;
  }
  maxLen = Math.max(maxLen, right - left + 1);
}
```

---

### 🟡 Binary Search
**When:** Sorted array, find element or boundary, "minimum possible maximum"
**Template:**
```javascript
let left = 0, right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  else if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
return -1;
```

---

### 🔴 DFS (Tree/Graph)
**When:** Tree paths, connected components, cycle detection, exhaustive search
**Template:**
```javascript
function dfs(node) {
  if (!node) return baseCase;
  const left = dfs(node.left);
  const right = dfs(node.right);
  return combineResults(left, right);
}
```

---

### 🟠 BFS (Shortest Path)
**When:** Shortest path, level-order traversal, minimum steps
**Template:**
```javascript
const queue = [start];
const visited = new Set([start]);
let steps = 0;
while (queue.length) {
  const size = queue.length;
  for (let i = 0; i < size; i++) {
    const node = queue.shift();
    if (node === target) return steps;
    for (const neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  steps++;
}
```

---

### 🟣 Dynamic Programming
**When:** "Count ways", "minimum cost", overlapping subproblems, optimal substructure
**Framework:**
```
1. Define what dp[i] means in plain English
2. Find the recurrence relation (how dp[i] relates to dp[i-1])
3. Define the base case (dp[0] or dp[1])
4. Decide: top-down (memoization) or bottom-up (tabulation)
```

```javascript
// Example: Climbing Stairs (dp[i] = ways to reach step i)
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2]; // recurrence
  }
  return dp[n];
}
```

---

## Big O Reference

### Time Complexity (fast → slow)
```
O(1)        Constant    — hash map lookup, array access by index
O(log n)    Log         — binary search, balanced BST operations
O(n)        Linear      — single loop through array
O(n log n)  Linearithmic— merge sort, heap sort
O(n²)       Quadratic   — nested loops
O(2ⁿ)       Exponential — recursive subsets
O(n!)       Factorial   — permutations
```

### Space Complexity Reminders
- Recursion depth = O(n) stack space for linear, O(log n) for balanced tree
- Hash map of n items = O(n)
- Sorting in-place = O(1) extra space (but not always stable)

---

## How to Talk Through a Problem in an Interview

This is the script. Memorise the structure, not the words.

```
1. "Let me make sure I understand the problem..."
   → Restate it in your own words

2. "Let me work through this example to confirm..."
   → Trace the given example by hand

3. "Before I code, let me think about the brute force approach..."
   → State it. Give complexity.

4. "I think we can do better. The insight here is..."
   → Explain the optimisation in plain English before coding

5. "Let me code this up..."
   → Code cleanly, talk while you code

6. "The time complexity is O(...) because... and space is O(...) because..."
   → Always say why, not just what

7. "Let me test with the examples..."
   → Trace through manually
```

**The interviewer is evaluating your THINKING, not just your answer.**

---

## The 50 Problems Every Developer Must Know

### Arrays (Start Here)
1. Two Sum — Hash Map
2. Best Time to Buy/Sell Stock — Greedy
3. Contains Duplicate — Hash Set
4. Product of Array Except Self — Prefix/Suffix
5. Maximum Subarray — Kadane's Algorithm
6. Maximum Product Subarray — DP
7. Find Minimum in Rotated Sorted Array — Binary Search
8. Search in Rotated Sorted Array — Binary Search
9. 3Sum — Two Pointers
10. Container With Most Water — Two Pointers

### Strings
11. Valid Anagram — Hash Map
12. Valid Palindrome — Two Pointers
13. Longest Substring Without Repeating Characters — Sliding Window
14. Longest Repeating Character Replacement — Sliding Window
15. Minimum Window Substring — Sliding Window
16. Valid Parentheses — Stack
17. Group Anagrams — Hash Map
18. Longest Palindromic Substring — Expand Around Centre

### Linked Lists
19. Reverse a Linked List — Iterative + Recursive
20. Merge Two Sorted Lists
21. Reorder List
22. Remove Nth Node From End
23. Detect Cycle — Floyd's Algorithm
24. Merge K Sorted Lists — Heap

### Trees
25. Invert Binary Tree — DFS
26. Maximum Depth — DFS
27. Same Tree — DFS
28. Subtree of Another Tree — DFS
29. Lowest Common Ancestor of BST
30. Level Order Traversal — BFS
31. Validate BST — DFS with bounds
32. Kth Smallest Element in BST — Inorder
33. Construct BST from Preorder
34. Serialize and Deserialize Binary Tree

### Graphs
35. Number of Islands — DFS/BFS
36. Clone Graph — DFS + Hash Map
37. Pacific Atlantic Water Flow — Multi-source BFS
38. Course Schedule — Topological Sort
39. Number of Connected Components — Union-Find
40. Graph Valid Tree

### Dynamic Programming
41. Climbing Stairs — DP
42. Coin Change — DP
43. Longest Increasing Subsequence — DP
44. Longest Common Subsequence — 2D DP
45. Word Break — DP
46. Combination Sum IV — DP
47. House Robber — DP
48. House Robber II — DP
49. Decode Ways — DP
50. Unique Paths — 2D DP

---

## Weekly LeetCode Schedule

| Day | Focus | Volume |
|-----|-------|--------|
| Monday | Easy — new pattern | 2 problems |
| Tuesday | Easy — same pattern | 2 problems |
| Wednesday | Medium — apply pattern | 1 problem |
| Thursday | Medium — stretch problem | 1 problem |
| Friday | Review the week's solutions. Rewrite without looking. | — |
| Saturday | Mock interview: 1 medium, timed 25 min, talk out loud | 1 problem |
| Sunday | Read editorial for hardest problem of the week | — |

**Rule: Never look at a solution until you have spent at least 20 minutes genuinely stuck.**

---

*Solve the problem. Understand the pattern. Own the concept.*
