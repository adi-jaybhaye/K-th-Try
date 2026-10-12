// ====================================================================
// KthTry — Language Implementation Notes (C++ and Python)
// Idiomatic templates, tricks, and pitfalls for all 16 modules
// ====================================================================

import { LanguageImplementationNotes } from '../types/curriculum';

export const cppImplementationNotesByModule: Record<string, LanguageImplementationNotes> = {
  'm1-foundations-complexity': {
    language: 'C++',
    coreDataStructures: 'int, long long, std::vector, std::chrono for micro-benchmarking.',
    tricks: [
      'Use 1LL * a * b to safely promote multiplications to 64-bit integer before overflow occurs.',
      'Call cin.tie(nullptr); ios_base::sync_with_stdio(false); at start of main() for competitive I/O.',
      'Logarithmic loop detection: while (n > 0) n >>= 1 runs in O(log N) iterations.',
    ],
    gotchas: [
      'Assuming vector::size() is signed: it returns size_t (unsigned). Doing vec.size() - 1 when empty causes unsigned integer underflow to 18 quintillion!',
      'Passing vector by value instead of const vector<T>& creates an accidental O(N) copy.',
    ],
    codeTemplate: `// Safe 64-bit operations & fast I/O setup:
#include <iostream>
#include <vector>
#include <chrono>

using namespace std;

void setupFastIO() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
}

// Avoid unsigned underflow when looping backwards:
void safeReverseLoop(const vector<int>& nums) {
    int n = static_cast<int>(nums.size());
    for (int i = n - 1; i >= 0; --i) {
        // Safe O(1) access
    }
}`,
  },
  'm2-math-bit-manipulation': {
    language: 'C++',
    coreDataStructures: 'unsigned long long, std::bitset, builtin bit functions (__builtin_popcountll).',
    tricks: [
      'Count set bits with __builtin_popcount(x) or __builtin_popcountll(x) in single CPU instruction.',
      'Clear lowest set bit: x & (x - 1); isolate lowest set bit: x & (-x).',
      'Use 1ULL << k when shifting beyond 31 bits.',
    ],
    gotchas: [
      'Undefined behavior shifting by >= 32 bits on 32-bit int: 1 << 32 is UB. Always use 1ULL << k.',
      'Modulo operator % in C++ can yield negative results for negative dividends: (-7 % 3 is -1). Correct: (x % MOD + MOD) % MOD.',
    ],
    codeTemplate: `// Binary Exponentiation under Modulo 1e9+7:
long long powerMod(long long base, long long exp, long long mod = 1e9 + 7) {
    long long res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) res = (1LL * res * base) % mod;
        base = (1LL * base * base) % mod;
        exp >>= 1;
    }
    return res;
}

// Sieve of Eratosthenes up to N:
vector<bool> sievePrimes(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; p * p <= n; ++p) {
        if (isPrime[p]) {
            for (int i = p * p; i <= n; i += p) isPrime[i] = false;
        }
    }
    return isPrime;
}`,
  },
  'm3-arrays-prefix-hashing': {
    language: 'C++',
    coreDataStructures: 'std::vector, std::unordered_map, std::map, std::pair.',
    tricks: [
      'Prefix sums: prefix[i + 1] = prefix[i] + nums[i]. Range sum [L, R] is prefix[R + 1] - prefix[L].',
      'Reserve unordered_map buckets upfront: map.reserve(n); map.max_load_factor(0.7f) to avoid rehashes.',
      'Kadane Algorithm tracks local max and global max in single O(N) pass with O(1) memory.',
    ],
    gotchas: [
      'Unordered_map worst-case O(N) lookup under anti-hash test cases. Use custom splitmix64 hash if hacking occurs.',
      'Array out of bounds accessing prefix[-1]. Always 1-index prefix arrays of size N + 1.',
    ],
    codeTemplate: `// Prefix Sums & Hash Map Subarray Sum Equals K:
#include <vector>
#include <unordered_map>
using namespace std;

int subarraySum(const vector<int>& nums, int k) {
    unordered_map<long long, int> prefixCounts;
    prefixCounts[0] = 1; // Base case for prefix sum matching k
    long long runningSum = 0;
    int count = 0;

    for (int num : nums) {
        runningSum += num;
        long long target = runningSum - k;
        if (prefixCounts.count(target)) {
            count += prefixCounts[target];
        }
        prefixCounts[runningSum]++;
    }
    return count;
}`,
  },
  'm4-two-pointers-sliding-windows': {
    language: 'C++',
    coreDataStructures: 'std::vector, std::deque, std::stack.',
    tricks: [
      'Variable-size window: expand right pointer until invalid or condition met; contract left pointer while maintaining state.',
      'Monotonic Stack: for Next Greater Element, store indices to compute distances and values in O(N).',
      'Sliding Window Maximum uses std::deque storing indices with strictly decreasing values.',
    ],
    gotchas: [
      'Off-by-one errors in window length: length is right - left + 1.',
      'Popping from empty deque before checking !dq.empty().',
    ],
    codeTemplate: `// Monotonic Stack: Next Greater Element
#include <vector>
#include <stack>
using namespace std;

vector<int> nextGreaterElements(const vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st; // Stores indices

    for (int i = 0; i < n; ++i) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}`,
  },
  'm5-sorting-binary-search': {
    language: 'C++',
    coreDataStructures: 'std::vector, std::lower_bound, std::upper_bound, std::sort.',
    tricks: [
      'Binary Search on Answer predicate pattern: bool check(mid) returns true if feasible; then shrink space.',
      'Midpoint formula: int mid = low + (high - low) / 2 to avoid overflow.',
      'Use lower_bound for >= and upper_bound for > on sorted ranges.',
    ],
    gotchas: [
      'Infinite loop with while (low < high) when high = mid vs high = mid - 1.',
      'Custom comparator violating strict weak ordering (using <= instead of <).',
    ],
    codeTemplate: `// Binary Search Template (Lower Bound):
#include <vector>
using namespace std;

int binarySearchLowerBound(const vector<int>& nums, int target) {
    int low = 0, high = static_cast<int>(nums.size()) - 1;
    int ans = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] >= target) {
            ans = mid;
            high = mid - 1; // Look for earlier occurrence
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
  },
  'm6-strings-algorithms': {
    language: 'C++',
    coreDataStructures: 'std::string, std::string_view, fixed array int[26].',
    tricks: [
      'Use int freq[26] = {0} instead of unordered_map for lowercase alphabet problems for 10x faster execution.',
      'KMP Longest Prefix Suffix (LPS) table in O(N) allows O(N + M) substring matching.',
      'std::string_view allows zero-copy non-owning string references in C++17.',
    ],
    gotchas: [
      'Repeated string concatenation inside loops without reserve() creates O(N^2) memory reallocation.',
      'string::npos check: str.find(sub) == string::npos when not found.',
    ],
    codeTemplate: `// KMP LPS Table Construction:
#include <vector>
#include <string>
using namespace std;

vector<int> buildKMPLPS(const string& pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;

    while (i < m) {
        if (pattern[i] == pattern[len]) {
            lps[i++] = ++len;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i++] = 0;
            }
        }
    }
    return lps;
}`,
  },
  'm7-recursion-backtracking': {
    language: 'C++',
    coreDataStructures: 'std::vector, recursion stack, bitmask.',
    tricks: [
      'Choose-explore-unchoose pattern: path.push_back(val); solve(); path.pop_back().',
      'Pass path by reference: void backtrack(vector<int>& path, ...) to avoid copying vectors at every step.',
      'Pruning: sort input beforehand so if (nums[i] > remaining) break early.',
    ],
    gotchas: [
      'Passing path by value creates 2^N copies and crashes memory limits.',
      'Handling duplicates in combination sums: if (i > start && nums[i] == nums[i-1]) continue.',
    ],
    codeTemplate: `// Backtracking Subset Generation:
