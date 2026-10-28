import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TurtlePosition, applyTurtleCommand, executePythonTurtleScript } from '../utils/pythonSim';

interface FloatingTurtleCanvasProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingTurtleCanvas: React.FC<FloatingTurtleCanvasProps> = ({
  isOpen,
  onToggle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const initialTurtle: TurtlePosition = {
    x: 0,
    y: 0,
    angle: 0,
    isPenDown: true,
    penColor: '#2563eb',
    penSize: 3,
    fillColor: '#fbbf24',
    bgColor: '#ffffff',
    isFilling: false,
    currentFillPath: [],
    history: [],
  };

  const [turtle, setTurtle] = useState<TurtlePosition>(initialTurtle);
  const [zoom, setZoom] = useState<number>(1);
  const [customCmd, setCustomCmd] = useState<string>('circle(80, steps=6)');
  const [isDrawingPreset, setIsDrawingPreset] = useState<boolean>(false);
  const [lastExecutedMsg, setLastExecutedMsg] = useState<string>('就绪');
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Large coordinate canvas dimensions
  // Normal mode: 1200 x 800 (X: -600..600, Y: -400..400)
  // Maximized / Fullscreen mode: 2000 x 1200 (X: -1000..1000, Y: -600..600)
  const canvasWidth = isMaximized ? 2000 : 1200;
  const canvasHeight = isMaximized ? 1200 : 800;
  const xBound = canvasWidth / 2;
  const yBound = canvasHeight / 2;

  // Center scroll position on open, resize, or reset
  const centerViewport = useCallback(() => {
    if (viewportRef.current) {
      const vp = viewportRef.current;
      vp.scrollLeft = Math.max(0, (vp.scrollWidth - vp.clientWidth) / 2);
      vp.scrollTop = Math.max(0, (vp.scrollHeight - vp.clientHeight) / 2);
    }
  }, []);

  // Auto-fit function to fit the expansive canvas into current viewport with (0, 0) centered
  const fitToScreen = useCallback(() => {
    if (!viewportRef.current) return;
    const vp = viewportRef.current;
    const padding = 28;
    const availableW = Math.max(100, vp.clientWidth - padding);
    const availableH = Math.max(100, vp.clientHeight - padding);
    if (availableW <= 0 || availableH <= 0) return;

    const scale = Math.min(availableW / canvasWidth, availableH / canvasHeight);
    const targetScale = Math.max(0.2, Math.min(1.5, +scale.toFixed(3)));
    setZoom(targetScale);
    setTimeout(centerViewport, 40);
  }, [canvasWidth, canvasHeight, centerViewport]);

  // Adjust zoom and center origin on open or maximize change
  useEffect(() => {
    if (isOpen) {
      fitToScreen();
      const timer = setTimeout(() => {
        fitToScreen();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMaximized, fitToScreen]);

  // Keep centered on window or viewport resize
  useEffect(() => {
    if (!isOpen || !viewportRef.current) return;
    const ro = new ResizeObserver(() => {
      fitToScreen();
    });
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [isOpen, fitToScreen]);

  // Listen for execution events from cards
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

  // Canvas redraw effect with rich large coordinate system & tick marks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Background fill
    const bgColor = turtle.bgColor || '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const isDarkBg = bgColor === 'black' || bgColor === '#000000' || bgColor.includes('15, 23') || bgColor.includes('rgb(0,');

    // 1. Minor grid lines (every 50px)
    ctx.strokeStyle = isDarkBg ? 'rgba(255, 255, 255, 0.04)' : '#f8fafc';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Major grid lines (every 100px)
    ctx.strokeStyle = isDarkBg ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Quadrant watermark markers for elementary students
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = isDarkBg ? 'rgba(255, 255, 255, 0.16)' : 'rgba(100, 116, 139, 0.22)';
    ctx.textAlign = 'center';
    ctx.fillText('第 II 象限 (-X, +Y)', centerX - 360, centerY - 240);
    ctx.fillText('第 I 象限 (+X, +Y)', centerX + 360, centerY - 240);
    ctx.fillText('第 III 象限 (-X, -Y)', centerX - 360, centerY + 240);
    ctx.fillText('第 IV 象限 (+X, -Y)', centerX + 360, centerY + 240);

    // 4. Main X and Y Axes (thick blue lines with arrows)
    ctx.strokeStyle = isDarkBg ? '#38bdf8' : '#2563eb';
    ctx.lineWidth = 2.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // X Axis Arrow at right
    ctx.fillStyle = isDarkBg ? '#38bdf8' : '#2563eb';
    ctx.beginPath();
    ctx.moveTo(width - 4, centerY);
    ctx.lineTo(width - 20, centerY - 8);
    ctx.lineTo(width - 20, centerY + 8);
    ctx.closePath();
    ctx.fill();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, height);
    ctx.lineTo(centerX, 0);
    ctx.stroke();

    // Y Axis Arrow at top
    ctx.beginPath();
    ctx.moveTo(centerX, 4);
    ctx.lineTo(centerX - 8, 20);
    ctx.lineTo(centerX + 8, 20);
    ctx.closePath();
    ctx.fill();

    // Axis Header Labels
    ctx.font = 'bold 15px JetBrains Mono, monospace';
    ctx.fillStyle = isDarkBg ? '#38bdf8' : '#1d4ed8';
    ctx.textAlign = 'right';
    ctx.fillText(`+X 轴 (0°) [±${centerX}]`, width - 26, centerY - 14);
    ctx.textAlign = 'left';
    ctx.fillText(`+Y 轴 (90°) [±${centerY}]`, centerX + 16, 26);

    // 5. Ticks & Numerical Labels along X and Y axes
    ctx.font = 'bold 13px JetBrains Mono, monospace';
    ctx.fillStyle = isDarkBg ? '#cbd5e1' : '#475569';
    ctx.strokeStyle = isDarkBg ? '#38bdf8' : '#2563eb';
    ctx.lineWidth = 2;

    // Ticks on X axis
    for (let xCoord = -centerX + 100; xCoord < centerX; xCoord += 100) {
      if (xCoord === 0) continue;
      const px = centerX + xCoord;
      ctx.beginPath();
      ctx.moveTo(px, centerY - 7);
      ctx.lineTo(px, centerY + 7);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillText(String(xCoord), px, centerY + 22);
    }

    // Ticks on Y axis
    for (let yCoord = -centerY + 100; yCoord < centerY; yCoord += 100) {
      if (yCoord === 0) continue;
      const py = centerY - yCoord; // Inverted Y for canvas
      ctx.beginPath();
      ctx.moveTo(centerX - 7, py);
      ctx.lineTo(centerX + 7, py);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillText(String(yCoord), centerX + 12, py + 5);
    }

    // Origin (0, 0) indicator with target ring and clear text
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Concentric ring around (0, 0) for extra clarity
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 13, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isDarkBg ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 14px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('(0, 0) 原点 [中心]', centerX + 18, centerY - 10);

    // 6. Draw drawing history
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
        ctx.font = h.font || 'bold 16px JetBrains Mono, sans-serif';
        ctx.fillStyle = h.color || turtle.penColor;
        ctx.textAlign = (h.align as CanvasTextAlign) || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(h.text, centerX + h.fromX, centerY - h.fromY);
        ctx.restore();
      }
    });

    // 7. Draw turtle avatar
    const tX = centerX + turtle.x;
    const tY = centerY - turtle.y;
    const rad = (-turtle.angle * Math.PI) / 180;

    ctx.save();
    ctx.translate(tX, tY);
    ctx.rotate(rad);

    // Body
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // Shell border
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Head
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(14, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    // Flippers
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(7, -10, 3.5, 0, Math.PI * 2);
    ctx.arc(7, 10, 3.5, 0, Math.PI * 2);
    ctx.arc(-8, -10, 3, 0, Math.PI * 2);
    ctx.arc(-8, 10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Pointer / pen
    ctx.strokeStyle = turtle.isPenDown ? turtle.penColor : '#94a3b8';
    ctx.lineWidth = Math.max(2, turtle.penSize);
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();

    ctx.restore();
  }, [turtle, canvasWidth, canvasHeight, isOpen]);

  const executeCommand = (cmd: string, val?: any, val2?: any, val3?: any, val4?: any) => {
    setTurtle((prev) => applyTurtleCommand(prev, cmd, val, val2, val3, val4));
    setLastExecutedMsg(`${cmd}(${val !== undefined ? val : ''})`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCmd.trim()) return;
    setTurtle((prev) => executePythonTurtleScript(prev, customCmd));
    setLastExecutedMsg(customCmd);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.3, Math.min(2.5, +(prev + delta).toFixed(2))));
  };

  const setExactZoom = (z: number) => setZoom(z);

  // Preset Draw Demos (Including expansive macro demos)
  const runPreset = async (type: string) => {
    if (isDrawingPreset) return;
    setIsDrawingPreset(true);

    if (type === 'hexagon') {
      let curr: TurtlePosition = { ...initialTurtle, penColor: '#8b5cf6', penSize: 3, fillColor: '#c4b5fd' };
      curr = applyTurtleCommand(curr, 'begin_fill');
      curr = applyTurtleCommand(curr, 'circle', 100, 360, 6);
      curr = applyTurtleCommand(curr, 'end_fill');
      curr = applyTurtleCommand(curr, 'write', '大正六边形 R=100 (steps=6)', false, 'center');
      setTurtle(curr);
    } else if (type === 'triangle') {
      let curr: TurtlePosition = { ...initialTurtle, penColor: '#ef4444', penSize: 3, fillColor: '#fca5a5' };
      curr = applyTurtleCommand(curr, 'begin_fill');
      curr = applyTurtleCommand(curr, 'circle', 90, 360, 3);
      curr = applyTurtleCommand(curr, 'end_fill');
      curr = applyTurtleCommand(curr, 'write', '等边三角形 R=90 (steps=3)', false, 'center');
      setTurtle(curr);
    } else if (type === 'macroGalaxy') {
      // Expansive macro coordinate demo traveling through 4 quadrants
      let curr: TurtlePosition = { ...initialTurtle, penSize: 3, bgColor: '#0f172a' };
      // Quadrant 1
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'goto', 350, 220);
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#38bdf8');
      curr = applyTurtleCommand(curr, 'circle', 60, 360, 6);
      curr = applyTurtleCommand(curr, 'write', '第一象限 (350, 220)', false, 'center');

      // Quadrant 2
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'goto', -350, 220);
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#f59e0b');
      curr = applyTurtleCommand(curr, 'circle', 60, 360, 5);
      curr = applyTurtleCommand(curr, 'write', '第二象限 (-350, 220)', false, 'center');

      // Quadrant 3
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'goto', -350, -220);
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#ec4899');
      curr = applyTurtleCommand(curr, 'circle', 60, 360, 8);
      curr = applyTurtleCommand(curr, 'write', '第三象限 (-350, -220)', false, 'center');

      // Quadrant 4
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'goto', 350, -220);
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#10b981');
      curr = applyTurtleCommand(curr, 'circle', 60, 360, 4);
      curr = applyTurtleCommand(curr, 'write', '第四象限 (350, -220)', false, 'center');

      // Center
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'home');
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#fbbf24');
      curr = applyTurtleCommand(curr, 'write', '🌌 大范围全象限漫游', false, 'center');

      setTurtle(curr);
    } else if (type === 'star') {
      let curr: TurtlePosition = { ...initialTurtle, penColor: '#d97706', penSize: 3, fillColor: '#fbbf24' };
      curr = applyTurtleCommand(curr, 'begin_fill');
      for (let i = 0; i < 5; i++) {
        curr = applyTurtleCommand(curr, 'fd', 160);
        curr = applyTurtleCommand(curr, 'rt', 144);
        setTurtle(curr);
        await new Promise((r) => setTimeout(r, 60));
      }
      curr = applyTurtleCommand(curr, 'end_fill');
      curr = applyTurtleCommand(curr, 'write', '金色巨星 (边长 160px)', false, 'center');
      setTurtle(curr);
    } else if (type === 'writeDemo') {
      let curr: TurtlePosition = { ...initialTurtle, penColor: '#2563eb', penSize: 3 };
      curr = applyTurtleCommand(curr, 'pu');
      curr = applyTurtleCommand(curr, 'goto', 0, 70);
      curr = applyTurtleCommand(curr, 'write', 'Python GESP 大范围坐标系', false, 'center', ['Arial', 20, 'bold']);
      curr = applyTurtleCommand(curr, 'goto', 0, -30);
      curr = applyTurtleCommand(curr, 'pencolor', '#10b981');
      curr = applyTurtleCommand(curr, 'write', '全屏模式 X: [-1000, 1000] | Y: [-600, 600]', false, 'center', ['Courier', 15, 'bold']);
      curr = applyTurtleCommand(curr, 'goto', 0, -100);
      curr = applyTurtleCommand(curr, 'pd');
      curr = applyTurtleCommand(curr, 'pencolor', '#8b5cf6');
      curr = applyTurtleCommand(curr, 'circle', 50, 360, 6);
      setTurtle(curr);
    }

    setIsDrawingPreset(false);
  };

  return (
    <>
      {/* Floating Toggle Tab / Button on the right */}
      <aside aria-label="海龟悬浮画布快捷栏" className="fixed right-4 bottom-22 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 border border-emerald-300/40 cursor-pointer transition-all hover:scale-105 group"
            title="点击唤起可缩放海龟绘图大画布"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🐢</span>
            <span>海龟悬浮大画板</span>
            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
          </button>
        )}
      </aside>

      {/* Floating Resizable/Zoomable Drawer Panel */}
      {isOpen && (
        <aside
          aria-label="海龟悬浮绘图工作台"
          className={`fixed z-50 transition-all duration-200 ${
            isMaximized
              ? 'inset-2 sm:inset-4 bg-white rounded-3xl shadow-2xl border-2 border-emerald-400 flex flex-col overflow-hidden'
              : 'right-3 sm:right-6 bottom-4 sm:bottom-6 w-[95vw] sm:w-[760px] md:w-[860px] lg:w-[940px] max-h-[92vh] bg-white rounded-3xl shadow-2xl border-2 border-emerald-400 flex flex-col overflow-hidden'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-900 text-white shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🐢</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Python Turtle 悬浮大画板
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-500/40">
                    {isMaximized
                      ? '🌌 全屏超大坐标系 (2000×1200 像素)'
                      : '大范围坐标系 (1200×800 像素)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isMaximized
                    ? `全屏宽广视野：X 轴范围 [-${xBound}, ${xBound}]，Y 轴范围 [-${yBound}, ${yBound}]`
                    : `随时随地直观作画：X 轴范围 [-${xBound}, ${xBound}]，Y 轴范围 [-${yBound}, ${yBound}]`}
                </p>
              </div>
            </div>

            {/* Window & Zoom Controls */}
            <div className="flex items-center space-x-2">
              {/* Zoom Buttons & Centering Presets */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs font-mono">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
                  title="缩小画布"
                >
                  <i className="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <button
                  onClick={() => setExactZoom(0.5)}
                  className={`px-1.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                    Math.abs(zoom - 0.5) < 0.05 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="50% 宏观鸟瞰"
                >
                  50%
                </button>
                <button
                  onClick={() => setExactZoom(1)}
                  className={`px-1.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                    Math.abs(zoom - 1) < 0.05 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                  title="100% 原始尺寸"
                >
                  100%
                </button>
                <button
                  onClick={fitToScreen}
                  className="px-2 py-1 text-emerald-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer font-bold text-[11px] flex items-center space-x-1"
                  title="一键自适应居中 (Fit & Center)"
                >
                  <span>自适应居中</span>
                </button>
                <button
                  onClick={centerViewport}
                  className="px-2 py-1 text-sky-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer font-bold text-[11px] flex items-center space-x-1"
                  title="将视口重新对准 (0, 0) 原点"
                >
                  <span>🎯 原点居中</span>
                </button>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
                  title="放大画布"
                >
                  <i className="fa-solid fa-magnifying-glass-plus"></i>
                </button>
              </div>

              {/* Maximize Toggle */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1 text-xs font-bold transition-colors cursor-pointer border ${
                  isMaximized
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title={isMaximized ? '退出全屏模式' : '进入全屏大坐标系'}
              >
                <i className={`fa-solid ${isMaximized ? 'fa-compress' : 'fa-expand'}`}></i>
                <span className="hidden sm:inline">{isMaximized ? '还原' : '全屏模式'}</span>
              </button>

              {/* Close/Collapse */}
              <button
                onClick={onToggle}
                className="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-rose-500/30"
                title="收起画板"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {/* Coordinate HUD & Pen Info */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-mono shrink-0">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="font-bold text-blue-700">
                当前海龟: ({Math.round(turtle.x)}, {Math.round(turtle.y)})
              </span>
              <span className="text-slate-300">|</span>
              <span>朝向: {turtle.angle}°</span>
              <span className="text-slate-300">|</span>
              <span className={turtle.isPenDown ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                {turtle.isPenDown ? '落笔' : '抬笔'}
              </span>
              <span className="text-slate-300">|</span>
              <span>粗细: {turtle.penSize}px</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-sans hidden sm:inline">
                视野: X: [{-xBound}, {xBound}] · Y: [{-yBound}, {yBound}] · (0, 0) 居中
              </span>
            </div>

            <div className="flex items-center space-x-2 text-[11px]">
              <span className="text-slate-400 truncate max-w-[140px]">
                {lastExecutedMsg}
              </span>
              <button
                onClick={() => executeCommand('clear')}
                className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer font-bold"
              >
                clear()
              </button>
              <button
                onClick={() => setTurtle(initialTurtle)}
                className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer font-bold"
              >
                reset()
              </button>
            </div>
          </div>

          {/* Canvas Viewport (Scrollable container with large coordinate space, guaranteed centered (0,0)) */}
          <div
            ref={viewportRef}
            className="flex-1 bg-slate-900/95 overflow-auto p-4 min-h-[260px] flex items-center justify-center relative select-none"
          >
            <div
              style={{
                width: `${Math.round(canvasWidth * zoom)}px`,
                height: `${Math.round(canvasHeight * zoom)}px`,
                minWidth: `${Math.round(canvasWidth * zoom)}px`,
                minHeight: `${Math.round(canvasHeight * zoom)}px`,
                transition: 'width 0.15s ease-out, height 0.15s ease-out',
              }}
              className="shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-700 bg-white relative m-auto shrink-0"
            >
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                className="block"
              />
            </div>
          </div>

          {/* Quick Action Badges (circle with steps, macro multi-quadrant, write, bgcolor) */}
          <div className="px-4 py-2.5 bg-white border-t border-slate-200 space-y-2 shrink-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600 text-[11px] shrink-0">
                大坐标系演练：
              </span>
              <button
                onClick={() => runPreset('macroGalaxy')}
                disabled={isDrawingPreset}
                className="px-2.5 py-1 text-[11px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                title="漫游所有四个象限 (±350坐标点)"
              >
                🌌 四象限大范围漫游 (±350, ±220)
              </button>
              <button
                onClick={() => runPreset('hexagon')}
                disabled={isDrawingPreset}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                circle(100, steps=6) 六边形
              </button>
              <button
                onClick={() => runPreset('triangle')}
                disabled={isDrawingPreset}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
              >
                circle(90, steps=3) 三角形
              </button>
              <button
                onClick={() => runPreset('star')}
                disabled={isDrawingPreset}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
              >
                ⭐ 巨星 (160px)
              </button>
              <button
                onClick={() => runPreset('writeDemo')}
                disabled={isDrawingPreset}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                write("大字标题")
              </button>
              <button
                onClick={() => executeCommand('bgcolor', turtle.bgColor === 'black' ? '#ffffff' : 'black')}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                bgcolor({turtle.bgColor === 'black' ? '"white"' : '"black"'})
              </button>
            </div>

            {/* Quick Motion Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-1 border-t border-slate-100">
              <button
                onClick={() => executeCommand('fd', 100)}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                fd(100)
              </button>
              <button
                onClick={() => executeCommand('bk', 80)}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                bk(80)
              </button>
              <button
                onClick={() => executeCommand('rt', 90)}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                rt(90)
              </button>
              <button
                onClick={() => executeCommand('lt', 60)}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                lt(60)
              </button>
              <button
                onClick={() => executeCommand('circle', 80, 360, 6)}
                className="py-1 text-[11px] font-mono font-bold bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-md border border-purple-200 cursor-pointer"
                title="画正六边形"
              >
                steps=6
              </button>
              <button
                onClick={() => executeCommand('goto', 300, 200)}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
                title="远距离瞬移 (300, 200)"
              >
                goto(300,200)
              </button>
              <button
                onClick={() => executeCommand('home')}
                className="py-1 text-[11px] font-mono font-bold bg-slate-100 hover:bg-slate-700 hover:text-white text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                home()
              </button>
              <button
                onClick={() => executeCommand(turtle.isPenDown ? 'pu' : 'pd')}
                className={`py-1 text-[11px] font-mono font-bold rounded-md border cursor-pointer ${
                  turtle.isPenDown
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white'
                }`}
              >
                {turtle.isPenDown ? 'pu()抬笔' : 'pd()落笔'}
              </button>
            </div>

            {/* Live Command Form */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none font-mono text-[11px] text-slate-400">
                  &gt;&gt;&gt;
                </span>
                <input
                  type="text"
                  value={customCmd}
                  onChange={(e) => setCustomCmd(e.target.value)}
                  placeholder="如 goto(400, 250) 或 circle(120, steps=6) 或 write('大范围坐标系')"
                  className="w-full pl-9 pr-2 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
              >
                运行命令
              </button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
};
