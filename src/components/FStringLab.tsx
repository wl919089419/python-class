import React, { useState } from 'react';
import { PythonCodeView } from './PythonCodeBlock';

export const FStringLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basics' | 'align' | 'numbers' | 'padzero' | 'quotes'>('align');

  // Tab 1: Basics & Expression
  const [studentName, setStudentName] = useState<string>('小明');
  const [score, setScore] = useState<number>(95);
  const [numA, setNumA] = useState<number>(7);
  const [numB, setNumB] = useState<number>(8);

  // Tab 2: Alignment & Padding
  const [alignText, setAlignText] = useState<string>('Python');
  const [alignWidth, setAlignWidth] = useState<number>(12);
  const [alignDir, setAlignDir] = useState<'<' | '>' | '^'>('^');
  const [fillChar, setFillChar] = useState<string>('*');

  // Tab 3: Numbers & Percent & Commas
  const [floatVal, setFloatVal] = useState<number>(3.14159265);
  const [decimals, setDecimals] = useState<number>(2);
  const [bigNumber, setBigNumber] = useState<number>(10000000);
  const [ratioVal, setRatioVal] = useState<number>(0.8526);

  // Tab 4: Zero Padding (Time clock)
  const [hour, setHour] = useState<number>(9);
  const [minute, setMinute] = useState<number>(5);
  const [second, setSecond] = useState<number>(3);

  // Generate python code and expected output
  const renderCurrentExperiment = () => {
    switch (activeTab) {
      case 'basics': {
        const code = `# 1. 基础变量插值
name = "${studentName}"
score = ${score}
print(f"学生姓名: {name}，GESP 考级成绩: {score}")

# 2. 花括号 {} 内直接执行计算与三元表达式 (超方便！)
a, b = ${numA}, ${numB}
print(f"{a} 乘以 {b} 等于: {a * b}")
print(f"考级判定: {'优秀 🌟' if score >= 90 else '及格 👍'}")
print(f"名字大写: {name.upper()}")`;

        const output = `学生姓名: ${studentName}，GESP 考级成绩: ${score}\n${numA} 乘以 ${numB} 等于: ${numA * numB}\n考级判定: ${score >= 90 ? '优秀 🌟' : '及格 👍'}\n名字大写: ${studentName.toUpperCase()}`;
        return { code, output };
      }
      case 'align': {
        const fill = fillChar || ' ';
        const alignFormat = `${fill}${alignDir}${alignWidth}`;
        const code = `# 对齐与填充（制表输出与整齐打印绝技）
# 格式规范：{变量:填充字符 对齐方向 宽度}
# < 代表左对齐，> 代表右对齐，^ 代表居中对齐
word = "${alignText}"
print(f"原词: '{word}'")
print(f"格式化后: '{word:${alignFormat}}'")

# 经典考级应用：居中打印分割线
print(f"{' GESP 满分秘籍 ':=^30}")`;

        let alignedStr = alignText;
        const totalPad = Math.max(0, alignWidth - alignText.length);
        if (alignDir === '<') {
          alignedStr = alignText + fill.repeat(totalPad);
        } else if (alignDir === '>') {
          alignedStr = fill.repeat(totalPad) + alignText;
        } else {
          const leftPad = Math.floor(totalPad / 2);
          const rightPad = totalPad - leftPad;
          alignedStr = fill.repeat(leftPad) + alignText + fill.repeat(rightPad);
        }

        const bannerTotal = Math.max(0, 30 - ' GESP 满分秘籍 '.length);
        const bLeft = Math.floor(bannerTotal / 2);
        const bRight = bannerTotal - bLeft;
        const banner = '='.repeat(bLeft) + ' GESP 满分秘籍 ' + '='.repeat(bRight);

        const output = `原词: '${alignText}'\n格式化后: '${alignedStr}'\n${banner}`;
        return { code, output };
      }
      case 'numbers': {
        const code = `# 1. 保留小数位数 (:.${decimals}f)
val = ${floatVal}
print(f"保留 ${decimals} 位小数: {val:.${decimals}f}")

# 2. 千分位逗号分隔 (:,) —— 读大数字不再眼花！
money = ${bigNumber}
print(f"千分位显示: {money:,}")

# 3. 百分比格式 (:.1%) —— 自动乘以 100 并加 % 符号！
ratio = ${ratioVal}
print(f"正确率: {ratio:.1%}")

# 4. 进制快速转换 (:b 二进制, :o 八进制, :x 十六进制)
n = 42
print(f"42 的二进制: {n:b}, 十六进制: {n:x}")`;

        const formattedFloat = floatVal.toFixed(decimals);
        const formattedBig = bigNumber.toLocaleString('en-US');
        const formattedRatio = (ratioVal * 100).toFixed(1) + '%';
        const output = `保留 ${decimals} 位小数: ${formattedFloat}\n千分位显示: ${formattedBig}\n正确率: ${formattedRatio}\n42 的二进制: 101010, 十六进制: 2a`;
        return { code, output };
      }
      case 'padzero': {
        const code = `# 整数高位补零 (机考高频考题：输出标准电子钟时分秒 09:05:03)
# 格式规范：{:02d} 表示总宽度为 2 位，不足 2 位在前面补 0
h, m, s = ${hour}, ${minute}, ${second}
print(f"标准时间: {h:02d}:{m:02d}:{s:02d}")

# 编号补零示例：生成 001, 002...
student_id = 7
print(f"学员编号: #{student_id:04d}")`;

        const pad = (n: number, w: number) => String(n).padStart(w, '0');
        const output = `标准时间: ${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}\n学员编号: #${pad(7, 4)}`;
        return { code, output };
      }
      case 'quotes': {
        const code = `# ⚠️ f-string 避坑 1：内外引号不可冲突
student = {"name": "小红", "age": 10}
# ❌ 错误写法：外层双引号，字典键也用双引号 -> 报 SyntaxError
# print(f"名字: {student["name"]}") 

# ✅ 正确写法：外层双引号，内层字典用单引号
print(f"名字: {student['name']}, 年龄: {student['age']}")

# ⚠️ f-string 避坑 2：字面输出花括号 {}
# 在 f-string 内部想要真正打印出字符 '{' 或 '}'，必须打双重花括号 {{}}！
print(f"集合的语法格式是: {{1, 2, 3}}")`;

        const output = `名字: 小红, 年龄: 10\n集合的语法格式是: {1, 2, 3}`;
        return { code, output };
      }
    }
  };

  const { code, output } = renderCurrentExperiment();

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md shadow-indigo-500/20">
            {'f"{}"'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                f-string 格式化全能专题实验室
              </h3>
              <span className="bg-indigo-100 text-indigo-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
                Python 3.6+ 核心考点
              </span>
            </div>
            <p className="text-xs text-slate-500">
              不仅仅是保留小数！变量嵌入、算式运算、左右居中对齐、时间补零、百分比排版一网打尽。
            </p>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('align')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'align' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📐 对齐与填充
          </button>
          <button
            onClick={() => setActiveTab('padzero')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'padzero' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {'⏰ 时间补零 {:02d}'}
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'numbers' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💰 小数与千分位
          </button>
          <button
            onClick={() => setActiveTab('basics')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'basics' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔤 算式与变量
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'quotes' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ 引号与花括号避坑
          </button>
        </div>
      </div>

      {/* Interactive Controls according to activeTab */}
      <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-3">
        {activeTab === 'align' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">文字内容：</label>
              <input
                type="text"
                value={alignText}
                onChange={(e) => setAlignText(e.target.value)}
                className="w-full bg-white border border-indigo-200 px-2 py-1.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">对齐方向：</label>
              <div className="flex gap-1">
                {(['<', '^', '>'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setAlignDir(d)}
                    className={`flex-1 py-1.5 rounded-lg font-bold font-mono cursor-pointer ${
                      alignDir === d ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {d === '<' ? '左 <' : d === '^' ? '居中 ^' : '右 >'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">总宽度 ({alignWidth})：</label>
              <input
                type="number"
                min={4}
                max={30}
                value={alignWidth}
                onChange={(e) => setAlignWidth(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-indigo-200 px-2 py-1.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">填充字符：</label>
              <input
                type="text"
                maxLength={1}
                value={fillChar}
                onChange={(e) => setFillChar(e.target.value || ' ')}
                className="w-full bg-white border border-indigo-200 px-2 py-1.5 rounded-lg font-mono text-center font-bold"
              />
            </div>
          </div>
        )}

        {activeTab === 'padzero' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">小时 hour (0-23)：</label>
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">分钟 minute (0-59)：</label>
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">秒钟 second (0-59)：</label>
              <input
                type="number"
                min={0}
                max={59}
                value={second}
                onChange={(e) => setSecond(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'numbers' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">小数位数 ({decimals} 位)：</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDecimals(d)}
                    className={`flex-1 py-1 rounded font-mono font-bold cursor-pointer ${
                      decimals === d ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 border'
                    }`}
                  >
                    .{d}f
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">千分位大数值：</label>
              <input
                type="number"
                value={bigNumber}
                onChange={(e) => setBigNumber(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">百分比原始小数 (0~1)：</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={1}
                value={ratioVal}
                onChange={(e) => setRatioVal(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2.5 py-1.5 rounded-lg font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'basics' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">学生姓名：</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-white border border-indigo-200 px-2 py-1 rounded font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">考级成绩：</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2 py-1 rounded font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">操作数 A：</label>
              <input
                type="number"
                value={numA}
                onChange={(e) => setNumA(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2 py-1 rounded font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">操作数 B：</label>
              <input
                type="number"
                value={numB}
                onChange={(e) => setNumB(Number(e.target.value))}
                className="w-full bg-white border border-indigo-200 px-2 py-1 rounded font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="text-xs text-indigo-900 leading-relaxed">
            💡 <strong>双重花括号记忆口诀</strong>：单花括号 <code className="bg-white px-1 font-bold">{"{}"}</code> 代表“这里要执行 Python 表达式”；双花括号 <code className="bg-white px-1 font-bold">{"{{}}"}</code> 代表“我只想打印一个纯正的大花括号文本”！
          </div>
        )}
      </div>

      {/* Code & Simulated Console Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Python Code Block */}
        <div className="bg-slate-900 rounded-xl p-4 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] font-sans ml-1 text-slate-300">生成的 Python f-string 代码</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="hover:text-emerald-400 cursor-pointer text-[11px]"
            >
              <i className="fa-regular fa-copy mr-1"></i>复制代码
            </button>
          </div>
          <PythonCodeView code={code} />
        </div>

        {/* Real-time Console */}
        <div className="bg-black rounded-xl p-4 text-white font-mono text-xs space-y-2 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <i className="fa-solid fa-terminal text-blue-400"></i>
              <span className="text-[11px] font-sans text-slate-300">控制台模拟输出结果 (Console)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-sans">● 实时运算</span>
          </div>
          <div className="min-h-[110px] text-slate-100 overflow-x-auto whitespace-pre-wrap leading-relaxed py-1">
            {output}
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