#include <vector>
#include <algorithm>
using namespace std;

void backtrackSubsets(int start, vector<int>& nums, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);
    for (int i = start; i < static_cast<int>(nums.size()); ++i) {
        current.push_back(nums[i]);
        backtrackSubsets(i + 1, nums, current, result);
        current.pop_back(); // Backtrack
    }
}`,
  },
  'm8-linked-lists': {
    language: 'C++',
    coreDataStructures: 'Raw pointers Node*, unique_ptr, sentinel/dummy nodes.',
    tricks: [
      'Always use a dummy head: ListNode dummy(0); ListNode* tail = &dummy; to eliminate empty list special cases.',
      'Floyd cycle detection (tortoise & hare): slow advances 1 step, fast advances 2 steps.',
      'Reverse linked list iteratively with 3 pointers: prev, curr, nextTemp.',
    ],
    gotchas: [
      'Dereferencing nullptr: always check fast && fast->next before accessing fast->next->next.',
      'Memory leaks: in technical interviews, clarify whether nodes should be deallocated via delete.',
    ],
    codeTemplate: `// In-place List Reversal:
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
  },
  'm9-stacks-queues-expressions': {
    language: 'C++',
    coreDataStructures: 'std::stack, std::queue, std::deque.',
    tricks: [
      'Min-Stack: maintain parallel stack or pair<int, int> (val, currentMin) for O(1) getMin().',
      'Valid parentheses: map matching closing brackets to opening brackets.',
      'Circular queue: advance index using (idx + 1) % capacity.',
    ],
    gotchas: [
      'Calling top() or pop() on empty stack causes segmentation fault! Always check !st.empty().',
      'std::stack does not support iteration; use std::vector or std::deque if traversal is required.',
    ],
    codeTemplate: `// Min-Stack with O(1) getMin using pairs:
#include <stack>
using namespace std;

class MinStack {
    stack<pair<int, int>> st; // {value, currentMin}
public:
    void push(int val) {
        int curMin = st.empty() ? val : min(val, st.top().second);
        st.push({val, curMin});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,
  },
  'm10-trees-bst': {
    language: 'C++',
    coreDataStructures: 'TreeNode*, std::queue for BFS, std::vector.',
    tricks: [
      'Tree diameter: update max diameter at each node via leftHeight + rightHeight while returning 1 + max(left, right).',
      'BST property: in-order traversal of BST yields strictly increasing sorted sequence.',
      'Lowest Common Ancestor (LCA) in BST: navigate left if both < root, right if both > root, otherwise root is LCA.',
    ],
    gotchas: [
      'Comparing BST bounds with INT_MIN or INT_MAX: root may equal INT_MIN or INT_MAX. Use long long bounds: (LONG_MIN, LONG_MAX).',
      'Forgetting nullptr base case in recursive tree functions.',
    ],
    codeTemplate: `// Validate BST using long long bounds:
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool isValidBSTHelper(TreeNode* root, long long minVal, long long maxVal) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBSTHelper(root->left, minVal, root->val) &&
           isValidBSTHelper(root->right, root->val, maxVal);
}`,
  },
  'm11-heaps-priority-queues': {
    language: 'C++',
    coreDataStructures: 'std::priority_queue, std::greater<T>.',
    tricks: [
      'By default priority_queue<T> is a MAX-HEAP. For MIN-HEAP, write: priority_queue<T, vector<T>, greater<T>>.',
      'Top-K Frequent: maintain min-heap of size K; when size exceeds K, pop smallest.',
      'Running median: keep max-heap for left half and min-heap for right half, balanced within size difference <= 1.',
    ],
    gotchas: [
      'priority_queue uses .top() to read (not .front() or .peek()).',
      'Calling top() or pop() on empty priority queue is undefined behavior.',
    ],
    codeTemplate: `// Top K Frequent Elements using Min-Heap:
