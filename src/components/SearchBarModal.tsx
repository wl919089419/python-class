import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../data/categories';
import { ApiItem, StageId } from '../types';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (stageId: StageId, categoryId: string, itemId: string) => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for '/' or 'Escape'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten all items
  const allItems: Array<{ item: ApiItem; categoryTitle: string }> = [];
  CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      allItems.push({ item, categoryTitle: cat.title });
    });
  });

  const q = query.toLowerCase().trim();
  const results = q
    ? allItems.filter(
        ({ item, categoryTitle }) =>
          item.name.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          categoryTitle.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      )
    : allItems.slice(0, 8); // show some quick picks

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <i className="fa-solid fa-magnifying-glass text-slate-400 text-lg"></i>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索函数名、考点（如 print, split, map, range, gcd, dfs）..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-slate-200/60 cursor-pointer"
            >
              清空
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <i className="fa-regular fa-face-meh text-3xl mb-2 block"></i>
              未找到匹配的函数或考点，换个关键词试试？
            </div>
          ) : (
            results.map(({ item, categoryTitle }) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectResult(item.stageId, item.categoryId, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 hover:bg-blue-50/80 rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-blue-600 group-hover:text-blue-700 text-sm">
                      {item.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.title}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-sans">
                      {categoryTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-lg">
                    {item.summary}
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {item.level}
                  </span>
                  <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-blue-500 text-xs"></i>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>提示：输入任意关键词实时检索 4 大阶段全部内容</span>
          <span>按 ESC 键或点击外部关闭</span>
        </div>
      </div>
    </div>
  );
};
