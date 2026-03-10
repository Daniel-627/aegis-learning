/**
 * TOPIC: Arrays — Two Pointers & Hash Map Patterns
 * DATE: Fill in today's date
 *
 * WHAT IS IT:
 *   Arrays are the most fundamental data structure.
 *   Most array problems use one of three core patterns:
 *   1. Hash Map  — trade memory for speed (O(n) time, O(n) space)
 *   2. Two Pointers — use sorted property or symmetry (O(n) time, O(1) space)
 *   3. Sliding Window — track a subarray efficiently (O(n) time, O(1) or O(k) space)
 *
 * BIG O REVIEW:
 *   Array access by index:  O(1)
 *   Linear scan (loop):     O(n)
 *   Nested loops:           O(n²)
 *   Sorting:                O(n log n)
 */


// ============================================================
// PROBLEM 1: Two Sum (LeetCode #1 — Easy)
// ============================================================
/**
 * Given an array of integers and a target, return the indices
 * of the two numbers that add up to target.
 * Assume exactly one solution exists.
 *
 * Input:  nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1]
 *
 * PATTERN: Hash Map
 * INSIGHT: Instead of checking every pair (O(n²)),
 *          ask "have I already seen the complement of this number?"
 */

// BRUTE FORCE — O(n²) time, O(1) space
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// OPTIMAL — O(n) time, O(n) space
function twoSum(nums, target) {
  const seen = new Map(); // Map<value, index>

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }

    seen.set(nums[i], i);
  }

  return [];
}

// Python equivalent:
/*
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # { value: index }
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
*/

// Tests
console.log(twoSum([2, 7, 11, 15], 9));   // [0, 1]
console.log(twoSum([3, 2, 4], 6));         // [1, 2]
console.log(twoSum([3, 3], 6));            // [0, 1]


// ============================================================
// PROBLEM 2: Best Time to Buy and Sell Stock (LeetCode #121 — Easy)
// ============================================================
/**
 * Given an array where prices[i] is the price on day i,
 * return the maximum profit from one buy and one sell.
 * Must buy before selling. Return 0 if no profit possible.
 *
 * Input:  [7, 1, 5, 3, 6, 4]
 * Output: 5  (buy at 1, sell at 6)
 *
 * PATTERN: Greedy — track min price seen so far
 * INSIGHT: For each day, ask "what's the best profit if I sell today?"
 *          = today's price - lowest price seen so far
 */

function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;            // new minimum found
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice; // new max profit found
    }
  }

  return maxProfit;
}

// Tests
console.log(maxProfit([7, 1, 5, 3, 6, 4]));  // 5
console.log(maxProfit([7, 6, 4, 3, 1]));      // 0 (prices only go down)
console.log(maxProfit([1, 2]));               // 1


// ============================================================
// PROBLEM 3: Maximum Subarray — Kadane's Algorithm (LeetCode #53 — Medium)
// ============================================================
/**
 * Find the contiguous subarray with the largest sum.
 *
 * Input:  [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 * Output: 6  (subarray [4, -1, 2, 1])
 *
 * PATTERN: Dynamic Programming / Greedy
 * INSIGHT: At each position, decide: extend the current subarray
 *          OR start fresh from this element.
 *          currentSum = max(num, currentSum + num)
 */

function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Is it better to extend the subarray or start fresh here?
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// Tests
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));  // 6
console.log(maxSubArray([1]));                                 // 1
console.log(maxSubArray([-1, -2, -3]));                       // -1


// ============================================================
// PROBLEM 4: Contains Duplicate (LeetCode #217 — Easy)
// ============================================================
/**
 * Return true if any value appears at least twice in the array.
 *
 * Input:  [1, 2, 3, 1]
 * Output: true
 *
 * PATTERN: Hash Set
 */

function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}

// One-liner (valid in interviews, but explain it):
const containsDuplicate2 = (nums) => new Set(nums).size !== nums.length;


// ============================================================
// PROBLEM 5: Product of Array Except Self (LeetCode #238 — Medium)
// ============================================================
/**
 * Return an array where output[i] = product of all elements EXCEPT nums[i]
 * Without using division. O(n) time.
 *
 * Input:  [1, 2, 3, 4]
 * Output: [24, 12, 8, 6]
 *
 * PATTERN: Prefix/Suffix Products
 * INSIGHT: output[i] = (product of everything LEFT of i)
 *                    × (product of everything RIGHT of i)
 *          Build these two arrays in two passes.
 */

function productExceptSelf(nums) {
  const n = nums.length;
  const output = new Array(n).fill(1);

  // Pass 1: output[i] = product of all elements to the LEFT of i
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    output[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // Pass 2: multiply by product of all elements to the RIGHT of i
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    output[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return output;
}

// Tests
console.log(productExceptSelf([1, 2, 3, 4]));    // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0, 0, 9, 0, 0]


// ============================================================
// PROBLEM TEMPLATE — Use this for every new problem
// ============================================================
/**
 * PROBLEM: [Problem name] (LeetCode #___ — Easy/Medium/Hard)
 *
 * DESCRIPTION:
 *   [What is the problem asking?]
 *
 * EXAMPLES:
 *   Input:  [your example]
 *   Output: [expected output]
 *
 * CONSTRAINTS:
 *   [What are the array sizes, value ranges?]
 *
 * PATTERN: [Hash Map / Two Pointers / Sliding Window / etc.]
 *
 * BRUTE FORCE:
 *   [Describe in words — O(?) time, O(?) space]
 *
 * INSIGHT / OPTIMISATION:
 *   [What is the key observation that improves it?]
 *
 * APPROACH:
 *   [Step by step in plain English BEFORE coding]
 *
 * COMPLEXITY:
 *   Time:  O(?)
 *   Space: O(?)
 */

function solveProblem(input) {
  // Step 1: handle edge cases
  
  // Step 2: main logic
  
  // Step 3: return result
}


// ============================================================
// EXERCISES — Solve these using the template above
// ============================================================

// Exercise 1: Valid Anagram (LeetCode #242 — Easy)
// Given two strings s and t, return true if t is an anagram of s
// "anagram" and "nagaram" → true
// "rat" and "car" → false
// Hint: Both strings have the same character frequencies
function isAnagram(s, t) {
  // YOUR CODE HERE
}

// Exercise 2: Two Sum II (LeetCode #167 — Medium)
// Array is SORTED. Find two numbers summing to target.
// Return 1-indexed positions. Use O(1) space.
// Hint: Two pointers — if sum too small, move left pointer right
function twoSumSorted(numbers, target) {
  // YOUR CODE HERE
}

// Exercise 3: 3Sum (LeetCode #15 — Medium)
// Find all unique triplets that sum to 0
// Input: [-1, 0, 1, 2, -1, -4]
// Output: [[-1, -1, 2], [-1, 0, 1]]
// Hint: Sort first, then for each element use Two Pointers
function threeSum(nums) {
  // YOUR CODE HERE
}