#include <vector>
#include <unordered_map>
#include <queue>
using namespace std;

vector<int> topKFrequent(const vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int num : nums) freq[num]++;

    // Min-heap storing {count, value}:
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
    for (const auto& [val, count] : freq) {
        minHeap.push({count, val});
        if (minHeap.size() > static_cast<size_t>(k)) {
            minHeap.pop();
        }
    }

    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return result;
}`,
  },
  'm12-greedy-algorithms': {
    language: 'C++',
    coreDataStructures: 'std::vector<std::pair<int, int>>, std::sort.',
    tricks: [
      'Interval scheduling: sort by end time to maximize non-overlapping intervals.',
      'Merge intervals: sort by start time, then merge when current[0] <= previous[1].',
      'Jump Game: maintain maxReachable = max(maxReachable, i + nums[i]) as long as i <= maxReachable.',
    ],
    gotchas: [
      'Assuming greedy works without proving exchange argument or optimal substructure.',
      'Sorting intervals by end time when problem requires merging (merging requires start time sorting!).',
    ],
    codeTemplate: `// Merge Intervals in O(N log N):
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end()); // Sort by start time

    vector<vector<int>> merged = {intervals[0]};
    for (size_t i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] <= merged.back()[1]) {
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
  },
  'm13-graphs': {
    language: 'C++',
    coreDataStructures: 'vector<vector<int>> adj, vector<vector<pair<int, int>>>, queue, priority_queue.',
    tricks: [
      'Dijkstra shortest path: priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> stores {dist, node}.',
      'Kahn Algorithm for Topological Sort: track inDegree[u] and queue all nodes with inDegree == 0.',
      'Bipartite Graph: 2-color graph with colors 0 and 1 using BFS/DFS.',
    ],
    gotchas: [
      'In Dijkstra, pushing without distance check creates O(E) heap bloat. If (d > dist[u]) continue.',
      'Forgetting graph could be disconnected: loop 0..V-1 to start BFS/DFS for every unvisited node.',
    ],
    codeTemplate: `// Dijkstra Shortest Path:
#include <vector>
#include <queue>
using namespace std;

vector<int> dijkstra(int n, int src, const vector<vector<pair<int, int>>>& adj) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    // Min-heap stores {distance, vertex}
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue; // Stale heap entry

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
  },
  'm14-dynamic-programming': {
    language: 'C++',
    coreDataStructures: 'vector<int> dp, vector<vector<int>> dp, memset for memo tables.',
    tricks: [
      'Space optimization: if dp[i][j] only depends on row dp[i-1], compress to 1D vector of size Cols.',
      '0/1 Knapsack 1D compression: loop weights backwards from W down to weight[i] to prevent reusing same item.',
      'Longest Increasing Subsequence (LIS) in O(N log N) using patience sorting with lower_bound.',
    ],
    gotchas: [
      'Initial state values: initializing with 0 when values can be negative or when finding minimum (use 1e9 or 0x3f3f3f3f).',
      'Order of loops in Coin Change (combinations vs permutations): outer loop over coins = combinations; outer loop over amount = permutations.',
    ],
    codeTemplate: `// 0/1 Knapsack with 1D Space Optimization:
#include <vector>
#include <algorithm>
using namespace std;

int knapsack1D(int W, const vector<int>& wt, const vector<int>& val) {
    int n = wt.size();
    vector<int> dp(W + 1, 0);

    for (int i = 0; i < n; ++i) {
        // Iterate backwards so we use results from previous items only
        for (int w = W; w >= wt[i]; --w) {
            dp[w] = max(dp[w], dp[w - wt[i]] + val[i]);
        }
    }
    return dp[W];
}`,
  },
  'm15-tries-dsu-range-queries': {
    language: 'C++',
    coreDataStructures: 'TrieNode*, struct DSU (Disjoint Set Union with path compression and rank).',
    tricks: [
      'DSU find() with path compression: return parent[x] = find(parent[x]).',
      'DSU union() by rank/size keeps tree height O(alpha(N)) ~ O(1).',
      'Bitwise Trie for Maximum XOR: traverse from bit 31 down to 0, greedily choosing opposite bit 1 - b.',
    ],
    gotchas: [
      'Memory leak in Trie without destructor: delete children recursively when done.',
      'DSU union without finding roots: always call find(u) and find(v) before uniting.',
    ],
    codeTemplate: `// Disjoint Set Union (DSU) with Path Compression & Union by Rank:
#include <vector>
using namespace std;

struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression
    }
    bool unite(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);
        if (rootI == rootJ) return false;
        if (rank[rootI] < rank[rootJ]) swap(rootI, rootJ);
        parent[rootJ] = rootI;
        if (rank[rootI] == rank[rootJ]) rank[rootI]++;
        return true;
    }
};`,
  },
  'm16-advanced-algorithms': {
    language: 'C++',
    coreDataStructures: 'Tarjan low/disc arrays, deque for 0-1 BFS.',
    tricks: [
      '0-1 BFS: use deque; push to front if edge weight is 0, push to back if edge weight is 1. Runs in O(V + E).',
      'Tarjan Bridge finding: edge (u, v) is a bridge if low[v] > disc[u].',
      'Matrix exponentiation computes N-th linear recurrence state in O(K^3 log N).',
    ],
    gotchas: [
      'Back-edges vs tree edges in Tarjan: do not update low[u] with parent node.',
      '0-1 BFS: nodes can be re-pushed; guard with distance checks.',
    ],
    codeTemplate: `// 0-1 BFS Shortest Path:
