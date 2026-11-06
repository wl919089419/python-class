import React, { useState } from 'react';
import { PythonCodeView } from './PythonCodeBlock';

// Python 3 Keywords
const PYTHON_KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from',
  'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
  'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield',
  'True', 'False', 'None'
]);

// Common Built-in Functions/Types to warn against shadowing
const PYTHON_BUILTINS = new Set([
  'print', 'input', 'int', 'float', 'str', 'list', 'dict', 'set', 'tuple',
  'len', 'type', 'sum', 'max', 'min', 'map', 'range', 'abs', 'round',
  'id', 'open', 'bool'
]);

interface NamingAnalysis {
  isValid: boolean;
  statusType: 'success' | 'error' | 'warning';
  reason: string;
  ruleViolations: string[];
  suggestions: string;
}

function analyzeVariableName(name: string): NamingAnalysis {
  const trimmed = name.trim();
  if (!trimmed) {
    return {
      isValid: false,
      statusType: 'error',
      reason: '变量名不能为空',
      ruleViolations: ['请输入变量名'],
      suggestions: '建议：起一个有实际意义的名字，如 student_age 或 total_score',
    };
  }

  const violations: string[] = [];

  // Check 1: Must start with letter or underscore
  const firstChar = trimmed[0];
  if (/^[0-9]/.test(firstChar)) {
    violations.push('❌ 违反首字符规则：不能以数字开头（如 1a、2nd 是非法的）');
  }

  // Check 2: Invalid characters
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    const invalidChars = Array.from(new Set(trimmed.split('').filter(c => !/[a-zA-Z0-9_]/.test(c))));
    violations.push(`❌ 包含非法字符：[ ${invalidChars.map(c => c === ' ' ? '空格' : c).join(', ')} ]。只能由英文字母、数字和下划线组成`);
  }

  // Check 3: Keywords
  if (PYTHON_KEYWORDS.has(trimmed)) {
    violations.push(`❌ 触碰保留字红线：'${trimmed}' 是 Python 语法关键字，严禁作为变量名！`);
  }

  if (violations.length > 0) {
    return {
      isValid: false,
      statusType: 'error',
      reason: `语法错误 (SyntaxError)：'${trimmed}' 是非法的变量名！`,
      ruleViolations: violations,
      suggestions: '修改建议：改为字母开头，如字母放在最前，或在单词间使用下划线连接',
    };
  }

  // Check 4: Built-in shadowing warning
  if (PYTHON_BUILTINS.has(trimmed)) {
    return {
      isValid: true,
      statusType: 'warning',
      reason: `⚠️ 语法允许但极度危险：'${trimmed}' 覆盖了 Python 官方内置函数！`,
      ruleViolations: [`虽然不会立刻报语法错误，但如果执行了 '${trimmed} = 10'，后续将无法再调用内置函数 '${trimmed}()'！考级绝不能这样写！`],
      suggestions: `修改建议：换成带有修饰词的名字，如 my_${trimmed} 或 ${trimmed}_val`,
    };
  }

  return {
    isValid: true,
    statusType: 'success',
    reason: `合规变量名：'${trimmed}' 语法完全正确！`,
    ruleViolations: ['✓ 由字母/下划线开头', '✓ 仅包含字母、数字与下划线', '✓ 没有占用保留关键字'],
    suggestions: '小贴士：在 Python 中推荐使用“小写字母 + 下划线”蛇形命名法 (如 max_score)，清晰规范！',
  };
}

