import React, { useState } from 'react';

// Python keyword list
const PYTHON_KEYWORDS = new Set([
  'import', 'from', 'as', 'def', 'return', 'if', 'elif', 'else', 'for', 'in',
  'while', 'break', 'continue', 'and', 'or', 'not', 'is', 'None', 'True',
  'False', 'lambda', 'with', 'try', 'except', 'class', 'pass', 'global',
  'yield', 'assert', 'raise', 'finally'
]);

// Common builtins & Turtle functions
const PYTHON_FUNCTIONS = new Set([
  'print', 'input', 'int', 'float', 'str', 'list', 'map', 'range', 'len',
  'type', 'abs', 'max', 'min', 'round', 'sum', 'pow', 'sorted', 'filter',
  'open', 'tuple', 'dict', 'set', 'bool', 'enumerate', 'zip', 'chr', 'ord',
  // Turtle
  'turtle', 'Turtle', 'forward', 'fd', 'backward', 'bk', 'right', 'rt',
  'left', 'lt', 'goto', 'home', 'circle', 'dot', 'pensize', 'width',
  'pencolor', 'fillcolor', 'color', 'begin_fill', 'end_fill', 'penup',
  'pu', 'pendown', 'pd', 'speed', 'hideturtle', 'ht', 'showturtle', 'st',
  'clear', 'reset', 'done', 'colormode'
]);

/**
 * Tokenizes a single line of Python code and returns highlighted spans
 */
