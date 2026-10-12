// ====================================================================
// KthTry — C++ Preparation Track: Core Foundations & STL Mechanics
// Comprehensive language-specific guide for technical interviews
// ====================================================================

import { LanguageEssentialTopic } from '../types/curriculum';

export const cppEssentialsData: LanguageEssentialTopic[] = [
  {
    id: 'cpp-primitives-fastio',
    language: 'C++',
    title: 'Primitive Types, Overflow & Fast Console I/O',
    category: 'Primitives & Memory',
    description:
      'Master 32-bit `int` [-2^31 to 2^31-1] vs 64-bit `long long` [-2^63 to 2^63-1], avoiding integer overflow in computations, and fast competitive programming I/O.',
    keyRules: [
      '`INT_MAX` is 2,147,483,647 (~2 * 10^9). In sums or products, cast operands upfront: `1LL * a * b` or `static_cast<long long>(a) * b`.',
      'Always calculate midpoints safely: `int mid = low + (high - low) / 2;` to avoid `low + high` exceeding `INT_MAX`.',
      'For heavy I/O competitive assessments, decouple C and C++ standard streams: `cin.tie(nullptr); ios_base::sync_with_stdio(false);`.',
      'Use `\\n` instead of `endl` in loops to avoid redundant and slow buffer flushes.',
    ],
    codeExample: `// Fast I/O snippet for technical assessments:
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

void optimizeIO() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
}

// Safe midpoint without overflow:
int low = 0, high = n - 1;
int mid = low + (high - low) / 2;

// Safe product with modulo:
long long MOD = 1e9 + 7;
long long product = (1LL * a * b) % MOD;`,
    complexityCost: 'Primitive operations (arithmetic, bitwise, comparison) execute in 1 CPU cycle.',
    interviewTip:
      'Explicitly state your choice of `long long` and `1LL * a * b` when discussing problem constraints where N = 10^5 and values are 10^5.',
  },
  {
    id: 'cpp-pointers-references',
    language: 'C++',
    title: 'References, const auto&, and Memory Semantics',
    category: 'References & Memory',
    description:
      'Understanding C++ memory models: value semantics (deep copies) vs references (`&`) and `const auto&` to prevent accidental O(N) copy overhead inside loops.',
    keyRules: [
      'Looping with `for (auto item : vec)` creates a full copy of each element on every iteration! For vectors of strings or vectors, this turns O(N) into O(N^2).',
      'Always use `const auto& item : vec` for read-only iteration or `auto& item : vec` for in-place modifications.',
      'Passing vectors or strings to functions by value `void dfs(vector<int> adj)` creates a deep copy of the entire graph! Always pass by reference: `void dfs(const vector<vector<int>>& adj)`.',
      'Passing pointers (`Node*`) is idiomatic for linked lists and tree nodes where `nullptr` represents leaf or terminal states.',
    ],
    codeExample: `// EFFICIENT: Zero-copy traversal using const auto&
vector<string> words = {"apple", "banana", "cherry"};
for (const auto& word : words) {
    cout << word << "\\n"; // No copying occurs
}

// In-place mutation:
for (auto& word : words) {
    word += "!"; // Modifies elements in place
}

// Function signature passing graph without copying:
void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) dfs(v, adj, visited);
    }
}`,
    complexityCost: 'Copying `std::vector<T>` of size N is O(N) time and memory. Reference passing `const vector<T>&` is O(1).',
    interviewTip:
      'Interviewers immediately evaluate your C++ maturity by checking whether your recursive functions pass containers by `const &` rather than by value.',
  },
  {
    id: 'cpp-stl-vector-string',
    language: 'C++',
    title: 'std::vector & std::string Dynamics and reserve()',
    category: 'Containers & Collections',
    description:
      '`std::vector` is a contiguous dynamic array providing O(1) random access, amortized O(1) `push_back()`, and fast cache locality.',
    keyRules: [
      'Capacity vs Size: `size()` is number of elements; `capacity()` is allocated memory. When capacity is exceeded, vector reallocates and doubles, copying all items.',
      'Use `vec.reserve(expectedSize)` upfront when the size is known to prevent multiple reallocation and copying phases.',
      '`vec.pop_back()` and `vec.back()` are O(1). `vec.insert()` or `vec.erase()` at the front or middle is O(N) due to element shifting.',
      '`std::string` has Small String Optimization (SSO): strings under ~15-22 chars require no heap allocation.',
    ],
    codeExample: `// Reserve memory for known bounds:
vector<int> results;
results.reserve(n); // Allocates once, zero reallocations

// Push and pop operations:
results.push_back(42);       // Amortized O(1)
int last = results.back();   // O(1) read
results.pop_back();          // O(1) remove

// 2D Matrix initialization:
int rows = 5, cols = 10;
vector<vector<int>> grid(rows, vector<int>(cols, 0));`,
    complexityCost: 'Indexed access `vec[i]` is O(1). `push_back()` is amortized O(1). Front insertion `insert(vec.begin(), x)` is O(N).',
    interviewTip:
      'Mention `reserve()` when writing graph construction or collecting filtered results: "I will call reserve(n) to guarantee zero reallocation overhead."',
  },
  {
    id: 'cpp-stl-associative-containers',
    language: 'C++',
    title: 'map vs unordered_map: Complexity Trade-offs',
    category: 'Containers & Collections',
    description:
      'Comparison between ordered tree-based containers (`std::map`, `std::set`) and hash-table containers (`std::unordered_map`, `std::unordered_set`).',
    keyRules: [
      '`std::map` and `std::set` are implemented as self-balancing Red-Black Trees. All operations (`find`, `insert`, `erase`) are guaranteed O(log N).',
      '`std::unordered_map` and `std::unordered_set` use hash tables. Average time is O(1), but worst-case is O(N) if collisions occur.',
      '`std::map` maintains keys in sorted order, enabling range queries with `lower_bound()` and `upper_bound()`.',
      'Accessing a nonexistent key with `mp[key]` automatically inserts `key` with default value 0. Use `mp.count(key)` or `mp.find(key) != mp.end()` to test existence without mutating.',
    ],
    codeExample: `// Ordered Map: Guaranteed O(log N) and sorted order
map<int, int> ordered;
ordered[10] = 1;
ordered[5] = 2;
// Keys iterate in ascending order: 5, then 10

// Unordered Map: Average O(1) frequency counting
unordered_map<string, int> freq;
for (const auto& word : words) {
    freq[word]++; // Average O(1) insert/update
}

// Safe membership check without insertion:
if (freq.find("target") != freq.end()) {
    // Key exists
}`,
    complexityCost: '`map` insert/search is O(log N). `unordered_map` is average O(1), worst-case O(N). Iterating `map` is O(N) in sorted order.',
    interviewTip:
      'When explaining your hash table solution, clarify: "I am using `unordered_map` for average O(1) lookups, but if guaranteed worst-case bounds or sorted keys are needed, `std::map` gives O(log N)."',
  },
  {
    id: 'cpp-stl-priority-queue',
    language: 'C++',
    title: 'std::priority_queue: Max-Heap by Default & Custom Comparators',
    category: 'Containers & Collections',
    description:
      '`std::priority_queue` provides O(log N) insertion and O(1) access to the highest-priority element. In C++, it is a MAX-HEAP by default.',
    keyRules: [
      'CRITICAL: `priority_queue<int>` is a MAX-HEAP (largest element on top via `top()`). To create a MIN-HEAP, you must explicitly declare `priority_queue<int, vector<int>, greater<int>>`.',
      '`top()` reads the root element in O(1). `push()` and `pop()` run in O(log N).',
      'For custom types (like pairs or custom structs), specify custom comparators or overload `operator<`.',
      'A comparator returning `true` for `cmp(a, b)` means `a` has LOWER priority than `b` in the heap (i.e. `b` surfaces on top).',
    ],
    codeExample: `// 1. Standard Max-Heap (Default)
priority_queue<int> maxHeap;
maxHeap.push(10);
maxHeap.push(30);
int largest = maxHeap.top(); // 30

// 2. Standard Min-Heap
priority_queue<int, vector<int>, greater<int>> minHeap;
minHeap.push(10);
minHeap.push(30);
int smallest = minHeap.top(); // 10

// 3. Custom Comparator with Lambda for pairs (e.g. Dijkstra or Top-K):
auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) {
    return a.first > b.first; // Min-heap on first element
};
priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq(cmp);`,
    complexityCost: '`top()` is O(1). `push()` and `pop()` are O(log N). Heap construction from vector using `priority_queue(vec.begin(), vec.end())` is O(N).',
    interviewTip:
      'The difference between C++ default max-heap and Python heapq default min-heap is a favorite interview discussion point. Proactively declare your min-heap syntax.',
  },
  {
    id: 'cpp-stl-algorithms-comparators',
    language: 'C++',
    title: '<algorithm> Mastery & Strict Weak Ordering',
    category: 'Algorithms & Modern C++',
    description:
      'Essential STL algorithms from `<algorithm>`: `std::sort`, `std::lower_bound`, `std::upper_bound`, and strict weak ordering requirements for comparators.',
    keyRules: [
      '`std::sort(begin, end)` runs in O(N log N) time using Introsort (quicksort + heapsort fallback + insertion sort).',
      'Strict Weak Ordering: custom comparators MUST return `false` when comparing identical elements (`cmp(a, a) == false`). Using `<=` instead of `<` causes undefined behavior or segmentation faults!',
      '`std::lower_bound` finds the first element `>= val` in a sorted range. `std::upper_bound` finds the first element `> val`. Both run in O(log N).',
      'Use lambda expressions `[](const auto& a, const auto& b) { ... }` for inline custom sorting.',
    ],
    codeExample: `#include <algorithm>
#include <vector>
using namespace std;

// 1. Custom Sort with Lambda:
vector<pair<int, int>> intervals = {{1, 3}, {2, 6}, {8, 10}};
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    if (a.first != b.first) return a.first < b.first;
    return a.second < b.second; // Strict '<', never '<='
});

// 2. Binary Search Bounds:
vector<int> nums = {1, 2, 4, 4, 4, 5, 8};
// Find first index where element >= 4:
auto it = lower_bound(nums.begin(), nums.end(), 4);
int firstIdx = distance(nums.begin(), it); // Index 2

// Find first index where element > 4:
auto it2 = upper_bound(nums.begin(), nums.end(), 4);
int afterIdx = distance(nums.begin(), it2); // Index 5`,
    complexityCost: '`std::sort` is O(N log N). `lower_bound` / `upper_bound` on random-access iterators is O(log N).',
    interviewTip:
      'Always remember: if you write `return a.val <= b.val;` in a C++ comparator, interviewers or automated test runners on LeetCode will catch the crash due to violation of strict weak ordering.',
  },
  {
    id: 'cpp-iterator-invalidation',
    language: 'C++',
    title: 'Iterator Invalidation & Safe Element Removal',
    category: 'Gotchas & Safety',
    description:
      'Understanding when iterators, pointers, and references become invalid after container mutations such as insertions, deletions, or vector resizing.',
    keyRules: [
      'In `std::vector`, adding elements via `push_back` or `insert` invalidates ALL iterators and references if capacity reallocation occurs.',
      'Erasing from a vector invalidates iterators at and after the erased point. Never do `vec.erase(it); it++;`. Use `it = vec.erase(it);` or `std::erase_if`.',
      'In `std::map`, `std::set`, and `std::list`, erasing an element only invalidates iterators pointing to the erased element. All other iterators remain valid.',
      'In modern C++20, prefer `std::erase_if(vec, predicate)` over the classic erase-remove idiom.',
    ],
    codeExample: `// INCORRECT (Undefined behavior):
// for (auto it = vec.begin(); it != vec.end(); ++it) {
//     if (*it % 2 == 0) vec.erase(it); // INVALIDATES it!
// }

// CORRECT C++11 way to erase while iterating:
for (auto it = vec.begin(); it != vec.end(); ) {
    if (*it % 2 == 0) {
        it = vec.erase(it); // Returns iterator to next valid element
    } else {
        ++it;
    }
}

// MODERN C++20 way:
std::erase_if(vec, [](int x) { return x % 2 == 0; });`,
    complexityCost: 'Erasing elements individually from vector in loop is O(N^2). `std::erase_if` / erase-remove idiom runs in linear O(N) time.',
    interviewTip:
      'Explain the Erase-Remove idiom or iterator return value when discussing filtering problems to show mastery of C++ memory safety.',
  },
];
