import React, { useState, useEffect } from 'react';
import { StageId, Category, ApiItem } from './types';
import { STAGES } from './data/stages';
import { CATEGORIES } from './data/categories';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ApiCard } from './components/ApiCard';
import { TurtlePlayground } from './components/TurtlePlayground';
import { CodeTemplateModal } from './components/CodeTemplateModal';
import { SearchBarModal } from './components/SearchBarModal';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { FloatingTurtleCanvas } from './components/FloatingTurtleCanvas';

export default function App() {
  const [currentStageId, setCurrentStageId] = useState<StageId>('gesp13');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('gesp13-io-lab');
  const [selectedItemId, setSelectedItemId] = useState<string>('api-print-lab');

  // Modal & Drawer states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isTurtleDrawerOpen, setIsTurtleDrawerOpen] = useState<boolean>(false);

  // Filter categories by current stage
  const currentStageCategories = CATEGORIES.filter((c) => c.stageId === currentStageId);
  const currentStage = STAGES.find((s) => s.id === currentStageId)!;

  // Selected category object
  const activeCategory = currentStageCategories.find((c) => c.id === selectedCategoryId) || currentStageCategories[0];

  // Handle stage change: canvas hidden by default, automatically hide when switching to other stages
  const handleSelectStage = (stageId: StageId) => {
    setCurrentStageId(stageId);
    if (stageId !== 'turtle') {
      setIsTurtleDrawerOpen(false);
    }
    const stageCats = CATEGORIES.filter((c) => c.stageId === stageId);
    if (stageCats.length > 0) {
      setSelectedCategoryId(stageCats[0].id);
      setSelectedItemId(stageCats[0].items[0]?.id || '');
    }
  };

  // Handle category change
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    if (cat && cat.items.length > 0) {
      setSelectedItemId(cat.items[0].id);
      setTimeout(() => {
        const el = document.getElementById(`api-${cat.items[0].id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  // Handle item select (and scroll to card)
  const handleSelectItem = (itemId: string, categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedItemId(itemId);
    const el = document.getElementById(`api-${itemId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle search select
  const handleSelectSearchResult = (stageId: StageId, categoryId: string, itemId: string) => {
    setCurrentStageId(stageId);
    setSelectedCategoryId(categoryId);
    setSelectedItemId(itemId);
    setTimeout(() => {
      const el = document.getElementById(`api-${itemId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for request to open floating turtle drawer from any card
  useEffect(() => {
    const handleOpenDrawer = () => setIsTurtleDrawerOpen(true);
    window.addEventListener('pykids-open-turtle-drawer', handleOpenDrawer);
    return () => window.removeEventListener('pykids-open-turtle-drawer', handleOpenDrawer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentStageId={currentStageId}
        onSelectStage={handleSelectStage}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onJumpToTurtle={() => handleSelectStage('turtle')}
      />

      {/* Main Content Area: Stage Banner + Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1 space-y-5">
        {/* Stage Hero Banner */}
        <div
          className={`rounded-3xl p-5 sm:p-6 text-white shadow-md bg-gradient-to-r ${currentStage.bgGradient} relative overflow-hidden flex flex-wrap items-center justify-between gap-4`}
        >
          <div className="space-y-1.5 max-w-2xl z-10">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-0.5 rounded-full border border-white/25">
                {currentStage.gespLevels}
              </span>
              <span className="text-xs text-white/80 font-mono">
                {currentStageCategories.length} 个核心专题
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2">
              <i className={`${currentStage.icon} text-lg`}></i>
              <span>{currentStage.title} · {currentStage.subtitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              {currentStage.description}
            </p>
          </div>

          {currentStageId !== 'turtle' && (
            <div className="flex items-center space-x-3 z-10">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-50 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-transform hover:scale-105 cursor-pointer flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-lightbulb text-amber-500"></i>
                <span>做题模板速查</span>
              </button>
            </div>
          )}

          {/* Background watermark icon */}
          <i
            className={`${currentStage.icon} absolute -right-6 -bottom-8 text-8xl text-white/10 pointer-events-none select-none`}
          ></i>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left: Secondary Catalog */}
          <Sidebar
            categories={currentStageCategories}
            selectedCategoryId={selectedCategoryId}
            selectedItemId={selectedItemId}
            onSelectCategory={handleSelectCategory}
            onSelectItem={handleSelectItem}
          />

          {/* Right: Category Title & API Cards */}
          <main className="flex-1 w-full space-y-6">
            {/* Current Active Category Title Card */}
            {activeCategory && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-lg">
                    <i className={activeCategory.icon}></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {activeCategory.title}
                      </h3>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                        {activeCategory.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{activeCategory.description}</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  包含 {activeCategory.items.length} 个知识点
                </span>
              </div>
            )}

            {/* API Cards List for Active Category */}
            {activeCategory && (
              <div className="space-y-6">
                {activeCategory.items.map((item) => (
                  <ApiCard
                    key={item.id}
                    item={item}
                    onOpenTurtle={() => {
                      const el = document.getElementById('turtle-playground-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-500">
          PyKids - 面向小学生的 Python 学习与 GESP 考级交互式速查站
        </p>
        <p>
          专为少儿编程教学、等级考试避坑与实战演练设计 · 无需后端 · 开箱即用
        </p>
      </footer>

      {/* Floating Action Button for Code Templates - 启蒙阶段 (turtle) 无需出现 */}
      {currentStageId !== 'turtle' && (
        <aside aria-label="快捷悬浮菜单" className="fixed bottom-6 right-6 z-30 flex flex-col items-end space-y-2">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/30 transition-all hover:scale-105 cursor-pointer border border-amber-300/40"
            title="打开 GESP 做题高频代码模板速查"
          >
            <i className="fa-solid fa-file-code text-base"></i>
            <span>做题模板速查 📑</span>
          </button>
        </aside>
      )}

      {/* Floating Canvas Drawer - 其他阶段不需要出现海龟悬浮画板，仅在启蒙阶段 (turtle) 出现 */}
      {currentStageId === 'turtle' && (
        <FloatingTurtleCanvas
          isOpen={isTurtleDrawerOpen}
          onToggle={() => setIsTurtleDrawerOpen(!isTurtleDrawerOpen)}
        />
      )}

      <CodeTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      <SearchBarModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <SingleFileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
