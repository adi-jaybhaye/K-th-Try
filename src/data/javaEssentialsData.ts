import { JavaEssentialTopic } from '../types/curriculum';

export const javaEssentialsData: JavaEssentialTopic[] = [
  {
    id: 'java-primitives-overflow',
    title: 'Primitive Types, Bounds & Overflow Pitfalls',
    category: 'Primitives & Memory',
    description:
      'Understanding 32-bit signed int [-2^31 to 2^31-1] vs 64-bit long [-2^63 to 2^63-1], casting rules, and preventing silent mathematical wrap-around.',
    keyRules: [
      'Integer.MAX_VALUE is 2,147,483,647 (~2 * 10^9). Adding 1 gives Integer.MIN_VALUE (-2,147,483,648).',
      'Always use mid = low + (high - low) / 2 instead of (low + high) / 2 to prevent integer overflow.',
      'When calculating prefix sums or modular arithmetic (e.g. 10^9 + 7), cast products to (long) before modulo: (int)(((long)a * b) % MOD).',
      'Bitwise shifts on int: 1 << 31 is negative. Use 1L << k when shifting beyond 30 bits.',
    ],
    codeExample: `// Safe midpoint calculation without overflow:
int low = 0, high = nums.length - 1;
int mid = low + (high - low) / 2;

// Safe multiplication under modulo 1e9 + 7:
long MOD = 1_000_000_007L;
long safeProduct = ((long) a * b) % MOD;

// Safe sum checking for overflow:
long sum = (long) a + b;
if (sum > Integer.MAX_VALUE) {
    // Handle overflow boundary
}`,
    complexityCost: 'Primitive operations (arithmetic, bitwise, comparison) execute in O(1) CPU cycles.',
    interviewTip:
      'Interviewers specifically watch for `(low + high) / 2` in binary search and sum accumulations without `long`. Point out overflow boundaries proactively.',
  },
  {
    id: 'java-strings-stringbuilder',
    title: 'String Immutability & StringBuilder Mechanics',
    category: 'Strings & I/O',
    description:
      'Java Strings are immutable sequences of chars backed by byte arrays. Repeated concatenation creates O(N^2) garbage and memory pressure.',
    keyRules: [
      'String concatenation in a loop: "s += ch" creates a new String every iteration, causing O(N^2) time and memory thrashing.',
      'Always use StringBuilder for string construction or reversal: sb.append(ch), sb.reverse(), sb.toString() in amortized O(1).',
      'Never compare strings with "=="; always use s1.equals(s2) or s1.compareTo(s2).',
      'To access characters frequently, convert to char[] using s.toCharArray() for direct O(1) indexed reads.',
    ],
    codeExample: `// EFFICIENT: O(N) using StringBuilder
StringBuilder sb = new StringBuilder();
for (char c : chars) {
    sb.append(c);
}
String result = sb.toString();

// Efficient sliding window character counts:
int[] freq = new int[26];
for (int i = 0; i < s.length(); i++) {
    freq[s.charAt(i) - 'a']++;
}`,
    complexityCost:
      'charAt(i) is O(1). substring(i, j) copies characters and takes O(j - i) time. toCharArray() takes O(N) time and memory.',
    interviewTip:
      'If parsing strings in an interview, mention why you use StringBuilder or char array upfront: "I will use char[] to avoid repeated string allocation overhead."',
  },
  {
    id: 'java-collections-complexity',
    title: 'Collections Framework & Real Complexity Costs',
    category: 'Collections Framework',
    description:
      'ArrayList vs LinkedList, HashMap vs TreeMap, and ArrayDeque vs Stack. Know the hidden overhead of autoboxing and hash collisions.',
    keyRules: [
      'ArrayList: O(1) random get, amortized O(1) add, O(N) remove/insert in the middle.',
      'ArrayDeque is faster than Stack and LinkedList for both Stack (LIFO) and Queue (FIFO) operations.',
      'HashMap / HashSet: Average O(1) get/put/contains, Worst case O(N) or O(log N) due to bucket collisions (red-black tree bins in Java 8+).',
      'TreeMap / TreeSet: O(log N) for get/put/contains, guaranteed sorted order, supports floorKey(), ceilingKey(), higher(), lower().',
      'Beware of Autoboxing: Storing int in List<Integer> creates heap-allocated Integer objects, which consumes 4x memory and adds GC overhead.',
    ],
    codeExample: `// Stack & Queue standard in Java DSA:
Deque<Integer> stack = new ArrayDeque<>();
stack.push(10);
int top = stack.pop();

Queue<Integer> queue = new ArrayDeque<>();
queue.offer(20);
int head = queue.poll();

// Frequency map idiom:
Map<Integer, Integer> map = new HashMap<>();
map.put(val, map.getOrDefault(val, 0) + 1);

// Sorted set with floor/ceiling:
TreeSet<Integer> sorted = new TreeSet<>();
Integer lowerBound = sorted.ceiling(target); // >= target`,
    complexityCost:
      'ArrayDeque avoids pointer overhead of LinkedList. PriorityQueue insertion is O(log K), peek is O(1), poll is O(log K).',
    interviewTip:
      'Avoid Legacy `java.util.Stack` and `Vector` because their methods are synchronized and slow. Always state: "I will use ArrayDeque as the stack implementation."',
  },
  {
    id: 'java-comparators-priority-queues',
    title: 'Comparators, PriorityQueue & Custom Objects',
    category: 'Comparators & Lambdas',
    description:
      'Mastering custom sorting orders, intervals sorting, multi-criteria tie-breakers, and min-heap vs max-heap configurations.',
    keyRules: [
      'Natural ordering in Java PriorityQueue is Min-Heap by default: PriorityQueue<Integer> minHeap = new PriorityQueue<>();',
      'Max-Heap: PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> Integer.compare(b, a)); or Collections.reverseOrder().',
      'Interval sorting idiom: Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));',
      'Never do `(a, b) -> a - b` if values can be negative or large because subtraction can overflow and invert the sort order! Always use `Integer.compare(a, b)`.',
    ],
    codeExample: `// Top-K Elements Min-Heap:
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));

// Sorting 2D array of intervals:
Arrays.sort(intervals, (a, b) -> {
    if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
    return Integer.compare(a[1], b[1]);
});

// Custom Node for Dijkstra or Graphs:
class Node implements Comparable<Node> {
    int u, dist;
    Node(int u, int dist) { this.u = u; this.dist = dist; }
    @Override
    public int compareTo(Node o) {
        return Integer.compare(this.dist, o.dist);
    }
}`,
    complexityCost: 'Heap operations: offer() is O(log N), poll() is O(log N), peek() is O(1).',
    interviewTip:
      'Point out the `Integer.compare(a, b)` idiom over `a - b` to demonstrate senior-level defensive coding.',
  },
  {
    id: 'java-equals-hashcode',
    title: 'Custom Objects in HashSets/HashMaps: equals & hashCode',
    category: 'Collections Framework',
    description:
      'When storing custom pairs or coordinates in a Set or Map, overriding equals() without hashCode() breaks lookup silently.',
    keyRules: [
      'If two objects are equal according to equals(), they MUST have the same hashCode().',
      'Default Object.equals() compares reference identity (==), not field values.',
      'For coordinate pairs in graphs/grids, instead of creating a custom class, use a compact primitive key: `long key = (((long)r) << 32) | (c & 0xFFFFFFFFL);` or string `r + "," + c`.',
      'Or use Java 16+ `record Pair(int r, int c) {}` which automatically provides correct equals() and hashCode().',
    ],
    codeExample: `// Record with built-in equals & hashCode:
record Point(int x, int y) {}
Set<Point> visited = new HashSet<>();
visited.add(new Point(0, 0)); // Works cleanly!

// Or using primitive encoding for grid coordinates:
// R <= 1000, C <= 1000
int key = r * 1001 + c;
Set<Integer> visitedGrid = new HashSet<>();`,
    complexityCost:
      'Correct hashCode prevents bucket degradation from O(1) to O(N). Primitive encoding avoids heap allocation altogether.',
    interviewTip:
      'In grid BFS, using `r * cols + c` or a 2D boolean array `boolean[][] visited` is faster and cleaner than hashing Point objects.',
  },
  {
    id: 'java-recursion-stack-safety',
    title: 'Recursion Depth, Stack Overflow & Fast I/O',
    category: 'Recursion & Stack',
    description:
      'Understanding Java JVM call-stack limitations (default ~5,000 to 10,000 frames) and when to convert recursion to iteration.',
    keyRules: [
      'Standard JVM call stack throws StackOverflowError if recursion depth exceeds ~10,000 frames.',
      'On platforms with deep recursion (e.g. DFS on degenerate linked list or trees with N = 10^5), recursion WILL fail without increasing stack size.',
      'Convert deep DFS to iterative DFS with an explicit `ArrayDeque<Integer>` stack or use BFS.',
      'Fast Input/Output in online assessments: Use `BufferedReader` and `StringTokenizer` instead of `Scanner`. Scanner does regex parsing on every token and is 10x slower.',
    ],
    codeExample: `// Fast I/O template for online tests:
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
StringTokenizer st = new StringTokenizer(br.readLine());
int n = Integer.parseInt(st.nextToken());

// Converting deep recursive DFS to Iterative:
Deque<Integer> stack = new ArrayDeque<>();
boolean[] visited = new boolean[n];
stack.push(start);
while (!stack.isEmpty()) {
    int u = stack.pop();
    if (visited[u]) continue;
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (!visited[v]) stack.push(v);
    }
}`,
    complexityCost:
      'Call stack uses O(depth) memory. Explicit stack uses JVM heap, avoiding thread stack limitations.',
    interviewTip:
      'Always mention recursion stack space in your auxiliary space complexity analysis: "Space complexity is O(H) where H is tree height for the recursion call stack."',
  },
];
