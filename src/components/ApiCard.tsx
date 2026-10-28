import React, { useState } from 'react';
import { ApiItem } from '../types';
import { PrintLab } from './PrintLab';
import { InputLab } from './InputLab';
import { FStringLab } from './FStringLab';
import { ForLoopLab } from './ForLoopLab';
import { renderPythonLine } from './PythonCodeBlock';

interface ApiCardProps {
  item: ApiItem;
  onOpenTurtle?: () => void;
}

export const ApiCard: React.FC<ApiCardProps> = ({ item, onOpenTurtle }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [code, setCode] = useState<string>(item.codeExample);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isCustomized = code !== item.codeExample;

  const handleRun = () => {
    setIsRunning(true);

    // If it's a turtle item, dispatch live execution event to canvas with current (possibly customized) code
    if (item.stageId === 'turtle' || item.interactiveType === 'turtle') {
      window.dispatchEvent(
        new CustomEvent('pykids-run-turtle', {
          detail: { code: code },
        })
      );
      // Automatically open the floating canvas drawer so the student immediately sees the drawing!
      window.dispatchEvent(new CustomEvent('pykids-open-turtle-drawer'));
    }

    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 250);
  };

  const handleScrollToTurtle = () => {
    // Open floating drawer directly so student does not lose their position on the page
    window.dispatchEvent(new CustomEvent('pykids-open-turtle-drawer'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      id={`api-${item.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 space-y-5"
    >
      {/* Header: Title, Level, Difficulty, Tags */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-tight">
              {item.name}
            </h3>
            <span className="text-xs font-sans font-semibold text-slate-500">
              — {item.title}
            </span>
            {(!item.level.includes('启蒙') && item.stageId !== 'turtle' && item.level) && (
              <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                {item.level}
              </span>
            )}
            <span className="text-xs text-amber-500" title={`难度: ${item.difficulty}`}>
              {item.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {item.tags
              .filter((tag) => !tag.includes('启蒙'))
              .map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
          </div>
        </div>

        {/* Quick Copy code */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
          aria-label={`复制 ${item.name} 示例代码`}
        >
          <i className={copied ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'}></i>
          <span>{copied ? '已复制！' : '复制代码'}</span>
        </button>
      </div>

      {/* Part 1: 小学生秒懂解释 */}
      <section className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start space-x-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 font-bold text-sm shadow-2xs">
          💡
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
            1. 小学生秒懂解释 (大白话比喻)
          </h4>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed whitespace-pre-wrap">
            {item.summary}
          </p>
        </div>
      </section>

      {/* Part 2: 语法格式与参数解剖 */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>2. 语法格式与参数解剖</span>
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            返回值类型: <span className="font-bold text-indigo-600">{item.returnType}</span>
          </span>
        </div>

        {/* Syntax block with colored labels & full syntax highlighting */}
        <div className="bg-slate-950 rounded-xl p-3.5 text-white font-mono text-xs border border-slate-800 space-y-1.5 shadow-xs">
          <div className="flex items-center space-x-1.5 text-slate-400 select-none text-[11px] pb-1 border-b border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span># 语法定义与形式</span>
          </div>
          <pre className="overflow-x-auto leading-relaxed font-mono">
            <div className="table w-full">
              {item.syntax.split('\n').map((line, idx) => renderPythonLine(line, idx))}
            </div>
          </pre>
        </div>

        {/* Parameter dissection list */}
        {item.params.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {item.params.map((param) => (
              <div
                key={param.name}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {param.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                      {param.type}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      param.required
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {param.required ? '必填' : `可选 (默认: ${param.defaultVal || 'None'})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight whitespace-pre-wrap">{param.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Part 3: 直观交互/可视化演练场 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>3. 直观交互与演练场</span>
          </h4>

          {(item.stageId === 'turtle' || item.interactiveType === 'turtle') && (
            <button
              onClick={handleScrollToTurtle}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <span>🐢 唤起海龟悬浮大画板</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </button>
          )}
        </div>

        {/* If this is the special print_lab or input_lab or fstring_lab or for_lab */}
        {item.interactiveType === 'print_lab' ? (
          <PrintLab />
        ) : item.interactiveType === 'input_lab' ? (
          <InputLab />
        ) : item.interactiveType === 'fstring_lab' ? (
          <FStringLab />
        ) : item.interactiveType === 'for_lab' ? (
          <ForLoopLab />
        ) : (
          /* Standard interactive code runner with terminal output */
          <div className="space-y-2">
            <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-slate-400 font-sans ml-1">
                    Python 3.12 演练代码
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.stageId === 'turtle' && hasRun && (
                    <button
                      onClick={handleScrollToTurtle}
                      className="text-[11px] font-sans font-bold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-700/60 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>展开悬浮大画板 ↗</span>
                    </button>
                  )}
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <i className={`fa-solid ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
                    <span>{isRunning ? '正在运行...' : '运行演示 ▶'}</span>
                  </button>
                </div>
              </div>

              {/* Preset Visual Comparison & Quick Tweak for pensize */}
              {item.id === 'turtle-pensize' && (
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-bold text-amber-300 flex items-center space-x-1">
                      <span>📏 画笔粗细即时对比条 (点击一键换参数)：</span>
                    </span>
                    <span className="text-[11px] text-slate-400">数字越大，毛笔越粗</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        label: '1px 极细线',
                        desc: '默认最细线条',
                        code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(1)  # 1px 细线\nt.forward(120)`,
                        thickness: '1px',
                      },
                      {
                        label: '6px 中粗笔',
                        desc: '清晰笔触',
                        code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(6)  # 6px 中等画笔\nt.forward(120)`,
                        thickness: '6px',
                      },
                      {
                        label: '15px 超粗毛笔',
                        desc: '醒目粗线条',
                        code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(15)  # 15px 特粗毛笔\nt.forward(120)`,
                        thickness: '15px',
                      },
                      {
                        label: '⭐ 粗细对比测试',
                        desc: '1px vs 6px vs 15px',
                        code: `import turtle\nt = turtle.Turtle()\n\n# 粗细对比测试：1px 细线 -> 6px 中等线 -> 15px 特粗线\nt.pensize(1)\nt.forward(60)\n\nt.pensize(6)\nt.forward(60)\n\nt.pensize(15)\nt.forward(60)`,
                        thickness: '8px',
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCode(preset.code);
                          setIsEditing(false);
                          setHasRun(false);
                        }}
                        className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                          code.trim() === preset.code.trim()
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-xs'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{preset.label}</div>
                        <div className="my-1.5 h-4 flex items-center">
                          <div
                            className="bg-amber-400 rounded-full w-full"
                            style={{ height: preset.thickness }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Color Palette & 3D Float RGB for pencolor */}
              {item.id === 'turtle-pencolor' && (
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-bold text-sky-300 flex items-center space-x-1">
                      <span>🎨 常规颜色 & 3D 浮点 RGB 色板 (点击一键测试)：</span>
                    </span>
                    <span className="text-[11px] text-slate-400">支持 "英文名" 与 (R,G,B) 浮点数</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      {
                        label: '🔴 鲜红 "red"',
                        desc: '常规颜色名',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\nt.pencolor("red")  # 常用英文颜色名\nt.forward(100)`,
                      },
                      {
                        label: '🔵 皇家蓝 "royalblue"',
                        desc: '常用英文色',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\nt.pencolor("royalblue")  # 常用英文颜色名\nt.forward(100)`,
                      },
                      {
                        label: '🟡 金色 "gold"',
                        desc: '常用英文色',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\nt.pencolor("gold")  # 常用英文颜色名\nt.forward(100)`,
                      },
                      {
                        label: '🌌 3D浮点 (0.0, 0.6, 1.0)',
                        desc: '天蓝 3D 浮点数',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# Python 3D 浮点数 RGB: (R, G, B 各在 0.0~1.0 之间)\nt.pencolor(0.0, 0.6, 1.0)  # 亮天蓝\nt.forward(100)`,
                      },
                      {
                        label: '🔥 3D浮点 (1.0, 0.4, 0.0)',
                        desc: '橙红 3D 浮点数',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# Python 3D 浮点数 RGB 模式\nt.pencolor(1.0, 0.4, 0.0)  # 橙红色\nt.forward(100)`,
                      },
                      {
                        label: '⭐ 全彩对比测试',
                        desc: '常规色与浮点RGB',
                        code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# 方式一：常用英文常规颜色\nt.pencolor("red")\nt.forward(60)\n\n# 方式二：Python 3D 浮点数 RGB 模式\nt.pencolor(0.0, 0.6, 1.0)  # 亮天蓝\nt.forward(60)\n\nt.pencolor(1.0, 0.8, 0.0)  # 金黄色\nt.forward(60)`,
                      },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCode(preset.code);
                          setIsEditing(false);
                          setHasRun(false);
                        }}
                        className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                          code.trim() === preset.code.trim()
                            ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-xs'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-bold text-[11px] truncate">{preset.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-1">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Code toolbar: Edit toggle & Reset */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-sans text-[11px]">
                    {isEditing ? '✏️ 自定义参数编辑中' : '🌈 语法高亮代码块 (带行号)'}
                  </span>
                  {isCustomized && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      已修改参数
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {isCustomized && (
                    <button
                      type="button"
                      onClick={() => {
                        setCode(item.codeExample);
                        setHasRun(false);
                      }}
                      className="text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                      title="恢复课程初始代码"
                    >
                      ↺ 恢复初始
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-sans font-bold transition-colors cursor-pointer border ${
                      isEditing
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {isEditing ? '✓ 完成修改' : '✏️ 修改代码参数'}
                  </button>
                </div>
              </div>

              {/* Editable Textarea in edit mode */}
              {isEditing && (
                <div className="space-y-1">
                  <textarea
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setHasRun(false);
                    }}
                    rows={Math.max(5, code.split('\n').length + 1)}
                    className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border-2 border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed resize-y"
                    placeholder="在此直接修改 Python 代码参数..."
                    spellCheck={false}
                  />
                  <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                    <span>💡 随意修改数值或颜色名，点击右上角「运行演示 ▶」即时生效！</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      切换回高亮模式 ➔
                    </button>
                  </div>
                </div>
              )}

              {/* Syntax Highlighted Code block */}
              <pre
                className={`bg-slate-950/80 rounded-xl p-3 text-xs overflow-x-auto border border-slate-800/90 leading-relaxed font-mono ${
                  isEditing ? 'hidden' : 'block'
                }`}
              >
                <div className="table w-full">
                  {code.split('\n').map((line, idx) => renderPythonLine(line, idx))}
                </div>
              </pre>

              {/* Console Output */}
              <div className="border-t border-slate-800 pt-3 space-y-1 font-mono">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-sans">
                  <span className="flex items-center space-x-1">
                    <i className="fa-solid fa-terminal text-blue-400"></i>
                    <span>模拟终端运行结果：</span>
                  </span>
                  {hasRun && (
                    <span className="text-emerald-400 text-[10px] font-semibold flex items-center space-x-1">
                      <span>✓ 执行成功</span>
                      {item.stageId === 'turtle' ? (
                        <span>(已同步在海龟画布绘制)</span>
                      ) : (
                        <span>(Exit Code 0)</span>
                      )}
                    </span>
                  )}
                </div>

                <div className="bg-black/60 rounded-lg p-3 text-slate-100 min-h-[50px] whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {hasRun ? (
                    <div>
                      {item.stageId === 'turtle' && (
                        <div className="mb-2 p-2 bg-emerald-950/50 border border-emerald-800/80 rounded text-emerald-300 font-sans text-xs flex items-center justify-between">
                          <span>🐢 <strong>海龟指令执行完毕！</strong>已在悬浮大画板中同步绘制。</span>
                          <button
                            onClick={handleScrollToTurtle}
                            className="underline text-emerald-200 hover:text-white font-bold ml-2 cursor-pointer"
                          >
                            展开悬浮大画板查看 ↗
                          </button>
                        </div>
                      )}
                      <div>{item.expectedOutput}</div>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic font-sans text-xs">
                      👉 点击右上角「运行演示 ▶」查看真实运行输出...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Part 4: GESP 做题常见坑点 (避坑指南) */}
      <section className="bg-rose-50/80 border-2 border-rose-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-base">🛡️</span>
          <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wide">
            4. GESP 做题常见坑点 (避坑高分秘籍)
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed whitespace-pre-wrap pl-6">
          {item.pitfall}
        </p>

        {item.examTip && (
          <div className="mt-2 pt-2 border-t border-rose-200/60 pl-6 flex items-start space-x-2 text-xs text-rose-800 whitespace-pre-wrap leading-relaxed">
            <span className="font-bold shrink-0">🎯 考情分析:</span>
            <span>{item.examTip}</span>
          </div>
        )}
      </section>
    </article>
  );
};
