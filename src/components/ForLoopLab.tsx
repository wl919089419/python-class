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
    name: '水果篮列表 (最生动直观)',
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
    name: 'range(5, 0, -1) 倒数倒计时',
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
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fruits');
  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Animation step:
  // For N items, total cycle steps = N * 3 + 1 (last finish step)
  // Substep 0: 瞄准容器中的下一个元素 (Targeting)
  // Substep 1: 从容器中取出并放进变量抽屉 (Extract & Assign)
  // Substep 2: 执行循环体代码 print() (Execute Body)
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // ms per step

  const items = currentPreset.items;
  const totalSteps = items.length * 3 + 1;

  // Derive current state from stepIndex
  const isFinished = stepIndex >= items.length * 3;
  const currentItemIndex = isFinished ? items.length : Math.floor(stepIndex / 3);
  const subStep = isFinished ? 3 : stepIndex % 3;
  const currentItem = items[currentItemIndex] || null;

  // Collected terminal outputs up to current step
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

  // Active code line: 1 = definition, 2 = for loop, 3 = print body, 4 = after loop
  let activeCodeLine = 1;
  if (isFinished) {
    activeCodeLine = 4;
  } else if (subStep === 0 || subStep === 1) {
    activeCodeLine = 2; // for item in container:
  } else if (subStep === 2) {
    activeCodeLine = 3; // print(...)
  }

  // Auto-play timer
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

  const handleStepNext = () => {
    setIsPlaying(false);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

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
                for ... in ... 循环本质与单步动画拆解
              </h3>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                ⭐ 考级核心本质
              </span>
            </div>
            <p className="text-xs text-slate-500">
              大白话本质：Python 的 for 循环不是计数器，而是<strong>「逐个从容器里取东西」的机械臂传送带</strong>！
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id)}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedPresetId === p.id
                  ? 'bg-white text-indigo-700 shadow-2xs font-extrabold scale-102'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p.name.split(' ')[0]} {p.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Essence Explanation Alert */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/90 rounded-2xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-indigo-950 flex items-center space-x-1.5 text-sm">
            <span>💡 破除思维误区：for 循环的三问三答</span>
          </span>
          <span className="text-[11px] font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
            当前容器类型: {currentPreset.badge}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 leading-relaxed pt-1">
          <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
            <span className="font-bold text-indigo-700 block">Q1: for 循环到底在干嘛？</span>
            <span>它不是死板的转圈圈，而是<strong>把容器（列表、字符串、range）里的元素一个一个取出来</strong>，每取出一个就执行一次缩进代码。</span>
          </div>
          <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
            <span className="font-bold text-indigo-700 block">Q2: 循环变量是什么？</span>
            <span><code className="text-pink-600 font-mono font-bold">for x in ...</code> 里的 <code className="text-pink-600 font-mono font-bold">x</code> 就像一个<strong>暂存抽屉</strong>，每一轮循环把当前抓到的元素存进去供你使用。</span>
          </div>
          <div className="bg-white/80 rounded-xl p-2.5 border border-indigo-100">
            <span className="font-bold text-indigo-700 block">Q3: 什么时候停下来？</span>
            <span><strong>容器里的东西抓光了，循环自动优雅结束</strong>，绝不会多转一次！如果容器是空的，一次都不会执行。</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: The Conveyor & Mechanical Arm */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white space-y-5 border border-slate-800 shadow-inner">
        {/* Stage Top Bar: Controls & Step Description */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-slate-300 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                第 {Math.min(items.length, completedIterations + (subStep > 0 ? 1 : 0))} / {items.length} 轮循环
              </span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              [单步拆解: {stepIndex + 1}/{totalSteps}]
            </span>
          </div>

          {/* Player Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStepPrev}
              disabled={stepIndex === 0}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center space-x-1"
              title="上一步"
            >
              <i className="fa-solid fa-backward-step"></i>
              <span>上一步</span>
            </button>
            <button
              onClick={handleTogglePlay}
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
              onClick={handleStepNext}
              disabled={isFinished}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold transition-colors cursor-pointer border border-slate-700 flex items-center space-x-1"
              title="下一步"
            >
              <span>下一步</span>
              <i className="fa-solid fa-forward-step"></i>
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title="重置"
            >
              <i className="fa-solid fa-rotate-left"></i>
            </button>

            {/* Speed toggle */}
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

        {/* Current Step Banner (Explains what the Python engine is doing right now) */}
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

        {/* The Visual Conveyor Belt: Container elements row */}
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
              const isFuture = idx > currentItemIndex || isFinished;

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
                  {/* Indicator badge */}
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

                  {/* Value */}
                  <span className="font-mono font-black text-sm sm:text-base text-white tracking-wide">
                    {item.label}
                  </span>

                  {/* Little mechanical arrow if current */}
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

        {/* Two Columns: Variable Memory Box & Code/Terminal Synchronizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left: Variable Memory Box */}
          <div className="lg:col-span-4 bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <i className="fa-solid fa-cube"></i>
                <span>变量暂存抽屉 (Memory Box)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                每次循环自动把容器里抓出来的物品放在这里：
              </p>
            </div>

            {/* Glowing Box */}
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
              💡 <strong>注意</strong>：循环变量每一轮都会被新值覆盖，下一轮开始时自动取下一个。
            </div>
          </div>

          {/* Right: Code Sync & Terminal Output */}
          <div className="lg:col-span-8 space-y-3">
            {/* Synchronized Code Box */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
                <span>代码同步指针：</span>
                <span className="text-emerald-400">黄色高亮 = 当前正在执行的代码行</span>
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

            {/* Terminal Output Console */}
            <div className="bg-black rounded-xl p-3 border border-slate-800 font-mono text-xs space-y-1 min-h-[90px]">
              <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] pb-1 border-b border-slate-900">
                <i className="fa-solid fa-terminal text-slate-400"></i>
                <span>模拟控制台实时输出 (Terminal Output)：</span>
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

      {/* GESP 考级 3 大避坑铁律卡片 */}
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
