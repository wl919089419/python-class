import React, { useState, useEffect, useRef } from 'react';
import { PythonCodeView } from './PythonCodeBlock';

interface ContainerPreset {
  id: string;
  name: string;
  badge: string;
  codeSnippet: string;
  containerName: string;
  items: Array<{ label: string; value: string | number; desc?: string }>;
  bodyTemplate: (item: string | number) => string;
}

const PRESETS: ContainerPreset[] = [
  {
    id: 'fruits',
    name: '水果篮列表 (最直观)',
    badge: '列表遍历 list',
    codeSnippet: `fruits = ["🍎 苹果", "🍌 香蕉", "🍇 葡萄", "🍉 西瓜"]\nfor fruit in fruits:\n    print(f"小海龟吃到了: {fruit}")\nprint("水果吃完啦，大饱口福！")`,
    containerName: 'fruits',
    items: [
      { label: '🍎 苹果', value: '🍎 苹果', desc: '索引 0' },
      { label: '🍌 香蕉', value: '🍌 香蕉', desc: '索引 1' },
      { label: '🍇 葡萄', value: '🍇 葡萄', desc: '索引 2' },
      { label: '🍉 西瓜', value: '🍉 西瓜', desc: '索引 3' },
    ],
    bodyTemplate: (item) => `小海龟吃到了: ${item}`,
  },
  {
    id: 'range5',
    name: 'range(5) 计数生成器',
    badge: '考级第一高频',
    codeSnippet: `# range(5) 生成 0, 1, 2, 3, 4 (共 5 次，绝不含 5！)\nfor i in range(5):\n    print("第", i, "次循环")\nprint("循环结束！")`,
    containerName: 'range(5)',
    items: [
      { label: '0', value: 0, desc: '第 1 轮' },
      { label: '1', value: 1, desc: '第 2 轮' },
      { label: '2', value: 2, desc: '第 3 轮' },
      { label: '3', value: 3, desc: '第 4 轮' },
      { label: '4', value: 4, desc: '第 5 轮' },
    ],
    bodyTemplate: (item) => `第 ${item} 次循环`,
  },
  {
    id: 'rangeStep',
    name: 'range(1, 10, 2) 奇数跨步',
    badge: '步长 step',
    codeSnippet: `# 从 1 开始，每次 +2，小于 10 停止\nfor num in range(1, 10, 2):\n    print("奇数:", num)\nprint("奇数输出完毕！")`,
    containerName: 'range(1, 10, 2)',
    items: [
      { label: '1', value: 1, desc: '起点 start' },
      { label: '3', value: 3, desc: '+2 步长' },
      { label: '5', value: 5, desc: '+2 步长' },
      { label: '7', value: 7, desc: '+2 步长' },
      { label: '9', value: 9, desc: '终点前一位' },
    ],
    bodyTemplate: (item) => `奇数: ${item}`,
  },
  {
    id: 'stringLoop',
    name: '字符串 "CODE" 字符拆解',
    badge: '字符串遍历 str',
    codeSnippet: `# 字符串也是可迭代容器！一个字符一个字符掏出\nfor ch in "CODE":\n    print("字母:", ch)\nprint("单词拼读完毕！")`,
    containerName: '"CODE"',
    items: [
      { label: "'C'", value: 'C', desc: '字符 1' },
      { label: "'O'", value: 'O', desc: '字符 2' },
      { label: "'D'", value: 'D', desc: '字符 3' },
      { label: "'E'", value: 'E', desc: '字符 4' },
    ],
    bodyTemplate: (item) => `字母: ${item}`,
  },
  {
    id: 'countdown',
    name: 'range(5, 0, -1) 倒计时',
    badge: '负步长倒序',
    codeSnippet: `# 倒序步长 -1：从 5 倒数到 1 (不含 0！)\nfor s in range(5, 0, -1):\n    print("倒计时:", s)\nprint("🚀 点火发射！")`,
    containerName: 'range(5, 0, -1)',
    items: [
      { label: '5', value: 5, desc: '倒数 5' },
      { label: '4', value: 4, desc: '倒数 4' },
      { label: '3', value: 3, desc: '倒数 3' },
      { label: '2', value: 2, desc: '倒数 2' },
      { label: '1', value: 1, desc: '倒数 1' },
    ],
    bodyTemplate: (item) => `倒计时: ${item}`,
  },
];

