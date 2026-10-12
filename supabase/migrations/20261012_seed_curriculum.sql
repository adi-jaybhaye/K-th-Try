-- ====================================================================
-- KthTry — Seed Shared Curriculum & Resources
-- ====================================================================

INSERT INTO public.topics (id, slug, module_number, title, subtitle, description, priority, estimated_hours) VALUES
('m1-foundations-complexity', 'foundations-and-complexity', 1, 'Foundations and Complexity', 'Asymptotic analysis, Big-O, loop invariants', 'Master mathematical foundations of algorithm efficiency: Big-O, Big-Theta, Big-Omega, constraints estimation, and loop termination.', 'CORE', 12),
('m2-math-bit-manipulation', 'mathematics-and-bit-manipulation', 2, 'Mathematics & Bit Manipulation', 'GCD, Euclidean algorithm, Sieve, modular arithmetic', 'Essential discrete mathematics and bit-level tricks for technical assessments: primes, Euclidean GCD, binary exponentiation, and bitmasks.', 'HIGH VALUE', 14),
('m3-arrays-prefix-hashing', 'arrays-prefix-sums-and-hashing', 3, 'Arrays, Prefix Sums & Hashing', 'Prefix arrays, frequency maps, Kadane, Dutch Flag', 'Core interview problem solving: in-place mutations, range query prefix/suffix sums, Kadane max subarray, Boyer-Moore, and 2D matrix rotations.', 'CORE', 18),
('m4-two-pointers-sliding-windows', 'two-pointers-and-sliding-windows', 4, 'Two Pointers, Sliding Windows & Monotonic', 'Opposite/same direction pointers, monotonic stacks & deques', 'Two pointers, variable-size sliding windows, monotonic stacks for Next Greater Element and histogram area, and monotonic deques.', 'CORE', 16),
('m5-sorting-binary-search', 'sorting-and-binary-search', 5, 'Sorting and Binary Search', 'Lower/upper bounds, rotated arrays, binary search on answer', 'Standard & rotated binary search, bounds, peak finding, binary search on answer predicates, merge sort, quicksort, and inversion counting.', 'CORE', 18),
('m6-strings-algorithms', 'strings-and-string-algorithms', 6, 'Strings and String Algorithms', 'Immutability, palindromes, anagrams, KMP LPS, Rabin-Karp', 'Character frequencies, anagram grouping, palindrome centers, KMP Longest Prefix Suffix (LPS) table, and Rabin-Karp rolling hashes.', 'CORE', 14),
('m7-recursion-backtracking', 'recursion-divide-and-conquer-backtracking', 7, 'Recursion, Divide & Conquer, Backtracking', 'Call stacks, choose-explore-unchoose, N-Queens, Sudoku', 'Search space exploration: recursion trees, choose-explore-unchoose pattern, combination sums, permutations, duplicate pruning, N-Queens, and Sudoku.', 'CORE', 18),
('m8-linked-lists', 'linked-lists', 8, 'Linked Lists', 'Singly/doubly lists, Floyd cycle detection, reversal, merging', 'Pointer manipulation: sentinel/dummy heads, iterative/recursive reversals, fast-slow pointer Floyd cycle detection, merging, and random pointers.', 'CORE', 14),
('m9-stacks-queues-expressions', 'stacks-queues-and-expression-processing', 9, 'Stacks, Queues, Deques & Expressions', 'Parentheses, min-stack, circular queues, infix/postfix expressions', 'LIFO/FIFO structures: bracket matching, Min-Stack O(1), circular ring buffers, arithmetic expression calculators, and string decoders.', 'CORE', 14),
('m10-trees-bst', 'trees-and-binary-search-trees', 10, 'Trees and Binary Search Trees', 'Traversals (DFS, BFS), diameter, LCA, path sum, BST validation', 'Hierarchical trees: DFS & BFS traversals, tree diameter, maximum path sum, Lowest Common Ancestor (LCA), and BST search/insert/validation.', 'CORE', 20),
('m11-heaps-priority-queues', 'heaps-and-priority-queues', 11, 'Heaps and Priority Queues', 'Min-heaps, max-heaps, Top-K, running median with two heaps', 'Priority scheduling: heap invariants, top-k frequent elements, k-way merging, and two-heap running median balance.', 'CORE', 14),
('m12-greedy-algorithms', 'greedy-algorithms-and-interval-scheduling', 12, 'Greedy Algorithms & Interval Scheduling', 'Activity selection, meeting rooms, interval overlaps, Jump Game', 'Locally optimal choices: interval scheduling by end time, meeting rooms, merging intervals, Jump Game, and exchange argument proofs.', 'CORE', 14),
('m13-graphs', 'graphs', 13, 'Graphs', 'BFS, DFS, topological sort, Dijkstra, Bellman-Ford, Kruskal, DSU', 'Highest-yield interview topic: graph representations, connected components, cycle detection, topological sort, Dijkstra, and DSU.', 'CORE', 24),
('m14-dynamic-programming', 'dynamic-programming', 14, 'Dynamic Programming', '1D, 2D, Knapsack, LIS, LCS, Edit Distance, Stock Buy/Sell', 'Overlapping subproblems, state transitions, memoization vs tabulation, knapsack variants, LIS in O(N log N), and Edit Distance.', 'CORE', 26),
('m15-tries-dsu-range-queries', 'tries-and-range-query-structures', 15, 'Tries & Range-Query Structures', 'Prefix trees, Word Search II, Segment Trees, Fenwick Trees (BIT)', 'Trie prefix trees, binary bitwise Tries, Fenwick (Binary Indexed) Trees in O(log N), and Segment Tree range minimum queries.', 'HIGH VALUE', 16),
('m16-advanced-algorithms', 'advanced-algorithms', 16, 'Advanced Algorithms', 'Tarjan Bridges & SCCs, 0-1 BFS, Matrix Exponentiation, Meet-in-the-Middle', 'Tarjan bridges & articulation points, Kosaraju SCC, 0-1 BFS with Deques, matrix exponentiation for Fibonacci, and Meet-in-the-Middle.', 'STRETCH', 16)
ON CONFLICT (id) DO NOTHING;

-- Topic Prerequisites
INSERT INTO public.topic_prerequisites (topic_id, prerequisite_id) VALUES
('m2-math-bit-manipulation', 'm1-foundations-complexity'),
('m3-arrays-prefix-hashing', 'm1-foundations-complexity'),
('m4-two-pointers-sliding-windows', 'm3-arrays-prefix-hashing'),
('m5-sorting-binary-search', 'm1-foundations-complexity'),
('m6-strings-algorithms', 'm3-arrays-prefix-hashing'),
('m7-recursion-backtracking', 'm1-foundations-complexity'),
('m8-linked-lists', 'm1-foundations-complexity'),
('m9-stacks-queues-expressions', 'm1-foundations-complexity'),
('m10-trees-bst', 'm7-recursion-backtracking'),
('m11-heaps-priority-queues', 'm5-sorting-binary-search'),
('m12-greedy-algorithms', 'm5-sorting-binary-search'),
('m13-graphs', 'm9-stacks-queues-expressions'),
('m13-graphs', 'm10-trees-bst'),
('m14-dynamic-programming', 'm7-recursion-backtracking'),
('m14-dynamic-programming', 'm3-arrays-prefix-hashing'),
('m15-tries-dsu-range-queries', 'm10-trees-bst'),
('m16-advanced-algorithms', 'm13-graphs')
ON CONFLICT DO NOTHING;
