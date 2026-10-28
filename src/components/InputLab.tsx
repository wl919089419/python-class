import React, { useState } from 'react';
import { simulateInputPipeline } from '../utils/pythonSim';
import { PythonCodeView } from './PythonCodeBlock';

export const InputLab: React.FC = () => {
  // Part 1: "3" + "5" = "35" Trap State
  const [trapA, setTrapA] = useState<string>('3');
  const [trapB, setTrapB] = useState<string>('5');
  const [trapType, setTrapType] = useState<'str' | 'int'>('str');

  // Part 2: 3 GESP Templates State
  const [activeTemplate, setActiveTemplate] = useState<'tpl1' | 'tpl2' | 'tpl3'>('tpl3');

  // Template 3 Interactive Input
  const [pipelineInput, setPipelineInput] = useState<string>('10 20 30');

  // Run pipeline
  const pipelineResult = simulateInputPipeline(pipelineInput);

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-md space-y-6">
      {/* Title */}
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
              为什么输入 3 和 5 相加会等于 35？GESP 机考三大输入模板动态步进解析！
            </p>
          </div>
        </div>

        {/* Templates Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTemplate('tpl3')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'tpl3'
                ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模板3: split+map (必考)
          </button>
          <button
            onClick={() => setActiveTemplate('tpl1')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTemplate === 'tpl1' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            模板1: 单数 int(input())
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

      {/* Part 1: Classic "3" + "5" = "35" Trap Interactive Card */}
      <div className="bg-rose-50/70 border-2 border-rose-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-rose-600 font-extrabold text-xs uppercase tracking-wider">
              ⚠️ 警惕考级名场面：输入 3 和 5，相加结果是 8 还是 35？
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setTrapType('str')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                trapType === 'str' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-rose-800'
              }`}
            >
              直接 a + b (错误)
            </button>
            <button
              onClick={() => setTrapType('int')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                trapType === 'int' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white text-emerald-800'
              }`}
            >
              int(a) + int(b) (正确)
            </button>
          </div>
        </div>

        {/* Input box row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono font-bold text-slate-700">a = input():</span>
            <input
              type="text"
              value={trapA}
              onChange={(e) => setTrapA(e.target.value)}
              className="w-16 px-2 py-1 text-xs font-mono text-center font-bold bg-white border border-rose-300 rounded-md"
            />
          </div>
          <span className="text-sm font-bold text-slate-400">+</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono font-bold text-slate-700">b = input():</span>
            <input
              type="text"
              value={trapB}
              onChange={(e) => setTrapB(e.target.value)}
              className="w-16 px-2 py-1 text-xs font-mono text-center font-bold bg-white border border-rose-300 rounded-md"
            />
          </div>
          <span className="text-sm font-bold text-slate-400">=</span>

          {/* Real-time Result Pill */}
          <div className="flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-lg font-mono font-bold text-sm shadow-xs ${
                trapType === 'str'
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {trapType === 'str' ? `"${trapA}${trapB}" (字符串拼接！)` : `${Number(trapA) + Number(trapB)} (数学加法)`}
            </div>
            <span className="text-xs text-slate-600">
              {trapType === 'str'
                ? '❌ input() 读进来永远带着双引号！两个字符串相加只是连在一起！'
                : '✅ 加上 int() 成功脱去双引号，按真正数学相加！'}
            </span>
          </div>
        </div>
      </div>

      {/* Part 2: Selected Template Display */}
      {activeTemplate === 'tpl3' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-emerald-950 flex items-center space-x-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-emerald-600"></i>
                <span>单行多个数字输入：a, b = map(int, input().split()) 四步可视化拆解</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">尝试修改输入文本：</span>
                <input
                  type="text"
                  value={pipelineInput}
                  onChange={(e) => setPipelineInput(e.target.value)}
                  placeholder="例如 10 20 或 5 8 9"
                  className="px-3 py-1 text-xs font-mono bg-white border border-emerald-300 rounded-lg w-44 font-bold text-emerald-900"
                />
              </div>
            </div>

            {/* 4 Steps Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {pipelineResult.steps.map((step) => {
                return (
                  <div
                    key={step.stepIndex}
                    className={`rounded-xl p-3 border shadow-2xs space-y-2 transition-all ${
                      step.isError
                        ? 'bg-rose-50 border-rose-300'
                        : 'bg-white border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                        {step.stepIndex}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {step.dataType}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">{step.description}</p>

                    {/* Step Visual Preview */}
                    <div className="bg-slate-900 text-emerald-400 rounded-lg p-2 font-mono text-xs overflow-x-auto min-h-[40px] flex items-center">
                      {step.isError ? (
                        <span className="text-rose-400 text-[11px]">{step.errorMessage}</span>
                      ) : typeof step.data === 'string' ? (
                        <span>"{step.data}"</span>
                      ) : Array.isArray(step.data) ? (
                        <span>
                          [{step.data.map((x) => (typeof x === 'string' ? `"${x}"` : x)).join(', ')}]
                        </span>
                      ) : (
                        <span>{JSON.stringify(step.data)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Standard Code block for Template 3 */}
          <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs space-y-2">
            <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800 flex justify-between">
              <span>GESP 机考标准写法 (点击直接抄作业)：</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(`a, b = map(int, input().split())\nprint(a + b)`)
                }
                className="hover:text-emerald-400 cursor-pointer"
              >
                <i className="fa-regular fa-copy mr-1"></i>复制代码
              </button>
            </div>
            <pre className="text-emerald-400">
{`# 1. 一行正好两个整数时（直接解包赋值给 a, b）
a, b = map(int, input().split())
print("两数相加:", a + b)

# 2. 一行有若干个未知数量的整数时（转为列表）
nums = list(map(int, input().split()))
print("输入了", len(nums), "个数字，最大值是", max(nums))`}
            </pre>
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
