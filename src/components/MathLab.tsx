import React, { useState } from 'react';
import { PythonCodeView } from './PythonCodeBlock';

// Helper for GCD & LCM
function calcGcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function calcLcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return (a * b) / calcGcd(a, b);
}

// Helper for Factorial
function calcFactorial(n: number): { result: number | string; formula: string; isError: boolean } {
  if (n < 0 || !Number.isInteger(n)) {
    return { result: 'ValueError: factorial() only accepts non-negative integers', formula: '', isError: true };
  }
  if (n > 20) {
    return { result: '数值过大 (Python 支持任意大整数，此处演示截断)', formula: `${n}! = ${n} × ... × 1`, isError: false };
  }
  let res = 1;
  const parts: number[] = [];
  for (let i = n; i >= 1; i--) {
    res *= i;
    if (parts.length < 5) parts.push(i);
  }
  const formula = n === 0 ? '0! = 1 (数学与考级硬性规定)' : n <= 5 ? `${parts.join(' × ')} = ${res}` : `${parts.join(' × ')} × ... × 1 = ${res}`;
  return { result: res, formula, isError: false };
}

// Check prime helper
function checkPrime(n: number): { isPrime: boolean; checks: number[]; divisors: number[]; limit: number } {
  if (n <= 1) return { isPrime: false, checks: [], divisors: [1], limit: 1 };
  if (n === 2 || n === 3) return { isPrime: true, checks: [], divisors: [1, n], limit: Math.floor(Math.sqrt(n)) };
  if (n % 2 === 0) return { isPrime: false, checks: [2], divisors: [1, 2, n / 2, n], limit: Math.floor(Math.sqrt(n)) };

  const limit = Math.floor(Math.sqrt(n));
  const checks: number[] = [];
  const divisors: number[] = [1, n];

  for (let i = 3; i <= limit; i += 2) {
    checks.push(i);
    if (n % i === 0) {
      divisors.push(i);
      if (i * i !== n) divisors.push(n / i);
      divisors.sort((a, b) => a - b);
      return { isPrime: false, checks, divisors, limit };
    }
  }

  return { isPrime: true, checks, divisors, limit };
}

