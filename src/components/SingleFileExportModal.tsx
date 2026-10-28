import React, { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { GESP_TEMPLATES } from '../data/templates';
import { STAGES } from '../data/stages';

interface SingleFileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const generateSingleHtml = (): string => {
    const serializedStages = JSON.stringify(STAGES);
    const serializedCategories = JSON.stringify(CATEGORIES);
    const serializedTemplates = JSON.stringify(GESP_TEMPLATES);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PyKids - 少儿 Python & GESP 考级 API 互动速查站 (单文件离线版)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome CDN -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Noto Sans SC', sans-serif; }
    code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen">
  <div id="app" class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
    <!-- 头部导航 -->
    <header class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center text-xl shadow-md">
          <i class="fa-brands fa-python"></i>
        </div>
        <div>
          <h1 class="text-lg font-extrabold text-slate-900">PyKids 少儿 Python & GESP 考级互动速查站</h1>
          <p class="text-xs text-slate-500">单文件开箱即用离线版 (无需后端)</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="openModal('tplModal')" class="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-sm cursor-pointer">
          <i class="fa-solid fa-file-code mr-1"></i>做题模板速查 (10套)
        </button>
      </div>
    </header>

    <!-- 阶段选项卡 -->
    <div id="stageTabs" class="flex flex-wrap gap-2"></div>

    <!-- 主体：左侧二级目录 + 右侧知识点详情 -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      <aside id="sidebar" class="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2 lg:sticky lg:top-4"></aside>
      <main id="mainContent" class="lg:col-span-3 space-y-6"></main>
    </div>
  </div>

  <!-- 模板弹窗 -->
  <div id="tplModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-amber-50">
        <h3 class="font-extrabold text-slate-900 text-base">GESP 做题常用代码高频模板速查</h3>
        <button onclick="closeModal('tplModal')" class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 cursor-pointer">&times;</button>
      </div>
      <div id="tplList" class="p-4 overflow-y-auto space-y-4"></div>
    </div>
  </div>

  <script>
    const STAGES = ${serializedStages};
    const CATEGORIES = ${serializedCategories};
    const TEMPLATES = ${serializedTemplates};

    let currentStage = 'gesp13';
    let currentCategory = CATEGORIES.find(c => c.stageId === 'gesp13')?.id || '';

    function renderStageTabs() {
      const container = document.getElementById('stageTabs');
      container.innerHTML = STAGES.map(s => \`
        <button onclick="switchStage('\${s.id}')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer \${currentStage === s.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}">
          <i class="\${s.icon} mr-1.5"></i>\${s.title} (\${s.badge})
        </button>
      \`).join('');
    }

    function switchStage(stageId) {
      currentStage = stageId;
      const cats = CATEGORIES.filter(c => c.stageId === stageId);
      currentCategory = cats[0]?.id || '';
      renderStageTabs();
      renderSidebar();
      renderMain();
    }

    function renderSidebar() {
      const sidebar = document.getElementById('sidebar');
      const cats = CATEGORIES.filter(c => c.stageId === currentStage);
      sidebar.innerHTML = \`
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">二级知识目录</div>
        \${cats.map(c => \`
          <button onclick="switchCategory('\${c.id}')" class="w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer \${currentCategory === c.id ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-100'}">
            <i class="\${c.icon} mr-1.5 text-slate-400"></i>\${c.title}
            <span class="float-right text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono">\${c.items.length}</span>
          </button>
        \`).join('')}
      \`;
    }

    function switchCategory(catId) {
      currentCategory = catId;
      renderSidebar();
      renderMain();
    }

    function renderMain() {
      const main = document.getElementById('mainContent');
      const cat = CATEGORIES.find(c => c.id === currentCategory);
      if (!cat) return;

      main.innerHTML = \`
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h2 class="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
            <i class="\${cat.icon} text-blue-600"></i>
            <span>\${cat.title}</span>
            <span class="text-xs font-normal text-slate-500">(\${cat.badge})</span>
          </h2>
          <p class="text-xs text-slate-600 mt-1">\${cat.description}</p>
        </div>
        \${cat.items.map(item => \`
          <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3 flex flex-wrap justify-between items-center gap-2">
              <div class="flex items-center space-x-2">
                <h3 class="text-lg font-mono font-extrabold text-slate-900">\${item.name}</h3>
                <span class="text-xs text-slate-500">— \${item.title}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">\${item.level}</span>
              </div>
            </div>
            
            <!-- 1. 小学生秒懂解释 -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 font-medium">
              <strong>💡 1. 小学生秒懂解释：</strong>\${item.summary}
            </div>

            <!-- 2. 语法格式与参数 -->
            <div class="space-y-1.5">
              <div class="text-xs font-bold text-slate-700">2. 语法格式与参数解剖：</div>
              <pre class="bg-slate-900 text-amber-300 p-3 rounded-xl text-xs font-mono overflow-x-auto">\${item.syntax}</pre>
            </div>

            <!-- 3. 直观交互演练 -->
            <div class="space-y-1.5">
              <div class="text-xs font-bold text-slate-700">3. 示例代码与终端运行：</div>
              <div class="bg-slate-900 text-white rounded-xl p-3 font-mono text-xs space-y-2">
                <pre class="text-emerald-400 overflow-x-auto">\${item.codeExample}</pre>
                <div class="border-t border-slate-800 pt-2 text-slate-300">
                  <span class="text-[11px] text-slate-400 font-sans block mb-1">模拟输出结果：</span>
                  <div class="bg-black/60 p-2 rounded text-emerald-300">\${item.expectedOutput}</div>
                </div>
              </div>
            </div>

            <!-- 4. GESP 做题常见坑点 -->
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950">
              <strong class="text-rose-800">🛡️ 4. GESP 做题常见坑点 (避坑指南)：</strong>
              <div class="mt-1 leading-relaxed whitespace-pre-line">\${item.pitfall}</div>
            </div>
          </article>
        \`).join('')}
      \`;
    }

    function openModal(id) {
      document.getElementById(id).classList.remove('hidden');
      if (id === 'tplModal') {
        document.getElementById('tplList').innerHTML = TEMPLATES.map(t => \`
          <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="font-extrabold text-sm text-slate-900">\${t.title}</h4>
              <span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">\${t.gespLevel}</span>
            </div>
            <pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">\${t.code}</pre>
            <p class="text-xs text-slate-600">\${t.explanation}</p>
          </div>
        \`).join('');
      }
    }

    function closeModal(id) {
      document.getElementById(id).classList.add('hidden');
    }

    // 初始化运行
    renderStageTabs();
    renderSidebar();
    renderMain();
  </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    const htmlContent = generateSingleHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PyKids_Python_GESP_Cheatsheet.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    const htmlContent = generateSingleHtml();
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-sm">
              <i className="fa-solid fa-file-arrow-down"></i>
            </div>
            <div>
              <h3 id="export-modal-title" className="font-extrabold text-slate-900 text-base">
                导出单文件 HTML (零依赖离线版)
              </h3>
              <p className="text-xs text-slate-500">
                完整打包所有数据与代码，单文件开箱即用，适合拷入U盘或机房无网复习！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Body features */}
        <div className="p-6 space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-emerald-950">
            <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
              <i className="fa-solid fa-circle-check"></i>
              <span>单文件 HTML 包含全部特质：</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>四阶段完整数据（Turtle 启蒙、GESP 1-3级、4-6级、6-8级）内置结构化 JSON</li>
              <li>四大标准板块（秒懂解释、语法解剖、演练代码、避坑指南）100% 完整保留</li>
              <li>10 套 GESP 必考常用代码模板速查弹窗</li>
              <li>引入 Tailwind CSS CDN 与 FontAwesome CDN，双击即可在任何浏览器打开！</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-download"></i>
              <span>立即下载 .html 文件</span>
            </button>
            <button
              onClick={handleCopyHtml}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              <i className={copied ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'}></i>
              <span>{copied ? '已复制完整源码！' : '复制全部 HTML 源码'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
