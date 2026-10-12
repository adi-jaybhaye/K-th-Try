import { TopicModule } from '../types/curriculum';

export const curriculumModules: TopicModule[] = [
  {
    id: 'm1-foundations-complexity',
    slug: 'foundations-and-complexity',
    moduleNumber: 1,
    title: 'Foundations and Complexity',
    subtitle: 'Asymptotic analysis, Big-O, loop invariants, and estimation',
    description:
      'Master the mathematical and mechanical foundations of algorithm efficiency: Big-O, Big-Theta, Big-Omega, worst/average/best cases, constraints-to-complexity deduction, recursion stack space, and loop termination.',
    priority: 'CORE',
    estimatedHours: 12,
    prerequisites: [],
    learningObjectives: [
      'Analyze time and space complexity with formal Big-O definitions.',
      'Estimate acceptable time complexities directly from input constraints (e.g. N <= 10^5 implies O(N log N)).',
      'Distinguish auxiliary space from total space, including recursion call stacks.',
      'Formulate loop invariants and inductive proofs of correctness.',
    ],
    practicalApplications: [
      'Determining whether a solution will pass within the 1-second time limit (~10^8 operations).',
      'Predicting memory consumption in high-throughput enterprise batch pipelines.',
      'Analyzing amortized costs of dynamic resizing in standard libraries (like ArrayList).',
    ],
    patternClues: [
      'N <= 20: O(2^N) or O(N!) backtracking / bitmask DP is expected.',
      'N <= 1,000: O(N^2) double loop or dynamic programming is likely.',
      'N <= 10^5 or 10^6: O(N) or O(N log N) using sorting, two pointers, hash map, or binary search is required.',
      'N >= 10^9: O(log N) or O(1) mathematical closed form or binary search on answer is required.',
    ],
    complexityNotes: {
      time: 'Focus on dominant terms; ignore lower-order terms and constant factors in asymptotic notation.',
      space: 'Include auxiliary memory + recursion call stack. Primitive variables are O(1); call stack is O(depth).',
      intuition: 'Think of Big-O as an upper bound on growth rate as input size approaches infinity.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'int, long, arrays, System.currentTimeMillis() for benchmarking.',
      tricks: [
        'Recognize logarithmic loops: while (n > 0) n /= 2 is O(log N).',
        'Recognize nested loop harmonics: sum of N/i for i=1..N is O(N log N).',
      ],
      gotchas: [
        'Assuming all operations are O(1) without verifying (e.g., ArrayList.remove(0) is O(N)).',
        'Neglecting garbage collection pauses and object allocation overhead.',
      ],
      codeTemplate: `// Constraint Estimation Guideline:
// N <= 10^4  -> O(N^2) ~ 10^8 operations (may pass if inner loop is simple)
// N <= 10^5  -> O(N log N) ~ 1.7 * 10^6 operations (safely passes in < 0.2s)
// N <= 10^9  -> O(log N) or O(sqrt N)`,
    },
    commonMistakes: [
      'Equating worst case with Big-O: Big-O is an upper bound on any function; worst case is a scenario.',
      'Forgetting that String.substring() in modern Java creates an array copy of size O(K).',
      'Ignoring recursion stack space when reporting auxiliary space complexity.',
    ],
    boundaryCases: ['N = 0, N = 1, Integer.MAX_VALUE, empty inputs.'],
    subtopics: [
      {
        id: 'sub-m1-asymptotic',
        title: 'Asymptotic Notations & Math Foundations',
        description: 'Big-O, Big-Theta, Big-Omega definitions and arithmetic rules.',
        keyPoints: ['Limit definition', 'Dominant terms', 'Master Theorem for divide-and-conquer recurrences'],
        checklistItems: [
          'Can explain difference between O, Omega, and Theta to an interviewer',
          'Can solve recurrence T(n) = 2T(n/2) + O(n) using Master Theorem',
          'Understands why base of logarithm does not matter in Big-O',
        ],
      },
      {
        id: 'sub-m1-constraints',
        title: 'Constraints-to-Complexity Deduction',
        description: 'How to deduce the optimal algorithm by looking at the given constraints on LeetCode/OA.',
        keyPoints: ['The 10^8 operations per second rule', 'Logarithmic vs Linear vs Quadratic bounds'],
        checklistItems: [
          'Can instantly map N <= 50 to O(N^3) or O(N^4)',
          'Can determine when an O(N) auxiliary space solution is acceptable',
          'Knows how to detect O(1) math solutions from N = 10^18',
        ],
      },
      {
        id: 'sub-m1-amortized',
        title: 'Amortized Analysis & Recursion Stack',
        description: 'Aggregate method, accounting method, and call stack memory growth.',
        keyPoints: ['ArrayList dynamic resizing (doubling strategy)', 'Recursion tree depth vs call stack frames'],
        checklistItems: [
          'Understands why ArrayList.add() is amortized O(1) despite O(N) resizes',
          'Can analyze maximum recursion stack depth for tree traversals',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m1-striver',
        title: "Striver's Time and Space Complexity Primer",
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m1-visualgo',
        title: 'VisuAlgo — Algorithm Analysis Visualizations',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
      {
        id: 'res-m1-oracle',
        title: 'Oracle Java Complexity & Collections Guide',
        provider: 'Oracle Java',
        url: 'https://docs.oracle.com/en/java/',
        type: 'documentation',
        access: 'free',
        order: 3,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m1-nested-loops',
        title: 'Nested Loop Complexity Identification',
        platform: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-4-analysis-of-loops/',
        difficulty: 'Easy',
        pattern: 'Complexity Analysis',
        topicId: 'm1-foundations-complexity',
        order: 1,
      },
      {
        id: 'prob-m1-recurrence',
        title: 'Recurrence Tree Analysis for Merge Sort',
        platform: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/master-theorem-for-divide-and-conquer-recurrences/',
        difficulty: 'Medium',
        pattern: 'Recurrence Relations',
        topicId: 'm1-foundations-complexity',
        order: 2,
      },
    ],
  },
  {
    id: 'm2-math-bit-manipulation',
    slug: 'mathematics-and-bit-manipulation',
    moduleNumber: 2,
    title: 'Mathematics, Number Theory & Bit Manipulation',
    subtitle: 'GCD, Euclidean algorithm, Sieve, modular arithmetic, and bitwise operations',
    description:
      'Essential discrete mathematics and bit-level wizardry for technical interviews: Euclidean GCD, Sieve of Eratosthenes, modular inverse, powers via binary exponentiation, bitwise shifts, masks, power-of-two tests, and bit DP basics.',
    priority: 'HIGH VALUE',
    estimatedHours: 14,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Compute GCD and LCM in O(log(min(a,b))) using Euclidean algorithm.',
      'Generate all primes up to N in O(N log log N) using the Sieve of Eratosthenes.',
      'Perform modular arithmetic safely without 64-bit integer overflow.',
      'Apply bitwise tricks: n & (n - 1) to clear lowest set bit, n & (-n) to isolate lowest set bit.',
      'Iterate over all submasks of a bitmask in O(3^N).',
    ],
    practicalApplications: [
      'Cryptography and secure hash computations.',
      'Compact state representation in games, grid search, and Traveling Salesperson Problem.',
      'Low-level systems programming and cache alignment.',
    ],
    patternClues: [
      'Finding single unique element among pairs: XOR cancellation.',
      'Subset generation without recursion: bitmask enumeration from 0 to (1 << N) - 1.',
      'Checking if N is a power of two: (n > 0) && ((n & (n - 1)) == 0).',
      'Calculating a^b mod m for huge b: Binary Exponentiation.',
    ],
    complexityNotes: {
      time: 'Euclidean GCD is O(log(min(a, b))). Binary Exponentiation is O(log b). Sieve is O(N log log N).',
      space: 'Bitwise tricks are O(1) auxiliary space. Sieve requires O(N) boolean array.',
      intuition: 'Bits operate in parallel at hardware level. Treating an integer as a set of elements saves memory.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'int, long, Integer.bitCount(), Long.numberOfLeadingZeros().',
      tricks: [
        'Isolate lowest set bit: int lowbit = n & (-n);',
        'Clear lowest set bit: n = n & (n - 1);',
        'Count set bits: Integer.bitCount(n) executes in O(1) using hardware instructions.',
      ],
      gotchas: [
        'Shift precedence: 1 << n + 1 parses as 1 << (n + 1). Always use parentheses: (1 << n) + 1.',
        'Negative right shift: >> performs sign extension. Use >>> for logical unsigned right shift.',
      ],
      codeTemplate: `// Binary Exponentiation under Modulo:
public long power(long base, long exp, long mod) {
    long res = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) res = (res * base) % mod;
        base = (base * base) % mod;
        exp >>= 1;
    }
    return res;
}`,
    },
    commonMistakes: [
      'Dividing before modulo: (a / b) % mod != ((a % mod) / (b % mod)). Requires Fermat Little Theorem inverse.',
      'Forgetting that 1 << 31 in Java is Integer.MIN_VALUE, not 2^31.',
    ],
    boundaryCases: ['n = 0, n = 1, negative integers, exp = 0, mod = 1.'],
    subtopics: [
      {
        id: 'sub-m2-primes-gcd',
        title: 'Primes, Divisors & Euclidean GCD',
        description: 'Sieve of Eratosthenes, prime factorization in O(sqrt(N)), and extended GCD.',
        keyPoints: ['Euclidean theorem', 'Sieve optimizations up to sqrt(N)', 'Modular arithmetic'],
        checklistItems: [
          'Can write Euclidean GCD iteratively in under 30 seconds',
          'Can implement Sieve of Eratosthenes without memory leaks',
          'Understands why prime checking only requires testing up to sqrt(N)',
        ],
      },
      {
        id: 'sub-m2-bit-tricks',
        title: 'Bitwise Operators & Core Hacks',
        description: 'AND, OR, XOR, NOT, shift operators, set/toggle/clear bits, and XOR identities.',
        keyPoints: ['XOR properties (x ^ x = 0, x ^ 0 = x)', 'Lowbit extraction', 'Brian Kernighan count'],
        checklistItems: [
          'Understands how n & (n-1) counts set bits in O(set bits)',
          'Can solve Single Number I, II, III using bitwise reasoning',
          'Knows difference between >> and >>> in Java',
        ],
      },
      {
        id: 'sub-m2-bitmask-subsets',
        title: 'Bitmasks for State Representation',
        description: 'Representing subsets of size N <= 20 with integers and subset iteration.',
        keyPoints: ['Iterating subsets from 0 to 2^N - 1', 'Submask iteration: for (int s = m; s > 0; s = (s - 1) & m)'],
        checklistItems: [
          'Can generate all combinations using bitmask loops',
          'Can write state transitions for introductory Bitmask DP',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m2-striver',
        title: 'Striver Bit Manipulation Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m2-gfg',
        title: 'Bitwise Hacks and Tricks for Competitive Programming',
        provider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/bitwise-hacks-for-competitive-programming/',
        type: 'article',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m2-single-number',
        title: 'Single Number',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/single-number/',
        difficulty: 'Easy',
        pattern: 'XOR Cancellation',
        topicId: 'm2-math-bit-manipulation',
        order: 1,
      },
      {
        id: 'prob-m2-counting-bits',
        title: 'Counting Bits',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/counting-bits/',
        difficulty: 'Easy',
        pattern: 'Bit DP / Kernighan',
        topicId: 'm2-math-bit-manipulation',
        order: 2,
      },
      {
        id: 'prob-m2-subsets',
        title: 'Subsets (Bitmask Approach)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/subsets/',
        difficulty: 'Medium',
        pattern: 'Bitmask Generation',
        topicId: 'm2-math-bit-manipulation',
        order: 3,
      },
    ],
  },
  {
    id: 'm3-arrays-prefix-hashing',
    slug: 'arrays-prefix-sums-and-hashing',
    moduleNumber: 3,
    title: 'Arrays, Prefix Sums & Hashing',
    subtitle: 'Prefix arrays, difference arrays, frequency maps, Kadane, Dutch Flag, and matrices',
    description:
      'The foundational core of interview problem-solving: in-place mutations, range query optimizations via prefix/suffix sums, difference arrays for range updates, HashMap frequency counts, Kadane maximum subarray, Boyer-Moore majority voting, and 2D matrix traversals (spiral, diagonals, rotations).',
    priority: 'CORE',
    estimatedHours: 18,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Implement range sum queries in O(1) time after O(N) prefix preprocessing.',
      'Apply difference arrays to execute multiple range additions in O(1) per update.',
      'Explain and implement Kadane algorithm for maximum subarray sum with invariant tracking.',
      'Implement Boyer-Moore majority voting in O(N) time and O(1) space.',
      'Partition arrays in one pass using Dutch National Flag (3-way partitioning).',
      'Traverse 2D matrices in spiral order and rotate NxN matrices in-place.',
    ],
    practicalApplications: [
      'Financial ledger balance auditing and cumulative revenue reporting.',
      'Image processing filters, 2D convolution buffers, and matrix spatial rotations.',
      'Database indexing lookup speedups and hash join algorithms.',
    ],
    patternClues: [
      'Frequent subsegment sum queries: Prefix Sum array.',
      'Continuous subarray with target sum K (with negative numbers): Prefix sum + HashMap.',
      'Subarray with maximum sum: Kadane DP.',
      'Element appearing > N/2 times in O(1) space: Boyer-Moore Voting.',
      '0s, 1s, and 2s sorting in one pass: 3 pointers / Dutch National Flag.',
    ],
    complexityNotes: {
      time: 'Prefix build is O(N); queries are O(1). Kadane is O(N). Boyer-Moore is O(N). Matrix rotation is O(N^2).',
      space: 'Prefix arrays take O(N). In-place matrix rotation and Kadane take O(1) auxiliary space.',
      intuition: 'Precomputing cumulative state turns repetitive recalculation into instant subtraction.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'int[], int[][], HashMap<Integer, Integer>, HashSet<Integer>.',
      tricks: [
        'Prefix sum map initialization: map.put(0, 1) or map.put(0, -1) to handle subarrays starting at index 0.',
        'In-place matrix rotation 90 deg clockwise: Transpose matrix then reverse each row.',
      ],
      gotchas: [
        'Integer overflow on cumulative sum: always use long for prefix arrays when values can exceed 10^5.',
        'Modifying a collection while iterating over it throws ConcurrentModificationException.',
      ],
      codeTemplate: `// Kadane's Algorithm:
public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
    },
    commonMistakes: [
      'Forgetting that sliding window fails when array contains negative numbers; prefix sum + map is required.',
      'Off-by-one errors in range sum: sum(L, R) = prefix[R] - (L > 0 ? prefix[L - 1] : 0).',
    ],
    boundaryCases: ['All negative numbers in array, single-element array, 1x1 matrix, non-square matrices.'],
    subtopics: [
      {
        id: 'sub-m3-prefix-diff',
        title: 'Prefix Sums, Suffix Sums & Difference Arrays',
        description: 'Cumulative range precomputations, 2D prefix sums, and difference array updates.',
        keyPoints: ['1D and 2D prefix sum formulas', 'Difference array range additions: diff[l]+=val, diff[r+1]-=val'],
        checklistItems: [
          'Can derive 2D prefix sum formula: pref[r][c] = pref[r-1][c] + pref[r][c-1] - pref[r-1][c-1] + grid[r][c]',
          'Can solve Subarray Sum Equals K using prefix sum + HashMap',
        ],
      },
      {
        id: 'sub-m3-kadane-majority',
        title: 'Kadane & Boyer-Moore Majority Vote',
        description: 'Optimal O(N) single-pass state maintenance algorithms.',
        keyPoints: ['Kadane local vs global maximum', 'Boyer-Moore candidate and count tracking'],
        checklistItems: [
          'Can write Kadane algorithm and return both max sum and the actual subarray bounds',
          'Can prove correctness of Boyer-Moore majority vote to an interviewer',
        ],
      },
      {
        id: 'sub-m3-matrix-manipulation',
        title: '2D Matrix Traversal, Spiral & Rotation',
        description: 'Boundary tracking, in-place transpose, and clockwise/anti-clockwise rotation.',
        keyPoints: ['Top/bottom/left/right boundaries', 'Transpose + row reversal = 90 deg clockwise rotation'],
        checklistItems: [
          'Can code Spiral Matrix without edge-case infinite loops',
          'Can rotate an N x N matrix in place in O(1) extra space',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m3-striver',
        title: "Striver's Arrays and Hashing Master Series",
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m3-leetcode150',
        title: 'LeetCode Top Interview 150 — Arrays & Hashing',
        provider: 'LeetCode',
        url: 'https://leetcode.com/studyplan/top-interview-150/',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m3-two-sum',
        title: 'Two Sum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/two-sum/',
        difficulty: 'Easy',
        pattern: 'Hash Map Lookup',
        topicId: 'm3-arrays-prefix-hashing',
        order: 1,
      },
      {
        id: 'prob-m3-subarray-sum-k',
        title: 'Subarray Sum Equals K',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
        difficulty: 'Medium',
        pattern: 'Prefix Sum + HashMap',
        topicId: 'm3-arrays-prefix-hashing',
        order: 2,
      },
      {
        id: 'prob-m3-dutch-flag',
        title: 'Sort Colors (Dutch National Flag)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/sort-colors/',
        difficulty: 'Medium',
        pattern: '3-Way Partitioning',
        topicId: 'm3-arrays-prefix-hashing',
        order: 3,
      },
      {
        id: 'prob-m3-spiral-matrix',
        title: 'Spiral Matrix',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/spiral-matrix/',
        difficulty: 'Medium',
        pattern: 'Boundary Simulation',
        topicId: 'm3-arrays-prefix-hashing',
        order: 4,
      },
    ],
  },
  {
    id: 'm4-two-pointers-sliding-windows',
    slug: 'two-pointers-and-sliding-windows',
    moduleNumber: 4,
    title: 'Two Pointers, Sliding Windows & Monotonic Structures',
    subtitle: 'Opposite/same direction pointers, variable windows, monotonic stacks & deques',
    description:
      'Master the art of shrinking search spaces: opposite-direction pointers for sorted pairs, slow/fast pointers for cycle and duplicate management, fixed and variable sliding windows for contiguous subarray constraints, monotonic stacks for Next Greater Element and largest histogram rectangle, and monotonic deques for sliding window minimum/maximum.',
    priority: 'CORE',
    estimatedHours: 16,
    prerequisites: ['m3-arrays-prefix-hashing'],
    learningObjectives: [
      'Prove why two pointers reduces O(N^2) searches to O(N) by discarding non-viable states.',
      'Maintain frequency maps inside variable sliding windows with expand-and-shrink invariant.',
      'Construct Next Greater Element and Stock Span solutions using Monotonic Stacks in O(N).',
      'Compute Largest Rectangle in Histogram using monotonic stack heights and indices.',
      'Maintain sliding window maximum in O(N) using a Monotonic Deque.',
    ],
    practicalApplications: [
      'Network rate limiting, moving average computations, and packet windowing protocols.',
      'Audio waveform peak detection and stock market volatility spans.',
      'Real-time streaming telemetry maximum tracking.',
    ],
    patternClues: [
      'Contiguous subarray satisfying a condition (positive numbers): Sliding Window.',
      'Sorted array asking for pairs/triplets with target sum: Opposite-direction Two Pointers.',
      'Find next greater / smaller element for each index: Monotonic Stack.',
      'Max/Min value in every moving window of size K: Monotonic Deque.',
    ],
    complexityNotes: {
      time: 'Two pointers and sliding windows visit each element at most twice: O(N) amortized time.',
      space: 'Monotonic stack/deque stores at most N elements: O(N) space. Basic two pointers is O(1).',
      intuition: 'Each element enters and leaves the window/stack at most once, guaranteeing linear time.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'ArrayDeque<Integer> (for stack and deque), int[] frequency maps.',
      tricks: [
        'Monotonic Stack idiom: push index rather than value to easily compute width: (i - stack.peek() - 1).',
        'Use fixed-size int[128] or int[26] instead of HashMap for ASCII sliding window frequency to eliminate hash overhead.',
      ],
      gotchas: [
        'Do not shrink the sliding window while left <= right if the condition already holds.',
        'Negative numbers invalidate monotonic sum expansion: use prefix sums instead.',
      ],
      codeTemplate: `// Monotonic Stack for Next Greater Element:
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && nums[stack.peek()] <= nums[i]) {
            stack.pop();
        }
        res[i] = stack.isEmpty() ? -1 : nums[stack.peek()];
        stack.push(i);
    }
    return res;
}`,
    },
    commonMistakes: [
      'Popping the wrong end of the monotonic deque when maintaining sliding window maximum.',
      'Forgetting to clear elements outside window range: deque.peekFirst() <= i - k.',
    ],
    boundaryCases: ['Window size K larger than array length, empty window, all identical elements, sorted decreasing input.'],
    subtopics: [
      {
        id: 'sub-m4-two-pointers',
        title: 'Two Pointers: Converging & Fast-Slow',
        description: 'Sorted pair searching, container with most water, and deduplication.',
        keyPoints: ['Proof of eliminating impossible pairs', '3Sum reduction to 2Sum with duplicate skipping'],
        checklistItems: [
          'Can implement 3Sum with proper duplicate elimination',
          'Can solve Container With Most Water and explain the greedy proof',
        ],
      },
      {
        id: 'sub-m4-sliding-windows',
        title: 'Fixed & Dynamic Sliding Windows',
        description: 'Fixed-size rolling state, longest/shortest valid substring, and character frequency tracking.',
        keyPoints: ['Expand right pointer until invalid, shrink left pointer until valid', 'Condition satisfaction counter'],
        checklistItems: [
          'Can solve Longest Substring Without Repeating Characters in one pass',
          'Can implement Minimum Window Substring using frequency maps',
        ],
      },
      {
        id: 'sub-m4-monotonic-structures',
        title: 'Monotonic Stacks & Deques',
        description: 'Next Greater Element, largest rectangle in histogram, and sliding window maximum.',
        keyPoints: ['Monotonically increasing vs decreasing stacks', 'Window max with ArrayDeque'],
        checklistItems: [
          'Can implement Largest Rectangle in Histogram in O(N)',
          'Can implement Sliding Window Maximum in O(N) using Monotonic Deque',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m4-striver',
        title: 'Striver Sliding Window and Two Pointer Sheet',
        provider: 'Striver SDE Pattern Sheet',
        url: 'https://takeuforward.org/prep-hub/strivers-180-master-dsa-patterns',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m4-leetcode75',
        title: 'LeetCode 75 — Sliding Window & Two Pointers',
        provider: 'LeetCode 75',
        url: 'https://leetcode.com/studyplan/leetcode-75/',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m4-3sum',
        title: '3Sum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/3sum/',
        difficulty: 'Medium',
        pattern: 'Converging Pointers',
        topicId: 'm4-two-pointers-sliding-windows',
        order: 1,
      },
      {
        id: 'prob-m4-min-window-sub',
        title: 'Minimum Window Substring',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/minimum-window-substring/',
        difficulty: 'Hard',
        pattern: 'Variable Sliding Window',
        topicId: 'm4-two-pointers-sliding-windows',
        order: 2,
      },
      {
        id: 'prob-m4-histogram',
        title: 'Largest Rectangle in Histogram',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
        difficulty: 'Hard',
        pattern: 'Monotonic Stack',
        topicId: 'm4-two-pointers-sliding-windows',
        order: 3,
      },
      {
        id: 'prob-m4-sliding-max',
        title: 'Sliding Window Maximum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/sliding-window-maximum/',
        difficulty: 'Hard',
        pattern: 'Monotonic Deque',
        topicId: 'm4-two-pointers-sliding-windows',
        order: 4,
      },
    ],
  },
  {
    id: 'm5-sorting-binary-search',
    slug: 'sorting-and-binary-search',
    moduleNumber: 5,
    title: 'Sorting and Binary Search',
    subtitle: 'Lower/upper bounds, rotated arrays, binary search on answer, and sorting algorithms',
    description:
      'The crown jewel of algorithmic efficiency: standard and rotated binary search, lower and upper bounds, peak finding, binary search on monotonic feasibility predicates (capacity, speed, allocation problems), merge sort with inversion counting, quicksort partitioning stability, and matrix binary searches.',
    priority: 'CORE',
    estimatedHours: 18,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Write bug-free binary search with low + (high - low) / 2 and clear loop termination conditions.',
      'Implement lower_bound and upper_bound in arrays with duplicate values.',
      'Formulate and execute "Binary Search on Answer" using boolean feasibility predicates.',
      'Analyze stability, in-place behavior, and best/worst-case limits of Merge Sort and QuickSort.',
      'Count inversions in an array using modified Merge Sort.',
    ],
    practicalApplications: [
      'Database B-Tree index range scans and binary lookups.',
      'Resource allocation optimization (e.g. allocating server memory or truck capacities).',
      'Genome sequence alignment and inversion mutation metrics.',
    ],
    patternClues: [
      'Given a sorted array or finding an element in O(log N): Binary Search.',
      'Array is rotated sorted: Check which half (left or right) is strictly sorted.',
      'Problem asks to find "minimum maximum" or "maximum minimum": Binary Search on Answer.',
      'Count pairs where i < j and nums[i] > nums[j]: Inversion Count via Merge Sort.',
    ],
    complexityNotes: {
      time: 'Binary Search: O(log N). Binary Search on Answer: O(N log(SearchSpace)). Merge Sort: O(N log N).',
      space: 'Binary Search: O(1). Merge Sort: O(N) auxiliary array. QuickSort: O(log N) stack frames.',
      intuition: 'If an answer condition is monotonic (F F F T T T), binary search finds the transition boundary.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'Arrays.binarySearch(), custom low/high pointers.',
      tricks: [
        'Search space boundaries: low = max(nums), high = sum(nums) for allocation problems.',
        'Binary search on answer template: while (low <= high) { mid = ...; if (isValid(mid)) { ans = mid; high = mid - 1; } else { low = mid + 1; } }',
      ],
      gotchas: [
        'Infinite loop when high = mid or low = mid without +1 / -1 increment.',
        'Rotated array with duplicates: when nums[low] == nums[mid] == nums[high], shrink bounds linearly.',
      ],
      codeTemplate: `// Binary Search on Answer Template:
public int shipWithinDays(int[] weights, int days) {
    int low = 0, high = 0;
    for (int w : weights) {
        low = Math.max(low, w);
        high += w;
    }
    int ans = high;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canShip(weights, days, mid)) {
            ans = mid;
            high = mid - 1; // seek smaller valid capacity
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
    },
    commonMistakes: [
      'Using (low + high) / 2 instead of low + (high - low) / 2 causing integer overflow.',
      'Mixing up < vs <= in while loop conditions.',
    ],
    boundaryCases: ['Array size 1, target smaller than min element, target larger than max element, all duplicates.'],
    subtopics: [
      {
        id: 'sub-m5-bs-fundamentals',
        title: 'Binary Search Fundamentals & Bounds',
        description: 'Lower bound, upper bound, first and last occurrence, and insertion position.',
        keyPoints: ['Exact match vs bound search', 'Handling duplicates gracefully'],
        checklistItems: [
          'Can write lower_bound and upper_bound without checking documentation',
          'Can find first and last position of element in sorted array',
        ],
      },
      {
        id: 'sub-m5-bs-answer',
        title: 'Binary Search on Answer (Monotonic Predicates)',
        description: 'Minimizing maximums, allocating books, painter partition, and Koko eating bananas.',
        keyPoints: ['Monotonic feasibility function', 'Defining search space boundaries'],
        checklistItems: [
          'Can identify when a problem is a Binary Search on Answer candidate',
          'Can implement Koko Eating Bananas and Capacity To Ship Packages',
        ],
      },
      {
        id: 'sub-m5-sorting-internals',
        title: 'Sorting Algorithms & Inversion Counting',
        description: 'Merge Sort, QuickSort, QuickSelect, stability analysis, and inversion counts.',
        keyPoints: ['Inversion count during merge step', 'Quickselect O(N) average time for kth element'],
        checklistItems: [
          'Can implement Merge Sort and explain why it is stable',
          'Can write QuickSelect for kth largest element',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m5-striver',
        title: 'Striver Complete Binary Search Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m5-visualgo',
        title: 'VisuAlgo Sorting Visualizer',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en/sorting',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m5-search-rotated',
        title: 'Search in Rotated Sorted Array',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        difficulty: 'Medium',
        pattern: 'Rotated Binary Search',
        topicId: 'm5-sorting-binary-search',
        order: 1,
      },
      {
        id: 'prob-m5-koko',
        title: 'Koko Eating Bananas',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/koko-eating-bananas/',
        difficulty: 'Medium',
        pattern: 'Binary Search on Answer',
        topicId: 'm5-sorting-binary-search',
        order: 2,
      },
      {
        id: 'prob-m5-find-peak',
        title: 'Find Peak Element',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/find-peak-element/',
        difficulty: 'Medium',
        pattern: 'Gradient Binary Search',
        topicId: 'm5-sorting-binary-search',
        order: 3,
      },
    ],
  },
  {
    id: 'm6-strings-algorithms',
    slug: 'strings-and-string-algorithms',
    moduleNumber: 6,
    title: 'Strings and String Algorithms',
    subtitle: 'Immutability, palindromes, anagrams, KMP LPS, Rabin-Karp, and Tries preview',
    description:
      'String processing from core interview mechanics to industrial string matching: character frequencies, anagram grouping, palindrome expansion, longest common prefixes, Knuth-Morris-Pratt (KMP) Longest Prefix Suffix (LPS) table, rolling hash with Rabin-Karp, and string pattern recognition.',
    priority: 'CORE',
    estimatedHours: 14,
    prerequisites: ['m3-arrays-prefix-hashing'],
    learningObjectives: [
      'Manipulate strings safely without garbage collector pauses using StringBuilder.',
      'Group anagrams in O(N * K) using frequency fingerprints or sorted canonical keys.',
      'Construct the KMP Longest Prefix Suffix (LPS) array in O(M) time.',
      'Search for needle in haystack in O(N + M) using KMP pattern matching.',
      'Understand rolling-hash principles in Rabin-Karp and collision avoidance.',
    ],
    practicalApplications: [
      'Search engines, regex engines, and DNA genomic sequence alignment.',
      'Plagiarism detection, diff algorithms, and text editor search functionality.',
    ],
    patternClues: [
      'Checking if two strings are permutations: Character frequency arrays or sorting.',
      'Longest Palindromic Substring: Expand around centers or DP.',
      'Find all occurrences of a pattern in a large text in O(N + M): KMP / Rabin-Karp.',
      'Prefix search across multiple dictionary words: Trie structure.',
    ],
    complexityNotes: {
      time: 'Anagram checking is O(N). KMP preprocessing is O(M); search is O(N).',
      space: 'KMP LPS requires O(M) extra space. Rolling hash uses O(1) extra space.',
      intuition: 'KMP uses previously matched prefix information so the text pointer never steps backwards.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'StringBuilder, char[], int[] frequency table.',
      tricks: [
        'char[] arr = s.toCharArray() allows direct in-place swapping for reversals.',
        'Use prime modulus for rolling hash (e.g. 10^9 + 7) and base 31 or 257.',
      ],
      gotchas: [
        's.substring(i, j) creates an object copy in modern Java.',
        'Using == for string comparison compares pointer memory references, not characters.',
      ],
      codeTemplate: `// KMP LPS Array Construction:
public int[] buildLPS(String pattern) {
    int m = pattern.length();
    int[] lps = new int[m];
    int len = 0, i = 1;
    while (i < m) {
        if (pattern.charAt(i) == pattern.charAt(len)) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}`,
    },
    commonMistakes: [
      'Concatenating strings inside loops causing O(N^2) memory allocations.',
      'Forgetting character encoding assumptions (ASCII vs Unicode).',
    ],
    boundaryCases: ['Empty string, single character string, string with identical characters, pattern longer than text.'],
    subtopics: [
      {
        id: 'sub-m6-anagrams-palindromes',
        title: 'Anagrams, Palindromes & Immutability',
        description: 'Frequency fingerprints, expanding around centers, and StringBuilder operations.',
        keyPoints: ['Group anagrams by tuple frequency', 'Expand around 2N-1 centers for palindromes'],
        checklistItems: [
          'Can implement Group Anagrams cleanly',
          'Can find Longest Palindromic Substring in O(N^2) space O(1)',
        ],
      },
      {
        id: 'sub-m6-kmp',
        title: 'Knuth-Morris-Pratt (KMP) & LPS Table',
        description: 'Prefix function, LPS table derivation, and O(N + M) substring search.',
        keyPoints: ['LPS intuition', 'Avoiding text pointer backtracking'],
        checklistItems: [
          'Can construct LPS array on whiteboard from scratch',
          'Can implement KMP search and explain worst-case time complexity',
        ],
      },
      {
        id: 'sub-m6-rabin-karp',
        title: 'Rabin-Karp Rolling Hash & Substring Search',
        description: 'Polynomial rolling hash, modular arithmetic, and hash collision resolution.',
        keyPoints: ['Sliding hash update in O(1)', 'Choosing base and modulus to minimize collisions'],
        checklistItems: [
          'Can compute rolling hash for fixed window',
          'Understands how to resolve hash collisions in interview discussions',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m6-striver',
        title: 'Striver String Sheet & KMP Walkthrough',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m6-gfg',
        title: 'KMP Algorithm for Pattern Searching',
        provider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/',
        type: 'article',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m6-group-anagrams',
        title: 'Group Anagrams',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/group-anagrams/',
        difficulty: 'Medium',
        pattern: 'Hashing Frequency Fingerprint',
        topicId: 'm6-strings-algorithms',
        order: 1,
      },
      {
        id: 'prob-m6-longest-palindrome',
        title: 'Longest Palindromic Substring',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/longest-palindromic-substring/',
        difficulty: 'Medium',
        pattern: 'Expand Around Center',
        topicId: 'm6-strings-algorithms',
        order: 2,
      },
      {
        id: 'prob-m6-str-str',
        title: 'Find the Index of the First Occurrence in a String (KMP)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
        difficulty: 'Medium',
        pattern: 'KMP Pattern Matching',
        topicId: 'm6-strings-algorithms',
        order: 3,
      },
    ],
  },
  {
    id: 'm7-recursion-backtracking',
    slug: 'recursion-divide-and-conquer-backtracking',
    moduleNumber: 7,
    title: 'Recursion, Divide & Conquer, Backtracking',
    subtitle: 'Call stacks, choose-explore-unchoose, combination sum, permutations, N-Queens, Sudoku',
    description:
      'The foundational mental model for search spaces: call stacks, base cases, recursion trees, divide-and-conquer reasoning, choose-explore-unchoose backtracking pattern, duplicate pruning in combination sums, N-Queens, Sudoku solving, and maze explorations.',
    priority: 'CORE',
    estimatedHours: 18,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Trace recursion trees and calculate time complexity via branch factor ^ depth.',
      'Master the canonical Backtracking template: Choice -> Constraint Validation -> Recursive Exploration -> Unchoose (Revert).',
      'Prune duplicate branches in sorted arrays for combinations and permutations.',
      'Implement state-space search for constraint satisfaction problems (N-Queens, Sudoku Solver).',
      'Distinguish subsets vs combinations vs permutations.',
    ],
    practicalApplications: [
      'Constraint satisfaction solvers and compiler syntax parsers.',
      'Automated layout routing, logistics route scheduling, and puzzle engines.',
    ],
    patternClues: [
      'Find all combinations / permutations / partitions: Backtracking.',
      'Grid exploration requiring paths without revisiting cells: Backtracking with visited array.',
      'Small N (N <= 15): Exponential or factorial backtracking is acceptable.',
      'Constraint satisfaction (place queens, fill sudoku): Backtracking with aggressive pruning.',
    ],
    complexityNotes: {
      time: 'Subsets: O(2^N). Permutations: O(N!). Pruning cuts branches early but theoretical worst-case remains exponential.',
      space: 'Recursion call stack is O(N) auxiliary space + memory required to store generated outputs.',
      intuition: 'Backtracking is depth-first search on an implicit decision tree, reverting state upon backtrack.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'List<List<Integer>>, List<Integer>, boolean[] used.',
      tricks: [
        'Always create a new copy when adding current path to result: result.add(new ArrayList<>(path)).',
        'Duplicate pruning in sorted array: if (i > start && nums[i] == nums[i - 1]) continue;',
      ],
      gotchas: [
        'Forgetting to unchoose (e.g. path.remove(path.size() - 1)) pollutes subsequent branch explorations.',
        'StackOverflowError on unpruned deep trees.',
      ],
      codeTemplate: `// Canonical Backtracking Template (Combinations):
public void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue; // duplicate pruning
        current.add(nums[i]); // Choose
        backtrack(nums, i + 1, current, result); // Explore
        current.remove(current.size() - 1); // Unchoose
    }
}`,
    },
    commonMistakes: [
      'Adding `current` directly to `result` instead of `new ArrayList<>(current)`, resulting in a list of empty lists.',
      'Not sorting the input array before attempting duplicate pruning.',
    ],
    boundaryCases: ['Input array with no elements, duplicate elements, target that cannot be achieved.'],
    subtopics: [
      {
        id: 'sub-m7-recursion-trees',
        title: 'Recursion Call Stacks & Tree Analysis',
        description: 'Base cases, recursive cases, and call stack visualization.',
        keyPoints: ['Visualizing the call stack frames', 'Calculating branching factor and tree depth'],
        checklistItems: [
          'Can draw recursion tree for Fibonacci and explain call stack memory',
          'Can translate recursive function to mathematical recurrence',
        ],
      },
      {
        id: 'sub-m7-subsets-permutations',
        title: 'Subsets, Combinations & Permutations',
        description: 'Choose-explore-unchoose pattern, subsets I & II, combinations, and permutations.',
        keyPoints: ['Duplicate pruning with sorting', 'Generating power sets'],
        checklistItems: [
          'Can implement Combination Sum I & II with duplicate elimination',
          'Can implement Permutations without extra boolean array using swaps',
        ],
      },
      {
        id: 'sub-m7-constraint-solvers',
        title: 'Constraint Satisfaction: N-Queens & Sudoku',
        description: 'Board validation, bitmask speedups for diagonal attacks, and backtracking solvers.',
        keyPoints: ['Diagonal conflict tracking: r + c and r - c', 'Sudoku row, column, and 3x3 box masks'],
        checklistItems: [
          'Can implement N-Queens and explain diagonal constraint checks',
          'Can implement Sudoku Solver and explain termination guarantees',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m7-striver',
        title: 'Striver Recursion and Backtracking Master Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m7-leetcode150',
        title: 'LeetCode 150 — Backtracking',
        provider: 'LeetCode',
        url: 'https://leetcode.com/studyplan/top-interview-150/',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m7-subsets-ii',
        title: 'Subsets II (With Duplicates)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/subsets-ii/',
        difficulty: 'Medium',
        pattern: 'Backtracking with Pruning',
        topicId: 'm7-recursion-backtracking',
        order: 1,
      },
      {
        id: 'prob-m7-combination-sum',
        title: 'Combination Sum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/combination-sum/',
        difficulty: 'Medium',
        pattern: 'Unbounded Backtracking',
        topicId: 'm7-recursion-backtracking',
        order: 2,
      },
      {
        id: 'prob-m7-n-queens',
        title: 'N-Queens',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/n-queens/',
        difficulty: 'Hard',
        pattern: 'Constraint Backtracking',
        topicId: 'm7-recursion-backtracking',
        order: 3,
      },
    ],
  },
  {
    id: 'm8-linked-lists',
    slug: 'linked-lists',
    moduleNumber: 8,
    title: 'Linked Lists',
    subtitle: 'Singly/doubly lists, Floyd cycle detection, reversal, merging, and dummy nodes',
    description:
      'Pointer manipulation and memory referencing mastery: singly, doubly, and circular linked lists; sentinel/dummy node architecture to eliminate edge cases; iterative and recursive reversal; fast/slow pointers for middle node and Floyd cycle detection/entry; merging sorted lists; reorder list; and cloning with random pointers.',
    priority: 'CORE',
    estimatedHours: 14,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Use sentinel/dummy head nodes to cleanly handle head insertions and deletions without null checks.',
      'Reverse singly linked lists iteratively in O(1) space and recursively.',
      'Detect cycles and pinpoint cycle entry node using Floyd Tortoise & Hare algorithm.',
      'Merge K sorted linked lists using a min-heap in O(N log K) time.',
      'Clone linked lists with random pointers in O(N) time and O(1) extra space.',
    ],
    practicalApplications: [
      'LRU Cache implementation (combining HashMap with Doubly Linked List).',
      'Operating system memory block free-lists and kernel process scheduler queues.',
      'Undo/redo histories in text editors.',
    ],
    patternClues: [
      'Find middle node or detect cycle: Fast and Slow Pointers.',
      'Modify or delete head node: Always create `ListNode dummy = new ListNode(0, head)`.',
      'Reorder list (L0 -> Ln -> L1 -> Ln-1): Find middle -> Reverse second half -> Merge alternately.',
      'Node has extra pointers (e.g. random): Interleave clone nodes with original nodes.',
    ],
    complexityNotes: {
      time: 'Traversal, reversal, and cycle detection are O(N). Node insertion/deletion given pointer is O(1).',
      space: 'Iterative operations take O(1) space. Recursive reversal uses O(N) call stack.',
      intuition: 'Draw pointer state diagrams before modifying pointers to avoid breaking linked references.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'Custom ListNode class, dummy head node.',
      tricks: [
        'Always save next pointer before reassigning: ListNode next = curr.next; curr.next = prev; prev = curr; curr = next;',
        'Fast/Slow pointer initialization: ListNode slow = head, fast = head; while (fast != null && fast.next != null) { ... }',
      ],
      gotchas: [
        'NullPointerException when dereferencing fast.next.next without checking fast != null && fast.next != null.',
        'Memory leaks if cyclic references are left dangling.',
      ],
      codeTemplate: `// In-Place Linked List Reversal:
public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
    },
    commonMistakes: [
      'Losing track of the rest of the list by overwriting `curr.next` without a temporary variable.',
      'Forgetting to break the link between the first half and reversed second half when reordering lists.',
    ],
    boundaryCases: ['Empty list (head == null), single-node list, two-node list, list with even vs odd number of nodes.'],
    subtopics: [
      {
        id: 'sub-m8-reversal-dummy',
        title: 'Reversal Mechanics & Sentinel Nodes',
        description: 'Iterative and recursive reversal, reverse between positions, and dummy nodes.',
        keyPoints: ['Dummy node saves edge-case branches', 'Four-pointer swap in linked list intervals'],
        checklistItems: [
          'Can write iterative reverseList with closed eyes in 60 seconds',
          'Can reverse subsegment [left, right] of a linked list',
        ],
      },
      {
        id: 'sub-m8-fast-slow-cycles',
        title: 'Floyd Cycle Detection & Cycle Entry Point',
        description: 'Mathematical proof of Tortoise and Hare, cycle length, and finding entry node.',
        keyPoints: ['Meeting point at distance 2k - k = k', 'Resetting one pointer to head to find entry point'],
        checklistItems: [
          'Can explain mathematical proof of cycle entry detection to interviewer',
          'Can find middle node of odd and even length lists',
        ],
      },
      {
        id: 'sub-m8-merge-interleave',
        title: 'Merge, Interleave & Random Pointer Cloning',
        description: 'Merge Two Sorted Lists, Merge K Lists, and Copy List with Random Pointer.',
        keyPoints: ['Interleaving copy nodes into original list to avoid hash map', 'Merge sort on linked lists in O(1) space'],
        checklistItems: [
          'Can clone random pointer linked list in O(1) auxiliary space',
          'Can implement Sort List in O(N log N) using merge sort',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m8-striver',
        title: 'Striver Linked List Master Sheet',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m8-visualgo',
        title: 'VisuAlgo Linked List & Pointers',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en/list',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m8-reverse-list',
        title: 'Reverse Linked List',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/reverse-linked-list/',
        difficulty: 'Easy',
        pattern: 'Pointer Reversal',
        topicId: 'm8-linked-lists',
        order: 1,
      },
      {
        id: 'prob-m8-linked-list-cycle-ii',
        title: 'Linked List Cycle II (Entry Point)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
        difficulty: 'Medium',
        pattern: 'Floyd Cycle Detection',
        topicId: 'm8-linked-lists',
        order: 2,
      },
      {
        id: 'prob-m8-merge-k-lists',
        title: 'Merge k Sorted Lists',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
        difficulty: 'Hard',
        pattern: 'Priority Queue / Divide and Conquer',
        topicId: 'm8-linked-lists',
        order: 3,
      },
    ],
  },
  {
    id: 'm9-stacks-queues-expressions',
    slug: 'stacks-queues-and-expression-processing',
    moduleNumber: 9,
    title: 'Stacks, Queues, Deques & Expressions',
    subtitle: 'Parentheses, min-stack, circular queues, infix/postfix expressions, decode string',
    description:
      'LIFO and FIFO data structure fundamentals: valid parentheses matching, min-stack with O(1) minimum retrieval, stack implementation using queues and queue using stacks, circular ring buffers, arithmetic expression parsing (infix, postfix, prefix, Shunting-Yard algorithm), and recursive string decoding.',
    priority: 'CORE',
    estimatedHours: 14,
    prerequisites: ['m1-foundations-complexity'],
    learningObjectives: [
      'Validate nested brackets and parentheses sequences in O(N) time.',
      'Design Min-Stack that returns minimum element in O(1) time and space.',
      'Convert and evaluate Infix, Postfix, and Prefix expressions.',
      'Implement Circular Queue and Deque ring buffers with bounded arrays.',
      'Decode nested encoded strings (e.g. 3[a2[c]] -> accaccacc) using dual stacks.',
    ],
    practicalApplications: [
      'Compiler syntax parsing, call stack management, and expression evaluation engines.',
      'Printer spoolers, task scheduling queues, and breadth-first search traversals.',
    ],
    patternClues: [
      'Problem involves nested structures, matching brackets, or undo operations: Stack.',
      'Order of processing must preserve arrival order (FIFO): Queue.',
      'Need O(1) getMin() on a stack: Store value + currentMin pair or delta encoding.',
      'Evaluate mathematical expression with operator precedence: Two Stacks (operators & values).',
    ],
    complexityNotes: {
      time: 'Push, pop, peek, offer, poll, and getMin are all O(1) operations.',
      space: 'O(N) auxiliary space to store elements.',
      intuition: 'A stack pauses the current context to resolve nested dependencies, then resumes execution.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'Deque<Integer> stack = new ArrayDeque<>(), Queue<Integer> q = new ArrayDeque<>().',
      tricks: [
        'Avoid java.util.Stack; use ArrayDeque for 2-3x faster operations without synchronized lock penalties.',
        'Min-Stack delta encoding: push (2 * val - min) when val < min to avoid storing extra objects.',
      ],
      gotchas: [
        'Calling pop() or peek() on an empty stack throws EmptyStackException / NoSuchElementException.',
      ],
      codeTemplate: `// Min Stack using Pair / Class or Delta:
class MinStack {
    private Deque<Long> stack = new ArrayDeque<>();
    private long min;

    public void push(int val) {
        if (stack.isEmpty()) {
            stack.push(0L);
            min = val;
        } else {
            stack.push((long) val - min);
            if (val < min) min = val;
        }
    }
    public void pop() {
        long diff = stack.pop();
        if (diff < 0) min = min - diff;
    }
    public int top() {
        long diff = stack.peek();
        return diff < 0 ? (int) min : (int) (min + diff);
    }
    public int getMin() {
        return (int) min;
    }
}`,
    },
    commonMistakes: [
      'Using synchronized legacy Stack class in performance-critical code.',
      'Incorrect operator precedence handling in expression calculators.',
    ],
    boundaryCases: ['Unmatched closing bracket at start, unclosed brackets remaining at end, division by zero.'],
    subtopics: [
      {
        id: 'sub-m9-stack-queue-design',
        title: 'Stack & Queue Design (MinStack & Circular Buffers)',
        description: 'Implementing MinStack, Stack using Queues, Queue using Stacks, and Circular Queue.',
        keyPoints: ['ArrayDeque vs LinkedList', 'Circular buffer head/tail pointer modular arithmetic'],
        checklistItems: [
          'Can implement MinStack in O(1) auxiliary space without duplicate stacks',
          'Can implement MyQueue using two stacks with amortized O(1) operations',
        ],
      },
      {
        id: 'sub-m9-parentheses-strings',
        title: 'Parentheses Matching & String Decoding',
        description: 'Valid Parentheses, Longest Valid Parentheses, and Decode String.',
        keyPoints: ['Stack of indices to calculate maximum valid parentheses length', 'String decoding stack'],
        checklistItems: [
          'Can solve Decode String using two stacks (numbers & string buffers)',
          'Can solve Longest Valid Parentheses in O(N) time',
        ],
      },
      {
        id: 'sub-m9-expression-eval',
        title: 'Expression Evaluation & Shunting-Yard',
        description: 'Basic Calculator I, II, III; infix to postfix; operator precedence.',
        keyPoints: ['Precedence map for operators', 'Unary minus handling'],
        checklistItems: [
          'Can implement Basic Calculator II with +, -, *, /',
          'Can evaluate Reverse Polish Notation in O(N)',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m9-striver',
        title: 'Striver Stacks and Queues Learning Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m9-oracle',
        title: 'Oracle ArrayDeque Documentation',
        provider: 'Oracle Java',
        url: 'https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ArrayDeque.html',
        type: 'documentation',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m9-valid-parentheses',
        title: 'Valid Parentheses',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        difficulty: 'Easy',
        pattern: 'Bracket Stack Matching',
        topicId: 'm9-stacks-queues-expressions',
        order: 1,
      },
      {
        id: 'prob-m9-basic-calculator-ii',
        title: 'Basic Calculator II',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/basic-calculator-ii/',
        difficulty: 'Medium',
        pattern: 'Operator Precedence Stack',
        topicId: 'm9-stacks-queues-expressions',
        order: 2,
      },
      {
        id: 'prob-m9-decode-string',
        title: 'Decode String',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/decode-string/',
        difficulty: 'Medium',
        pattern: 'Nested Decode Stacks',
        topicId: 'm9-stacks-queues-expressions',
        order: 3,
      },
    ],
  },
  {
    id: 'm10-trees-bst',
    slug: 'trees-and-binary-search-trees',
    moduleNumber: 10,
    title: 'Trees and Binary Search Trees',
    subtitle: 'Traversals (DFS, BFS), diameter, LCA, path sum, BST validation, and construction',
    description:
      'Hierarchical non-linear data structures: tree terminology, heights, depths, skew; recursive and iterative preorder, inorder, postorder traversals; level-order BFS and zigzag traversal; height, diameter, maximum path sum; Lowest Common Ancestor (LCA); binary search tree search, insertion, deletion, validation, kth smallest/largest, and tree reconstruction from traversals.',
    priority: 'CORE',
    estimatedHours: 20,
    prerequisites: ['m7-recursion-backtracking'],
    learningObjectives: [
      'Write both recursive and iterative versions of Preorder, Inorder, and Postorder traversals.',
      'Implement Level-Order BFS with level size tracking for depth-grouped processing.',
      'Compute tree diameter and Maximum Path Sum using postorder bottom-up return signatures.',
      'Find Lowest Common Ancestor (LCA) in both binary trees and binary search trees.',
      'Validate a BST using valid min/max value bounds rather than local child checks.',
      'Reconstruct a unique binary tree from Inorder + Preorder traversal arrays.',
    ],
    practicalApplications: [
      'DOM tree representations, file system directory hierarchies, and ASTs in interpreters.',
      'Database indexing (B+ Trees, AVL trees) and spatial partitioning (Quad-trees, KD-trees).',
    ],
    patternClues: [
      'Given a tree problem: Think recursive bottom-up postorder DFS first.',
      'Need to process tree level by level: BFS with Queue.',
      'BST problem: Leverage the fact that Inorder Traversal of a BST produces strictly sorted values.',
      'Find node relationship / intersection: Lowest Common Ancestor.',
    ],
    complexityNotes: {
      time: 'Standard tree traversals visit every node once: O(N). BST operations are O(H), where H is height.',
      space: 'Recursion stack is O(H). In balanced tree H = O(log N); in skewed tree H = O(N).',
      intuition: 'A tree is a recursive structure: any node is itself the root of its own subtree.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'TreeNode, Queue<TreeNode> (BFS), Deque<TreeNode> (iterative DFS).',
      tricks: [
        'Bottom-up pattern: helper returns height / branch sum, while updating global maximum variable.',
        'BST validation: pass Long.MIN_VALUE and Long.MAX_VALUE bounds down the recursion to catch overflow.',
      ],
      gotchas: [
        'Checking only `node.val > node.left.val` is INSUFFICIENT for BST validation: all left subtree descendants must be smaller.',
      ],
      codeTemplate: `// Lowest Common Ancestor in Binary Tree:
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root; // both found in separate subtrees
    return left != null ? left : right;
}`,
    },
    commonMistakes: [
      'Returning global maximum from the recursive function instead of branch height.',
      'Not handling negative node values when computing Maximum Path Sum.',
    ],
    boundaryCases: ['Null tree, single-root tree, completely skewed tree (linked list behavior), root is one of p or q.'],
    subtopics: [
      {
        id: 'sub-m10-traversals',
        title: 'Traversals: Recursive, Iterative & Level-Order BFS',
        description: 'Preorder, Inorder, Postorder (iterative with one/two stacks), and Zigzag BFS.',
        keyPoints: ['Morris traversal in O(1) space', 'Iterative postorder traversal mechanics'],
        checklistItems: [
          'Can write iterative Inorder traversal with stack',
          'Can implement Level-Order BFS grouping nodes by level',
        ],
      },
      {
        id: 'sub-m10-paths-lca',
        title: 'Diameter, Max Path Sum & Lowest Common Ancestor',
        description: 'Bottom-up postorder information passing, diameter, path sum, and LCA.',
        keyPoints: ['Subtree contribution vs path through root', 'LCA recurrence logic'],
        checklistItems: [
          'Can solve Binary Tree Maximum Path Sum in one pass',
          'Can write Lowest Common Ancestor for both Tree and BST',
        ],
      },
      {
        id: 'sub-m10-bst-operations',
        title: 'Binary Search Trees (BST) & Validation',
        description: 'Search, insert, delete node with 2 children, kth smallest element, and BST recovery.',
        keyPoints: ['Inorder traversal sorted property', 'Deleting a node by replacing with inorder successor'],
        checklistItems: [
          'Can validate BST using min/max range limits',
          'Can delete a node from BST with 2 children correctly',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m10-striver',
        title: 'Striver Binary Tree and BST Comprehensive Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m10-visualgo',
        title: 'VisuAlgo Binary Search Tree Visualizer',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en/bst',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m10-max-path-sum',
        title: 'Binary Tree Maximum Path Sum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
        difficulty: 'Hard',
        pattern: 'Bottom-Up Postorder DFS',
        topicId: 'm10-trees-bst',
        order: 1,
      },
      {
        id: 'prob-m10-lca',
        title: 'Lowest Common Ancestor of a Binary Tree',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
        difficulty: 'Medium',
        pattern: 'Subtree Return DFS',
        topicId: 'm10-trees-bst',
        order: 2,
      },
      {
        id: 'prob-m10-validate-bst',
        title: 'Validate Binary Search Tree',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        difficulty: 'Medium',
        pattern: 'Range Boundary DFS',
        topicId: 'm10-trees-bst',
        order: 3,
      },
    ],
  },
  {
    id: 'm11-heaps-priority-queues',
    slug: 'heaps-and-priority-queues',
    moduleNumber: 11,
    title: 'Heaps and Priority Queues',
    subtitle: 'Min-heaps, max-heaps, Top-K, running median with two heaps, and k-way merging',
    description:
      'Priority scheduling and extreme element retrieval: binary heap array representations (parent at i/2, children at 2i, 2i+1), min-heap and max-heap invariants, top-k frequent elements, k closest points, merging k sorted streams, two-heap running median maintenance, and custom comparator handling.',
    priority: 'CORE',
    estimatedHours: 14,
    prerequisites: ['m5-sorting-binary-search'],
    learningObjectives: [
      'Maintain a running Min-Heap of size K to solve Top-K problems in O(N log K) time and O(K) space.',
      'Maintain the running median of a data stream in O(log N) insert and O(1) read using two balanced heaps.',
      'Merge K sorted lists/arrays in O(N log K) using a priority queue.',
      'Understand heapify in O(N) versus N successive insertions in O(N log N).',
    ],
    practicalApplications: [
      'Dijkstra shortest path algorithm and Prim minimum spanning tree.',
      'Operating system event priority dispatchers and live data stream quantile tracking.',
    ],
    patternClues: [
      'Find K-th largest / smallest element in a stream: Min-Heap of size K.',
      'Find median in continuous incoming data: Two Heaps (Max-Heap for lower half, Min-Heap for upper half).',
      'Merge multiple sorted lists/streams: Min-Heap storing next elements.',
      'Rearrange string so no adjacent characters are identical: Max-Heap of frequencies.',
    ],
    complexityNotes: {
      time: 'Heap insertion (offer): O(log K). Heap removal (poll): O(log K). Peek: O(1). Building a heap from array (heapify): O(N).',
      space: 'O(K) auxiliary space when bounded to K elements.',
      intuition: 'A heap gives you access to the minimum or maximum element without the overhead of sorting the entire collection.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'PriorityQueue<Integer>, PriorityQueue<int[]> with lambda comparators.',
      tricks: [
        'Kth largest element: Maintain min-heap of size K. When pq.size() > K, poll(). The top of the heap is the answer!',
        'Two-heap balance rule: maxHeap size == minHeap size OR maxHeap size == minHeap size + 1.',
      ],
      gotchas: [
        'Iterating over a PriorityQueue does NOT return elements in sorted order; only poll() guarantees priority ordering.',
      ],
      codeTemplate: `// Running Median Finder using Two Heaps:
class MedianFinder {
    private PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a)); // lower half
    private PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // upper half

    public void addNum(int num) {
        if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
            maxHeap.offer(num);
        } else {
            minHeap.offer(num);
        }
        // Balance sizes:
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.offer(maxHeap.poll());
        } else if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) return maxHeap.peek();
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}`,
    },
    commonMistakes: [
      'Using a Max-Heap of size N to find K-th largest element instead of a Min-Heap of size K, which wastes memory and increases time from O(N log K) to O(N log N).',
      'Using (a - b) comparator causing integer overflow on negative numbers.',
    ],
    boundaryCases: ['Stream with odd vs even number of elements, K larger than stream size, duplicate frequencies.'],
    subtopics: [
      {
        id: 'sub-m11-top-k',
        title: 'Top-K Elements & Heap Sizing',
        description: 'Kth Largest Element, Top K Frequent Elements, and K Closest Points.',
        keyPoints: ['Min-Heap of size K saves memory', 'Frequency map + Heap combination'],
        checklistItems: [
          'Can implement Kth Largest Element in O(N log K)',
          'Can implement Top K Frequent Elements using bucket sort in O(N) as well',
        ],
      },
      {
        id: 'sub-m11-two-heaps',
        title: 'Two Heaps: Running Median & Stream Tracking',
        description: 'Median in a Data Stream, Sliding Window Median.',
        keyPoints: ['Maintaining size invariants between max-heap and min-heap', 'Lazy removal from heaps'],
        checklistItems: [
          'Can code MedianFinder without edge-case balancing errors',
          'Can explain lazy deletion in heaps for sliding window problems',
        ],
      },
      {
        id: 'sub-m11-k-way-merge',
        title: 'K-Way Merging & Interval Scheduling Heaps',
        description: 'Merge K Sorted Lists, Task Scheduler, Meeting Rooms II.',
        keyPoints: ['Heap of size K holding list heads', 'End-time min-heap for resource allocation'],
        checklistItems: [
          'Can solve Meeting Rooms II using a Min-Heap of end times',
          'Can implement Task Scheduler with cool-down intervals',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m11-striver',
        title: 'Striver Heaps and Priority Queues Learning Series',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m11-visualgo',
        title: 'VisuAlgo Binary Heap Visualizer',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en/heap',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m11-kth-largest',
        title: 'Kth Largest Element in an Array',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        difficulty: 'Medium',
        pattern: 'Min-Heap of Size K',
        topicId: 'm11-heaps-priority-queues',
        order: 1,
      },
      {
        id: 'prob-m11-find-median',
        title: 'Find Median from Data Stream',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
        difficulty: 'Hard',
        pattern: 'Two Heaps Balance',
        topicId: 'm11-heaps-priority-queues',
        order: 2,
      },
      {
        id: 'prob-m11-task-scheduler',
        title: 'Task Scheduler',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/task-scheduler/',
        difficulty: 'Medium',
        pattern: 'Max-Heap / Greedy Frequency',
        topicId: 'm11-heaps-priority-queues',
        order: 3,
      },
    ],
  },
  {
    id: 'm12-greedy-algorithms',
    slug: 'greedy-algorithms-and-interval-scheduling',
    moduleNumber: 12,
    title: 'Greedy Algorithms and Interval Scheduling',
    subtitle: 'Activity selection, meeting rooms, interval overlaps, Jump Game, and Huffman intuition',
    description:
      'Locally optimal choices leading to global solutions: interval scheduling by earliest end time, meeting rooms and sweep line counting, merging and inserting intervals, Jump Game reachability reasoning, Gas Station circuit verification, and exchange argument proofs to determine when greedy is sound vs when Dynamic Programming is strictly required.',
    priority: 'CORE',
    estimatedHours: 14,
    prerequisites: ['m5-sorting-binary-search'],
    learningObjectives: [
      'Prove greedy correctness using exchange arguments and staying ahead invariants.',
      'Solve Non-Overlapping Intervals by sorting by finish time.',
      'Merge overlapping intervals in O(N log N) time and O(N) space.',
      'Differentiate when greedy works (e.g. fractional knapsack) vs when it fails (0/1 knapsack, requiring DP).',
      'Solve Jump Game I & II by maintaining the maximum reachable boundary.',
    ],
    practicalApplications: [
      'Calendar conference room allocation and CPU batch job scheduling.',
      'Bandwidth bandwidth streaming, video packet compression, and minimum arrow balloon popping.',
    ],
    patternClues: [
      'Interval problems (meeting times, schedule, overlaps): Sort intervals first!',
      'Can you reach the end of an array by jumping: Track `maxReach` greedily.',
      'Distribute items with minimum resources: Greedy choice property.',
      'Does greedy work: If making a local choice does not close off the optimal global future, greedy holds.',
    ],
    complexityNotes: {
      time: 'Interval problems typically dominated by sorting: O(N log N), followed by an O(N) sweep.',
      space: 'O(1) or O(N) for output intervals.',
      intuition: 'Sort by end time when you want to leave maximum time open for subsequent activities.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'int[][] intervals, Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0])).',
      tricks: [
        'Sweep Line technique: separate start events (+1) and end events (-1) and sort them on a common timeline.',
      ],
      gotchas: [
        'Sorting intervals by start time vs end time: Activity selection requires END time sorting; merging intervals requires START time sorting!',
      ],
      codeTemplate: `// Merge Intervals:
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> merged = new ArrayList<>();
    int[] current = intervals[0];
    merged.add(current);
    for (int[] next : intervals) {
        if (next[0] <= current[1]) {
            current[1] = Math.max(current[1], next[1]); // overlap
        } else {
            current = next;
            merged.add(current);
        }
    }
    return merged.toArray(new int[merged.size()][]);
}`,
    },
    commonMistakes: [
      'Sorting by start time when the problem requires minimizing completion time (e.g. non-overlapping intervals).',
      'Assuming greedy works for coin change with arbitrary coin denominations (it fails for coins [1, 3, 4] and target 6).',
    ],
    boundaryCases: ['No overlapping intervals, intervals that completely encapsulate other intervals, empty array.'],
    subtopics: [
      {
        id: 'sub-m12-intervals',
        title: 'Interval Scheduling & Merging',
        description: 'Merge Intervals, Insert Interval, Non-Overlapping Intervals, Meeting Rooms I & II.',
        keyPoints: ['Start time vs End time sorting rules', 'Sweep-line event processing'],
        checklistItems: [
          'Can code Merge Intervals cleanly without extra memory leaks',
          'Can solve Non-Overlapping Intervals by sorting by end time',
        ],
      },
      {
        id: 'sub-m12-jump-game-gas',
        title: 'Reachability & State Tracking (Jump Game & Gas Station)',
        description: 'Jump Game I & II, Gas Station circular tour, and greedy choice properties.',
        keyPoints: ['Maintaining maxReach boundary', 'Total gas >= total cost guarantees a starting station'],
        checklistItems: [
          'Can implement Jump Game I in O(N) time and O(1) space',
          'Can solve Gas Station in a single pass',
        ],
      },
      {
        id: 'sub-m12-proofs',
        title: 'Exchange Arguments: When Greedy Fails',
        description: 'Proving greedy algorithms and recognizing when Dynamic Programming is required.',
        keyPoints: ['Exchange argument technique', 'Fractional vs 0/1 Knapsack contrast'],
        checklistItems: [
          'Can construct a counter-example where greedy fails for Coin Change',
          'Can explain the exchange argument for Activity Selection',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m12-striver',
        title: 'Striver Greedy Algorithms Sheet',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m12-leetcode150',
        title: 'LeetCode 150 — Intervals and Greedy',
        provider: 'LeetCode',
        url: 'https://leetcode.com/studyplan/top-interview-150/',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m12-merge-intervals',
        title: 'Merge Intervals',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/merge-intervals/',
        difficulty: 'Medium',
        pattern: 'Interval Start Sorting',
        topicId: 'm12-greedy-algorithms',
        order: 1,
      },
      {
        id: 'prob-m12-non-overlapping',
        title: 'Non-overlapping Intervals',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/non-overlapping-intervals/',
        difficulty: 'Medium',
        pattern: 'Interval End Sorting',
        topicId: 'm12-greedy-algorithms',
        order: 2,
      },
      {
        id: 'prob-m12-gas-station',
        title: 'Gas Station',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/gas-station/',
        difficulty: 'Medium',
        pattern: 'Greedy Accumulation',
        topicId: 'm12-greedy-algorithms',
        order: 3,
      },
    ],
  },
  {
    id: 'm13-graphs',
    slug: 'graphs',
    moduleNumber: 13,
    title: 'Graphs',
    subtitle: 'BFS, DFS, topological sort, Dijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, DSU',
    description:
      'The highest-yield interview topic: graph representations (adjacency lists vs matrices), connected components, island counting, cycle detection in directed and undirected graphs, bipartite graph coloring, topological sort (Kahn BFS and DFS), multi-source BFS, Dijkstra shortest paths with PriorityQueue, Bellman-Ford, Floyd-Warshall, Disjoint Set Union (DSU) with path compression and rank/size, and Kruskal/Prim Minimum Spanning Tree (MST).',
    priority: 'CORE',
    estimatedHours: 24,
    prerequisites: ['m9-stacks-queues-expressions', 'm10-trees-bst', 'm11-heaps-priority-queues'],
    learningObjectives: [
      'Model real-world interview problems as graph vertices and edges.',
      'Perform BFS for unweighted shortest paths and DFS for connected components and cycles.',
      'Detect cycles in directed graphs using 3-state coloring (unvisited, visiting, visited).',
      'Implement Topological Sort using Kahn BFS (in-degree tracking) and DFS.',
      'Implement Dijkstra algorithm for non-negative weighted graphs in O((V + E) log V).',
      'Implement Disjoint Set Union (DSU) with path compression and union by rank in nearly O(1) amortized.',
      'Construct Minimum Spanning Trees using Kruskal algorithm with DSU.',
    ],
    practicalApplications: [
      'Social network mutual connection lookups and friend recommendations.',
      'GPS navigation routing (Google Maps / Dijkstra), telecommunications fiber layouts (MST).',
      'Package dependency resolution managers (npm, pip, Maven topological sorting).',
    ],
    patternClues: [
      'Shortest path in unweighted grid or graph: BFS.',
      'Shortest path in weighted graph with non-negative weights: Dijkstra with Min-Heap.',
      'Dependency prerequisites (A must be done before B): Topological Sort.',
      'Network connectivity or dynamic component grouping: Disjoint Set Union (DSU).',
      'Simultaneous spread from multiple origins (rotting oranges, fire): Multi-Source BFS.',
    ],
    complexityNotes: {
      time: 'BFS/DFS: O(V + E). Dijkstra: O((V + E) log V). DSU: O(alpha(V)) ~ O(1). Kruskal: O(E log E).',
      space: 'Adjacency list uses O(V + E). Visited set and queues use O(V).',
      intuition: 'DSU handles dynamic connectivity; BFS handles unweighted paths; Dijkstra handles weighted paths.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'List<List<Integer>> adj, int[] dist, PriorityQueue<int[]>, DSU class.',
      tricks: [
        'Grid graphs: use direction arrays `int[] dr = {-1, 1, 0, 0}; int[] dc = {0, 0, -1, 1};`.',
        'Mark visited immediately upon enqueuing in BFS to prevent duplicate nodes in queue.',
      ],
      gotchas: [
        'Dijkstra does NOT work correctly with negative edge weights; use Bellman-Ford instead.',
        'Directed cycle detection is different from undirected: an undirected graph needs parent tracking; directed needs 3 states.',
      ],
      codeTemplate: `// Dijkstra Algorithm Template:
