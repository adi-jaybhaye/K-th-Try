// ====================================================================
// KthTry — Python Preparation Track: Standard Library & Idioms
// Comprehensive language-specific guide for technical interviews
// ====================================================================

import { LanguageEssentialTopic } from '../types/curriculum';

export const pythonEssentialsData: LanguageEssentialTopic[] = [
  {
    id: 'py-list-slicing-costs',
    language: 'Python',
    title: 'List Mechanics, Slicing Costs & deque Selection',
    category: 'Sequences & Complexity',
    description:
      'Understanding Python dynamic list internals, avoiding hidden O(N) slicing and pop(0) costs, and choosing `collections.deque` for double-ended queues.',
    keyRules: [
      '`list.pop(0)` and `list.insert(0, x)` are O(N) operations because all remaining elements must be shifted in memory. For queues, always use `collections.deque`.',
      'List slicing `arr[i:j]` creates a shallow copy of length (j - i), taking O(j - i) time and memory! Avoid slicing inside loops or recursive calls (e.g. `dfs(nums[1:])` is O(N^2)).',
      '`collections.deque` provides true O(1) `append()`, `appendleft()`, `pop()`, and `popleft()`.',
      'Python integers have arbitrary precision (no 32-bit or 64-bit integer overflow limit), but memory allocation grows for astronomical values.',
    ],
    codeExample: `from collections import deque

# INCORRECT: O(N) per pop operation
# queue = []
# queue.append(1)
# queue.pop(0) # O(N) element shift!

# CORRECT: O(1) double-ended queue for BFS:
queue = deque([root])
while queue:
    node = queue.popleft() # True O(1)
    if node.left:
        queue.append(node.left)
    if node.right:
        queue.append(node.right)

# SLICING PITFALL:
# Passing indices instead of slicing copies:
def helper(arr, start_idx):
    if start_idx >= len(arr):
        return
    # Read arr[start_idx] without copying arr[start_idx:]
    helper(arr, start_idx + 1)`,
    complexityCost: '`list.pop()` from end is amortized O(1). `list.pop(0)` is O(N). `deque.popleft()` is O(1). `arr[i:j]` is O(j - i).',
    interviewTip:
      'Never write `queue.pop(0)` on a standard list in an interview. State: "I will use `collections.deque` so `popleft()` executes in O(1) instead of O(N)."',
  },
  {
    id: 'py-collections-counter-defaultdict',
    language: 'Python',
    title: 'collections.defaultdict & collections.Counter',
    category: 'Dictionaries & Sets',
    description:
      'Master high-performance frequency counting, adjacency list graph representation, and default dictionary factories without KeyErrors.',
    keyRules: [
      '`collections.Counter(iterable)` counts frequencies in linear O(N) time and provides `.most_common(k)` and multiset subtraction.',
      '`collections.defaultdict(list)` automatically creates an empty list when accessing an unobserved key, eliminating repetitive `if key not in d:` checks.',
      '`collections.defaultdict(int)` defaults nonexistent keys to 0, ideal for running frequency tallies.',
      'Dictionary keys must be hashable and immutable: strings, ints, and tuples are valid keys; lists and dicts are NOT valid keys (use `tuple(my_list)`).',
    ],
    codeExample: `from collections import defaultdict, Counter

# 1. Building Graph Adjacency List:
edges = [[0, 1], [0, 2], [1, 2], [2, 3]]
graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u) # Undirected

# 2. Anagram Grouping with tuple key:
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
anagrams = defaultdict(list)
for word in words:
    # Character count tuple (length 26) as immutable key:
    count = [0] * 26
    for char in word:
        count[ord(char) - ord('a')] += 1
    anagrams[tuple(count)].append(word)

# 3. Frequency Counter:
counts = Counter("abracadabra")
# Top 2 most frequent characters:
top2 = counts.most_common(2) # [('a', 5), ('b', 2)]`,
    complexityCost: 'Dictionary lookups, inserts, and deletes are average O(1). Constructing `Counter(iterable)` of length N is O(N).',
    interviewTip:
      'In anagram or frequency problems, explain why you tuple-ify list states before using them as dictionary keys to satisfy hashability invariants.',
  },
  {
    id: 'py-heapq-mechanics',
    language: 'Python',
    title: 'heapq Mechanics: Min-Heap by Default & Negation for Max-Heap',
    category: 'Priority Queues & Heaps',
    description:
      '`heapq` implements a binary heap directly over standard Python lists. Python heaps are MIN-HEAPS by default.',
    keyRules: [
      'CRITICAL: `heapq.heappop(h)` always extracts the SMALLEST element. Python does NOT have a built-in max-heap class.',
      'To build a Max-Heap in Python, negate numerical values when pushing: `heapq.heappush(max_heap, -val)`, and negate again when popping: `-heapq.heappop(max_heap)`.',
      '`heapq.heapify(nums)` converts an arbitrary list into a valid min-heap in-place in linear O(N) time (faster than N `heappush` calls which take O(N log N)).',
      '`heapq.heappushpop(h, item)` pushes first and pops smallest in a single O(log N) pass (faster than separate push and pop).',
    ],
    codeExample: `import heapq

# 1. Linear-time heap construction:
nums = [5, 1, 8, 3, 2]
heapq.heapify(nums) # O(N) in-place transformation
smallest = heapq.heappop(nums) # 1 in O(log N)

# 2. Max-Heap Pattern using Negation:
max_heap = []
for val in [10, 30, 20, 5]:
    heapq.heappush(max_heap, -val)

largest = -heapq.heappop(max_heap) # 30

# 3. Running K-th Largest Element (Min-Heap of size K):
class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        return self.heap[0]`,
    complexityCost: '`heapify()` is O(N). `heappop()` and `heappush()` are O(log N). `heap[0]` reads root in O(1).',
    interviewTip:
      'Clarify your max-heap technique to the interviewer upfront: "Since Python\'s `heapq` is a min-heap by default, I will invert the signs to simulate a max-heap."',
  },
  {
    id: 'py-bisect-binary-search',
    language: 'Python',
    title: 'bisect Module: bisect_left vs bisect_right Bounds',
    category: 'Binary Search & Algorithms',
    description:
      'Standard library binary search routines in `bisect` for sorted sequences: finding lower bounds, insertion points, and range counts.',
    keyRules: [
      '`bisect.bisect_left(a, x)` finds the first index where `a[i] >= x` (equivalent to C++ `lower_bound`). If `x` exists, it returns its first appearance.',
      '`bisect.bisect_right(a, x)` finds the first index where `a[i] > x` (equivalent to C++ `upper_bound`). If `x` exists, it returns the index directly after the last occurrence.',
      'The number of occurrences of `x` in sorted list `a` is: `bisect_right(a, x) - bisect_left(a, x)`.',
      'In Python 3.10+, `bisect` supports a `key` parameter (e.g. `bisect_left(intervals, target, key=lambda x: x[0])`).',
    ],
    codeExample: `import bisect

nums = [1, 2, 4, 4, 4, 5, 8]

# Find first occurrence of 4:
left_idx = bisect.bisect_left(nums, 4)   # Index 2

# Find index directly after last 4:
right_idx = bisect.bisect_right(nums, 4) # Index 5

# Total count of 4s:
count_4 = right_idx - left_idx           # 3

# Check if target exists:
def binary_search_exists(arr, target):
    idx = bisect.bisect_left(arr, target)
    return idx < len(arr) and arr[idx] == target`,
    complexityCost: '`bisect_left` and `bisect_right` execute in O(log N) comparisons on pre-sorted random-access sequences.',
    interviewTip:
      'While implementing binary search manually is required when the problem asks for custom predicate conditions, mentioning `bisect_left` for standard intervals shows strong standard library proficiency.',
  },
  {
    id: 'py-recursion-depth-limit',
    language: 'Python',
    title: 'Recursion Depth Limits & Iterative DFS Alternatives',
    category: 'Recursion & Call Stacks',
    description:
      'Python default recursion limit is 1,000 stack frames. Deep trees (e.g. skewed trees with N = 10^5) cause `RecursionError: maximum recursion depth exceeded`.',
    keyRules: [
      'Standard Python limits recursion to 1,000 frames to prevent C stack overflows. `sys.setrecursionlimit(200000)` increases it, but increases memory usage.',
      'On LeetCode and assessment platforms, skewed binary trees or deep graph DFS paths exceed the limit unless explicitly increased or rewritten iteratively.',
      'Always consider an explicit stack for deep graph traversals: `stack = [root]` with a `while stack:` loop avoids stack overflow entirely.',
      'Beware of mutable default arguments: `def dfs(node, visited=[])` shares the same list across all calls! Always use `visited=None` and initialize inside.',
    ],
    codeExample: `import sys

# 1. Increasing recursion depth for deep recursive DFS:
sys.setrecursionlimit(200000)

# 2. Iterative DFS pattern avoiding call stack overflow:
def iterative_dfs(root):
    if not root:
        return []
    result = []
    stack = [root]
    while stack:
        node = stack.pop() # LIFO behavior simulates call stack
        result.append(node.val)
        # Push right first so left is processed next:
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return result

# 3. CORRECT mutable argument pattern:
def backtrack(path=None):
    if path is None:
        path = [] # Fresh instance per top-level invocation`,
    complexityCost: 'Iterative stack DFS is O(N) time and O(N) heap memory, with zero risk of call-stack overflow.',
    interviewTip:
      'If an interviewer mentions: "What if the graph has 100,000 nodes in a line?", immediately discuss the 1,000 frame default recursion limit and show the iterative stack conversion.',
  },
  {
    id: 'py-sorting-custom-keys',
    language: 'Python',
    title: 'Timsort & Custom Sorting with key Functions',
    category: 'Algorithms & Modern Python',
    description:
      'Python `sort()` and `sorted()` use Timsort (adaptive merge-sort + insertion sort), guaranteed O(N log N) time and stable ordering.',
    keyRules: [
      '`list.sort()` sorts in-place in O(N log N) time; `sorted(iterable)` returns a brand new sorted list.',
      'Both sorting methods are STABLE: two elements with identical comparison keys retain their original relative order.',
      'The `key` parameter expects a function returning a tuple for multi-criteria sorting: `key=lambda x: (x[0], -x[1])` sorts ascending by first value, then descending by second.',
      '`cmp_to_key` from `functools` converts traditional two-argument comparator functions into Python 3 key functions.',
    ],
    codeExample: `from functools import cmp_to_key

# 1. Multi-attribute sorting:
intervals = [[1, 4], [2, 3], [1, 2]]
# Sort by start time ascending; for ties, sort by end time descending:
intervals.sort(key=lambda x: (x[0], -x[1]))
# Result: [[1, 4], [1, 2], [2, 3]]

# 2. Custom string comparator (e.g. Largest Number LeetCode 179):
def compare_strings(a, b):
    # If ab > ba, a should come first (-1 in Python cmp)
    if a + b > b + a:
        return -1
    elif a + b < b + a:
        return 1
    return 0

nums_str = ["3", "30", "34", "5", "9"]
nums_str.sort(key=cmp_to_key(compare_strings))
result = "".join(nums_str) # "9534330"`,
    complexityCost: 'Timsort runs in O(N log N) worst-case and O(N) best-case (on already-sorted data) with O(N) space.',
    interviewTip:
      'Highlight stability: "Because Python\'s Timsort is stable, I can sort primarily on criteria A and preserve previous criteria B rankings."',
  },
];
