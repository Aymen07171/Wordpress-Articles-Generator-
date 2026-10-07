import React from 'react';
import { ChefHat, BarChart3, Rocket, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentModule: 1 | 2;
  setCurrentModule: (m: 1 | 2) => void;
  onSelectRecipePreset: () => void;
  onSelectArticlePreset: () => void;
  activeView: 'editor' | 'preview';
  setActiveView: (view: 'editor' | 'preview') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  setCurrentModule,
  onSelectRecipePreset,
  onSelectArticlePreset,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                RankCraft
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                SEO & Distribution Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">
              High-Ranking Content, Custom Media & Pinterest Bulk Publishing
            </p>
          </div>
        </div>

        {/* Primary Module Switcher (Module 1 vs Module 2) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setCurrentModule(1)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentModule === 1
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 1: SEO Creator</span>
          </button>
          <button
            onClick={() => setCurrentModule(2)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentModule === 2
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Module 2: Pinterest Bulk Engine</span>
          </button>
        </div>

        {/* Preset Helpers */}
        <div className="hidden lg:flex items-center gap-1.5">
          {currentModule === 1 && (
            <>
              <button
                onClick={onSelectRecipePreset}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Load Tuscan Chicken Recipe Example"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Recipe Demo</span>
              </button>
              <button
                onClick={onSelectArticlePreset}
                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Load Sourdough SEO Article Example"
              >
                <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
                <span>Article Demo</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