public int[] dijkstra(int n, List<List<int[]>> adj, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
    pq.offer(new int[]{src, 0});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue; // lazy deletion skip

        for (int[] edge : adj.get(u)) {
            int v = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}`,
    },
    commonMistakes: [
      'Marking nodes visited when dequeuing in BFS instead of when enqueuing, leading to exponential memory blowup.',
      'Forgetting path compression in DSU: `return parent[x] = find(parent[x]);`.',
    ],
    boundaryCases: ['Disconnected graph with multiple components, self-loops, disconnected destination node.'],
    subtopics: [
      {
        id: 'sub-m13-bfs-dfs-grids',
        title: 'BFS, DFS & Grid Traversals (Number of Islands)',
        description: 'Adjacency list representation, connected components, grid boundaries, and multi-source BFS.',
        keyPoints: ['Direction vectors dr/dc', 'Multi-source queue initialization'],
        checklistItems: [
          'Can code Number of Islands using both DFS and BFS',
          'Can solve Rotting Oranges using Multi-Source BFS',
        ],
      },
      {
        id: 'sub-m13-topological-cycles',
        title: 'Cycle Detection & Topological Sort',
        description: 'Undirected cycle detection, directed 3-state cycle detection, Kahn algorithm, Course Schedule.',
        keyPoints: ['In-degree array in Kahn algorithm', 'Detecting cycles via count of visited topological nodes'],
        checklistItems: [
          'Can implement Course Schedule I & II using Kahn algorithm',
          'Can explain cycle detection differences between directed and undirected graphs',
        ],
      },
      {
        id: 'sub-m13-shortest-paths-dijkstra',
        title: 'Shortest Paths: Dijkstra, Bellman-Ford & Floyd-Warshall',
        description: 'Single-source shortest path, priority queue relaxation, negative cycles, and all-pairs paths.',
        keyPoints: ['Lazy skip in Dijkstra', 'Bellman-Ford V-1 relaxations for negative weights'],
        checklistItems: [
          'Can implement Dijkstra algorithm with PriorityQueue',
          'Understands when Bellman-Ford and Floyd-Warshall are required',
        ],
      },
      {
        id: 'sub-m13-dsu-mst',
        title: 'Disjoint Set Union (DSU) & Minimum Spanning Trees',
        description: 'Path compression, union by rank/size, Kruskal algorithm, Redundant Connection.',
        keyPoints: ['Ackermann inverse function alpha(N)', 'Sorting edges by weight for Kruskal'],
        checklistItems: [
          'Can code DSU with path compression and union by size in under 2 minutes',
          'Can solve Redundant Connection using DSU',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m13-striver',
        title: 'Striver Graph Master Series (Top Interview Prep)',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m13-visualgo',
        title: 'VisuAlgo Graph Traversal and Dijkstra',
        provider: 'VisuAlgo',
        url: 'https://visualgo.net/en/graphds',
        type: 'interactive',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m13-islands',
        title: 'Number of Islands',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/number-of-islands/',
        difficulty: 'Medium',
        pattern: 'Grid DFS / Connected Components',
        topicId: 'm13-graphs',
        order: 1,
      },
      {
        id: 'prob-m13-course-schedule',
        title: 'Course Schedule (Topological Sort)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/course-schedule/',
        difficulty: 'Medium',
        pattern: 'Kahn Topological Sort',
        topicId: 'm13-graphs',
        order: 2,
      },
      {
        id: 'prob-m13-network-delay',
        title: 'Network Delay Time (Dijkstra)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/network-delay-time/',
        difficulty: 'Medium',
        pattern: 'Dijkstra Shortest Path',
        topicId: 'm13-graphs',
        order: 3,
      },
      {
        id: 'prob-m13-redundant-conn',
        title: 'Redundant Connection (DSU)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/redundant-connection/',
        difficulty: 'Medium',
        pattern: 'Disjoint Set Union (DSU)',
        topicId: 'm13-graphs',
        order: 4,
      },
    ],
  },
  {
    id: 'm14-dynamic-programming',
    slug: 'dynamic-programming',
    moduleNumber: 14,
    title: 'Dynamic Programming',
    subtitle: '1D, 2D, Knapsack, LIS, LCS, Edit Distance, Stock Buy/Sell, and Space Optimization',
    description:
      'The pinnacle of algorithmic reasoning: overlapping subproblems, optimal substructure, state definitions, recurrence transitions, base cases, and iteration order; memoization (top-down) vs tabulation (bottom-up); 1D DP (Climbing Stairs, House Robber); 2D Grid DP (Unique Paths, Min Path Sum); 0/1 Knapsack, Subset Sum, Unbounded Knapsack, Coin Change; Longest Increasing Subsequence (O(N^2) and O(N log N) patience sorting); Longest Common Subsequence (LCS), Edit Distance; Stock state machines; and rolling array space optimizations.',
    priority: 'CORE',
    estimatedHours: 26,
    prerequisites: ['m7-recursion-backtracking', 'm3-arrays-prefix-hashing'],
    learningObjectives: [
      'Identify whether a problem exhibits optimal substructure and overlapping subproblems.',
      'Formulate precise state representations dp[i] or dp[i][j] with clear semantic definitions.',
      'Translate recursive solutions into iterative bottom-up tables.',
      'Optimize auxiliary space from O(N^2) to O(N) using rolling arrays.',
      'Implement 0/1 Knapsack and Unbounded Knapsack variations.',
      'Solve Longest Increasing Subsequence in O(N log N) using binary search (patience sorting).',
      'Solve 2D string alignment problems (LCS, Edit Distance, Wildcard Matching).',
    ],
    practicalApplications: [
      'Diff tools (git diff uses Myers LCS algorithm).',
      'Bioinformatics DNA / RNA global sequence alignment (Needleman-Wunsch).',
      'Financial quantitative portfolio optimization and knapsack capital allocation.',
    ],
    patternClues: [
      'Problem asks for: Maximum / Minimum / Number of ways to achieve target.',
      'Subproblems depend on smaller prefix or suffix choices: DP.',
      'Take or Not-Take choice at each element: 0/1 Knapsack pattern.',
      'Two strings comparison / transformation: 2D DP matrix dp[i][j].',
    ],
    complexityNotes: {
      time: 'Time is proportional to (Number of States) * (Transitions per State). 1D DP: O(N); 2D DP: O(N * M).',
      space: 'Full table is O(N * M). Space optimization with previous row/column reduces space to O(M).',
      intuition: 'Store the results of subproblems in a table so that each distinct state is computed exactly once.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'int[], int[][], Arrays.fill(dp, -1).',
      tricks: [
        'Space optimization: if dp[i][w] only depends on dp[i-1][...], replace with 1D array traversed backwards for 0/1 Knapsack.',
        'LIS in O(N log N): maintain tails array where tails[k] is smallest tail of all increasing subsequences of length k+1, updated via binary search.',
      ],
      gotchas: [
        'Traversing 0/1 Knapsack 1D array forwards accidentally turns it into Unbounded Knapsack.',
        'Negative array index lookups when base cases are not offset properly.',
      ],
      codeTemplate: `// 0/1 Knapsack Space-Optimized Pattern:
public int knapsack(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = W; w >= weights[i]; w--) { // traverse backwards!
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}`,
    },
    commonMistakes: [
      'Vague state definition: e.g. "dp[i] is the answer" without defining whether index i is included or excluded.',
      'Wrong iteration direction leading to using uncomputed or overwritten values.',
    ],
    boundaryCases: ['Target sum 0, empty array, target impossible to form (returning -1), items with weight 0.'],
    subtopics: [
      {
        id: 'sub-m14-1d-grids',
        title: '1D DP & 2D Grid DP',
        description: 'Climbing Stairs, House Robber I & II, Unique Paths, Minimum Path Sum.',
        keyPoints: ['State definition precision', 'Optimizing 1D array to two variables: prev1 and prev2'],
        checklistItems: [
          'Can space-optimize House Robber to O(1) auxiliary space',
          'Can implement Minimum Path Sum with rolling 1D array',
        ],
      },
      {
        id: 'sub-m14-knapsack-subsets',
        title: 'Knapsack Patterns & Coin Change',
        description: '0/1 Knapsack, Subset Sum, Partition Equal Subset, Unbounded Knapsack, Coin Change I & II.',
        keyPoints: ['Reverse loop for 0/1 Knapsack', 'Forward loop for Unbounded Knapsack'],
        checklistItems: [
          'Can explain why 0/1 knapsack must traverse backwards in 1D array',
          'Can implement Coin Change (min coins) returning -1 when impossible',
        ],
      },
      {
        id: 'sub-m14-lis-subsequences',
        title: 'Longest Increasing Subsequence (LIS) & Binary Search',
        description: 'O(N^2) DP approach vs O(N log N) Patience Sorting binary search.',
        keyPoints: ['Tails array concept', 'Reconstructing the actual LIS sequence'],
        checklistItems: [
          'Can code LIS in O(N log N) using binary search lower_bound',
          'Can solve Russian Doll Envelopes using sorted width and descending height LIS',
        ],
      },
      {
        id: 'sub-m14-strings-edit-distance',
        title: 'String DP: LCS, Edit Distance & Stocks',
        description: 'Longest Common Subsequence, Edit Distance, Palindromic Subsequences, Stock State Machines.',
        keyPoints: ['Insert, Delete, Replace transitions', 'Stock finite state machine transitions'],
        checklistItems: [
          'Can derive Edit Distance table transitions',
          'Can solve Best Time to Buy and Sell Stock with Cooldown using state machines',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m14-striver',
        title: 'Striver Dynamic Programming Master Playlist',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m14-leetcode150',
        title: 'LeetCode 150 — Dynamic Programming 1D & Multidimensional',
        provider: 'LeetCode',
        url: 'https://leetcode.com/studyplan/top-interview-150/',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m14-coin-change',
        title: 'Coin Change',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/coin-change/',
        difficulty: 'Medium',
        pattern: 'Unbounded Knapsack DP',
        topicId: 'm14-dynamic-programming',
        order: 1,
      },
      {
        id: 'prob-m14-lis',
        title: 'Longest Increasing Subsequence',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
        difficulty: 'Medium',
        pattern: 'LIS / Binary Search',
        topicId: 'm14-dynamic-programming',
        order: 2,
      },
      {
        id: 'prob-m14-edit-distance',
        title: 'Edit Distance',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/edit-distance/',
        difficulty: 'Hard',
        pattern: '2D String Alignment DP',
        topicId: 'm14-dynamic-programming',
        order: 3,
      },
    ],
  },
  {
    id: 'm15-tries-dsu-range-queries',
    slug: 'tries-and-range-query-structures',
    moduleNumber: 15,
    title: 'Tries, DSU and Range-Query Structures',
    subtitle: 'Prefix trees, Word Search II, Segment Trees, Fenwick Trees (BIT), and Sparse Tables',
    description:
      'Advanced hierarchical indexing and dynamic range queries: Trie prefix trees for autocomplete and XOR maximum queries; Segment Tree construction, point updates, and range query; Fenwick / Binary Indexed Tree (BIT) for prefix sums and point updates in O(log N); and choosing the simplest adequate structure.',
    priority: 'HIGH VALUE',
    estimatedHours: 16,
    prerequisites: ['m10-trees-bst', 'm2-math-bit-manipulation'],
    learningObjectives: [
      'Implement a Trie supporting insert, search, and startsWith in O(L) time where L is word length.',
      'Optimize Word Search II on a 2D board using a Trie to prune dead-end paths.',
      'Find Maximum XOR of Two Numbers in an array in O(32 * N) using a Binary Trie.',
      'Construct a Fenwick Tree (Binary Indexed Tree) using lowbit (i & -i) indexing.',
      'Construct a Segment Tree for dynamic range minimum or sum queries with point updates.',
    ],
    practicalApplications: [
      'Search engine search-as-you-type autocomplete and spellcheck suggestion engines.',
      'IP routing prefix lookup tables (Longest Prefix Match).',
      'Dynamic trading order book price range aggregate volume computations.',
    ],
    patternClues: [
      'Dictionary lookup by prefix: Trie.',
      'Max XOR of two elements: Binary bitwise Trie.',
      'Range sum or minimum with frequent point updates: Fenwick Tree or Segment Tree.',
      'Static range minimum queries with no updates: Sparse Table in O(1) query time.',
    ],
    complexityNotes: {
      time: 'Trie operations: O(L) where L is string length. Fenwick Tree: O(log N) update and query. Segment Tree: O(log N).',
      space: 'Trie: O(Total characters * Alphabet size). Fenwick Tree: O(N). Segment Tree: O(4N).',
      intuition: 'Tries share common prefixes; Fenwick trees decompose intervals into powers of two.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'TrieNode with TrieNode[26] children, int[] tree for Fenwick.',
      tricks: [
        'Fenwick tree lowbit idiom: update(i, val): for (; i < n; i += i & -i) tree[i] += val; query(i): for (; i > 0; i -= i & -i) sum += tree[i];',
        'Word Search II: store the actual String at the leaf TrieNode so you do not need to reconstruct it with StringBuilder.',
      ],
      gotchas: [
        'Fenwick tree uses 1-based indexing! Passing 0 creates an infinite loop because 0 & (-0) == 0.',
      ],
      codeTemplate: `// Fenwick Tree (Binary Indexed Tree):
class FenwickTree {
    private int[] tree;
    private int n;
    public FenwickTree(int n) {
        this.n = n;
        this.tree = new int[n + 1];
    }
    public void add(int i, int delta) {
        for (; i <= n; i += i & -i) tree[i] += delta;
    }
    public int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
}`,
    },
    commonMistakes: [
      '0-indexing in Fenwick tree causing infinite loops.',
      'Over-allocating memory in Tries by not pruning leaf nodes.',
    ],
    boundaryCases: ['Empty prefix, words that are prefixes of other words, queries beyond array bounds.'],
    subtopics: [
      {
        id: 'sub-m15-trie-basics',
        title: 'Trie (Prefix Tree) Construction & Autocomplete',
        description: 'TrieNode structure, insert, search, startsWith, and Word Search II.',
        keyPoints: ['TrieNode array of 26 vs HashMap', 'Pruning visited nodes in backtracking search'],
        checklistItems: [
          'Can implement Trie class from scratch in 5 minutes',
          'Can solve Word Search II using Trie pruning',
        ],
      },
      {
        id: 'sub-m15-binary-trie',
        title: 'Binary Trie & Maximum XOR',
        description: 'Bitwise Trie for numbers, Maximum XOR of Two Numbers in an Array.',
        keyPoints: ['Greedy bit choice: seek opposite bit to maximize XOR', 'Fixed 31-bit depth'],
        checklistItems: [
          'Can implement Maximum XOR of Two Numbers using Binary Trie',
        ],
      },
      {
        id: 'sub-m15-segment-fenwick',
        title: 'Fenwick Trees (BIT) & Segment Trees',
        description: 'Binary Indexed Tree lowbit operations and Segment Tree range minimums.',
        keyPoints: ['Fenwick 1-indexed tree mechanics', 'Segment tree recursive divide-and-conquer'],
        checklistItems: [
          'Can implement 1D Fenwick Tree in under 20 lines of code',
          'Understands when Segment Tree with lazy propagation is required over Fenwick',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m15-striver',
        title: 'Striver Trie Series and Advanced Structures',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m15-gfg',
        title: 'Binary Indexed Tree or Fenwick Tree',
        provider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/',
        type: 'article',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m15-implement-trie',
        title: 'Implement Trie (Prefix Tree)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
        difficulty: 'Medium',
        pattern: 'Trie Implementation',
        topicId: 'm15-tries-dsu-range-queries',
        order: 1,
      },
      {
        id: 'prob-m15-word-search-ii',
        title: 'Word Search II',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/word-search-ii/',
        difficulty: 'Hard',
        pattern: 'Trie + Grid Backtracking',
        topicId: 'm15-tries-dsu-range-queries',
        order: 2,
      },
      {
        id: 'prob-m15-max-xor',
        title: 'Maximum XOR of Two Numbers in an Array',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
        difficulty: 'Medium',
        pattern: 'Binary Bitwise Trie',
        topicId: 'm15-tries-dsu-range-queries',
        order: 3,
      },
    ],
  },
  {
    id: 'm16-advanced-algorithms',
    slug: 'advanced-algorithms',
    moduleNumber: 16,
    title: 'Advanced Algorithms',
    subtitle: 'Tarjan Bridges & SCCs, 0-1 BFS, Matrix Exponentiation, Meet-in-the-Middle, and NP-Hardness',
    description:
      'For tier-1 engineering assessments and competitive coding rounds: Tarjan algorithm for bridges and articulation points; Kosaraju Strongly Connected Components (SCC); 0-1 BFS with Deques; Matrix Exponentiation for linear recurrences in O(K^3 log N); Fermat Little Theorem modular inverses; Catalan numbers and combinatorics; Meet-in-the-Middle search space splitting; and NP-completeness reduction intuition.',
    priority: 'STRETCH',
    estimatedHours: 16,
    prerequisites: ['m13-graphs', 'm14-dynamic-programming', 'm2-math-bit-manipulation'],
    learningObjectives: [
      'Find critical connections (bridges) in a network in O(V + E) using Tarjan discovery & low times.',
      'Decompose directed graphs into Strongly Connected Components (SCC) using Kosaraju / Tarjan.',
      'Solve shortest path problems on graphs with weights only 0 and 1 using 0-1 BFS in O(V + E).',
      'Compute the N-th Fibonacci or linear recurrence for N = 10^18 using Matrix Exponentiation in O(log N).',
      'Split search spaces of size N = 40 using Meet-in-the-Middle from O(2^40) down to O(2^20 * 20).',
    ],
    practicalApplications: [
      'Vulnerability and single point of failure analysis in power grids and communication backbones.',
      'Compiler optimization control flow graph component reductions.',
      'Large-scale financial discrete state simulation.',
    ],
    patternClues: [
      'Find critical connections whose removal disconnects the graph: Tarjan Bridges (low[v] > disc[u]).',
      'Graph edges have weights only 0 and 1: 0-1 BFS with ArrayDeque.',
      'Calculate linear recurrence where N is up to 10^18: Matrix Exponentiation.',
      'Subset sum or partition where N = 40 (too large for 2^N, but too small for polynomial DP): Meet-in-the-Middle.',
    ],
    complexityNotes: {
      time: 'Tarjan: O(V + E). 0-1 BFS: O(V + E). Matrix Exponentiation: O(K^3 log N). Meet in the Middle: O(2^(N/2) * N/2).',
      space: 'Tarjan requires O(V) discovery and low arrays.',
      intuition: 'Tarjan tracks ancestor back-edges to find whether a subtree can reach above its parent.',
    },
    javaImplementationNotes: {
      coreDataStructures: 'ArrayDeque (0-1 BFS), int[] disc, int[] low, long[][] matrices.',
      tricks: [
        '0-1 BFS: if edge weight is 0, add to FRONT of deque (`deque.addFirst()`); if 1, add to BACK (`deque.addLast()`).',
        'Meet-in-the-middle: generate all subsets of first half, sort them, and binary search for complementary subsets of second half.',
      ],
      gotchas: [
        'In Tarjan bridge search, do not traverse directly back to the immediate parent edge.',
      ],
      codeTemplate: `// Tarjan Bridges Template:
public void dfs(int u, int parent, List<List<Integer>> adj, int[] disc, int[] low, int[] time, List<List<Integer>> bridges) {
    disc[u] = low[u] = ++time[0];
    for (int v : adj.get(u)) {
        if (v == parent) continue;
        if (disc[v] != 0) {
            low[u] = Math.min(low[u], disc[v]); // back-edge
        } else {
            dfs(v, u, adj, disc, low, time, bridges);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) {
                bridges.add(Arrays.asList(u, v)); // Bridge found!
            }
        }
    }
}`,
    },
    commonMistakes: [
      'Confusing bridge condition (low[v] > disc[u]) with articulation point condition (low[v] >= disc[u]).',
      'Forgetting that root of DFS tree is an articulation point if and only if it has >= 2 children in DFS tree.',
    ],
    boundaryCases: ['Biconnected graphs (no bridges), star graphs, trees (every edge is a bridge).'],
    subtopics: [
      {
        id: 'sub-m16-tarjan-bridges',
        title: 'Tarjan Algorithm: Bridges & Articulation Points',
        description: 'Discovery times, low times, back-edges, and critical network connections.',
        keyPoints: ['DFS discovery tree', 'low[v] > disc[u] bridge condition', 'Articulation points special root rule'],
        checklistItems: [
          'Can implement Critical Connections in a Network (Bridges) in O(V + E)',
          'Can identify articulation points on a whiteboard',
        ],
      },
      {
        id: 'sub-m16-01-bfs-matrix-exp',
        title: '0-1 BFS & Matrix Exponentiation',
        description: '0-1 BFS deque relaxation, matrix exponentiation for linear recurrences in O(log N).',
        keyPoints: ['0-1 BFS avoids PriorityQueue overhead', 'Transition matrix multiplication for Fibonacci'],
        checklistItems: [
          'Can implement 0-1 BFS using ArrayDeque',
          'Can solve Nth Fibonacci for N = 10^18 using Matrix Exponentiation',
        ],
      },
      {
        id: 'sub-m16-meet-in-middle',
        title: 'Meet-in-the-Middle & Complexity Reductions',
        description: 'Splitting search spaces for N <= 40, subset sum reductions, and NP-hardness intuition.',
        keyPoints: ['Splitting N into two halves of N/2', 'Binary search across sorted complementary subsets'],
        checklistItems: [
          'Can solve Closest Subsequence Sum using Meet-in-the-Middle',
          'Understands polynomial vs NP-complete problem reductions',
        ],
      },
    ],
    resources: [
      {
        id: 'res-m16-cpalgorithms',
        title: 'CP-Algorithms: Bridges, SCC & Advanced Graph Theory',
        provider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/bridge-in-a-graph/',
        type: 'article',
        access: 'free',
        order: 1,
        verified: true,
      },
      {
        id: 'res-m16-striver',
        title: 'Striver Advanced Graphs & Tarjan Walkthrough',
        provider: 'Striver A2Z',
        url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
        type: 'roadmap',
        access: 'free',
        order: 2,
        verified: true,
      },
    ],
    practiceProblems: [
      {
        id: 'prob-m16-critical-conn',
        title: 'Critical Connections in a Network (Bridges)',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
        difficulty: 'Hard',
        pattern: 'Tarjan Discovery & Low Times',
        topicId: 'm16-advanced-algorithms',
        order: 1,
      },
      {
        id: 'prob-m16-closest-subsequence',
        title: 'Closest Subsequence Sum',
        platform: 'LeetCode',
        url: 'https://leetcode.com/problems/closest-subsequence-sum/',
        difficulty: 'Hard',
        pattern: 'Meet-in-the-Middle',
        topicId: 'm16-advanced-algorithms',
        order: 2,
      },
    ],
  },
];
