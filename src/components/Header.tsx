import React from 'react';
import { StageId } from '../types';
import { STAGES } from '../data/stages';

interface HeaderProps {
  currentStageId: StageId;
  onSelectStage: (id: StageId) => void;
  onOpenTemplates: () => void;
  onOpenSearch: () => void;
  onOpenExport: () => void;
  onJumpToTurtle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStageId,
  onSelectStage,
  onOpenTemplates,
  onOpenSearch,
  onOpenExport,
  onJumpToTurtle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectStage('gesp13')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <i className="fa-brands fa-python text-2xl"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                  PyKids
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  少儿 Python & GESP 考级
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">小学生 Python 学习与 API 交互式速查站</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="全局搜索知识点"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm transition-colors border border-slate-200/80 cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              <span className="hidden md:inline text-xs font-medium">搜索函数/考点 (print, split...)</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
                /
              </kbd>
            </button>

            {/* GESP Templates Cheat Sheet - hide in enlightenment stage (turtle) */}
            {currentStageId !== 'turtle' && (
              <button
                onClick={onOpenTemplates}
                aria-label="做题常用代码模板速查"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-sm shadow-amber-500/20 transition-all cursor-pointer"
              >
                <i className="fa-solid fa-file-code"></i>
                <span>做题模板速查</span>
                <span className="bg-amber-600/60 text-amber-100 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  10套
                </span>
              </button>
            )}

            {/* Offline HTML Export */}
            <button
              onClick={onOpenExport}
              aria-label="导出单文件 HTML 离线使用"
              title="下载完整离线单文件 HTML，无需网络随开随练！"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold border border-emerald-200 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-download"></i>
              <span className="hidden sm:inline">离线单文件</span>
            </button>
          </div>
        </div>

        {/* 4 Core Stage Tabs */}
        <div className="flex space-x-1 sm:space-x-2 border-t border-slate-100 py-2 overflow-x-auto no-scrollbar">
          {STAGES.map((stage) => {
            const isActive = currentStageId === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r ' + stage.bgGradient + ' text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <i className={`${stage.icon} ${isActive ? 'text-white' : 'text-slate-400'}`}></i>
                <span>{stage.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {stage.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
