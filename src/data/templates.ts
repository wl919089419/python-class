import { CodeTemplate } from '../types';

export const GESP_TEMPLATES: CodeTemplate[] = [
  {
    id: 'tpl-fast-input-map',
    title: '单行读取多个整数 (GESP 必考第一神技)',
    gespLevel: 'GESP 1-3级必考',
    category: '输入输出',
    summary: '一行内有多个用空格隔开的数字（如 10 20 或 a b c），考级题目中 90% 都是这种输入格式！',
    code: `# 方式 1: 确定只有两个数字时，直接解包赋值
a, b = map(int, input().split())

# 方式 2: 如果一行有未知个数的数字（例如给出一个数列），转为列表存储
nums = list(map(int, input().split()))

# 示例：计算两数之和
print(a + b)`,
    explanation: 'input().split() 负责把一行文本以空格切成字符串列表，map(int, ...) 统一将每个小字符串变成真正的整数 int。如果写成 a, b = input().split()，输入 3 5 就会变成 "3" 和 "5"，做加法会变成 "35"！',
    pitfall: '千万不要漏掉 map 或 int！也不要在 input() 里写提示语如 input("请输入:")，考级自动测评系统会把提示语当作错误输出判 0 分！',
  },
  {
    id: 'tpl-multi-line-input',
    title: '读取 N 行多组数据标准模板',
    gespLevel: 'GESP 2-4级必考',
    category: '输入输出',
    summary: '题目第一行给出一个整数 N，接下来有 N 行数字，需要循环读取并统计或存入列表。',
    code: `# 第一行输入数据组数 n
n = int(input())

# 方式 1: 边读入边累加计算（节约内存）
total = 0
for _ in range(n):
    num = int(input())
    total += num
print(total)

# 方式 2: 全部读取到列表保存
data = []
for _ in range(n):
    data.append(int(input()))
print("最大值:", max(data))`,
    explanation: '用 int(input()) 获取 n，再用 for _ in range(n) 重复执行 n 次 input()。_ 是常用的循环占位符，表示我们只关心循环次数，不需要用到循环变量。',
    pitfall: '循环次数一定要是 range(n)，而不是 range(1, n)，因为 range(1, n) 只会执行 n-1 次，导致最后一行没有读入而引发 EOFError！',
  },
  {
    id: 'tpl-is-prime',
    title: '高效素数(质数)判断模板',
    gespLevel: 'GESP 3-5级必考',
    category: '数论与算法',
    summary: '判断一个正整数 n 是否为质数。只需检查到 √n 即可，效率提升百倍！',
    code: `def is_prime(n):
    # 1 和负数不是质数
    if n <= 1:
        return False
    # 2 和 3 是质数
    if n <= 3:
        return True
    # 排除所有偶数
    if n % 2 == 0:
        return False
    
    # 只需从 3 遍历到 int(n**0.5)，步长为 2 检查奇数因子
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

# 做题调用
num = int(input())
if is_prime(num):
    print("YES")
else:
    print("NO")`,
    explanation: '合数的因子必定是成对出现的（如 36 = 4 × 9），其中较小的因子一定小于或等于 √n。所以循环条件只需 i * i <= n，复杂度为 O(√n)。',
    pitfall: '1 既不是质数也不是合数！2 是唯一的偶质数。很多同学容易漏掉 n <= 1 返回 False 的特判。',
  },
  {
    id: 'tpl-gcd-lcm',
    title: '辗转相除法求最大公约数 (GCD) 与最小公倍数 (LCM)',
    gespLevel: 'GESP 3-5级必考',
    category: '数论与算法',
    summary: '欧几里得经典算法，两行搞定 GCD，再通过 a * b // gcd 求得 LCM。',
    code: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def lcm(a, b):
    # 两数之积除以最大公约数即为最小公倍数 (用 // 整除)
    return (a * b) // gcd(a, b)

# GESP 常见：化简分数或公倍数应用
x, y = map(int, input().split())
print("最大公约数:", gcd(x, y))
print("最小公倍数:", lcm(x, y))`,
    explanation: '辗转相除法的核心在于 gcd(a, b) = gcd(b, a % b)。当余数为 0 时，当前的 a 即为最大公约数。Python 内置也有 math.gcd(a, b)。',
    pitfall: '求 LCM 时一定要用 // 整除符号！如果用 / 单斜杠会变成浮点数 float（如 12.0），考级判题系统会因为末尾多出的 .0 判格式错误！',
  },
  {
    id: 'tpl-grid-init',
    title: '二维列表矩阵初始化避坑模板 (防连环篡改)',
    gespLevel: 'GESP 4-6级必考',
    category: '容器与数据结构',
    summary: '创建 n 行 m 列初始值为 0 的二维数组，千万不能用 [[0]*m]*n 浅拷贝乘法！',
    code: `n, m = map(int, input().split()) # n 行 m 列

# ❌ 错误写法（考级血泪大坑）：
# grid = [[0] * m] * n 
# 这样会导致所有行指向同一内存地址，改一个格整列全变！

# ✅ 正确写法：使用列表推导式独立创建每一行
grid = [[0] * m for _ in range(n)]

# 二维矩阵读取输入 (连续读取 n 行，每行 m 个数字)
for i in range(n):
    grid[i] = list(map(int, input().split()))

# 遍历二维矩阵
for r in range(n):
    for c in range(m):
        print(f"{grid[r][c]:3d}", end=" ")
    print() # 换行`,
    explanation: '[[0]*m for _ in range(n)] 为每一行独立开辟了一个新的列表对象，相互之间完全隔离修改不会互相影响。',
    pitfall: '千万牢记：二维列表外层千万别用乘法 * n！必须用列表推导式 for _ in range(n)。',
  },
  {
    id: 'tpl-binary-search',
    title: '二分查找标准模板 (左闭右闭区间)',
    gespLevel: 'GESP 5-7级必考',
    category: '算法与查找',
    summary: '在有序数组中以 O(log n) 的极速找到目标值或插入位置。',
    code: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1 # 左闭右闭区间 [left, right]
    
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid # 找到了，返回下标
        elif nums[mid] < target:
            left = mid + 1 # 目标在右半区
        else:
            right = mid - 1 # 目标在左半区
            
    return -1 # 未找到

# 必须先确保数组有序！
arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7)) # 输出: 3`,
    explanation: '关键在于区间定义与循环条件 left <= right。每次折半排除一半可能，100万个数字只要比较 20 次就能找到！',
    pitfall: '二分查找的前提条件是：数组必须已经排好序！如果题目给的是乱序列表，必须先调用 arr.sort()。',
  },
  {
    id: 'tpl-dfs-recursion',
    title: '深度优先搜索 (DFS) 基础全排列 / 走迷宫模板',
    gespLevel: 'GESP 6-8级必考',
    category: '搜索与回溯',
    summary: '穷举所有可能路径的经典回溯框架：“选择 -> 递归 -> 撤销选择”。',
    code: `def dfs(step, n, visited, path, result):
    # 终止条件：当收集齐 n 个数字时，记录一条完整路径
    if step == n:
        result.append(path.copy())
        return
        
    for i in range(1, n + 1):
        if not visited[i]:
            visited[i] = True
            path.append(i)
            # 深入下一层
            dfs(step + 1, n, visited, path, result)
            # 回溯：撤销选择，恢复现场
            path.pop()
            visited[i] = False

# 生成 1~n 的全排列
n = 3
visited = [False] * (n + 1)
result = []
dfs(0, n, visited, [], result)
for p in result:
    print(p)`,
    explanation: '递归深入到底后，必须通过 path.pop() 和 visited[i] = False 恢复现场，才能让同层的其他分支继续探索。',
    pitfall: '在 Python 中向结果集添加路径时，必须用 path.copy() 或 path[:]，如果写 result.append(path)，最后会变成一堆空列表！',
  },
  {
    id: 'tpl-bfs-queue',
    title: '广度优先搜索 (BFS) 最短步数模板',
    gespLevel: 'GESP 6-8级必考',
    category: '搜索与图论',
    summary: '利用队列 collections.deque 逐层波浪式向外扩散，最先到达终点的一定是最短路径！',
    code: `from collections import deque

def bfs_shortest_path(start, target, graph):
    queue = deque([(start, 0)]) # (当前节点, 当前步数)
    visited = {start}
    
    while queue:
        current, steps = queue.popleft() # 队首出队
        if current == target:
            return steps # 找到终点，即为最短步数！
            
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, steps + 1))
                
    return -1 # 无法到达终点`,
    explanation: 'BFS 保证层级由小到大被处理，只要第一次遇到目标节点，所记录的 steps 必然是最短步数。',
    pitfall: '一定要在将节点放进队列 queue.append() 的同时就加入 visited！如果等出队才标记 visited，会导致大量重复入队爆内存超内存限制(MLE)！',
  },
  {
    id: 'tpl-dp-knapsack',
    title: '0-1 背包动态规划一维数组滚动优化模板',
    gespLevel: 'GESP 7-8级必考',
    category: '动态规划',
    summary: '背包容量 W，N 件物品，每件物品重量 weights[i]，价值 values[i]，求最大总价值。',
    code: `# n 物品数, w 背包承重
n, w = map(int, input().split())
weights = []
values = []
for _ in range(n):
    wt, val = map(int, input().split())
    weights.append(wt)
    values.append(val)

# dp[j] 表示容量为 j 时的最大总价值
dp = [0] * (w + 1)

for i in range(n):
    # 关键：逆序倒序遍历容量，防止同一件物品被多次选择！
    for j in range(w, weights[i] - 1, -1):
        dp[j] = max(dp[j], dp[j - weights[i]] + values[i])

print(dp[w])`,
    explanation: '一维数组优化的核心在于内层循环必须从大到小倒着遍历（w 到 weights[i]），这样用到的 dp[j - weights[i]] 才是未被当前物品更新过的上一轮状态。',
    pitfall: '如果是 0-1 背包（每件物品只能选一次），必须逆序；如果是完全背包（物品可无限选），则必须正序遍历！千万别记反了。',
  },
];
