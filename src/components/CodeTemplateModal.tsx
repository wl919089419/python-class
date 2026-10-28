import React, { useState } from 'react';
import { GESP_TEMPLATES } from '../data/templates';
import { CodeTemplate } from '../types';
import { PythonCodeView } from './PythonCodeBlock';

interface CodeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeTemplateModal: React.FC<CodeTemplateModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['全部', '输入输出', '数论与算法', '容器与数据结构', '搜索与回溯', '动态规划'];

  const filteredTemplates = selectedCategory === '全部'
    ? GESP_TEMPLATES
    : GESP_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleCopy = (t: CodeTemplate) => {
    navigator.clipboard.writeText(t.code);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shadow-sm">
              <i className="fa-solid fa-file-code"></i>
            </div>
            <div>
              <h2 id="template-modal-title" className="text-base sm:text-lg font-extrabold text-slate-900">
                GESP 做题常用代码高频模板速查
              </h2>
              <p className="text-xs text-slate-500">
                机考上机必备！精选 10 套必考代码骨架，一键复制，避免白卷！
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="关闭模板弹窗"
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-5">
          {filteredTemplates.map((template) => {
            const isCopied = copiedId === template.id;
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-amber-400 transition-all space-y-3"
              >
                {/* Template Title & Level */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {template.title}
                    </h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                      {template.gespLevel}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-mono">
                      {template.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(template)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-xs"
                    aria-label={`一键复制 ${template.title}`}
                  >
                    <i className={isCopied ? 'fa-solid fa-check' : 'fa-regular fa-copy'}></i>
                    <span>{isCopied ? '已复制！' : '一键复制代码'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {template.summary}
                </p>

                {/* Syntax Highlighted Code block */}
                <PythonCodeView code={template.code} />

                {/* Explanation & Pitfall */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 text-blue-950">
                    <span className="font-bold block mb-1 text-blue-800">📖 原理解析：</span>
                    {template.explanation}
                  </div>
                  <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-2.5 text-rose-950">
                    <span className="font-bold block mb-1 text-rose-800">⚠️ 做题避坑：</span>
                    {template.pitfall}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
