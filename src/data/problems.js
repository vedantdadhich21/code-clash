export const problems = [
  {
  title: "Two Sum",

  problem_id: "1",
  frontend_id: "1",

  problem_slug: "two-sum",
  difficulty: "Easy",

  topics: [
    "Array",
    "Hash Table"
  ],

  description:
    "Given an array of integers and a target value, find the indices of two numbers such that they add up to the target. Exactly one valid answer exists for every testcase.",

  inputFormat:
`First line contains an integer T — the number of test cases.

For each test case:

Line 1 contains an integer n — the size of the array.
Line 2 contains n space-separated integers representing the array.
Line 3 contains the target integer.`,

  outputFormat:
`For each test case print two space-separated indices whose values sum to the target.

Print each answer on a new line.`,

  note:
`Java users must name their class Main.`,

  examples: [
    {
      input:
`3
4
2 7 11 15
9
3
3 2 4
6
2
3 3
6`,

      output:
`0 1
1 2
0 1`,

      explanation:
`Each line of output corresponds to one testcase.`
    }
  ],

  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Exactly one valid answer exists."
  ],

  hints: [],

  multiTestcase: true,

  timeLimit: 2,
  memoryLimit: 256
},
{
  title: "Best Time to Buy and Sell Stock",

  problem_id: "121",
  frontend_id: "121",

  problem_slug: "best-time-to-buy-and-sell-stock",

  difficulty: "Easy",

  topics: [
    "Array",
    "Dynamic Programming"
  ],

  description:
    "Given an array of integers representing stock prices on consecutive days, find the maximum profit you can achieve by buying on one day and selling on a later day. If no profit is possible, return 0.",

  inputFormat:
`First line contains an integer T — the number of test cases.

For each test case:

Line 1 contains an integer n — the number of days.
Line 2 contains n space-separated integers representing the stock prices.`,

  outputFormat:
`For each test case print the maximum profit achievable.

Print each answer on a new line.`,

  note:
`Java users must name their class Main.`,

  examples: [
    {
      input:
`3
6
7 1 5 3 6 4
5
7 6 4 3 1
2
1 2`,

      output:
`5
0
1`,

      explanation:
`Testcase 1: Buy on day 2 (price = 1), sell on day 5 (price = 6), profit = 5.
Testcase 2: Prices only decrease, so no profit is possible.
Testcase 3: Buy on day 1 (price = 1), sell on day 2 (price = 2), profit = 1.`
    }
  ],

  constraints: [
    "1 <= prices.length <= 10^5",
    "0 <= prices[i] <= 10^4"
  ],

  hints: [],

  multiTestcase: true,

  timeLimit: 2,
  memoryLimit: 256
},
{
  title: "Maximum Subarray",

  problem_id: "53",
  frontend_id: "53",

  problem_slug: "maximum-subarray",

  difficulty: "Medium",

  topics: [
    "Array",
    "Divide and Conquer",
    "Dynamic Programming"
  ],

  description:
    "Given an integer array, find the contiguous subarray (containing at least one number) which has the largest sum, and return that sum.",

  inputFormat:
`First line contains an integer T — the number of test cases.

For each test case:

Line 1 contains an integer n — the size of the array.
Line 2 contains n space-separated integers representing the array.`,

  outputFormat:
`For each test case print the largest subarray sum.

Print each answer on a new line.`,

  note:
`Java users must name their class Main.`,

  examples: [
    {
      input:
`3
9
-2 1 -3 4 -1 2 1 -5 4
1
1
5
5 4 -1 7 8`,

      output:
`6
1
23`,

      explanation:
`Testcase 1: The subarray [4, -1, 2, 1] has the largest sum 6.
Testcase 2: The single element [1] has sum 1.
Testcase 3: The entire array [5, 4, -1, 7, 8] has the largest sum 23.`
    }
  ],

  constraints: [
    "1 <= nums.length <= 10^5",
    "-10^4 <= nums[i] <= 10^4"
  ],

  hints: [],

  multiTestcase: true,

  timeLimit: 2,
  memoryLimit: 256
},
{
  title: "Search in Rotated Sorted Array",

  problem_id: "33",
  frontend_id: "33",

  problem_slug: "search-in-rotated-sorted-array",

  difficulty: "Medium",

  topics: [
    "Array",
    "Binary Search"
  ],

  description:
    "Given a sorted array of distinct integers that has been rotated at an unknown pivot, and a target value, return the index of the target in the array. If the target is not found, return -1. Your algorithm must run in O(log n) time complexity.",

  inputFormat:
`First line contains an integer T — the number of test cases.

For each test case:

Line 1 contains an integer n — the size of the array.
Line 2 contains n space-separated integers representing the rotated sorted array.
Line 3 contains the target integer.`,

  outputFormat:
`For each test case print the index of the target, or -1 if not found.

Print each answer on a new line.`,

  note:
`Java users must name their class Main.`,

  examples: [
    {
      input:
`3
7
4 5 6 7 0 1 2
0
7
4 5 6 7 0 1 2
3
1
1
0`,

      output:
`4
-1
-1`,

      explanation:
`Testcase 1: Target 0 is at index 4.
Testcase 2: Target 3 is not in the array.
Testcase 3: Target 0 is not in the single-element array [1].`
    }
  ],

  constraints: [
    "1 <= nums.length <= 5000",
    "-10^4 <= nums[i] <= 10^4",
    "All values of nums are unique.",
    "nums is an ascending array that is possibly rotated.",
    "-10^4 <= target <= 10^4"
  ],

  hints: [],

  multiTestcase: true,

  timeLimit: 2,
  memoryLimit: 256
},
{
  title: "Climbing Stairs",

  problem_id: "70",
  frontend_id: "70",

  problem_slug: "climbing-stairs",

  difficulty: "Easy",

  topics: [
    "Math",
    "Dynamic Programming",
    "Memoization"
  ],

  description:
    "You are climbing a staircase that takes n steps to reach the top. Each time you can climb either 1 or 2 steps. Return the number of distinct ways you can climb to the top.",

  inputFormat:
`First line contains an integer T — the number of test cases.

For each test case:

Line 1 contains a single integer n.`,

  outputFormat:
`For each test case print the number of distinct ways to climb to the top.

Print each answer on a new line.`,

  note:
`Java users must name their class Main.`,

  examples: [
    {
      input:
`2
2
3`,

      output:
`2
3`,

      explanation:
`Testcase 1: Two ways — (1+1) or (2).
Testcase 2: Three ways — (1+1+1), (1+2), or (2+1).`
    }
  ],

  constraints: [
    "1 <= n <= 45"
  ],

  hints: [
    "To reach the nth step, what could have been your previous step? (Think about the step sizes)"
  ],

  multiTestcase: true,

  timeLimit: 2,
  memoryLimit: 256
}
]