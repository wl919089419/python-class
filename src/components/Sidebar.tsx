import React from 'react';
import { Category, ApiItem } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string;
  selectedItemId: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectItem: (itemId: string, categoryId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  selectedItemId,
  onSelectCategory,
  onSelectItem,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm lg:sticky lg:top-20 z-20 max-h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-2 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">二级知识目录</span>
        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          共 {categories.reduce((acc, cat) => acc + cat.items.length, 0)} 个考点
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 overscroll-contain">
        {categories.map((category) => {
          const isCategorySelected = selectedCategoryId === category.id;
          return (
            <div key={category.id} className="rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center justify-between p-2.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                  isCategorySelected
                    ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <i className={`${category.icon} text-slate-500 w-4 text-center`}></i>
                  <span className="truncate">{category.title}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 font-mono">
                  {category.items.length}
                </span>
              </button>

              {/* Items List inside category */}
              <div className="p-1 space-y-0.5">
                {category.items.map((item: ApiItem) => {
                  const isItemSelected = selectedItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectItem(item.id, category.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                        isItemSelected
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${isItemSelected ? 'bg-amber-300' : 'bg-slate-300'}`}></span>
                        <span className="truncate font-mono">{item.name}</span>
                      </div>
                      {(!item.level.includes('启蒙') && item.stageId !== 'turtle' && item.level) && (
                        <span
                          className={`text-[9px] px-1 rounded ${
                            isItemSelected
                              ? 'bg-blue-700 text-blue-100'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.level.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