#include <vector>
#include <deque>
using namespace std;

vector<int> zeroOneBFS(int n, int src, const vector<vector<pair<int, int>>>& adj) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    deque<int> dq;

    dist[src] = 0;
    dq.push_back(src);

    while (!dq.empty()) {
        int u = dq.front();
        dq.pop_front();

        for (const auto& [v, weight] : adj[u]) {
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                if (weight == 0) {
                    dq.push_front(v); // Zero cost: process immediately
                } else {
                    dq.push_back(v);  // Weight 1: process after
                }
            }
        }
    }
    return dist;
}`,
  },
};

export const pythonImplementationNotesByModule: Record<string, LanguageImplementationNotes> = {
  'm1-foundations-complexity': {
    language: 'Python',
    coreDataStructures: 'int (arbitrary precision), list, time.perf_counter().',
    tricks: [
      'Python integers never overflow 32/64 bit boundaries; they automatically promote to arbitrary precision.',
      'Use enumerate(seq) instead of range(len(seq)) for cleaner idiomatic index + item loops.',
      'List comprehensions [x for x in seq if cond] run faster in CPython bytecode than equivalent for loops.',
    ],
    gotchas: [
      'Hidden slicing cost: arr[1:] copies the rest of the list in O(N). Avoid in recursion.',
      'list.pop(0) is O(N). Never use standard list as a FIFO queue in Big-O analysis.',
    ],
    codeTemplate: `# Complexity deduction & benchmarking in Python:
