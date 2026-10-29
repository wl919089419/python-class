import React, { useState } from 'react';
import { simulateInputPipeline } from '../utils/pythonSim';
import { PythonCodeView } from './PythonCodeBlock';

export const InputLab: React.FC = () => {
  // Part 1: Trap State
  const [valA, setValA] = useState<string>('3');
  const [valB, setValB] = useState<string>('5');

  // Part 2: Templates & Pipeline
  const [activeTemplate, setActiveTemplate] = useState<'tpl3' | 'tpl1' | 'tpl2' | 'map_deep_dive'>('tpl3');
  const [pipelineInput, setPipelineInput] = useState<string>('10 20 30');

  // Calculation for Trap
  const strConcatResult = `"${valA}${valB}"`;
  const numA = parseInt(valA, 10);
  const numB = parseInt(valB, 10);
  const isNumAValid = !isNaN(numA);
  const isNumBValid = !isNaN(numB);
  const intMathResult = isNumAValid && isNumBValid ? numA + numB : '输入非法数字';

  // Run pipeline
  const pipelineResult = simulateInputPipeline(pipelineInput);

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/20">
            <i className="fa-solid fa-keyboard"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                input() 读题与考级避坑指南
              </h3>
              <span className="bg-rose-100 text-rose-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                ⭐ 零分重灾区
              </span>
            </div>
            <p className="text-xs text-slate-500">
              为什么输入 3 和 5 相加会等于 35？纵向拆解 split+map 流程与 map 核心机制！
            </p>
          </div>
        </div>

        {/* Templates Selector */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTemplate('tpl3')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'tpl3'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模板3: split+map 流程 (必考)
          </button>
          <button
            onClick={() => setActiveTemplate('map_deep_dive')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'map_deep_dive'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔍 map() 函数深入专题
          </button>
          <button
            onClick={() => setActiveTemplate('tpl1')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'tpl1' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模板1: 单数读入
          </button>
          <button
            onClick={() => setActiveTemplate('tpl2')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'tpl2' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模板2: 多行循环读入
          </button>
        </div>
      </div>

      {/* Part 1: Classic Trap Overhaul: a=input() vs a=int(input()) */}
      <div className="bg-rose-50/60 border-2 border-rose-200 rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Title & Interactive Value Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200/80 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h4 className="font-extrabold text-rose-950 text-sm sm:text-base">
                ⚠️ 警惕考级名场面：输入两个数，相加结果是 8 还是 35？
              </h4>
            </div>
            <p className="text-xs text-rose-800 mt-0.5">
              修改下方 a 和 b 的输入值，左右两栏将按换行形式实时对比执行结果与数据类型：
            </p>
          </div>

          {/* Quick interactive test inputs */}
          <div className="flex items-center space-x-2 bg-white/90 p-2 rounded-xl border border-rose-200 shadow-xs">
            <span className="text-xs font-bold text-slate-700">测试输入：</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono font-bold text-slate-500">a:</span>
              <input
                type="text"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                className="w-12 px-1.5 py-1 text-xs font-mono font-bold text-center bg-rose-50 border border-rose-300 rounded focus:ring-1 focus:ring-rose-500"
                placeholder="a"
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-mono font-bold text-slate-500">b:</span>
              <input
                type="text"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                className="w-12 px-1.5 py-1 text-xs font-mono font-bold text-center bg-rose-50 border border-rose-300 rounded focus:ring-1 focus:ring-rose-500"
                placeholder="b"
              />
            </div>
            <div className="flex space-x-1 pl-1 border-l border-slate-200">
              <button
                type="button"
                onClick={() => { setValA('3'); setValB('5'); }}
                className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded font-bold cursor-pointer"
              >
                3 与 5
              </button>
              <button
                type="button"
                onClick={() => { setValA('12'); setValB('34'); }}
                className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 rounded font-bold cursor-pointer"
              >
                12 与 34
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Wrong (str concatenation) */}
          <div className="bg-white rounded-xl p-4 border-2 border-rose-300 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
                  ✕
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-rose-900">
                  写法一：直接使用 input()（错误）
                </span>
              </div>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                字符串拼接
              </span>
            </div>

            {/* Code presentation */}
            <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
              <div className="text-slate-400"># 键盘逐行输入文字：</div>
              <div className="flex items-center justify-between">
                <span>
                  <span className="text-purple-400 font-bold">a</span> = <span className="text-sky-300 font-semibold">input</span>()
                </span>
                <span className="text-slate-500 text-[11px]"># a 的值为 "{valA}"</span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <span className="text-purple-400 font-bold">b</span> = <span className="text-sky-300 font-semibold">input</span>()
                </span>
                <span className="text-slate-500 text-[11px]"># b 的值为 "{valB}"</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-amber-300">
                <div className="text-slate-400">&gt;&gt;&gt; a + b</div>
                <div className="text-rose-400 font-black text-sm pl-2">
                  {strConcatResult} <span className="text-slate-500 font-normal text-xs"># 拼接成字符串！</span>
                </div>
              </div>

              <div className="pt-1 text-amber-300">
                <div className="text-slate-400">&gt;&gt;&gt; type(a + b)</div>
                <div className="text-rose-300 font-bold pl-2 text-xs">
                  &lt;class 'str'&gt; <span className="text-slate-500 font-normal"># 类型仍是文本 str</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-lg p-2.5 text-xs text-rose-900 leading-relaxed border border-rose-200">
              🚨 <strong>致命陷阱</strong>：<code className="bg-white px-1 font-bold text-rose-600">input()</code> 读进来的数据<strong>永远自带双引号</strong>！对于字符串而言，加号 <code className="font-bold">+</code> 的作用是把两截文本连起来（例如 <code className="font-bold">"3" + "5" = "35"</code>），评测机按数学题批改直接判 0 分！
            </div>
          </div>

          {/* Right Column: Correct (int conversion) */}
          <div className="bg-white rounded-xl p-4 border-2 border-emerald-400 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
              <div className="flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  ✓
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-emerald-950">
                  写法二：使用 int() 转换（正确）
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                真正的数学运算
              </span>
            </div>

            {/* Code presentation */}
            <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800">
              <div className="text-slate-400"># 读入后立刻套上 int() 脱掉引号：</div>
              <div className="flex items-center justify-between">
                <span>
                  <span className="text-purple-400 font-bold">a</span> = <span className="text-sky-300 font-semibold">int</span>(<span className="text-sky-300 font-semibold">input</span>())
                </span>
                <span className="text-emerald-400 text-[11px]"># a 的值为 {isNumAValid ? numA : '非法'} (整数)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <span className="text-purple-400 font-bold">b</span> = <span className="text-sky-300 font-semibold">int</span>(<span className="text-sky-300 font-semibold">input</span>())
                </span>
                <span className="text-emerald-400 text-[11px]"># b 的值为 {isNumBValid ? numB : '非法'} (整数)</span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-emerald-300">
                <div className="text-slate-400">&gt;&gt;&gt; a + b</div>
                <div className="text-emerald-400 font-black text-sm pl-2">
                  {intMathResult} <span className="text-slate-500 font-normal text-xs"># 纯数学加法计算！</span>
                </div>
              </div>

              <div className="pt-1 text-emerald-300">
                <div className="text-slate-400">&gt;&gt;&gt; type(a + b)</div>
                <div className="text-emerald-300 font-bold pl-2 text-xs">
                  &lt;class 'int'&gt; <span className="text-slate-500 font-normal"># 类型成功变成整型 int</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-2.5 text-xs text-emerald-950 leading-relaxed border border-emerald-200">
              💡 <strong>int() 的核心作用</strong>：<code className="bg-white px-1 font-bold text-emerald-700">int()</code> 是剥除双引号的<strong>「类型转换魔法棒」</strong>！它把带引号的文字 <code className="font-bold">"{valA}"</code> 变成了能在数学运算中加减乘除的纯整数 <code className="font-bold">{isNumAValid ? numA : valA}</code>！
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Selected Template Display */}
      {activeTemplate === 'tpl3' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
              <div>
                <span className="text-sm font-extrabold text-emerald-950 flex items-center space-x-1.5">
                  <i className="fa-solid fa-wand-magic-sparkles text-emerald-600"></i>
                  <span>单行多个数字输入：a, b = map(int, input().split()) 纵向流水线拆解</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  考级题中最常见的「一行输入由空格隔开的多个整数」，四个步骤自上而下顺畅流动：
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                <span className="text-xs font-bold text-slate-700">修改模拟输入：</span>
                <input
                  type="text"
                  value={pipelineInput}
                  onChange={(e) => setPipelineInput(e.target.value)}
                  placeholder="例如 10 20 或 5 8 9"
                  className="px-2 py-0.5 text-xs font-mono bg-emerald-50 border border-emerald-200 rounded-md w-36 font-bold text-emerald-900"
                />
              </div>
            </div>

            {/* 4 Steps: VERTICAL STACKED FLOW (纵向排列，彻底解决横向挤压与滑动条问题) */}
            <div className="flex flex-col gap-3">
              {pipelineResult.steps.map((step, idx) => {
                return (
                  <React.Fragment key={step.stepIndex}>
                    <div
                      className={`rounded-xl p-3.5 border shadow-2xs space-y-2 transition-all ${
                        step.isError
                          ? 'bg-rose-50 border-rose-300'
                          : 'bg-white border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                            {step.stepIndex}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                            {step.title}
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            数据类型: {step.dataType}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Step Visual Preview Bar */}
                      <div className="bg-slate-950 text-emerald-300 rounded-lg p-2.5 font-mono text-xs border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 text-[11px] select-none">输出结果:</span>
                          {step.isError ? (
                            <span className="text-rose-400 font-bold">{step.errorMessage}</span>
                          ) : typeof step.data === 'string' ? (
                            <span className="text-amber-300">"{step.data}"</span>
                          ) : Array.isArray(step.data) ? (
                            <span className="text-emerald-300">
                              [{step.data.map((x) => (typeof x === 'string' ? `"${x}"` : x)).join(', ')}]
                            </span>
                          ) : (
                            <span className="text-sky-300">{JSON.stringify(step.data)}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                          {idx === 0 && '包含整行空格的原始文本'}
                          {idx === 1 && '切分成独立的小字符串片段'}
                          {idx === 2 && '每个元素都执行了 int() 脱去双引号'}
                          {idx === 3 && '分别分发存入变量抽屉'}
                        </span>
                      </div>
                    </div>

                    {/* Connecting downward arrow */}
                    {idx < pipelineResult.steps.length - 1 && (
                      <div className="flex items-center justify-center text-emerald-600 py-0.5">
                        <div className="flex items-center space-x-1.5 bg-emerald-100/90 text-emerald-800 px-3 py-0.5 rounded-full text-[11px] font-bold">
                          <span>↓ 下一步流水线</span>
                          <span>
                            {idx === 0 && '(.split() 空格切片)'}
                            {idx === 1 && '(map(int, ...) 批量类型转换)'}
                            {idx === 2 && '(变量解包赋值)'}
                          </span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Standard Code block for Template 3 */}
          <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800 flex justify-between">
              <span>GESP 机考标准写法 (点击直接复制)：</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`a, b = map(int, input().split())\nprint(a + b)`)
                }
                className="hover:text-emerald-400 cursor-pointer text-xs"
              >
                <i className="fa-regular fa-copy mr-1"></i>复制代码
              </button>
            </div>
            <PythonCodeView
              code={`# 1. 一行正好两个整数时（直接解包赋值给 a, b）\na, b = map(int, input().split())\nprint("两数之和:", a + b)\n\n# 2. 一行有若干个未知数量的整数时（转为列表）\nnums = list(map(int, input().split()))\nprint("总个数:", len(nums), "最大值:", max(nums))`}
            />
          </div>
        </div>
      )}

      {/* Part 3: Deep Dive into map() Function */}
      {activeTemplate === 'map_deep_dive' && (
        <div className="bg-indigo-50/70 border-2 border-indigo-200 rounded-2xl p-5 space-y-4">
          <div className="border-b border-indigo-200 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                ⚙️
              </div>
              <div>
                <h4 className="font-extrabold text-indigo-950 text-base">
                  彻底搞懂 map()：Python 里的「自动化加工传送带」
                </h4>
                <p className="text-xs text-indigo-800">
                  语法结构：<code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-indigo-600">map(加工规则函数, 原材料列表)</code>
                </p>
              </div>
            </div>
            <span className="text-xs bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">
              GESP 2-4级精髓
            </span>
          </div>

          {/* Assembly Line Analogy */}
          <div className="bg-white rounded-xl p-4 border border-indigo-200 space-y-3">
            <h5 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center space-x-1.5">
              <span>🏭 形象比喻：工厂车间里的自动化冲压传送带</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-800 block">1. 待加工原料 (第二个参数)</span>
                <p className="text-slate-600">
                  比如 <code className="bg-white px-1 rounded font-bold text-amber-600">['10', '20', '30']</code>。
                  由 <code className="font-mono">input().split()</code> 产生，每个元素都带着讨厌的引号！
                </p>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-800 block">2. 冲压模具 (第一个参数)</span>
                <p className="text-slate-600">
                  比如 <code className="bg-white px-1 rounded font-bold text-indigo-600">int</code>。
                  注意<strong>只写函数名，不要加括号</strong>！它就像悬挂在传送带上方的模具，每个原料经过时被它冲压一下脱去引号。
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 block">3. 产出的合格零件</span>
                <p className="text-slate-600">
                  所有字符串都被变成了纯整数 <code className="bg-white px-1 rounded font-bold text-emerald-600">10, 20, 30</code>！可以直接做加减乘除。
                </p>
              </div>
            </div>
          </div>

          {/* Why not int(input().split())? */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2 text-xs">
            <span className="font-bold text-rose-800 text-sm block flex items-center space-x-1">
              <span>❓ 很多同学常问：为什么不能直接写 int(input().split())？</span>
            </span>
            <p className="text-slate-700 leading-relaxed">
              因为 <code className="bg-white px-1 font-mono font-bold text-rose-700">input().split()</code> 的结果是<strong>一整箱列表</strong>（比如 <code className="font-mono">['10', '20']</code>）。
              而 Python 的 <code className="bg-white px-1 font-mono font-bold text-rose-700">int()</code> 函数非常小巧，<strong>一次只能吞下一个苹果，吞不下一整箱苹果</strong>！如果你把列表硬塞给它，Python 就会直接报错崩溃：
            </p>
            <div className="bg-slate-900 text-rose-400 font-mono p-2.5 rounded-lg text-xs">
              TypeError: int() argument must be a string, a bytes-like object or a real number, not 'list'
            </div>
            <p className="text-slate-700 leading-relaxed">
              所以必须派 <code className="bg-white px-1 font-mono font-bold text-indigo-700">map</code> 出马，让 <code className="font-mono">int</code> 依次对列表里的每一个小元素逐个施展魔法！
            </p>
          </div>

          {/* Two ways to receive map: unpack vs list */}
          <div className="space-y-2">
            <h5 className="font-bold text-slate-800 text-xs sm:text-sm">
              📦 map 结果的两种接收方式：解包 vs 封装为 list
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-indigo-900 flex items-center justify-between">
                  <span>方式 A: 变量数量明确时 (解包赋值)</span>
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">考题已知输入 2 个数</span>
                </div>
                <PythonCodeView code={`# 题目说：“输入两个由空格隔开的正整数 a, b”\na, b = map(int, input().split())\nprint(a * b)`} />
                <p className="text-slate-500 text-[11px]">
                  左边写几个变量，右边就会把流水线上加工好的前几个数字分别装进去。
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-indigo-900 flex items-center justify-between">
                  <span>方式 B: 变量数量不确定时 (封装为列表)</span>
                  <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px]">考题输入很多未知个数</span>
                </div>
                <PythonCodeView code={`# 题目说：“输入一行若干个数字，求总和”\nnums = list(map(int, input().split()))\nprint(sum(nums))`} />
                <p className="text-slate-500 text-[11px]">
                  用 <code className="bg-slate-100 px-1 font-bold">list(...)</code> 把流水线上加工完的全部数字打包成一个列表盒子，供后续排序或求和。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template 1 Display */}
      {activeTemplate === 'tpl1' && (
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">模板 1：单行读取单个整数 / 浮点数</h4>
            <p className="text-xs text-slate-600">
              题目每行只输入一个数据时使用。最基础但不可轻视！
            </p>
            <PythonCodeView
              code={`# 读取单个整数\nn = int(input())\n\n# 读取单个小数 (浮点数)\nscore = float(input())\n\n# 读取一行普通文字 (保持字符串)\nname = input()`}
            />
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900">
              ⚠️ <strong>考级规矩</strong>：千万不要写 <code className="bg-white px-1 font-bold">int(input("请输入数字:"))</code>！不要带提示词！
            </div>
          </div>
        </div>
      )}

      {/* Template 2 Display */}
      {activeTemplate === 'tpl2' && (
        <div className="space-y-3">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800">模板 2：多行输入（配合循环读入 N 行）</h4>
            <p className="text-xs text-slate-600">
              常见题型：“第一行输入正整数 N，接下来 N 行每行一个正整数”。
            </p>
            <PythonCodeView
              code={`# 1. 先读第一行的行数 n\nn = int(input())\n\n# 2. 循环 n 次，每次用 input() 读一行\ntotal = 0\nfor _ in range(n):\n    num = int(input())\n    total += num\n\nprint("N 行数字总和:", total)`}
            />
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900">
              ⚠️ <strong>常见丢分</strong>：如果写成 <code className="bg-white px-1 font-bold">range(1, n)</code>，由于左闭右开只跑了 n-1 次，最后一行没读完，评测机就会报错 <strong>EOFError</strong> 判 0 分！
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
