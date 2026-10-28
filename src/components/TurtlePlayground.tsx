import React, { useState, useRef, useEffect } from 'react';
import { TurtlePosition, applyTurtleCommand, executePythonTurtleScript } from '../utils/pythonSim';

export const TurtlePlayground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initialTurtle: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0, // facing right (east)
    isPenDown: true,
    penColor: '#2563eb',
    penSize: 3,
    fillColor: '#fbbf24',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  const [turtle, setTurtle] = useState<TurtlePosition>(initialTurtle);
  const [zoom, setZoom] = useState<number>(1);
  const [customCmd, setCustomCmd] = useState<string>('circle(60, steps=6)');
  const [isDrawingPreset, setIsDrawingPreset] = useState<boolean>(false);
  const [lastExecutedMsg, setLastExecutedMsg] = useState<string>('就绪');

  // Listen for execution events from API cards (e.g. clicking "运行演示 ▶" on a Turtle API card)
  useEffect(() => {
    const handleRunTurtleEvent = (e: any) => {
      const code = e.detail?.code;
      if (typeof code === 'string') {
        setTurtle((prev) => executePythonTurtleScript(prev, code));
        setLastExecutedMsg(`已运行: ${code.split('\n')[0].slice(0, 30)}`);
      }
    };
    window.addEventListener('pykids-run-turtle', handleRunTurtleEvent);
    return () => window.removeEventListener('pykids-run-turtle', handleRunTurtleEvent);
  }, []);

  // Redraw canvas whenever turtle state updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background fill (supports bgcolor)
    const bgColor = turtle.bgColor || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Grid contrast based on background
    const isDarkBg = bgColor === 'black' || bgColor === '#000000' || bgColor.includes('15, 23') || bgColor.includes('rgb(0,');
    ctx.strokeStyle = isDarkBg ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw center axes
    ctx.strokeStyle = isDarkBg ? 'rgba(255, 255, 255, 0.2)' : '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw center label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('(0, 0)', centerX + 4, centerY - 4);

    // Draw drawing history
    turtle.history.forEach((h) => {
      if (h.type === 'polygon' && h.points && h.points.length >= 3) {
        ctx.fillStyle = h.fillColor || '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(centerX + h.points[0].x, centerY - h.points[0].y);
        for (let i = 1; i < h.points.length; i++) {
          ctx.lineTo(centerX + h.points[i].x, centerY - h.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = h.color;
        ctx.lineWidth = h.size;
        ctx.stroke();
      } else if (h.type === 'line' && h.toX !== undefined && h.toY !== undefined) {
        ctx.strokeStyle = h.color;
        ctx.lineWidth = h.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX + h.fromX, centerY - h.fromY);
        ctx.lineTo(centerX + h.toX, centerY - h.toY);
        ctx.stroke();
      } else if (h.type === 'dot' && h.radius) {
        ctx.fillStyle = h.color;
        ctx.beginPath();
        ctx.arc(centerX + h.fromX, centerY - h.fromY, h.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (h.type === 'text' && h.text) {
        ctx.save();
        ctx.font = h.font || 'bold 15px JetBrains Mono, sans-serif';
        ctx.fillStyle = h.color || turtle.penColor;
        ctx.textAlign = (h.align as CanvasTextAlign) || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(h.text, centerX + h.fromX, centerY - h.fromY);
        ctx.restore();
      }
    });

    // Draw the cute turtle avatar
    const tX = centerX + turtle.x;
    const tY = centerY - turtle.y;
    const rad = (-turtle.angle * Math.PI) / 180;

    ctx.save();
    ctx.translate(tX, tY);
    ctx.rotate(rad);

    // Turtle body
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Turtle shell pattern
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Turtle head
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(11, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Turtle flippers
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(5, -8, 3, 0, Math.PI * 2);
    ctx.arc(5, 8, 3, 0, Math.PI * 2);
    ctx.arc(-6, -8, 2.5, 0, Math.PI * 2);
    ctx.arc(-6, 8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Turtle direction pointer / pen tip
    ctx.fillStyle = turtle.isPenDown ? turtle.penColor : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(19, 0);
    ctx.lineWidth = turtle.penSize;
    ctx.stroke();

    ctx.restore();
  }, [turtle]);

  const executeCommand = (cmd: string, val?: any, val2?: any, val3?: any, val4?: any) => {
    setTurtle((prev) => applyTurtleCommand(prev, cmd, val, val2, val3, val4));
    setLastExecutedMsg(`${cmd}(${val !== undefined ? val : ''})`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCmd.trim()) return;

    // Standard Python command parser (handles goto(100, 50), fd(80), begin_fill(), etc.)
    setTurtle((prev) => executePythonTurtleScript(prev, customCmd));
    setLastExecutedMsg(customCmd);
  };

  // Preset Draw Routines
  const runPreset = async (type: string) => {
    if (isDrawingPreset) return;
    setIsDrawingPreset(true);

    setTurtle(initialTurtle);
    await new Promise((r) => setTimeout(r, 80));

    if (type === 'star') {
      // Golden 5-pointed star with gold fill!
      let curr = { ...initialTurtle, penColor: '#d97706', penSize: 2, fillColor: '#fbbf24' };
      curr = applyTurtleCommand(curr, 'begin_fill');
      for (let i = 0; i < 5; i++) {
        curr = applyTurtleCommand(curr, 'fd', 100);
        curr = applyTurtleCommand(curr, 'rt', 144);
        setTurtle(curr);
        await new Promise((r) => setTimeout(r, 100));
      }
      curr = applyTurtleCommand(curr, 'end_fill');
      setTurtle(curr);
    } else if (type === 'square') {
      // Four color square
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
      let curr = { ...initialTurtle, penSize: 4 };
      for (let i = 0; i < 4; i++) {
        curr = applyTurtleCommand(curr, 'pencolor', colors[i]);
        curr = applyTurtleCommand(curr, 'fd', 80);
        curr = applyTurtleCommand(curr, 'rt', 90);
        setTurtle(curr);
        await new Promise((r) => setTimeout(r, 120));
      }
    } else if (type === 'fillDemo') {
      // Fill demonstration (color filled triangle)
      let curr = { ...initialTurtle, penColor: '#dc2626', penSize: 3, fillColor: '#fde047' };
      curr = applyTurtleCommand(curr, 'begin_fill');
      for (let i = 0; i < 3; i++) {
        curr = applyTurtleCommand(curr, 'fd', 90);
        curr = applyTurtleCommand(curr, 'lt', 120);
        setTurtle(curr);
        await new Promise((r) => setTimeout(r, 120));
      }
      curr = applyTurtleCommand(curr, 'end_fill');
      setTurtle(curr);
    } else if (type === 'spiral') {
      // Colorful spiral
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
      let curr = { ...initialTurtle, penSize: 2 };
      for (let i = 0; i < 24; i++) {
        curr = applyTurtleCommand(curr, 'pencolor', colors[i % colors.length]);
        curr = applyTurtleCommand(curr, 'fd', i * 4);
        curr = applyTurtleCommand(curr, 'rt', 60);
        setTurtle(curr);
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    setIsDrawingPreset(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🐢</span>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
              Python Turtle 互动模拟画布
            </h3>
            <p className="text-xs text-slate-500">
              支持标准 Python 语法：goto(x, y)、begin_fill() 色彩填充与动作命令
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setZoom((prev) => Math.max(0.6, +(prev - 0.15).toFixed(2)))}
              className="px-2 py-0.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
              title="缩小"
            >
              <i className="fa-solid fa-magnifying-glass-minus text-[11px]"></i>
            </button>
            <button
              onClick={() => setZoom(1)}
              className="px-1.5 py-0.5 text-slate-700 font-bold cursor-pointer text-[11px]"
              title="100% 复位"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)))}
              className="px-2 py-0.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer"
              title="放大"
            >
              <i className="fa-solid fa-magnifying-glass-plus text-[11px]"></i>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-600 font-semibold">
              坐标: ({Math.round(turtle.x)}, {Math.round(turtle.y)})
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">朝向: {turtle.angle}°</span>
            <span className="text-slate-300">|</span>
            <span className={turtle.isPenDown ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
              {turtle.isPenDown ? '落笔 ✍️' : '抬笔 ✋'}
            </span>
            <span className="text-slate-300">|</span>
            <span className={turtle.isFilling ? 'text-purple-600 font-bold' : 'text-slate-400'}>
              {turtle.isFilling ? '正在填充 🎨' : '未填充'}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Area with smooth zoom */}
      <div className="relative w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100 flex items-center justify-center shadow-inner min-h-[320px]">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className="shadow-xs rounded-lg overflow-hidden bg-white"
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={320}
            className="block max-w-full"
          />
        </div>

        {/* Status watermark */}
        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 bg-white/90 px-2 py-0.5 rounded shadow-2xs">
          状态: {lastExecutedMsg}
        </div>
      </div>

      {/* Preset One-Click Demos */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-600">经典考题图案一键绘制：</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              let curr = { ...turtle, penColor: '#8b5cf6', penSize: 3, fillColor: '#c4b5fd' };
              curr = applyTurtleCommand(curr, 'begin_fill');
              curr = applyTurtleCommand(curr, 'circle', 65, 360, 6);
              curr = applyTurtleCommand(curr, 'end_fill');
              curr = applyTurtleCommand(curr, 'write', '正六边形 steps=6', false, 'center');
              setTurtle(curr);
            }}
            disabled={isDrawingPreset}
            className="px-2.5 py-1.5 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition-colors cursor-pointer"
          >
            🔷 正六边形 circle(65, steps=6)
          </button>
          <button
            onClick={() => {
              let curr = { ...turtle, penColor: '#2563eb', penSize: 3 };
              curr = applyTurtleCommand(curr, 'write', 'Python GESP 100分！', false, 'center');
              setTurtle(curr);
            }}
            disabled={isDrawingPreset}
            className="px-2.5 py-1.5 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          >
            ✍️ write() 文本输出
          </button>
          <button
            onClick={() => executeCommand('bgcolor', turtle.bgColor === 'black' ? '#ffffff' : 'black')}
            className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            🌓 bgcolor({turtle.bgColor === 'black' ? '"white"' : '"black"'})
          </button>
          <button
            onClick={() => runPreset('star')}
            disabled={isDrawingPreset}
            className="px-2.5 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            🌟 金色五角星
          </button>
          <button
            onClick={() => runPreset('fillDemo')}
            disabled={isDrawingPreset}
            className="px-2.5 py-1.5 text-xs font-bold bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            🎨 闭合填充演示
          </button>
        </div>
      </div>

      {/* Motion & Function Buttons Grid with Python function names */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => executeCommand('fd', 60)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          fd(60) 前进
        </button>
        <button
          onClick={() => executeCommand('bk', 40)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          bk(40) 后退
        </button>
        <button
          onClick={() => executeCommand('rt', 90)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          rt(90) 右转
        </button>
        <button
          onClick={() => executeCommand('lt', 45)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          lt(45) 左转
        </button>
        <button
          onClick={() => executeCommand('circle', 35)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          circle(35) 画圆
        </button>
        <button
          onClick={() => executeCommand('circle', 40, 360, 6)}
          className="px-2 py-2 text-xs font-mono font-bold bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-xl transition-all border border-purple-200 cursor-pointer"
        >
          circle(40, steps=6)
        </button>
        <button
          onClick={() => executeCommand('write', '你好Python', false, 'center')}
          className="px-2 py-2 text-xs font-mono font-bold bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 rounded-xl transition-all border border-sky-200 cursor-pointer"
        >
          write("你好Python")
        </button>
        <button
          onClick={() => executeCommand('goto', 80, 60)}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          goto(80, 60) 瞬移
        </button>
        <button
          onClick={() => executeCommand('goto', -80, -40)}
          className="px-2 py-2 text-xs font-mono font-bold bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 rounded-xl transition-all border border-purple-200 cursor-pointer"
        >
          goto(-80, -40)
        </button>
        <button
          onClick={() => executeCommand('begin_fill')}
          className="px-2 py-2 text-xs font-mono font-bold bg-yellow-100 hover:bg-yellow-500 hover:text-white text-yellow-900 rounded-xl transition-all border border-yellow-300 cursor-pointer"
        >
          begin_fill()
        </button>
        <button
          onClick={() => executeCommand('end_fill')}
          className="px-2 py-2 text-xs font-mono font-bold bg-yellow-100 hover:bg-yellow-500 hover:text-white text-yellow-900 rounded-xl transition-all border border-yellow-300 cursor-pointer"
        >
          end_fill()
        </button>
        <button
          onClick={() => executeCommand('fillcolor', '#fbbf24')}
          className="px-2 py-2 text-xs font-mono font-bold bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-900 rounded-xl transition-all border border-amber-300 cursor-pointer"
        >
          fillcolor('gold')
        </button>
        <button
          onClick={() => executeCommand('fillcolor', '#38bdf8')}
          className="px-2 py-2 text-xs font-mono font-bold bg-sky-50 hover:bg-sky-500 hover:text-white text-sky-900 rounded-xl transition-all border border-sky-300 cursor-pointer"
        >
          fillcolor('sky')
        </button>
        <button
          onClick={() => executeCommand('home')}
          className="px-2 py-2 text-xs font-mono font-bold bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl transition-all border border-slate-200 cursor-pointer"
        >
          home() 回家
        </button>
      </div>

      {/* Pen toggles & Color Pickers */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600">画笔:</span>
          <button
            onClick={() => executeCommand(turtle.isPenDown ? 'pu' : 'pd')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              turtle.isPenDown
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {turtle.isPenDown ? '落笔中 (点击 pu())' : '抬笔中 (点击 pd())'}
          </button>
        </div>

        {/* Color Switchers */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-bold text-slate-600">画笔色:</span>
          {['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0f172a'].map((col) => (
            <button
              key={col}
              onClick={() => executeCommand('pencolor', col)}
              style={{ backgroundColor: col }}
              className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                turtle.penColor === col ? 'scale-125 ring-2 ring-offset-1 ring-slate-400' : 'hover:scale-110'
              }`}
            />
          ))}
        </div>

        {/* Clear & Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => executeCommand('clear')}
            className="px-2.5 py-1 text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
          >
            clear() 擦除
          </button>
          <button
            onClick={() => setTurtle(initialTurtle)}
            className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 cursor-pointer"
          >
            reset() 重置
          </button>
        </div>
      </div>

      {/* Standard Python syntax input form */}
      <form onSubmit={handleCustomSubmit} className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Python 标准函数命令行：</span>
          <span className="text-[11px] text-blue-600 font-mono">支持 goto(x, y)、begin_fill()、circle(r)、fd(d) 等</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-xs text-slate-400">
              &gt;&gt;&gt;
            </span>
            <input
              type="text"
              value={customCmd}
              onChange={(e) => setCustomCmd(e.target.value)}
              placeholder="输入标准 Python 命令，如 goto(80, 50) 或 fd(100); rt(90) 或 begin_fill()"
              className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
          >
            运行 Python 代码
          </button>
        </div>
      </form>
    </div>
  );
};