import time

def benchmark(func, *args):
    start = time.perf_counter()
    res = func(*args)
    duration = time.perf_counter() - start
    print(f"Elapsed: {duration:.6f}s")
    return res

# Passing indices instead of slicing copies:
def safe_traverse(arr, idx=0):
    if idx >= len(arr):
        return
    # Process arr[idx] in O(1)
    safe_traverse(arr, idx + 1)`,
  },
  'm2-math-bit-manipulation': {
    language: 'Python',
    coreDataStructures: 'int, bin(), bitwise operators (&, |, ^, ~, <<, >>).',
    tricks: [
      'Clear lowest set bit: n & (n - 1); isolate lowest set bit: n & (-n).',
      'Count set bits: bin(n).count("1") or (n).bit_count() in Python 3.10+ in O(1).',
      'Python modulo always has the sign of the divisor: -7 % 3 is 2 (unlike C++ and Java!).',
    ],
    gotchas: [
      'Bitwise NOT (~x) flips bits in two\'s complement: ~x is -(x + 1). To simulate 32-bit unsigned, use: x & 0xFFFFFFFF.',
      'Power operator ** under modulo: always use pow(base, exp, mod) for O(log exp) modular exponentiation.',
    ],
    codeTemplate: `# Fast Modular Exponentiation:
def power_mod(base: int, exp: int, mod: int = 10**9 + 7) -> int:
    return pow(base, exp, mod) # Built-in O(log exp)

# Sieve of Eratosthenes:
def sieve(n: int) -> list[bool]:
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for p in range(2, int(n**0.5) + 1):
        if is_prime[p]:
            is_prime[p * p : n + 1 : p] = [False] * len(range(p * p, n + 1, p))
    return is_prime`,
  },
  'm3-arrays-prefix-hashing': {
    language: 'Python',
    coreDataStructures: 'list, dict, collections.defaultdict, collections.Counter.',
    tricks: [
      'itertools.accumulate(nums) computes prefix sums in a single optimized C-level pass.',
      'collections.defaultdict(int) eliminates boilerplate key existence checks.',
      'Kadane Algorithm computes maximum subarray in O(N) time with O(1) space.',
    ],
    gotchas: [
      'Using a list as a dictionary key causes TypeError: unhashable type: list. Use tuple(my_list).',
      'Multiplying 2D lists: [[0]*cols]*rows creates rows referencing the SAME list! Always use: [[0]*cols for _ in range(rows)].',
    ],
    codeTemplate: `from collections import defaultdict

