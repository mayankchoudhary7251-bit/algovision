-- ============================================================
-- V3 — Seed algorithm topics
-- ============================================================

INSERT INTO topics (id, slug, name, category, difficulty, description, time_complexity, space_complexity) VALUES
(gen_random_uuid(), 'bubble-sort', 'Bubble Sort', 'SORTING', 'BEGINNER', 'Repeatedly compare adjacent elements and swap if out of order.', '{"best":"O(n)","average":"O(n²)","worst":"O(n²)"}', 'O(1)'),
(gen_random_uuid(), 'selection-sort', 'Selection Sort', 'SORTING', 'BEGINNER', 'Find the minimum element and place it at the beginning.', '{"best":"O(n²)","average":"O(n²)","worst":"O(n²)"}', 'O(1)'),
(gen_random_uuid(), 'insertion-sort', 'Insertion Sort', 'SORTING', 'BEGINNER', 'Build sorted array one element at a time by insertion.', '{"best":"O(n)","average":"O(n²)","worst":"O(n²)"}', 'O(1)'),
(gen_random_uuid(), 'merge-sort', 'Merge Sort', 'SORTING', 'INTERMEDIATE', 'Divide and conquer: split, sort recursively, merge.', '{"best":"O(n log n)","average":"O(n log n)","worst":"O(n log n)"}', 'O(n)'),
(gen_random_uuid(), 'quick-sort', 'Quick Sort', 'SORTING', 'INTERMEDIATE', 'Pick a pivot, partition array, recurse on sub-arrays.', '{"best":"O(n log n)","average":"O(n log n)","worst":"O(n²)"}', 'O(log n)'),
(gen_random_uuid(), 'heap-sort', 'Heap Sort', 'SORTING', 'INTERMEDIATE', 'Build a max heap and repeatedly extract the maximum.', '{"best":"O(n log n)","average":"O(n log n)","worst":"O(n log n)"}', 'O(1)'),
(gen_random_uuid(), 'binary-search', 'Binary Search', 'SEARCHING', 'BEGINNER', 'Search sorted array by repeatedly halving the search space.', '{"best":"O(1)","average":"O(log n)","worst":"O(log n)"}', 'O(1)'),
(gen_random_uuid(), 'bfs', 'Breadth First Search', 'GRAPHS', 'INTERMEDIATE', 'Explore graph level by level using a queue.', '{"best":"O(V+E)","average":"O(V+E)","worst":"O(V+E)"}', 'O(V)'),
(gen_random_uuid(), 'dfs', 'Depth First Search', 'GRAPHS', 'INTERMEDIATE', 'Explore graph by going as deep as possible before backtracking.', '{"best":"O(V+E)","average":"O(V+E)","worst":"O(V+E)"}', 'O(V)'),
(gen_random_uuid(), 'dijkstra', 'Dijkstra''s Algorithm', 'GRAPHS', 'ADVANCED', 'Find shortest path in weighted graph using a priority queue.', '{"best":"O(V log V)","average":"O(V log V)","worst":"O(V log V)"}', 'O(V)'),
(gen_random_uuid(), 'binary-search-tree', 'Binary Search Tree', 'TREES', 'BEGINNER', 'Tree where left child < node < right child.', '{"best":"O(log n)","average":"O(log n)","worst":"O(n)"}', 'O(n)'),
(gen_random_uuid(), 'avl-tree', 'AVL Tree', 'TREES', 'ADVANCED', 'Self-balancing BST that maintains height balance.', '{"best":"O(log n)","average":"O(log n)","worst":"O(log n)"}', 'O(n)'),
(gen_random_uuid(), 'fibonacci-dp', 'Fibonacci (DP)', 'DYNAMIC_PROGRAMMING', 'BEGINNER', 'Compute Fibonacci using memoization or tabulation.', '{"best":"O(n)","average":"O(n)","worst":"O(n)"}', 'O(n)'),
(gen_random_uuid(), 'knapsack', '0/1 Knapsack', 'DYNAMIC_PROGRAMMING', 'ADVANCED', 'Maximize value with weight constraint using DP table.', '{"best":"O(nW)","average":"O(nW)","worst":"O(nW)"}', 'O(nW)');