export function renderPythonLine(line: string, lineIndex: number): React.ReactNode {
  if (!line) {
    return <span key={lineIndex}>&nbsp;</span>;
  }

  // Check if comment
  const commentIdx = line.indexOf('#');
  let codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  // Regex tokenizer for codePart: strings, identifiers/words, numbers, symbols, spaces
  const tokenRegex = /(".*?"|'.*?'|[a-zA-Z_][a-zA-Z0-9_]*|\b\d+(?:\.\d+)?\b|[(),:;=[\]{}<>]|[+\-*/%]+|\s+|[^\s])/g;
  const tokens: React.ReactNode[] = [];
  let match;
  let keyCounter = 0;

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const token = match[0];
    const key = `${lineIndex}-${keyCounter++}`;

    if (token.startsWith('"') || token.startsWith("'")) {
      tokens.push(
        <span key={key} className="text-amber-300 font-medium">
          {token}
        </span>
      );
    } else if (PYTHON_KEYWORDS.has(token)) {
      tokens.push(
        <span key={key} className="text-purple-400 font-semibold">
          {token}
        </span>
      );
    } else if (PYTHON_FUNCTIONS.has(token)) {
      tokens.push(
        <span key={key} className="text-sky-300 font-semibold">
          {token}
        </span>
      );
    } else if (/^\d+(?:\.\d+)?$/.test(token)) {
      tokens.push(
        <span key={key} className="text-emerald-400 font-mono">
          {token}
        </span>
      );
    } else if (['+', '-', '*', '/', '//', '%', '**', '=', '==', '!=', '<', '>', '<=', '>='].includes(token)) {
      tokens.push(
        <span key={key} className="text-pink-400 font-bold">
          {token}
        </span>
      );
    } else {
      tokens.push(
        <span key={key} className="text-slate-200">
          {token}
        </span>
      );
    }
  }

  return (
    <div key={lineIndex} className="table-row leading-relaxed font-mono">
      <span className="table-cell pr-4 select-none text-slate-600 text-right text-[11px] w-6">
        {lineIndex + 1}
      </span>
      <span className="table-cell">
        {tokens}
        {commentPart && (
          <span className="text-slate-400 italic">
            {commentPart}
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * Reusable read-only syntax highlighted Python code block with line numbers
 */
export const PythonCodeView: React.FC<{ code: string; className?: string }> = ({
  code,
  className = '',
}) => {
  return (
    <pre className={`bg-slate-950/90 rounded-xl p-3 text-xs overflow-x-auto border border-slate-800/90 leading-relaxed font-mono ${className}`}>
      <div className="table w-full">
        {code.split('\n').map((line, idx) => renderPythonLine(line, idx))}
      </div>
    </pre>
  );
};

interface PythonCodeBlockProps {
  itemId: string;
  code: string;
  onChangeCode: (newCode: string) => void;
  onResetCode: () => void;
  isCustomized: boolean;
}

export const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({
  itemId,
  code,
  onChangeCode,
  onResetCode,
  isCustomized,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Quick preset parameters for pensize
  const pensizePresets = [
    {
      label: '1px 极细线',
      desc: '默认最细线条',
      code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(1)  # 1px 细线\nt.forward(120)`,
    },
    {
      label: '6px 中粗笔',
      desc: '清晰笔触',
      code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(6)  # 6px 中等画笔\nt.forward(120)`,
    },
    {
      label: '15px 超粗毛笔',
      desc: '醒目粗线条',
      code: `import turtle\nt = turtle.Turtle()\n\nt.pensize(15)  # 15px 特粗毛笔\nt.forward(120)`,
    },
    {
      label: '⭐ 粗细对比测试 (1px vs 6px vs 15px)',
      desc: '三段递增对比',
      code: `import turtle\nt = turtle.Turtle()\n\n# 粗细对比测试：1px 细线 -> 6px 中等线 -> 15px 特粗线\nt.pensize(1)\nt.forward(60)\n\nt.pensize(6)\nt.forward(60)\n\nt.pensize(15)\nt.forward(60)`,
    },
  ];

  // Quick preset parameters for pencolor
  const pencolorPresets = [
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
      label: '🌌 3D浮点RGB (0.0, 0.6, 1.0)',
      desc: '天蓝色浮点三元组',
      code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# Python 3D 浮点数 RGB: (R, G, B 各在 0.0~1.0 之间)\nt.pencolor(0.0, 0.6, 1.0)  # 亮天蓝\nt.forward(100)`,
    },
    {
      label: '🔥 3D浮点RGB (1.0, 0.4, 0.0)',
      desc: '橙红色浮点三元组',
      code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# Python 3D 浮点数 RGB 模式\nt.pencolor(1.0, 0.4, 0.0)  # 橙红色\nt.forward(100)`,
    },
    {
      label: '⭐ 全彩对比模式',
      desc: '常规色与浮点RGB同台对比',
      code: `import turtle\nt = turtle.Turtle()\nt.pensize(8)\n\n# 方式一：常用英文常规颜色\nt.pencolor("red")\nt.forward(60)\n\n# 方式二：Python 3D 浮点数 RGB 模式\nt.pencolor(0.0, 0.6, 1.0)  # 亮天蓝\nt.forward(60)\n\nt.pencolor(1.0, 0.8, 0.0)  # 金黄色\nt.forward(60)`,
    },
  ];

  return (
    <div className="space-y-2.5">
      {/* Quick Visual Comparison & Parameter Tweak Bar for pensize */}
      {itemId === 'turtle-pensize' && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold text-amber-300 flex items-center space-x-1">
              <span>📏 画笔粗细直观对比条 (点击一键换参数)：</span>
            </span>
            <span className="text-[11px] text-slate-400">数字越大，毛笔越粗</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {pensizePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChangeCode(preset.code);
                  setIsEditing(false);
                }}
                className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                  code.trim() === preset.code.trim()
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-xs'
                    : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-bold text-[11px]">{preset.label}</div>
                {/* Visual stroke thickness bar */}
                <div className="my-1.5 h-4 flex items-center">
                  <div
                    className="bg-amber-400 rounded-full w-full"
                    style={{
                      height: idx === 0 ? '1px' : idx === 1 ? '6px' : idx === 2 ? '15px' : '8px',
                    }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 leading-tight">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Visual Comparison & Palette for pencolor */}
      {itemId === 'turtle-pencolor' && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold text-sky-300 flex items-center space-x-1">
              <span>🎨 常规颜色 & 3D 浮点 RGB 色板 (点击一键测试)：</span>
            </span>
            <span className="text-[11px] text-slate-400">支持 "英文名" 与 (R,G,B) 浮点数</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pencolorPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChangeCode(preset.code);
                  setIsEditing(false);
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

      {/* Code Editor / Highlighting Header Toolbar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-sans text-[11px]">
            {isEditing ? '✏️ 自定义参数编辑模式' : '🌈 语法高亮视图 (带行号)'}
          </span>
          {isCustomized && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
              已自定义
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isCustomized && (
            <button
              type="button"
              onClick={onResetCode}
              className="text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="恢复为课程默认初始代码"
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

      {/* Code Display or Editable Textarea */}
      {isEditing ? (
        <div className="space-y-1">
          <textarea
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            rows={Math.max(5, code.split('\n').length + 1)}
            className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border-2 border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed resize-y"
            placeholder="在此直接修改 Python 代码参数..."
            spellCheck={false}
          />
          <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
            <span>💡 提示：随意修改 pensize(数值) 或 pencolor("颜色名")，点击右上角「运行演示 ▶」即时生效！</span>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              切换回高亮模式 ➔
            </button>
          </div>
        </div>
      ) : (
        <pre
          className="bg-slate-950 rounded-xl p-3 text-xs overflow-x-auto border border-slate-800 leading-relaxed cursor-text selection:bg-blue-600 selection:text-white"
          onClick={() => {
            // Optional click to edit
          }}
        >
          <div className="table w-full">
            {code.split('\n').map((line, idx) => renderPythonLine(line, idx))}
          </div>
        </pre>
      )}
    </div>
  );
};