def subarray_sum(nums: list[int], k: int) -> int:
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1 # Base case
    running_sum = 0
    count = 0

    for num in nums:
        running_sum += num
        count += prefix_counts[running_sum - k]
        prefix_counts[running_sum] += 1

    return count`,
  },
  'm4-two-pointers-sliding-windows': {
    language: 'Python',
    coreDataStructures: 'list, collections.deque.',
    tricks: [
      'Variable-size window: expand right in loop, shrink left with while condition inside.',
      'Monotonic Stack: maintain decreasing stack storing indices for Next Greater Element.',
      'Sliding Window Maximum uses collections.deque storing indices with O(N) total amortized time.',
    ],
    gotchas: [
      'Off-by-one window length: right - left + 1.',
      'Popping from empty deque without checking if dq:.',
    ],
    codeTemplate: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque() # Stores indices of useful elements in window
    result = []

    for i, num in enumerate(nums):
        # Remove elements out of window range:
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Maintain decreasing order in deque:
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)

        if i >= k - 1:
            result.append(nums[dq[0]])

    return result`,
  },
  'm5-sorting-binary-search': {
    language: 'Python',
    coreDataStructures: 'list, bisect.bisect_left, bisect.bisect_right.',
    tricks: [
      'bisect.bisect_left(arr, x) finds lower bound (first index >= x) in O(log N).',
      'bisect.bisect_right(arr, x) finds upper bound (first index > x).',
      'Binary Search on Answer: define check(mid) -> bool and bisect between low and high.',
    ],
    gotchas: [
      'Python does not suffer from (low + high) integer overflow, but mid = (low + high) // 2 integer division must use // (not /).',
      'bisect requires a pre-sorted list; calling it on an unsorted list produces wrong results.',
    ],
    codeTemplate: `import bisect

def binary_search_first_occurrence(nums: list[int], target: int) -> int:
    idx = bisect.bisect_left(nums, target)
    if idx < len(nums) and nums[idx] == target:
        return idx
    return -1

# Predicate Binary Search on Answer:
def ship_within_days(weights: list[int], days: int) -> int:
    def can_ship(capacity: int) -> bool:
        needed_days = 1
        current_load = 0
        for w in weights:
            if current_load + w > capacity:
                needed_days += 1
                current_load = 0
            current_load += w
        return needed_days <= days

    low, high = max(weights), sum(weights)
    ans = high
    while low <= high:
        mid = (low + high) // 2
        if can_ship(mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
    return ans`,
  },
  'm6-strings-algorithms': {
    language: 'Python',
    coreDataStructures: 'str, "".join(list), collections.Counter.',
    tricks: [
      'String construction: accumulate strings in a list and call "".join(parts) in O(N) (never use += in a loop).',
      'Check palindrome in O(N): s == s[::-1] (for short strings) or two pointers left/right.',
      'ord(c) - ord("a") maps lowercase alphabet to 0..25.',
    ],
    gotchas: [
      'Python strings are immutable. Any modification creates a new string object in memory.',
      's.find(sub) returns -1 if not found; s.index(sub) raises ValueError.',
    ],
    codeTemplate: `# KMP Substring Search Table:
def build_kmp_lps(pattern: str) -> list[int]:
    m = len(pattern)
    lps = [0] * m
    length, i = 0, 1

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps`,
  },
  'm7-recursion-backtracking': {
    language: 'Python',
    coreDataStructures: 'list (as stack), sys.setrecursionlimit.',
    tricks: [
      'backtrack pattern: path.append(x); dfs(); path.pop().',
      'Save snapshot of state into results: result.append(path[:]) or result.append(list(path)).',
      'Increase recursion limit if needed: import sys; sys.setrecursionlimit(200000).',
    ],
    gotchas: [
      'Appending path without copying: result.append(path) stores a reference! When path is later modified, all results mutate to [].',
      'Mutable default parameter: def dfs(path=[]) is shared across all function calls.',
    ],
    codeTemplate: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start: int, current: list[int]):
        result.append(list(current)) # Take snapshot copy!
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop() # Backtrack
            
    backtrack(0, [])
    return result`,
  },
  'm8-linked-lists': {
    language: 'Python',
    coreDataStructures: 'class ListNode, dummy/sentinel nodes.',
    tricks: [
      'Dummy node eliminates edge cases when head changes: dummy = ListNode(0); dummy.next = head.',
      'Reverse in-place using prev, curr, next_node pointers.',
      'Fast and slow pointers for middle node and cycle detection.',
    ],
    gotchas: [
      'AttributeError: \'NoneType\' object has no attribute \'next\': check node and node.next before traversing.',
      'Lost pointer reference: store curr.next in temporary variable before rewiring curr.next.',
    ],
    codeTemplate: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode | None) -> ListNode | None:
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
  },
  'm9-stacks-queues-expressions': {
    language: 'Python',
    coreDataStructures: 'list (for LIFO stack), collections.deque (for FIFO queue).',
    tricks: [
      'Stack push: stack.append(x); pop: stack.pop(). Both amortized O(1).',
      'Queue push: q.append(x); pop: q.popleft() on collections.deque.',
      'Parentheses matching using hash map lookup: matching = {")": "(", "}": "{", "]": "["}.',
    ],
    gotchas: [
      'stack[-1] on empty list raises IndexError. Always check if stack: before peeking.',
      'Using list as a queue with pop(0) degrades performance to O(N^2).',
    ],
    codeTemplate: `def is_valid_parentheses(s: str) -> bool:
    bracket_map = {")": "(", "}": "{", "]": "["}
    stack = []
    
    for char in s:
        if char in bracket_map:
            top_element = stack.pop() if stack else '#'
            if bracket_map[char] != top_element:
                return False
        else:
            stack.append(char)
            
    return not stack`,
  },
  'm10-trees-bst': {
    language: 'Python',
    coreDataStructures: 'class TreeNode, collections.deque for BFS.',
    tricks: [
      'DFS recursion: return max(left, right) + 1 for height.',
      'BFS level-order: for _ in range(len(queue)) processes one entire level at a time.',
      'BST validation with float("-inf") and float("inf") bounds.',
    ],
    gotchas: [
      'Recursion depth exceeded for skewed tree with N > 1,000 nodes: use iterative stack DFS.',
      'Checking only parent relation in BST validation: must check entire ancestor boundary (low, high).',
    ],
    codeTemplate: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root: TreeNode | None) -> bool:
    def validate(node, low=float("-inf"), high=float("inf")):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
        
    return validate(root)`,
  },
  'm11-heaps-priority-queues': {
    language: 'Python',
    coreDataStructures: 'heapq module (functions over standard list).',
    tricks: [
      'Python heaps are MIN-HEAPS. For max-heap, push negative numbers: heapq.heappush(h, -val).',
      'heapq.heapify(lst) converts list to heap in linear O(N) time.',
      'Top K Frequent elements: maintain min-heap of size K using (freq, item) tuples.',
    ],
    gotchas: [
      'heapq is a module, not a class: call heapq.heappush(my_list, x) on a list.',
      'Tuples in heap: if first elements tie, Python compares second elements. If second element is not comparable, use a custom wrapper or counter.',
    ],
    codeTemplate: `import heapq
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    # Min-heap of size k storing (frequency, number):
    heap = []
    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
            
    return [num for freq, num in heap]`,
  },
  'm12-greedy-algorithms': {
    language: 'Python',
    coreDataStructures: 'list of tuples, sorted() with key lambda.',
    tricks: [
      'Interval scheduling: sort by end time key=lambda x: x[1].',
      'Interval merging: sort by start time key=lambda x: x[0].',
      'Jump Game: track max_reach = max(max_reach, i + nums[i]) as long as i <= max_reach.',
    ],
    gotchas: [
      'Assuming greedy works without proving optimal substructure.',
      'Sorting intervals in-place with .sort() vs sorted() (remember sort returns None).',
    ],
    codeTemplate: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0]) # Sort by start time
    
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
            
    return merged`,
  },
  'm13-graphs': {
    language: 'Python',
    coreDataStructures: 'collections.defaultdict(list), collections.deque, heapq.',
    tricks: [
      'Dijkstra: heapq storing (distance, node). Push (new_dist, neighbor).',
      'Kahn Algorithm for Topological Sort: queue nodes with in_degree == 0.',
      'Cycle detection in undirected graph with DFS passing parent node.',
    ],
    gotchas: [
      'Stale heap entries in Dijkstra: check if d > dist[u]: continue to avoid redundant work.',
      'Disconnected graphs: must loop through all vertices range(V) to find components.',
    ],
    codeTemplate: `import heapq