export const VariableLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'naming' | 'assignment' | 'types' | 'traps'>('naming');

  // Tab 1: Naming
  const [testVarName, setTestVarName] = useState<string>('student_score');

  // Tab 2: Assignment & Swapping
  const [valA, setValA] = useState<string>('苹果 🍎');
  const [valB, setValB] = useState<string>('香蕉 🍌');
  const [swapCount, setSwapCount] = useState<number>(0);
  const [accumVal, setAccumVal] = useState<number>(10);
  const [accumStep, setAccumStep] = useState<number>(5);

  // Tab 3: Data Types
  const [selectedType, setSelectedType] = useState<'int' | 'float' | 'str' | 'bool'>('int');
  const [reboundStep, setReboundStep] = useState<number>(1);

  // Tab 4: Conversion Traps
  const [trapId, setTrapId] = useState<'trunc' | 'float_str' | 'bool_str' | 'type_mismatch' | 'bool_calc'>('trunc');

  // Analysis of current naming
  const namingAnalysis = analyzeVariableName(testVarName);

  // Handle Swap
  const handleSwap = () => {
    const tempA = valA;
    setValA(valB);
    setValB(tempA);
    setSwapCount((prev) => prev + 1);
  };

  // Generate Current Code and Output
  const getExperimentData = () => {
    switch (activeTab) {
      case 'naming': {
        const isSafe = namingAnalysis.isValid && namingAnalysis.statusType === 'success';
        const code = `# Python 变量命名规则检查
# 规则 1: 只能包含字母、数字和下划线 _
# 规则 2: 绝对不能以数字开头！
# 规则 3: 严格区分大小写 (Age 和 age 是不同的盒子)
# 规则 4: 不能使用关键字 (如 if, for, while, class)

${namingAnalysis.isValid && !PYTHON_BUILTINS.has(testVarName)
  ? `${testVarName} = 100\nprint(f"变量赋值成功: {${testVarName}}")\nprint("大小写对比:", "age" != "Age")`
  : `# ❌ 错误示范：\n# ${testVarName} = 100  # 执行会抛出 SyntaxError 语法错误！\nprint("请在上方输入合法的变量名")`}

# 考级经典命名辨析：
# 合法: a1, _count, my_score, max_val
# 非法: 1a (数字开头), class (关键字), my-name (包含减号), user score (包含空格)`;

        const output = isSafe
          ? `变量赋值成功: 100\n大小写对比: True\n\n诊断结论: [${testVarName}] 完全符合 GESP 考级与 PEP 8 命名规范！`
          : namingAnalysis.statusType === 'warning'
          ? `警告: ${testVarName} 覆盖了系统内置函数！\n请避免将内置名字作为普通变量。`
          : `SyntaxError: invalid syntax (${namingAnalysis.reason})`;

        return { code, output };
      }

      case 'assignment': {
        const code = `# 1. 基础赋值与单等号 = 含义
# 等号 = 不是数学上的等于，而是把右边的值装进左边的变量盒子里！
a = "${valA}"
b = "${valB}"
print("交换前 a =", a)
print("交换前 b =", b)

# 2. ⚡ Python 绝技：不借助第三变量交换两数 (考级必考！)
# 原理：右边 (b, a) 打包为元组，左边 a, b 解包接收！
a, b = b, a
print("交换后 a =", a)
print("交换后 b =", b)

# 3. 链式赋值与多元赋值
x = y = z = 0       # 链式赋值：三个变量都赋予 0
name, score = "小华", 98 # 多元解包赋值

# 4. 复合赋值运算符 +=, -=, *=, //= (计数器与累加核心)
count = ${accumVal}
count += ${accumStep}  # 等价于 count = count + ${accumStep}
print(f"累加器结果: count = {count}")`;

        const output = `交换前 a = ${valA}\n交换前 b = ${valB}\n交换后 a = ${valB}\n交换后 b = ${valA}\n链式赋值: x=0, y=0, z=0\n多元赋值: name='小华', score=98\n累加器结果: count = ${accumVal + accumStep}`;

        return { code, output };
      }

      case 'types': {
        const samples = {
          int: { val: '42', display: '42', typeStr: "<class 'int'>", desc: '整数 (int)：没有小数点的数字，支持任意大整数不溢出！' },
          float: { val: '3.14159', display: '3.14159', typeStr: "<class 'float'>", desc: '浮点数 (float)：带小数点的数字，底层采用二进制浮点存储。' },
          str: { val: '"Hello Python"', display: "'Hello Python'", typeStr: "<class 'str'>", desc: '字符串 (str)：用单引号或双引号包裹的文本字符序列。' },
          bool: { val: 'True', display: 'True', typeStr: "<class 'bool'>", desc: '布尔值 (bool)：真假世界，只有 True 和 False 两种状态，首字母大写！' },
        };

        const currentSample = samples[selectedType];

        const code = `# Python 4 大核心基本数据类型
# 1. 动态类型特性：同一个变量名字，可以重新赋予不同类型的数据！
x = 100
print(f"x = {x}, 类型是:", type(x)) # int 整型

x = "少儿编程"
print(f"x = '{x}', 类型是:", type(x)) # str 字符串类型！

# 2. 当前探究类型: ${selectedType}
my_var = ${currentSample.val}
print("变量内容:", my_var)
print("type(my_var) 输出:", type(my_var))
print("isinstance 检查:", isinstance(my_var, ${selectedType}))`;

        const output = `x = 100, 类型是: <class 'int'>\nx = '少儿编程', 类型是: <class 'str'>\n变量内容: ${currentSample.display}\ntype(my_var) 输出: ${currentSample.typeStr}\nisinstance 检查: True`;

        return { code, output, currentSample };
      }

      case 'traps': {
        const trapDetails = {
          trunc: {
            title: '陷阱 1: int() 是向零截断，绝不是四舍五入！',
            code: `# 很多同学误以为 int() 会四舍五入，直接判 0 分！
a = int(3.99)
b = int(-3.99)
print("int(3.99)  =", a)  # 结果是 3，而不是 4！
print("int(-3.99) =", b)  # 结果是 -3，直接砍掉小数！
# 想要四舍五入必须使用 round() 函数：
print("round(3.99) =", round(3.99)) # 4`,
            output: 'int(3.99)  = 3\nint(-3.99) = -3\nround(3.99) = 4',
            warning: 'int() 的动作是“直接手起刀落砍掉小数部分”，永远往 0 的方向靠拢，切记不要当成四舍五入！',
          },
          float_str: {
            title: '陷阱 2: int("3.14") 字符串含小数会直接崩溃报错！',
            code: `# 字符串转数字两级跳：
# 纯整数字符串可以直接转：
print(int("100")) # 100

# ❌ 错误示范：带小数点的字符串直接套 int() 会崩！
# int("3.14") -> 报 ValueError: invalid literal for int()

# ✅ 正确做法：先转 float，再转 int 脱去小数
s = "3.14"
res = int(float(s))
print(f"正确转换 '{s}' 为整数:", res) # 3`,
            output: "100\n正确转换 '3.14' 为整数: 3\n(若直接执行 int('3.14') 会报 ValueError 运行时错误！)",
            warning: 'int("纯整数") 可以，但只要双引号里面带了小数点，如 int("3.0") 或 int("3.14")，Python 就会直接罢工报错！',
          },
          bool_str: {
            title: '陷阱 3: bool("False") 的结果竟然是 True！',
            code: `# GESP 考级判断题最高频大坑：
print(bool(""))        # False (只有纯空字符串才是 False！)
print(bool("Hello"))   # True
print(bool("False"))   # True！(惊呆所有人！)
print(bool("0"))       # True！

# 原理：bool 对字符串而言，只看里面有没有字符！只要长度大于 0，统统是 True！`,
            output: 'bool("")      = False\nbool("Hello") = True\nbool("False") = True (考级名场面！)\nbool("0")     = True',
            warning: '不要以为引号里写了 "False" 就会是假！对于字符串，只要引号里有字（哪怕是空格 " "），它的布尔值就永远是 True！',
          },
          type_mismatch: {
            title: '陷阱 4: 字符串和数字不能直接用 + 相加！',
            code: `# ❌ 错误示范：
# print("苹果数量: " + 5) -> TypeError: can only concatenate str (not "int") to str

# ✅ 正确做法 1: 用 str() 包装转换
print("苹果数量: " + str(5))

# ✅ 正确做法 2: 用 print 逗号隔开 (自动加空格)
print("苹果数量:", 5)

# ✅ 正确做法 3: 最推荐使用 f-string 优雅插值
count = 5
print(f"苹果数量: {count}")`,
            output: '苹果数量: 5\n苹果数量: 5\n苹果数量: 5',
            warning: 'Python 是强类型语言，不会自动把数字 5 转成字符串与前面的文本拼接，直接用加号 + 必定抛出 TypeError！',
          },
          bool_calc: {
            title: '陷阱 5: True 和 False 在数学算式中化身 1 和 0！',
            code: `# 布尔类型是整型的子类：True 对应 1，False 对应 0
print("True + True =", True + True)     # 1 + 1 = 2
print("True * 10   =", True * 10)       # 1 * 10 = 10
print("False * 100 =", False * 100)     # 0 * 100 = 0
print("3 > 2 + 1   =", 3 > (2 + 1))     # 比较表达式`,
            output: 'True + True = 2\nTrue * 10   = 10\nFalse * 100 = 0\n3 > 2 + 1   = False',
            warning: '当 True 和 False 参与算术加减乘除时，Python 会自动将其视为 1 和 0！这也是很多计数器逻辑的神奇简写。',
          },
        };

        const currentTrap = trapDetails[trapId];
        return { code: currentTrap.code, output: currentTrap.output, trapInfo: currentTrap };
      }
    }
  };

  const expData = getExperimentData();

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/20">
            <i className="fa-solid fa-box-archive"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                变量、赋值与数据类型全能实验室
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                GESP 1-2级核心基本功
              </span>
            </div>
            <p className="text-xs text-slate-500">
              变量是数据的贴标签储物盒，等号 = 是把宝物装进盒子！攻克合规命名、两数极速交换与四大基本类型！
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('naming')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'naming'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏷️ 变量命名体检机
          </button>
          <button
            onClick={() => setActiveTab('assignment')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'assignment'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔄 赋值运算与两数交换
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'types'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔬 四大基本类型显微镜
          </button>
          <button
            onClick={() => setActiveTab('traps')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'traps'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚠️ 类型转换五大陷阱
          </button>
        </div>
      </div>

      {/* Tab 1: Variable Naming Diagnosis */}
      {activeTab === 'naming' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200 pb-3">
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🏷️ 变量命名规则实时体检机</span>
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  输入想要测试的变量名字，系统将严格按照 GESP 考级语法要求进行实时合法性检测：
                </p>
              </div>

              {/* Input & Quick Presets */}
              <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-xs font-bold text-slate-700">测试变量名:</span>
                <input
                  type="text"
                  value={testVarName}
                  onChange={(e) => setTestVarName(e.target.value)}
                  placeholder="输入变量名..."
                  className="w-36 px-2 py-1 text-xs font-mono font-bold bg-emerald-50 border border-emerald-300 rounded focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick Test Presets Bar */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600 text-[11px]">快速测试常见真题案例:</span>
              {[
                { name: 'score_1', type: 'valid', label: '合法: score_1' },
                { name: '_temp', type: 'valid', label: '合法: _temp (下划线开头)' },
                { name: '2apples', type: 'invalid', label: '❌ 非法: 2apples (数字开头)' },
                { name: 'class', type: 'invalid', label: '❌ 非法: class (保留关键字)' },
                { name: 'user-id', type: 'invalid', label: '❌ 非法: user-id (带减号)' },
                { name: 'print', type: 'warn', label: '⚠️ 警告: print (覆盖内置函数)' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setTestVarName(preset.name)}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                    preset.type === 'valid'
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                      : preset.type === 'warn'
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                      : 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Diagnosis Result Card */}
            <div
              className={`rounded-xl p-4 border shadow-2xs space-y-2 transition-all ${
                namingAnalysis.statusType === 'success'
                  ? 'bg-emerald-100/70 border-emerald-300'
                  : namingAnalysis.statusType === 'warning'
                  ? 'bg-amber-100/70 border-amber-300'
                  : 'bg-rose-100/70 border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {namingAnalysis.statusType === 'success'
                      ? '✅'
                      : namingAnalysis.statusType === 'warning'
                      ? '⚠️'
                      : '❌'}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {namingAnalysis.reason}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 font-mono">
                  {namingAnalysis.statusType === 'success'
                    ? '通过检验'
                    : namingAnalysis.statusType === 'warning'
                    ? '有隐患'
                    : '语法报错'}
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-800 pl-6">
                {namingAnalysis.ruleViolations.map((v, i) => (
                  <div key={i} className="font-mono">{v}</div>
                ))}
                <div className="text-[11px] text-slate-600 mt-1 italic">{namingAnalysis.suggestions}</div>
              </div>
            </div>

            {/* Golden 3 Rules Cheat Sheet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>① 字符构成铁律</span>
                </span>
                <p className="text-slate-600 text-[11px]">
                  只能包含 <strong>大小写英文字母</strong>、<strong>数字 (0-9)</strong> 和 <strong>下划线 (_)</strong>，绝不能有空格或破折号 <code className="text-rose-600 font-bold">-</code>！
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>② 首字符绝对禁令</span>
                </span>
                <p className="text-slate-600 text-[11px]">
                  <strong>首个字符绝对不能是数字！</strong>写 <code className="text-rose-600 font-bold">1apple</code> 直接报 SyntaxError，必须写成 <code className="text-emerald-700 font-bold">apple1</code>！
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>③ 大小写敏感 & 避开关键字</span>
                </span>
                <p className="text-slate-600 text-[11px]">
                  <code className="font-bold">score</code> 和 <code className="font-bold">Score</code> 是两个完全独立的变量！且千万不能起名叫 <code className="text-rose-600 font-bold">if</code>, <code className="text-rose-600 font-bold">for</code>, <code className="text-rose-600 font-bold">while</code>！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assignment & Variable Swapping */}
      {activeTab === 'assignment' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-200 pb-3">
              <div>
                <h4 className="font-extrabold text-indigo-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🔄 赋值运算与 Python 神奇两数极速交换 (a, b = b, a)</span>
                </h4>
                <p className="text-xs text-indigo-800 mt-0.5">
                  单等号 = 是把右边的宝物放入左边的盒子！点击下方按钮体验无需第三方变量的一秒交换：
                </p>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <i className="fa-solid fa-arrows-rotate animate-spin-slow"></i>
                <span>执行 a, b = b, a 交换 (已交换 {swapCount} 次)</span>
              </button>
            </div>

            {/* Interactive Variable Boxes Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box A */}
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-300 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      a
                    </span>
                    <span className="font-bold text-xs text-indigo-950">变量盒子 a</span>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">
                    当前存储值
                  </span>
                </div>
                <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-100 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-indigo-900">{valA}</span>
                  <input
                    type="text"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-24 text-xs font-mono px-2 py-1 bg-white border border-indigo-200 rounded"
                    placeholder="修改 a..."
                  />
                </div>
              </div>

              {/* Box B */}
              <div className="bg-white p-4 rounded-xl border-2 border-emerald-300 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                      b
                    </span>
                    <span className="font-bold text-xs text-emerald-950">变量盒子 b</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                    当前存储值
                  </span>
                </div>
                <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100 flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-emerald-900">{valB}</span>
                  <input
                    type="text"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-24 text-xs font-mono px-2 py-1 bg-white border border-emerald-200 rounded"
                    placeholder="修改 b..."
                  />
                </div>
              </div>
            </div>

            {/* Python Swapping vs C/C++ Traditional Contrast */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="font-bold text-emerald-950 flex items-center space-x-1">
                  <span>🐍 Python 极简优雅一行写法 (考级满分代码)</span>
                </span>
                <div className="bg-slate-900 text-emerald-300 font-mono p-2.5 rounded-lg text-xs">
                  a, b = b, a
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  底层将 <code className="font-mono">(b, a)</code> 右边打包成一个临时元组对象，同时分别解包存入左边变量，<strong>无需任何临时空盒子</strong>！
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center space-x-1">
                  <span>🏛️ 传统 C/C++ 借助第三变量 temp 写法</span>
                </span>
                <div className="bg-slate-900 text-slate-300 font-mono p-2.5 rounded-lg text-xs">
                  temp = a<br />
                  a = b<br />
                  b = temp
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  必须额外声明一个中间空盒子 <code className="font-mono">temp</code> 倒腾，在 Python 里虽合法但完全不需要这么繁琐！
                </p>
              </div>
            </div>

            {/* Compound Assignment Operator (+=, -=, *=) */}
            <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                  <i className="fa-solid fa-calculator text-indigo-600"></i>
                  <span>复合赋值运算符：累加器与计数器核心 (+=, -=, *=, //=)</span>
                </span>
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setAccumVal((prev) => prev + accumStep)}
                    className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded font-bold cursor-pointer"
                  >
                    count += {accumStep} (加 {accumStep})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccumVal((prev) => Math.max(0, prev - accumStep))}
                    className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded font-bold cursor-pointer"
                  >
                    count -= {accumStep} (减 {accumStep})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccumVal(10)}
                    className="px-1.5 py-1 text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                  >
                    重置
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span>
                  当前变量 <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-indigo-600">count = {accumVal}</code>
                </span>
                <span className="text-slate-500 text-[11px]">
                  语法等价：<code className="text-emerald-700 font-bold">count += {accumStep}</code> 等价于 <code className="text-slate-600">count = count + {accumStep}</code>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Types Microscope */}
      {activeTab === 'types' && (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-200 pb-3">
              <div>
                <h4 className="font-extrabold text-purple-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🔬 四大核心基本数据类型显微镜 (int, float, str, bool)</span>
                </h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  点击切换数据类型，观察字面量书写规则与 type() 检测输出：
                </p>
              </div>

              {/* 4 Type Selectors */}
              <div className="flex bg-white/90 p-1 rounded-xl border border-purple-200 shadow-xs text-xs font-bold">
                {[
                  { key: 'int', label: 'int 整型' },
                  { key: 'float', label: 'float 浮点型' },
                  { key: 'str', label: 'str 字符串' },
                  { key: 'bool', label: 'bool 布尔型' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setSelectedType(t.key as any)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedType === t.key
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Details Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className={`p-3 rounded-xl border transition-all ${selectedType === 'int' ? 'bg-white border-2 border-purple-500 shadow-xs' : 'bg-white/60 border-slate-200'}`}>
                <span className="font-bold text-purple-950 block">1. 整数 int</span>
                <div className="font-mono text-base font-bold text-purple-700 my-1">42, -10, 0</div>
                <p className="text-slate-500 text-[11px]">没有小数点的纯数字。Python 支持超大整数无限精度，不会溢出！</p>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${selectedType === 'float' ? 'bg-white border-2 border-purple-500 shadow-xs' : 'bg-white/60 border-slate-200'}`}>
                <span className="font-bold text-purple-950 block">2. 浮点数 float</span>
                <div className="font-mono text-base font-bold text-purple-700 my-1">3.14, 2.0, -0.5</div>
                <p className="text-slate-500 text-[11px]">带小数点的数值。单斜杠除法 <code className="font-bold">4 / 2</code> 得到的结果也是 <code className="font-bold">2.0</code> 浮点型！</p>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${selectedType === 'str' ? 'bg-white border-2 border-purple-500 shadow-xs' : 'bg-white/60 border-slate-200'}`}>
                <span className="font-bold text-purple-950 block">3. 字符串 str</span>
                <div className="font-mono text-base font-bold text-purple-700 my-1">"Hello", '35'</div>
                <p className="text-slate-500 text-[11px]">必须用单引号或双引号括起来！注意 <code className="font-bold">"35"</code> 也是文本而不是数字！</p>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${selectedType === 'bool' ? 'bg-white border-2 border-purple-500 shadow-xs' : 'bg-white/60 border-slate-200'}`}>
                <span className="font-bold text-purple-950 block">4. 布尔值 bool</span>
                <div className="font-mono text-base font-bold text-purple-700 my-1">True, False</div>
                <p className="text-slate-500 text-[11px]">真假二值。首字母<strong>必须大写</strong>！在算式中当成 1 和 0 计算。</p>
              </div>
            </div>

            {/* Dynamic Re-binding Feature */}
            <div className="bg-white p-3.5 rounded-xl border border-purple-200 text-xs space-y-2">
              <div className="font-bold text-purple-950 flex items-center space-x-1.5">
                <i className="fa-solid fa-tags text-purple-600"></i>
                <span>动态类型概念：Python 变量是“便利贴标签”，不是焊死的铁箱子！</span>
              </div>
              <div className="text-slate-600 text-[11px] leading-relaxed">
                在 C++ 或 Java 中，必须先写 <code className="bg-slate-100 px-1 font-bold">int a = 10;</code> 且以后 a 只能装整数。而在 Python 中：
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-purple-50 p-2 rounded border border-purple-100">
                  <span className="text-slate-400"># 第 1 步：先贴在整数上</span><br />
                  <span className="font-bold text-purple-900">x = 100</span> <span className="text-slate-500"># type(x) 是 int</span>
                </div>
                <div className="bg-emerald-50 p-2 rounded border border-emerald-100">
                  <span className="text-slate-400"># 第 2 步：撕下标签贴到字符串上</span><br />
                  <span className="font-bold text-emerald-900">x = "Hello"</span> <span className="text-slate-500"># type(x) 变成 str！</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 5 Great Conversion Traps */}
      {activeTab === 'traps' && (
        <div className="space-y-4">
          <div className="bg-rose-50/70 border-2 border-rose-200 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-3">
              <div>
                <h4 className="font-extrabold text-rose-950 text-sm sm:text-base flex items-center space-x-1.5">
                  <span>🚨 考级选择题与填空题最常踩的 5 大数据类型陷阱</span>
                </h4>
                <p className="text-xs text-rose-800 mt-0.5">
                  点击切换不同的陷阱案例，考前彻底扫清易错概念：
                </p>
              </div>

              {/* Trap Buttons */}
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'trunc', label: '陷阱 1: int() 截断非四舍五入' },
                  { id: 'float_str', label: '陷阱 2: int("3.14") 报错' },
                  { id: 'bool_str', label: '陷阱 3: bool("False")==True' },
                  { id: 'type_mismatch', label: '陷阱 4: "10"+5 报错' },
                  { id: 'bool_calc', label: '陷阱 5: True+True==2' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTrapId(t.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      trapId === t.id
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Trap Alert */}
            <div className="bg-white p-4 rounded-xl border border-rose-300 shadow-xs space-y-2">
              <h5 className="font-extrabold text-xs sm:text-sm text-rose-950 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">!</span>
                <span>{(expData as any).trapInfo?.title}</span>
              </h5>
              <p className="text-xs text-rose-800 leading-relaxed font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {(expData as any).trapInfo?.warning}
              </p>
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
                Python 3.12 代码实时演练
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