export const MathLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sqrt_isqrt' | 'rounding' | 'gcd_lcm' | 'factorial_dist_pi' | 'precision_pitfalls'>('sqrt_isqrt');

  // Tab 1: Sqrt state
  const [sqrtInput, setSqrtInput] = useState<number>(50);

  // Tab 2: Rounding state
  const [roundInput, setRoundInput] = useState<number>(3.2);
  const [busStudents, setBusStudents] = useState<number>(45);
  const [busCapacity, setBusCapacity] = useState<number>(10);

  // Tab 3: GCD / LCM state
  const [gcdA, setGcdA] = useState<number>(24);
  const [gcdB, setGcdB] = useState<number>(36);

  // Tab 4: Geometry, Pi & Factorial state
  const [radius, setRadius] = useState<number>(5);
  const [p1X, setP1X] = useState<number>(0);
  const [p1Y, setP1Y] = useState<number>(0);
  const [p2X, setP2X] = useState<number>(3);
  const [p2Y, setP2Y] = useState<number>(4);
  const [factN, setFactN] = useState<number>(5);

  // Tab 5: Precision state
  const [floatA, setFloatA] = useState<number>(0.1);
  const [floatB, setFloatB] = useState<number>(0.2);

  // Compute Current Experiment Details
  const getExperimentData = () => {
    switch (activeTab) {
      case 'sqrt_isqrt': {
        const isNegative = sqrtInput < 0;
        const sqrtVal = isNegative ? NaN : Math.sqrt(sqrtInput);
        const isqrtVal = isNegative ? NaN : Math.floor(sqrtVal);
        const primeInfo = !isNegative && Number.isInteger(sqrtInput) ? checkPrime(sqrtInput) : null;

        const code = `import math

# 1. 浮点数开方 math.sqrt() vs 整数开方 math.isqrt()
n = ${sqrtInput}
${isNegative ? `# ⚠️ 负数不能开平方！直接调用会报 ValueError\n# math.sqrt(n) -> ValueError: math domain error` : `root_float = math.sqrt(n)   # 浮点平方根 (带小数)
root_int = math.isqrt(n)     # 整数平方根 (直接向下取整到 int, Python 3.8+)
print("math.sqrt(n)  =", root_float)
print("math.isqrt(n) =", root_int)
print("int(math.sqrt(n)) =", int(root_float))`}

# 2. GESP 质数/素数高效判定应用 (只需遍历到 √n)
# 遍历上限: range(2, int(math.sqrt(n)) + 1)
def is_prime(x):
    if x <= 1: return False
    for i in range(2, int(math.sqrt(x)) + 1):
        if x % i == 0:
            return False
    return True

print(f"{n} 是质数吗?", is_prime(${isNegative ? 7 : sqrtInput}))`;

        const output = isNegative
          ? `ValueError: math domain error (负数 ${sqrtInput} 没有实数平方根！)\n\n提示: 考级中遇到输入可能为负时，必须先 if n < 0 特判！`
          : `math.sqrt(n)  = ${sqrtVal}\nmath.isqrt(n) = ${isqrtVal}\nint(math.sqrt(n)) = ${isqrtVal}\n${sqrtInput} 是质数吗? ${primeInfo?.isPrime ? 'True (质数 ⭐)' : 'False (合数)'}`;

        return { code, output, isNegative, sqrtVal, isqrtVal, primeInfo };
      }

      case 'rounding': {
        const ceilVal = Math.ceil(roundInput);
        const floorVal = Math.floor(roundInput);
        const truncVal = Math.trunc(roundInput);
        const roundVal = Math.round(roundInput);

        const neededBuses = Math.ceil(busStudents / busCapacity);
        const wrongBuses = Math.floor(busStudents / busCapacity);
        const intFormulaBuses = Math.floor((busStudents + busCapacity - 1) / busCapacity);

        const code = `import math

x = ${roundInput}

# 1. 取整三剑客行为对比
print("原值 x =", x)
print("math.ceil(x)  =", math.ceil(x))   # 向上取整(天花板，往正无穷靠)
print("math.floor(x) =", math.floor(x))  # 向下取整(地板，往负无穷靠)
print("math.trunc(x) =", math.trunc(x))  # 向零截断(直接砍掉小数, 等价 int(x))
print("round(x)       =", round(x))        # 四舍五入

# 2. GESP 经典考题：${busStudents} 名学生租车，每车限乘 ${busCapacity} 人
students = ${busStudents}
capacity = ${busCapacity}
# ❌ 错误写法: students // capacity -> 算出来是 ${wrongBuses} 辆 (剩 ${busStudents % busCapacity} 人走着去！)
# ✅ 正确写法 1: math.ceil(students / capacity)
# ✅ 正确写法 2 (整除神技): (students + capacity - 1) // capacity
cars = math.ceil(students / capacity)
print(f"最少需要租 {cars} 辆车")`;

        const output = `原值 x = ${roundInput}\nmath.ceil(x)  = ${ceilVal}\nmath.floor(x) = ${floorVal}\nmath.trunc(x) = ${truncVal}\nround(x)       = ${roundVal}\n最少需要租 ${neededBuses} 辆车`;

        return { code, output, ceilVal, floorVal, truncVal, roundVal, neededBuses, wrongBuses, intFormulaBuses };
      }

      case 'gcd_lcm': {
        const gcdVal = calcGcd(gcdA, gcdB);
        const lcmVal = calcLcm(gcdA, gcdB);
        const product = Math.abs(gcdA * gcdB);

        const code = `import math

a = ${gcdA}
b = ${gcdB}

# 1. 最大公约数 math.gcd() (Greatest Common Divisor)
g = math.gcd(a, b)
print(f"gcd({a}, {b}) =", g)

# 2. 最小公倍数 math.lcm() (Least Common Multiple, Python 3.9+)
# 如果平台 Python 版本较低，可写: (a * b) // math.gcd(a, b)
l = math.lcm(a, b)
print(f"lcm({a}, {b}) =", l)

# 3. 黄金恒等式：两数之积 == gcd * lcm
print(f"{a} * {b} =", a * b)
print(f"gcd * lcm =", g * l)

# 4. 做题实战：最简分数化简 (如 ${gcdA}/${gcdB})
print(f"化简前: {a}/{b} -> 化简后最简分数: {a // g}/{b // g}")`;

        const output = `gcd(${gcdA}, ${gcdB}) = ${gcdVal}\nlcm(${gcdA}, ${gcdB}) = ${lcmVal}\n${gcdA} * ${gcdB} = ${product}\ngcd * lcm = ${gcdVal * lcmVal}\n化简前: ${gcdA}/${gcdB} -> 化简后最简分数: ${Math.floor(gcdA / gcdVal)}/${Math.floor(gcdB / gcdVal)}`;

        return { code, output, gcdVal, lcmVal, product };
      }

      case 'factorial_dist_pi': {
        const factRes = calcFactorial(factN);
        const circumference = 2 * Math.PI * radius;
        const area = Math.PI * radius * radius;
        const distVal = Math.hypot(p2X - p1X, p2Y - p1Y);

        const code = `import math

# 1. 阶乘函数 math.factorial(n)
n = ${factN}
print(f"{n}! =", math.factorial(n))
print("0! =", math.factorial(0))  # 考级常考：0的阶乘是 1

# 2. 圆周率 math.pi 几何计算 (半径 r = ${radius})
r = ${radius}
perimeter = 2 * math.pi * r
area = math.pi * r ** 2
print(f"圆周长: {perimeter:.2f}")
print(f"圆面积: {area:.2f}")

# 3. 两点间欧式距离 math.dist(p, q) (Python 3.8+)
# 等价于 sqrt((x2 - x1)**2 + (y2 - y1)**2)
p1 = (${p1X}, ${p1Y})
p2 = (${p2X}, ${p2Y})
d = math.dist(p1, p2)
print(f"点 {p1} 与 点 {p2} 的平面距离 =", d)`;

        const output = `${factN}! = ${factRes.result}\n0! = 1\n圆周长: ${circumference.toFixed(2)}\n圆面积: ${area.toFixed(2)}\n点 (${p1X}, ${p1Y}) 与 点 (${p2X}, ${p2Y}) 的平面距离 = ${distVal.toFixed(4)}`;

        return { code, output, factRes, circumference, area, distVal };
      }

      case 'precision_pitfalls': {
        const sumVal = floatA + floatB;
        const isExactEqual = sumVal === 0.3;
        const isCloseEqual = Math.abs(sumVal - 0.3) < 1e-9;
        const actualStr = (floatA + floatB).toString();

        const code = `import math

# 🚨 GESP 考级第 1 题判断题最爱考：
# "0.1 + 0.2 == 0.3 的结果是 True 还是 False？"
a = ${floatA}
b = ${floatB}
print("a + b 的表面结果:", a + b)
print("a + b 的真实精确值:", f"{a + b:.17f}")
print("a + b == 0.3 ?", a + b == 0.3)  # 答案是 False！

# ✅ 正确比较姿势：math.isclose() 允许极微小的舍入误差
print("math.isclose(a + b, 0.3) ?", math.isclose(a + b, 0.3))  # True！

# 绝对值对比：内置 abs() vs math.fabs()
print("abs(-5)       =", abs(-5))       # 返回整型 int 5
print("math.fabs(-5) =", math.fabs(-5)) # 强制返回浮点型 float 5.0`;

        const output = `a + b 的表面结果: ${sumVal}\na + b 的真实精确值: ${(floatA + floatB).toFixed(17)}\na + b == 0.3 ? ${isExactEqual ? 'True' : 'False (惊天大陷阱！)'}\nmath.isclose(a + b, 0.3) ? True\nabs(-5)       = 5\nmath.fabs(-5) = 5.0`;

        return { code, output, sumVal, isExactEqual, isCloseEqual, actualStr };
      }
    }
  };

  const expData = getExperimentData();

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
            <i className="fa-solid fa-square-root-variable"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                math 库常用函数全能实验室
              </h3>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                GESP 1-4 级提速神器
              </span>
            </div>
            <p className="text-xs text-slate-500">
              只需一句 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-indigo-700">import math</code>，解锁开方、取整、最大公约数、几何距离超能力！
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('sqrt_isqrt')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sqrt_isqrt'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌿 平方根与素数 (sqrt/isqrt)
          </button>
          <button
            onClick={() => setActiveTab('rounding')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rounding'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏢 取整三剑客与租车题 (ceil/floor)
          </button>
          <button
            onClick={() => setActiveTab('gcd_lcm')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'gcd_lcm'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🤝 最大公约与最小公倍 (gcd/lcm)
          </button>
          <button
            onClick={() => setActiveTab('factorial_dist_pi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'factorial_dist_pi'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 阶乘与几何 (fact/dist/pi)
          </button>
          <button
            onClick={() => setActiveTab('precision_pitfalls')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'precision_pitfalls'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚖️ 浮点精度防坑 (0.1+0.2/isclose)
          </button>
        </div>
      </div>

      {/* Tab 1: Sqrt & Isqrt Content */}
      {activeTab === 'sqrt_isqrt' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200 pb-3">
              <div>
                <h4 className="font-extrabold text-indigo-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🌱 动态开平方根实验室：对比 math.sqrt() 与 math.isqrt()</span>
                </h4>
                <p className="text-xs text-indigo-800 mt-0.5">
                  修改待开方数值，观察浮点根、整数根以及素数判定遍历步数的巨大缩减：
                </p>
              </div>

              {/* Input & Presets */}
              <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-indigo-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700">数值 n:</span>
                <input
                  type="number"
                  value={sqrtInput}
                  onChange={(e) => setSqrtInput(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs font-mono font-bold text-center bg-indigo-50 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex space-x-1 pl-1 border-l border-slate-200">
                  {[25, 50, 97, 100, -16].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSqrtInput(val)}
                      className={`px-1.5 py-0.5 text-[10px] rounded font-bold cursor-pointer ${
                        val < 0 ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {val < 0 ? `${val}(报错)` : val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">1. math.sqrt(n) 浮点平方根</span>
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono">float</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-indigo-600">
                  {expData.isNegative ? '❌ 报错 ValueError' : (expData.sqrtVal as number).toFixed(6)}
                </div>
                <p className="text-slate-500 text-[11px]">
                  无论传入整数还是小数，返回值<strong>永远是浮点数 float</strong>！
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">2. math.isqrt(n) 整数平方根</span>
                  <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px] font-mono">int</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-emerald-600">
                  {expData.isNegative ? '❌ 报错 ValueError' : (expData.isqrtVal as number)}
                </div>
                <p className="text-slate-500 text-[11px]">
                  直接向下取整返回纯整数！等价于 <code className="bg-slate-100 px-1 font-bold">int(math.sqrt(n))</code>，不损失大数精度。
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">3. 质数判定步数压缩</span>
                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">考级必考</span>
                </div>
                <div className="text-base font-mono font-extrabold text-amber-700">
                  {expData.isNegative || sqrtInput <= 1
                    ? '无需判定'
                    : `仅需检查至 √${sqrtInput} ≈ ${Math.floor(Math.sqrt(sqrtInput))}`}
                </div>
                <p className="text-slate-500 text-[11px]">
                  普通循环需跑 {sqrtInput} 次，用 <code className="font-mono">sqrt</code> 仅需循环 {Math.floor(Math.sqrt(Math.max(1, sqrtInput)))} 次，速度提升百倍！
                </p>
              </div>
            </div>

            {/* Prime Factor Pair Symmetry Visualizer */}
            {!expData.isNegative && sqrtInput > 1 && (
              <div className="bg-white/90 p-3.5 rounded-xl border border-indigo-200 space-y-2">
                <div className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
                  <i className="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>为什么要开方？因数成对出现对称原理 (合数因数必定一小一大)：</span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  若 <code className="font-bold">{sqrtInput} = a × b</code>，较小的因子 <code className="font-bold">a</code> 一定满足 <code className="bg-indigo-50 text-indigo-700 font-mono px-1 rounded font-bold">a ≤ √{sqrtInput} (即 ≤ {(expData.isqrtVal as number)})</code>。
                  如果检查到 {(expData.isqrtVal as number)} 还没找到除得尽的因数，后半部分就绝对不可能有了！
                </div>
                <div className="bg-slate-50 p-2 rounded-lg font-mono text-[11px] text-slate-700">
                  当前数值 {sqrtInput} 的因子状态：{expData.primeInfo?.isPrime ? (
                    <span className="text-emerald-600 font-bold">只有 1 和自身，是质数！(Prime Number)</span>
                  ) : (
                    <span className="text-rose-600 font-bold">是合数！所有因数: [{expData.primeInfo?.divisors.join(', ')}]</span>
                  )}
                </div>
              </div>
            )}

            {/* Pitfall Box */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 leading-relaxed space-y-1">
              <div className="font-bold flex items-center space-x-1">
                <span>⚠️ GESP 考级致命坑点：</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><strong>左闭右开漏数坑</strong>：写 <code className="bg-white px-1 font-bold text-rose-600">range(2, int(math.sqrt(n)))</code> 会漏掉平方根本身！比如 $n=9$ 时 $\sqrt{9}=3$，`range(2, 3)` 只遍历了 2，导致 9 被误判为质数！必须加 1 写成 <code className="bg-white px-1 font-bold text-emerald-700">range(2, int(math.sqrt(n)) + 1)</code>！</li>
                <li><strong>负数报错坑</strong>：负数没有实数平方根，<code className="bg-white px-1 font-bold text-rose-600">math.sqrt(-5)</code> 直接闪退崩溃，抛出 <code className="font-mono">ValueError: math domain error</code>！</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rounding Functions (ceil, floor, trunc) */}
      {activeTab === 'rounding' && (
        <div className="space-y-4">
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-3">
              <div>
                <h4 className="font-extrabold text-amber-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🏢 取整四兄弟对比条：ceil(向上) vs floor(向下) vs trunc(向零) vs round(四舍六入)</span>
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  输入正数或负数，实时观察不同取整函数的数轴方向差异：
                </p>
              </div>

              {/* Quick Input Controls */}
              <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-amber-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700">测试值 x:</span>
                <input
                  type="number"
                  step="0.1"
                  value={roundInput}
                  onChange={(e) => setRoundInput(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs font-mono font-bold text-center bg-amber-50 border border-amber-300 rounded focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex flex-wrap gap-1 pl-1 border-l border-slate-200">
                  {[3.2, 3.8, -2.3, -2.8, 2.5, 3.5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRoundInput(val)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded font-bold cursor-pointer text-slate-700"
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Cards Comparison */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border-2 border-indigo-200 space-y-1 shadow-2xs">
                <span className="font-bold text-indigo-900 block">math.ceil(x) 天花板</span>
                <span className="text-[10px] text-slate-500">向 +∞ 正方向进位</span>
                <div className="text-xl font-mono font-black text-indigo-600">
                  {Math.ceil(roundInput)}
                </div>
                <p className="text-slate-500 text-[10px]">大于或等于 x 的最小整数</p>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-emerald-200 space-y-1 shadow-2xs">
                <span className="font-bold text-emerald-900 block">math.floor(x) 地板</span>
                <span className="text-[10px] text-slate-500">向 -∞ 负方向退位</span>
                <div className="text-xl font-mono font-black text-emerald-600">
                  {Math.floor(roundInput)}
                </div>
                <p className="text-slate-500 text-[10px]">小于或等于 x 的最大整数</p>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-purple-200 space-y-1 shadow-2xs">
                <span className="font-bold text-purple-900 block">math.trunc(x) / int(x)</span>
                <span className="text-[10px] text-slate-500">向 0 截断小数</span>
                <div className="text-xl font-mono font-black text-purple-600">
                  {Math.trunc(roundInput)}
                </div>
                <p className="text-slate-500 text-[10px]">直接砍掉小数点后所有数字</p>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-amber-200 space-y-1 shadow-2xs">
                <span className="font-bold text-amber-900 block">round(x) 内置函数</span>
                <span className="text-[10px] text-slate-500">银行家舍入</span>
                <div className="text-xl font-mono font-black text-amber-600">
                  {Math.round(roundInput)}
                </div>
                <p className="text-slate-500 text-[10px]">四舍六入五成双 (奇进偶舍)</p>
              </div>
            </div>

            {/* Special Application: Bus / Boat Division Simulator */}
            <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm">🚌</span>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    做题高频应用：学生租车/坐船/切西瓜（有余数必须加一辆车！）
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-slate-600">总人数:</span>
                  <input
                    type="number"
                    min="1"
                    value={busStudents}
                    onChange={(e) => setBusStudents(Math.max(1, Number(e.target.value)))}
                    className="w-14 px-1.5 py-0.5 font-mono text-center bg-amber-50 border border-amber-200 rounded font-bold"
                  />
                  <span className="font-bold text-slate-600">每车限乘:</span>
                  <input
                    type="number"
                    min="1"
                    value={busCapacity}
                    onChange={(e) => setBusCapacity(Math.max(1, Number(e.target.value)))}
                    className="w-14 px-1.5 py-0.5 font-mono text-center bg-amber-50 border border-amber-200 rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-800">❌ 错误写法: students // capacity</span>
                  <div className="text-rose-600 font-mono font-bold">
                    {busStudents} // {busCapacity} = {Math.floor(busStudents / busCapacity)} 辆车
                  </div>
                  <p className="text-rose-700 text-[11px]">
                    整除会把多出来的 {busStudents % busCapacity} 个人丢下！评测判 0 分！
                  </p>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-800">✅ 正确写法 1: math.ceil(students / capacity)</span>
                  <div className="text-emerald-700 font-mono font-bold">
                    math.ceil({busStudents} / {busCapacity}) = {Math.ceil(busStudents / busCapacity)} 辆车！
                  </div>
                  <p className="text-emerald-700 text-[11px]">
                    只要除不尽，天花板向上进位，全员安全上车！
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
                <span>
                  💡 <strong>免导包的考级整除技巧</strong>：<code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-indigo-700">(n + k - 1) // k</code> 也能完美向上取整！({busStudents} + {busCapacity} - 1) // {busCapacity} = {Math.floor((busStudents + busCapacity - 1) / busCapacity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: GCD & LCM */}
      {activeTab === 'gcd_lcm' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🤝 最大公约数 math.gcd() 与 最小公倍数 math.lcm()</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  输入两个正整数，秒杀约分、齿轮齿数同步与通分计算：
                </p>
              </div>

              {/* Inputs & Quick Test Presets */}
              <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700">a:</span>
                <input
                  type="number"
                  min="1"
                  value={gcdA}
                  onChange={(e) => setGcdA(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-1.5 py-1 text-xs font-mono font-bold text-center bg-emerald-50 border border-emerald-300 rounded"
                />
                <span className="text-xs font-bold text-slate-700">b:</span>
                <input
                  type="number"
                  min="1"
                  value={gcdB}
                  onChange={(e) => setGcdB(Math.max(1, Number(e.target.value)))}
                  className="w-16 px-1.5 py-1 text-xs font-mono font-bold text-center bg-emerald-50 border border-emerald-300 rounded"
                />
                <div className="flex space-x-1 pl-1 border-l border-slate-200">
                  {[
                    [24, 36],
                    [12, 18],
                    [7, 13],
                    [15, 25],
                  ].map(([x, y]) => (
                    <button
                      key={`${x}-${y}`}
                      type="button"
                      onClick={() => { setGcdA(x); setGcdB(y); }}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded font-bold cursor-pointer text-slate-700"
                    >
                      {x},{y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Computation Display Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">最大公约数 math.gcd(a, b)</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">GCD</span>
                </div>
                <div className="text-2xl font-mono font-black text-emerald-600">
                  {calcGcd(gcdA, gcdB)}
                </div>
                <p className="text-slate-500 text-[11px]">
                  能同时整除 {gcdA} 和 {gcdB} 的最大正整数。
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950">最小公倍数 math.lcm(a, b)</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">LCM</span>
                </div>
                <div className="text-2xl font-mono font-black text-indigo-600">
                  {calcLcm(gcdA, gcdB)}
                </div>
                <p className="text-slate-500 text-[11px]">
                  同时是 {gcdA} 和 {gcdB} 倍数的最小正整数。
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">最简分数化简</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">实战解法</span>
                </div>
                <div className="text-lg font-mono font-black text-amber-700">
                  {gcdA}/{gcdB} = {gcdA / calcGcd(gcdA, gcdB)}/{gcdB / calcGcd(gcdA, gcdB)}
                </div>
                <p className="text-slate-500 text-[11px]">
                  分子分母同除以最大公约数 g 即得最简形式！
                </p>
              </div>
            </div>

            {/* Formula Notice */}
            <div className="bg-emerald-100/70 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <span>
                ⭐ <strong>数论黄金等式</strong>：两数之积恒等于公约数与公倍数之积！<code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-emerald-800">a * b == gcd(a, b) * lcm(a, b)</code>
              </span>
              <span className="text-[11px] font-mono text-emerald-800 font-bold hidden sm:inline">
                {gcdA} × {gcdB} = {calcGcd(gcdA, gcdB)} × {calcLcm(gcdA, gcdB)} = {gcdA * gcdB}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Factorial, Distance & Pi */}
      {activeTab === 'factorial_dist_pi' && (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 sm:p-5 space-y-4">
            <h4 className="font-extrabold text-purple-950 text-sm sm:text-base border-b border-purple-200 pb-3 flex items-center space-x-1.5">
              <span>🎯 阶乘 math.factorial()、两点距离 math.dist() 与圆周率 math.pi</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Factorial Module */}
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-purple-900">1. math.factorial(n) 阶乘</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-500">n:</span>
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={factN}
                      onChange={(e) => setFactN(Math.max(0, Math.min(15, Number(e.target.value))))}
                      className="w-12 px-1 py-0.5 text-xs font-mono font-bold text-center bg-purple-50 border border-purple-200 rounded"
                    />
                  </div>
                </div>
                <div className="text-xl font-mono font-black text-purple-700">
                  {factN}! = {calcFactorial(factN).result}
                </div>
                <p className="text-slate-500 text-[11px] font-mono leading-relaxed">
                  {calcFactorial(factN).formula}
                </p>
                <div className="text-[10px] bg-purple-50 text-purple-800 p-1.5 rounded font-bold">
                  ⚠️ 考级特判：0! = 1（千万不要答 0！）
                </div>
              </div>

              {/* Pi Module */}
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-purple-900">2. math.pi 几何常数</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[11px] text-slate-500">半径 r:</span>
                    <input
                      type="number"
                      min="1"
                      value={radius}
                      onChange={(e) => setRadius(Math.max(1, Number(e.target.value)))}
                      className="w-12 px-1 py-0.5 text-xs font-mono font-bold text-center bg-purple-50 border border-purple-200 rounded"
                    />
                  </div>
                </div>
                <div className="text-xs font-mono space-y-1 text-slate-700">
                  <div>周长 C = 2πr = <span className="font-bold text-purple-700">{(2 * Math.PI * radius).toFixed(2)}</span></div>
                  <div>面积 S = πr² = <span className="font-bold text-purple-700">{(Math.PI * radius * radius).toFixed(2)}</span></div>
                </div>
                <p className="text-slate-500 text-[11px]">
                  比手写 3.14 精度更高，避免因近似误差导致单测用例无法通过！
                </p>
              </div>

              {/* Distance Module */}
              <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-purple-900">3. math.dist(p1, p2) 两点距离</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1 rounded font-mono">Python 3.8+</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  <div className="flex items-center space-x-1">
                    <span>A:</span>
                    <input
                      type="number"
                      value={p1X}
                      onChange={(e) => setP1X(Number(e.target.value))}
                      className="w-8 px-1 py-0.5 text-center bg-slate-50 border rounded"
                    />
                    <input
                      type="number"
                      value={p1Y}
                      onChange={(e) => setP1Y(Number(e.target.value))}
                      className="w-8 px-1 py-0.5 text-center bg-slate-50 border rounded"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>B:</span>
                    <input
                      type="number"
                      value={p2X}
                      onChange={(e) => setP2X(Number(e.target.value))}
                      className="w-8 px-1 py-0.5 text-center bg-slate-50 border rounded"
                    />
                    <input
                      type="number"
                      value={p2Y}
                      onChange={(e) => setP2Y(Number(e.target.value))}
                      className="w-8 px-1 py-0.5 text-center bg-slate-50 border rounded"
                    />
                  </div>
                </div>
                <div className="text-lg font-mono font-black text-purple-700">
                  dist = {Math.hypot(p2X - p1X, p2Y - p1Y).toFixed(3)}
                </div>
                <p className="text-slate-500 text-[10px]">
                  勾股定理自动计算，支持坐标元组或列表传入。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Precision & Pitfalls (0.1+0.2 == 0.3) */}
      {activeTab === 'precision_pitfalls' && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-3">
              <div>
                <h4 className="font-extrabold text-rose-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🚨 考级判断题必坑：0.1 + 0.2 == 0.3 竟然是 False？！</span>
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  底层 IEEE 754 浮点数二进制转换导致的精度微差，以及安全解决法：
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700">加数 1:</span>
                <input
                  type="number"
                  step="0.05"
                  value={floatA}
                  onChange={(e) => setFloatA(Number(e.target.value))}
                  className="w-14 px-1 py-0.5 text-xs font-mono text-center bg-rose-50 border border-rose-200 rounded font-bold"
                />
                <span className="text-xs font-bold text-slate-700">加数 2:</span>
                <input
                  type="number"
                  step="0.05"
                  value={floatB}
                  onChange={(e) => setFloatB(Number(e.target.value))}
                  className="w-14 px-1 py-0.5 text-xs font-mono text-center bg-rose-50 border border-rose-200 rounded font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Direct Comparison Failure */}
              <div className="bg-white p-3.5 rounded-xl border border-rose-300 space-y-2">
                <div className="font-bold text-rose-900 flex items-center justify-between">
                  <span>❌ 直接用 == 双等号比较 (致命判断题)</span>
                  <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded text-[10px]">判题 0 分</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-slate-200 space-y-1">
                  <div>&gt;&gt;&gt; a + b</div>
                  <div className="text-amber-300 font-bold">{(floatA + floatB).toFixed(17)}</div>
                  <div>&gt;&gt;&gt; a + b == 0.3</div>
                  <div className="text-rose-400 font-bold">&gt;&gt;&gt; False (因为末尾多出了 4！)</div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  计算机底层是二进制，十进制小数 0.1 和 0.2 在二进制中是无限循环小数，相加时产生了极其细微的舍入误差！
                </p>
              </div>

              {/* Safe Comparison Solution */}
              <div className="bg-white p-3.5 rounded-xl border border-emerald-300 space-y-2">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>✅ 正确解法: math.isclose() 容差比较</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">标准解法</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-slate-200 space-y-1">
                  <div>&gt;&gt;&gt; import math</div>
                  <div>&gt;&gt;&gt; math.isclose(a + b, 0.3)</div>
                  <div className="text-emerald-400 font-bold">&gt;&gt;&gt; True (完美判定相等！)</div>
                  <div className="text-slate-500 text-[10px]"># 默认允许 1e-09 以内的微小容差</div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  在编写几何、浮点数判等做题时，永远不要用 <code className="font-bold">==</code> 比较两个 float，推荐使用 <code className="font-bold text-emerald-700">math.isclose()</code>！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code & Simulated Console Display (Vertical Stacked Flow) */}
      <div className="flex flex-col gap-4">
        {/* Python Code Card */}
        <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-sans ml-1 text-slate-300">
                Python 3.12 代码实时生成
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(expData.code)}
              className="hover:text-white transition-colors cursor-pointer text-[11px]"
              title="复制这段代码"
            >
              <i className="fa-regular fa-copy mr-1"></i>复制
            </button>
          </div>
          <PythonCodeView code={expData.code} />
        </div>

        {/* Real-time Simulated Console */}
        <div className="bg-black rounded-xl p-4 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-terminal text-blue-400"></i>
              <span className="text-[11px] font-sans text-slate-300">模拟终端控制台输出 (Console)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-sans">● 实时同步中</span>
          </div>
          <div className="min-h-[80px] text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed py-1">
            {expData.output}
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