from collections import defaultdict

def dijkstra(n: int, edges: list[tuple[int, int, int]], src: int) -> list[int]:
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
        
    dist = [float("inf")] * n
    dist[src] = 0
    min_heap = [(0, src)] # (distance, node)
    
    while min_heap:
        d, u = heapq.heappop(min_heap)
        if d > dist[u]:
            continue # Stale entry
            
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(min_heap, (dist[v], v))
                
    return dist`,
  },
  'm14-dynamic-programming': {
    language: 'Python',
    coreDataStructures: 'functools.cache, functools.lru_cache, 1D / 2D lists.',
    tricks: [
      'Top-down memoization with @functools.cache decorator converts clean recursion to DP with zero boilerplate.',
      '0/1 Knapsack 1D compression: loop backwards range(W, weight - 1, -1).',
      'Longest Increasing Subsequence (LIS) in O(N log N) using bisect.bisect_left.',
    ],
    gotchas: [
      '@cache requires function arguments to be hashable (cannot pass list or set; pass tuples).',
      'Grid DP base case: dp[0][0] = grid[0][0], not 0.',
    ],
    codeTemplate: `from functools import cache

# Top-Down with @cache:
def coin_change_memo(coins: list[int], amount: int) -> int:
    coins_tuple = tuple(coins)
    
    @cache
    def dp(rem: int) -> int:
        if rem == 0:
            return 0
        if rem < 0:
            return float("inf")
        res = min((dp(rem - c) + 1 for c in coins_tuple), default=float("inf"))
        return res

    ans = dp(amount)
    return ans if ans != float("inf") else -1`,
  },
  'm15-tries-dsu-range-queries': {
    language: 'Python',
    coreDataStructures: 'Trie using nested dicts or class, DSU class with rank and parent.',
    tricks: [
      'Idiomatic Python Trie with nested dicts: trie = {}; for w in words: cur = trie; for c in w: cur = cur.setdefault(c, {}); cur["#"] = True.',
      'DSU with path compression: def find(self, x): if self.parent[x] != x: self.parent[x] = self.find(self.parent[x]); return self.parent[x].',
    ],
    gotchas: [
      'Deep DSU recursion without path compression causes RecursionError.',
      'Forgetting to find canonical roots before uniting in DSU.',
    ],
    codeTemplate: `class DSU:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i: int) -> int:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i]) # Path compression
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        root_i, root_j = self.find(i), self.find(j)
        if root_i == root_j:
            return False
        if self.rank[root_i] < self.rank[root_j]:
            root_i, root_j = root_j, root_i
        self.parent[root_j] = root_i
        if self.rank[root_i] == self.rank[root_j]:
            self.rank[root_i] += 1
        return True`,
  },
  'm16-advanced-algorithms': {
    language: 'Python',
    coreDataStructures: 'collections.deque for 0-1 BFS, Tarjan low/disc lists.',
    tricks: [
      '0-1 BFS: appendleft(v) for 0-weight edges, append(v) for 1-weight edges.',
      'Tarjan Bridge detection: low[v] > disc[u] identifies critical bridges.',
    ],
    gotchas: [
      '0-1 BFS without distance check can process outdated paths: check d > dist[u].',
      'Parent edge check in Tarjan: ignore edge to immediate parent node.',
    ],
    codeTemplate: `from collections import deque

def zero_one_bfs(n: int, edges: list[tuple[int, int, int]], src: int) -> list[int]:
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
        
    dist = [float("inf")] * n
    dist[src] = 0
    dq = deque([src])
    
    while dq:
        u = dq.popleft()
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                if weight == 0:
                    dq.appendleft(v) # Zero cost: push front
                else:
                    dq.append(v)     # One cost: push back
    return dist`,
  },
};