export const ForLoopLab: React.FC = () => {
  // Top navigation between for..in conveyor animation & range() dynamic simulator
  const [activeTab, setActiveTab] = useState<'conveyor' | 'range_lab'>('conveyor');

  // ====================== Conveyor Animation State ======================
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fruits');
  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);

  const items = currentPreset.items;
  const totalSteps = items.length * 3 + 1;

  const isFinished = stepIndex >= items.length * 3;
  const currentItemIndex = isFinished ? items.length : Math.floor(stepIndex / 3);
  const subStep = isFinished ? 3 : stepIndex % 3;
  const currentItem = items[currentItemIndex] || null;

  const terminalLines: string[] = [];
  const completedIterations = Math.floor(stepIndex / 3);
  for (let i = 0; i < completedIterations; i++) {
    terminalLines.push(currentPreset.bodyTemplate(items[i].value));
  }
  if (!isFinished && subStep === 2 && currentItem) {
    terminalLines.push(currentPreset.bodyTemplate(currentItem.value));
  }
  if (isFinished) {
    if (selectedPresetId === 'fruits') terminalLines.push('水果吃完啦，大饱口福！');
    else if (selectedPresetId === 'countdown') terminalLines.push('🚀 点火发射！');
    else terminalLines.push('循环结束，所有元素处理完毕！');
  }

  let activeCodeLine = 1;
  if (isFinished) {
    activeCodeLine = 4;
  } else if (subStep === 0 || subStep === 1) {
    activeCodeLine = 2;
  } else if (subStep === 2) {
    activeCodeLine = 3;
  }

  const timerRef = useRef<any>(null);
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (stepIndex < totalSteps - 1) {
          setStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, stepIndex, totalSteps, speed]);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setStepIndex(0);
    setIsPlaying(false);
  };

  // ====================== Dynamic range() Lab State ======================
  const [rangeMode, setRangeMode] = useState<'1arg' | '2arg' | '3arg'>('3arg');
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeStop, setRangeStop] = useState<number>(10);
  const [rangeStep, setRangeStep] = useState<number>(2);

  // Helper to compute range elements safely
  const computeRangeList = (start: number, stop: number, step: number): number[] => {
    if (step === 0) return [];
    const result: number[] = [];
    const maxIterations = 50; // Guard against crazy UI loops
    if (step > 0) {
      for (let x = start; x < stop && result.length < maxIterations; x += step) {
        result.push(x);
      }
    } else {
      for (let x = start; x > stop && result.length < maxIterations; x += step) {
        result.push(x);
      }
    }
    return result;
  };

  // Active parameters based on mode
  const effectiveStart = rangeMode === '1arg' ? 0 : rangeStart;
  const effectiveStop = rangeStop;
  const effectiveStep = rangeMode === '3arg' ? rangeStep : 1;

  const generatedRangeNumbers = computeRangeList(effectiveStart, effectiveStop, effectiveStep);

  // Expression representation
  const rangeExpr =
    rangeMode === '1arg'
      ? `range(${effectiveStop})`
      : rangeMode === '2arg'
      ? `range(${effectiveStart}, ${effectiveStop})`
      : `range(${effectiveStart}, ${effectiveStop}, ${effectiveStep})`;

  // Presets for range lab
  const rangePresets = [
    { label: 'range(5)', mode: '1arg' as const, start: 0, stop: 5, step: 1, desc: '从 0 到 4，循环 5 次' },
    { label: 'range(1, 6)', mode: '2arg' as const, start: 1, stop: 6, step: 1, desc: '从 1 到 5，不含 6' },
    { label: 'range(0, 10, 2)', mode: '3arg' as const, start: 0, stop: 10, step: 2, desc: '偶数序列 0,2,4,6,8' },
    { label: 'range(1, 10, 2)', mode: '3arg' as const, start: 1, stop: 10, step: 2, desc: '奇数序列 1,3,5,7,9' },
    { label: 'range(10, 0, -1)', mode: '3arg' as const, start: 10, stop: 0, step: -1, desc: '倒数 10 到 1 (不含 0)' },
    { label: 'range(5, 5)', mode: '2arg' as const, start: 5, stop: 5, step: 1, desc: '空序列！0 次' },
    { label: 'range(5, 1)', mode: '2arg' as const, start: 5, stop: 1, step: 1, desc: '正步长无法倒退！0 次' },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
            <i className="fa-solid fa-arrows-rotate"></i>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                for 循环与 range() 动态演练场
              </h3>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                ⭐ GESP 1-3级核心
              </span>
            </div>
            <p className="text-xs text-slate-500">
              探究 for 循环的机械臂本质，或调节 range() 的 start / stop / step 参数实时生成数字序列！
            </p>
          </div>
        </div>

        {/* Tab switch between Conveyor and Range Lab */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('conveyor')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'conveyor'
                ? 'bg-white text-indigo-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏭 for...in 机械臂单步动画
          </button>
          <button
            onClick={() => setActiveTab('range_lab')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'range_lab'
                ? 'bg-white text-purple-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ range() 动态参数生成器 (高频必考)
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: Conveyor Animation ===================== */}
      {activeTab === 'conveyor' && (
        <div className="space-y-5">
          {/* Preset Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
              <span>选择演示容器：</span>
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedPresetId === p.id
                      ? 'bg-indigo-600 text-white shadow-2xs scale-102'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Three Questions Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/90 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-950 flex items-center space-x-1.5 text-sm">
                <span>💡 破除思维误区：for 循环的三问三答</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                当前容器: {currentPreset.badge}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 leading-relaxed pt-1">
              <div className="bg-white/90 rounded-xl p-2.5 border border-indigo-100">
                <span className="font-bold text-indigo-700 block">Q1: for 循环到底在干嘛？</span>
                <span>它不是死板的转圈圈，而是<strong>把容器（列表、字符串、range）里的元素一个一个取出来</strong>，每取出一个就执行一次缩进代码。</span>
              </div>
              <div className="bg-white/90 rounded-xl p-2.5 border border-indigo-100">
                <span className="font-bold text-indigo-700 block">Q2: 循环变量是什么？</span>
                <span><code className="text-pink-600 font-mono font-bold">for x in ...</code> 里的 <code className="text-pink-600 font-mono font-bold">x</code> 就像一个<strong>暂存抽屉</strong>，每一轮循环把当前抓到的元素存进去供你使用。</span>
              </div>
              <div className="bg-white/90 rounded-xl p-2.5 border border-indigo-100">
                <span className="font-bold text-indigo-700 block">Q3: 什么时候停下来？</span>
                <span><strong>容器里的东西抓光了，循环自动优雅结束</strong>，绝不会多转一次！如果容器是空的，一次都不会执行。</span>
              </div>
            </div>
          </div>

          {/* Conveyor Stage */}
          <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white space-y-5 border border-slate-800 shadow-inner">
            {/* Stage Top Bar: Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-slate-300 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>
                    第 {Math.min(items.length, completedIterations + (subStep > 0 ? 1 : 0))} / {items.length} 轮循环
                  </span>
                </span>
                <span className="text-xs font-mono text-slate-400">
                  [单步: {stepIndex + 1}/{totalSteps}]
                </span>
              </div>

              {/* Player Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
                  }}
                  disabled={stepIndex === 0}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center space-x-1"
                  title="上一步"
                >
                  <i className="fa-solid fa-backward-step"></i>
                  <span>上一步</span>
                </button>
                <button
                  onClick={() => {
                    if (isFinished) {
                      setStepIndex(0);
                      setIsPlaying(true);
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-md flex items-center space-x-1.5 ${
                    isPlaying
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <i className={`fa-solid ${isPlaying ? 'fa-pause' : isFinished ? 'fa-rotate-right' : 'fa-play'}`}></i>
                  <span>{isPlaying ? '暂停' : isFinished ? '重新演示' : '自动播放'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    if (stepIndex < totalSteps - 1) setStepIndex((prev) => prev + 1);
                  }}
                  disabled={isFinished}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center space-x-1"
                  title="下一步"
                >
                  <span>下一步</span>
                  <i className="fa-solid fa-forward-step"></i>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIndex(0);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                  title="重置"
                >
                  <i className="fa-solid fa-rotate-left"></i>
                </button>

                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="bg-slate-800 text-slate-300 text-xs font-mono font-bold rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-hidden"
                >
                  <option value={1600}>🐢 慢速 (1.6s)</option>
                  <option value={1000}>🚶 正常 (1.0s)</option>
                  <option value={500}>⚡ 快速 (0.5s)</option>
                </select>
              </div>
            </div>

            {/* Current Step Banner */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                isFinished
                  ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200'
                  : subStep === 0
                  ? 'bg-blue-950/80 border-blue-500/80 text-blue-200'
                  : subStep === 1
                  ? 'bg-amber-950/80 border-amber-500/80 text-amber-200'
                  : 'bg-purple-950/80 border-purple-500/80 text-purple-200'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">
                  {isFinished ? '🏁' : subStep === 0 ? '🎯' : subStep === 1 ? '📦' : '⚡'}
                </span>
                <div>
                  <span className="font-extrabold text-sm block">
                    {isFinished
                      ? '【步骤 4: 容器耗尽】循环正常结束'
                      : subStep === 0
                      ? `【步骤 1: 定位瞄准】指针指向容器第 ${currentItemIndex + 1} 个元素`
                      : subStep === 1
                      ? `【步骤 2: 取出赋值】把 "${currentItem?.label}" 放入变量抽屉`
                      : `【步骤 3: 执行循环体】执行 print() 打印`}
                  </span>
                  <span className="text-[11px] opacity-80">
                    {isFinished
                      ? '容器中已经没有下一个元素了！跳出 for 循环，继续执行下方顶格写的第一条语句。'
                      : subStep === 0
                      ? `探测到容器中存在待处理项：${currentItem?.label} (${currentItem?.desc})`
                      : subStep === 1
                      ? `赋值发生：item = ${currentItem?.label}，此时内存中的变量值被新元素刷新！`
                      : `运行缩进代码块：print("${currentPreset.bodyTemplate(currentItem?.value || '')}")`}
                  </span>
                </div>
              </div>
            </div>

            {/* The Visual Conveyor Belt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 font-bold">
                  <i className="fa-solid fa-boxes-stacked text-indigo-400"></i>
                  <span>可迭代容器传送带：{currentPreset.containerName}</span>
                </span>
                <span className="text-[11px] font-mono">共 {items.length} 个元素，按序排列</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 relative min-h-[90px] items-center">
                {items.map((item, idx) => {
                  const isPast = idx < currentItemIndex;
                  const isCurrent = idx === currentItemIndex && !isFinished;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl p-3 text-center border-2 transition-all flex flex-col items-center justify-center space-y-1 ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/30 scale-105 z-10'
                          : isPast
                          ? 'bg-slate-900 border-emerald-600/50 opacity-60'
                          : 'bg-slate-900 border-slate-700 opacity-90'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950 font-extrabold animate-pulse'
                            : isPast
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCurrent ? '👇 抓取中' : isPast ? '✓ 已出库' : item.desc}
                      </span>

                      <span className="font-mono font-black text-sm sm:text-base text-white tracking-wide">
                        {item.label}
                      </span>

                      {isCurrent && (
                        <div className="text-amber-400 text-xs font-bold">
                          {subStep === 0 && '🎯 探针锁定'}
                          {subStep === 1 && '📦 提取出库 ↗'}
                          {subStep === 2 && '⚡ 执行中...'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Variable Box & Code / Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Variable Memory Box */}
              <div className="lg:col-span-4 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                    <i className="fa-solid fa-cube"></i>
                    <span>变量暂存抽屉 (Memory Box)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    每一轮循环自动把容器抓出的元素存入此抽屉：
                  </p>
                </div>

                <div className="bg-slate-900 border-2 border-dashed border-amber-400/80 rounded-2xl p-4 text-center space-y-2 shadow-inner">
                  <span className="text-xs font-mono text-slate-400 block">
                    变量名: <span className="font-bold text-indigo-400 font-mono">item / num</span>
                  </span>
                  <div className="py-2">
                    <span
                      className={`text-2xl sm:text-3xl font-mono font-black tracking-wider transition-all inline-block ${
                        isFinished
                          ? 'text-slate-500'
                          : subStep >= 1
                          ? 'text-amber-400 scale-110 drop-shadow-md'
                          : 'text-slate-500'
                      }`}
                    >
                      {isFinished
                        ? '(已出作用域)'
                        : subStep >= 1 && currentItem
                        ? currentItem.label
                        : '⏳ 等待提取...'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block border-t border-slate-800 pt-1.5">
                    数据类型: {typeof currentItem?.value === 'number' ? 'int (整数)' : 'str (字符串)'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  💡 <strong>注意</strong>：循环变量每轮都会被新值覆盖，下一轮开始自动取下一个。
                </div>
              </div>

              {/* Code Sync & Terminal */}
              <div className="lg:col-span-8 space-y-3">
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                    <span>代码同步指针：</span>
                    <span className="text-emerald-400">高亮行 = 当前正在运行的语句</span>
                  </div>
                  <div className="space-y-0.5 pt-1">
                    <div
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeCodeLine === 1 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      1: container = {currentPreset.containerName}
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeCodeLine === 2
                          ? 'bg-amber-500/30 text-amber-200 font-bold border-l-4 border-amber-400 pl-2'
                          : 'text-slate-300'
                      }`}
                    >
                      2: for item in container:
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded transition-colors ml-4 ${
                        activeCodeLine === 3
                          ? 'bg-amber-500/30 text-amber-200 font-bold border-l-4 border-amber-400 pl-2'
                          : 'text-slate-300'
                      }`}
                    >
                      3:     print(f"当前处理: {'{'}item{'}'}")
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeCodeLine === 4
                          ? 'bg-emerald-500/30 text-emerald-200 font-bold border-l-4 border-emerald-400 pl-2'
                          : 'text-slate-500'
                      }`}
                    >
                      4: print("循环全部结束！")
                    </div>
                  </div>
                </div>

                <div className="bg-black rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1 min-h-[90px]">
                  <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] pb-1 border-b border-slate-900">
                    <i className="fa-solid fa-terminal text-slate-400"></i>
                    <span>模拟控制台输出 (Terminal Output)：</span>
                  </div>
                  <div className="text-emerald-400 space-y-0.5 pt-1">
                    {terminalLines.length === 0 ? (
                      <span className="text-slate-600 italic">等待输出... 点击「自动播放」或「下一步」</span>
                    ) : (
                      terminalLines.map((line, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <span className="text-slate-600 select-none">&gt;&gt;&gt;</span>
                          <span>{line}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: Dynamic range() Playground ===================== */}
      {activeTab === 'range_lab' && (
        <div className="space-y-5">
          {/* Top range mode selector & presets */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-purple-950 text-sm sm:text-base flex items-center space-x-2">
                  <span>⚡ range() 核心参数与动态调节模拟器</span>
                </h4>
                <p className="text-xs text-purple-800 mt-0.5">
                  随意修改下方参数，观察生成的数字序列、数轴位置与循环执行次数！
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-white p-1 rounded-xl text-xs font-bold border border-purple-200 shadow-2xs">
                <button
                  onClick={() => setRangeMode('1arg')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    rangeMode === '1arg' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  1个参数 range(stop)
                </button>
                <button
                  onClick={() => setRangeMode('2arg')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    rangeMode === '2arg' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  2个参数 range(start, stop)
                </button>
                <button
                  onClick={() => setRangeMode('3arg')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    rangeMode === '3arg' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  3个参数 range(start, stop, step)
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 border-t border-purple-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700">🎯 考级经典真题预设：</span>
              {rangePresets.map((pr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRangeMode(pr.mode);
                    setRangeStart(pr.start);
                    setRangeStop(pr.stop);
                    setRangeStep(pr.step);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white border border-purple-200 hover:border-purple-400 text-purple-900 hover:bg-purple-100 transition-colors cursor-pointer shadow-2xs"
                  title={pr.desc}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sliders / Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800">
            {/* Start control */}
            <div className={`space-y-2 p-3 rounded-xl border ${rangeMode === '1arg' ? 'opacity-40 border-slate-800 bg-slate-950/40' : 'border-emerald-500/40 bg-slate-950'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>起点 start (包含 / 左闭)</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {rangeMode === '1arg' ? '默认为 0' : rangeStart}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="20"
                value={rangeStart}
                disabled={rangeMode === '1arg'}
                onChange={(e) => setRangeStart(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>范围: -10 ~ 20</span>
                <div className="flex space-x-1">
                  <button
                    disabled={rangeMode === '1arg'}
                    onClick={() => setRangeStart((p) => p - 1)}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    -1
                  </button>
                  <button
                    disabled={rangeMode === '1arg'}
                    onClick={() => setRangeStart((p) => p + 1)}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            {/* Stop control */}
            <div className="space-y-2 p-3 rounded-xl border border-rose-500/40 bg-slate-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-rose-400"></span>
                  <span>终点 stop (绝不包含 / 右开)</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-300">
                  {rangeStop}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="20"
                value={rangeStop}
                onChange={(e) => setRangeStop(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>范围: -10 ~ 20</span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setRangeStop((p) => p - 1)}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => setRangeStop((p) => p + 1)}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>

            {/* Step control */}
            <div className={`space-y-2 p-3 rounded-xl border ${rangeMode !== '3arg' ? 'opacity-40 border-slate-800 bg-slate-950/40' : 'border-amber-500/40 bg-slate-950'}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>步长 step (每次跨越增量)</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {rangeMode !== '3arg' ? '默认为 1' : rangeStep}
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                value={rangeStep}
                disabled={rangeMode !== '3arg'}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRangeStep(val === 0 ? 1 : val); // Step can never be 0 in Python
                }}
                className="w-full accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>范围: -5 ~ 5 (步长不能为0)</span>
                <div className="flex space-x-1">
                  <button
                    disabled={rangeMode !== '3arg'}
                    onClick={() => setRangeStep((p) => (p - 1 === 0 ? -1 : p - 1))}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    -1
                  </button>
                  <button
                    disabled={rangeMode !== '3arg'}
                    onClick={() => setRangeStep((p) => (p + 1 === 0 ? 1 : p + 1))}
                    className="px-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Result & Sequence Visualization */}
          <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Python 表达式：</span>
                <span className="font-mono font-black text-sm sm:text-base text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-500/40">
                  {rangeExpr}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400">循环执行次数：</span>
                  <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${generatedRangeNumbers.length > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-600' : 'bg-rose-950 text-rose-400 border border-rose-600'}`}>
                    len = {generatedRangeNumbers.length} 次
                  </span>
                </div>
              </div>
            </div>

            {/* Generated Numbers Bubbles */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>生成的数字序列 list({rangeExpr})：</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {generatedRangeNumbers.length === 0 ? '⚠️ 空序列，for 循环一次都不会执行！' : `共 ${generatedRangeNumbers.length} 个数字`}
                </span>
              </div>

              {generatedRangeNumbers.length === 0 ? (
                <div className="bg-rose-950/40 border border-rose-600/60 rounded-xl p-4 text-center text-xs text-rose-300 space-y-1">
                  <div className="font-bold text-sm">[] (空列表)</div>
                  <p>
                    {effectiveStep > 0 && effectiveStart >= effectiveStop
                      ? `原因：正步长 (+${effectiveStep}) 只能往大数走，但起点 (${effectiveStart}) 大于或等于终点 (${effectiveStop})，无法向前移动！`
                      : effectiveStep < 0 && effectiveStart <= effectiveStop
                      ? `原因：负步长 (${effectiveStep}) 只能往小数倒数，但起点 (${effectiveStart}) 小于或等于终点 (${effectiveStop})，无法向后移动！`
                      : '此参数组合生成空序列。'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  {generatedRangeNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center bg-slate-950 border border-purple-400/60 rounded-xl px-3 py-1.5 shadow-md min-w-[50px]"
                    >
                      <span className="text-[10px] text-slate-400 font-mono">第 {idx + 1} 项</span>
                      <span className="text-lg font-black font-mono text-purple-300">{num}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real Code Preview & Terminal Sync */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 font-mono block">对应 for 循环 Python 代码：</span>
                <PythonCodeView
                  code={`for i in ${rangeExpr}:\n    print(i, end=" ")\nprint()`}
                />
              </div>

              <div className="bg-black rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1">
                <span className="text-[11px] text-slate-400 block border-b border-slate-900 pb-1">
                  控制台打印结果 (Console Output)：
                </span>
                <div className="text-emerald-400 py-2">
                  {generatedRangeNumbers.length === 0 ? (
                    <span className="text-slate-500 italic">(无任何输出，因为循环了 0 次)</span>
                  ) : (
                    <span>{generatedRangeNumbers.join(' ')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Golden Rules for range() */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <h5 className="font-extrabold text-purple-950 text-sm flex items-center space-x-2">
              <i className="fa-solid fa-graduation-cap text-purple-600"></i>
              <span>GESP 考级 range() 四大高频铁律与满分口诀</span>
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">
                  1. 口诀：左闭右开，包前不包后
                </span>
                <p className="text-slate-600">
                  <code className="bg-purple-100 text-purple-800 px-1 font-bold">range(1, 10)</code> 从 1 开始，到 9 结束，<strong>绝不包含 10</strong>！如果做题要求从 1 加到 n，必须写 <code className="font-bold text-emerald-600">range(1, n + 1)</code>。
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900 block">
                  2. 隐形默认值：省略起点是 0，省略步长是 1
                </span>
                <p className="text-slate-600">
                  写 1 个参数 <code className="bg-purple-100 text-purple-800 px-1 font-bold">range(5)</code> 等价于 <code className="font-bold">range(0, 5, 1)</code>。它生成 0, 1, 2, 3, 4，正好是 <strong>5 个数字（5 次循环）</strong>。
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-rose-800 block">
                  3. 负步长倒数陷阱：终点同样不包含！
                </span>
                <p className="text-slate-600">
                  倒数从 10 数到 1，必须写 <code className="bg-rose-50 text-rose-700 px-1 font-bold">range(10, 0, -1)</code>！因为右开不包含 0，所以最后一个取到 1。若写 <code className="font-mono">range(10, 1, -1)</code> 则只数到 2 就停了！
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-100 space-y-1">
                <span className="font-bold text-amber-800 block">
                  4. 步长方向与空序列：绝不能为 0
                </span>
                <p className="text-slate-600">
                  步长如果为正，起点必须小于终点；步长若为负，起点必须大于终点，否则得到<strong>空序列（循环 0 次）</strong>。另外，步长千万不能为 0，否则会抛出 <code className="bg-slate-100 px-1 font-mono font-bold">ValueError</code>！
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GESP 考级 3 大避坑卡片 (Always visible at bottom) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-amber-950 text-xs sm:text-sm flex items-center space-x-1.5">
          <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
          <span>GESP 1-3 级 for 循环核心做题避坑秘籍</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
            <span className="font-bold text-rose-700 block">坑点 1: range 左闭右开 [start, stop)</span>
            <p className="text-slate-600 leading-relaxed">
              <code className="bg-rose-50 text-rose-800 px-1 font-bold">range(1, 10)</code> 跑的是 1 到 9，绝对不包含 10！如果题目要求算 1 到 n 的和，循环必须写 <code className="bg-emerald-50 text-emerald-800 px-1 font-bold">range(1, n + 1)</code>！
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
            <span className="font-bold text-rose-700 block">坑点 2: 循环内改循环变量无用</span>
            <p className="text-slate-600 leading-relaxed">
              在循环体内写 <code className="bg-rose-50 text-rose-800 px-1 font-bold">i = 100</code> 并不会跳过循环！因为下一次迭代开始时，Python 会雷打不动地从容器里拿出下一个元素重新覆盖 <code className="font-bold">i</code>！
            </p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
            <span className="font-bold text-blue-700 block">考法 3: 直接遍历 vs 下标遍历</span>
            <p className="text-slate-600 leading-relaxed">
              只需读取数据用 <code className="bg-blue-50 text-blue-800 px-1 font-bold">for x in arr</code>（最推荐）；若需要修改元素或知道它在第几个位置，才用 <code className="bg-indigo-50 text-indigo-800 px-1 font-bold">for i in range(len(arr))</code>。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
