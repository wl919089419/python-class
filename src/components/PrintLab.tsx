import React, { useState } from 'react';
import { simulatePrint } from '../utils/pythonSim';
import { PythonCodeView } from './PythonCodeBlock';

export const PrintLab: React.FC = () => {
  // Config state
  const [val1, setVal1] = useState<string>('苹果 🍎');
  const [val2, setVal2] = useState<string>('香蕉 🍌');
  const [val3, setVal3] = useState<string>('西瓜 🍉');

  const [sepType, setSepType] = useState<string>('space');
  const [customSep, setCustomSep] = useState<string>('***');

  const [endType, setEndType] = useState<string>('newline');
  const [customEnd, setCustomEnd] = useState<string>('!');

  const [demoMode, setDemoMode] = useState<'standard' | 'loop' | 'format'>('standard');
  const [loopEndChoice, setLoopEndChoice] = useState<string>('space'); // 'space' or 'newline'

  // Float format demo
  const [piValue, setPiValue] = useState<number>(3.14159265);
  const [decimalPlaces, setDecimalPlaces] = useState<number>(2);

  // Compute actual sep value
  const getSep = (): string => {
    switch (sepType) {
      case 'space':
        return ' ';
      case 'comma':
        return ', ';
      case 'dash':
        return '---';
      case 'star':
        return ' * ';
      case 'newline':
        return '\n';
      case 'empty':
        return '';
      case 'custom':
        return customSep;
      default:
        return ' ';
    }
  };

  // Compute actual end value
  const getEnd = (): string => {
    switch (endType) {
      case 'newline':
        return '\n';
      case 'space':
        return ' ';
      case 'comma':
        return ', ';
      case 'custom':
        return customEnd;
      case 'empty':
        return '';
      default:
        return '\n';
    }
  };

  const actualSep = getSep();
  const actualEnd = getEnd();

  // Generated code string
  const generateCode = (): string => {
    if (demoMode === 'standard') {
      const sepStr = sepType === 'space' ? '' : `, sep="${actualSep.replace(/\n/g, '\\n')}"`;
      const endStr = endType === 'newline' ? '' : `, end="${actualEnd.replace(/\n/g, '\\n')}"`;
      return `# 标准 print() 多变量与自定义连接/结尾符\nprint("${val1}", "${val2}", "${val3}"${sepStr}${endStr})\nprint("👉 下一行文字（观察上一行的 end 是否换行）")`;
    } else if (demoMode === 'loop') {
      const loopEnd = loopEndChoice === 'space' ? 'end=" "' : 'end="\\n"';
      return `# 循环输出对比：默认换行 \\n vs 不换行空格 end=" "\nfor i in range(1, 6):\n    print(i, ${loopEnd})\n\n# 注意：若使用了 end=" "，循环结束后建议空打一个 print() 补齐换行！\nprint()`;
    } else {
      return `# 格式化输出浮点数（保留指定小数位数）\npi = ${piValue}\n# 方式 1: f-string 语法糖（GESP 推荐，清晰好写）\nprint(f"保留 ${decimalPlaces} 位小数: {pi:.${decimalPlaces}f}")\n\n# 方式 2: 百分号经典格式化\nprint("%%.${decimalPlaces}f" %% pi)`;
    }
  };

  // Compute simulated console output
  const computeOutput = (): string => {
    if (demoMode === 'standard') {
      const line1 = [val1, val2, val3].join(actualSep) + actualEnd;
      const line2 = '👉 下一行文字（观察上一行的 end 是否换行）';
      return line1 + line2;
    } else if (demoMode === 'loop') {
      const numbers = [1, 2, 3, 4, 5];
      const delim = loopEndChoice === 'space' ? ' ' : '\n';
      return numbers.join(delim) + delim + (loopEndChoice === 'space' ? '\n[换行完成]' : '');
    } else {
      const formatted = piValue.toFixed(decimalPlaces);
      return `保留 ${decimalPlaces} 位小数: ${formatted}\n${formatted}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-md space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md shadow-blue-500/20">
            &gt;_
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                print() 交互式参数实验室
              </h3>
              <span className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                GESP 1-2级必考
              </span>
            </div>
            <p className="text-xs text-slate-500">
              随意修改 sep 分隔符与 end 结尾符，实时观察控制台黑框里的魔法变化！
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setDemoMode('standard')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              demoMode === 'standard' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            sep & end 实验
          </button>
          <button
            onClick={() => setDemoMode('loop')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              demoMode === 'loop' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            循环不换行对比
          </button>
          <button
            onClick={() => setDemoMode('format')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              demoMode === 'format' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            小数保留 %.2f
          </button>
        </div>
      </div>

      {/* Control Panel */}
      {demoMode === 'standard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          {/* Values Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>待打印的 3 个变量内容：</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="变量 1"
              />
              <input
                type="text"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="变量 2"
              />
              <input
                type="text"
                value={val3}
                onChange={(e) => setVal3(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="变量 3"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              💡 提示：在 Python 中，当 print(a, b, c) 传入多个变量时，变量之间就会由 <code className="bg-white px-1 rounded font-bold text-blue-600">sep</code> 串联！
            </p>
          </div>

          {/* Sep & End Controls */}
          <div className="grid grid-cols-2 gap-3">
            {/* sep selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>sep (分隔符)</span>
                <span className="text-[10px] text-slate-500 font-mono">默认空格 " "</span>
              </label>
              <select
                value={sepType}
                onChange={(e) => setSepType(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="space">单个空格 " "</option>
                <option value="comma">逗号 ", "</option>
                <option value="dash">横杠 "---"</option>
                <option value="star">星号 " * "</option>
                <option value="newline">回车换行 \n</option>
                <option value="empty">空串 "" (紧挨着)</option>
                <option value="custom">自定义输入...</option>
              </select>
              {sepType === 'custom' && (
                <input
                  type="text"
                  value={customSep}
                  onChange={(e) => setCustomSep(e.target.value)}
                  placeholder="输入自定义分隔符"
                  className="w-full text-xs font-mono px-2 py-1 bg-white border border-blue-300 rounded mt-1"
                />
              )}
            </div>

            {/* end selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>end (结尾符)</span>
                <span className="text-[10px] text-slate-500 font-mono">默认换行 \n</span>
              </label>
              <select
                value={endType}
                onChange={(e) => setEndType(e.target.value)}
                className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="newline">默认换行 \n</option>
                <option value="space">单个空格 " " (不换行)</option>
                <option value="comma">逗号 ", "</option>
                <option value="empty">空串 "" (紧接后文)</option>
                <option value="custom">自定义输入...</option>
              </select>
              {endType === 'custom' && (
                <input
                  type="text"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  placeholder="输入自定义结尾符"
                  className="w-full text-xs font-mono px-2 py-1 bg-white border border-blue-300 rounded mt-1"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loop mode controls */}
      {demoMode === 'loop' && (
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-900">
              🔥 考级核心对比：打印数字序列 1 2 3 4 5
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLoopEndChoice('space')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  loopEndChoice === 'space'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                使用 end=" " (单行横向排开)
              </button>
              <button
                onClick={() => setLoopEndChoice('newline')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  loopEndChoice === 'newline'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                默认 \n (每打一个数字换一行)
              </button>
            </div>
          </div>
          <p className="text-xs text-amber-800">
            ⭐ 考级题目常要求：“请在一行内输出由空格隔开的结果”。如果直接写 print(i)，每个数字都会被换到下一行，机器评分直接判 0 分！因此必须写 <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-amber-700">print(i, end=" ")</code>！
          </p>
        </div>
      )}

      {/* Float format mode controls */}
      {demoMode === 'format' && (
        <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-indigo-950">待格式化的原数值：</label>
            <input
              type="number"
              step="0.0001"
              value={piValue}
              onChange={(e) => setPiValue(Number(e.target.value))}
              className="text-xs font-mono px-3 py-1.5 bg-white border border-slate-200 rounded-lg w-40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-indigo-950">保留小数位数 ({decimalPlaces} 位)：</label>
            <div className="flex items-center space-x-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setDecimalPlaces(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                    decimalPlaces === n
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  .{n}f
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Code & Simulated Console Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Python Code Card */}
        <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-sans ml-1 text-slate-300">Python 代码预览</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(generateCode())}
              className="hover:text-white transition-colors cursor-pointer text-[11px]"
              title="复制这段代码"
            >
              <i className="fa-regular fa-copy mr-1"></i>复制
            </button>
          </div>
          <PythonCodeView code={generateCode()} />
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
          <div className="min-h-[90px] text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed py-1">
            {computeOutput()}
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
