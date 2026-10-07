import React, { useState } from 'react';
import { GeneratedContentResponse } from './types';
import { sampleRecipeData, sampleArticleData } from './data/sampleData';
import { Header } from './components/Header';
import { GeneratorForm } from './components/GeneratorForm';
import { RecipeTemplate } from './components/RecipeTemplate';
import { ArticleView } from './components/ArticleView';
import { ThumbnailStudio } from './components/ThumbnailStudio';
import { SeoAuditPanel } from './components/SeoAuditPanel';
import { PinterestEngine } from './components/PinterestEngine/PinterestEngine';
import { normalizeContentResponse } from './utils/normalizeContent';
import {
  ChefHat,
  BookOpen,
  Image as ImageIcon,
  BarChart2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Rocket
} from 'lucide-react';

export default function App() {
  const [currentModule, setCurrentModule] = useState<1 | 2>(1);
  const [content, setContent] = useState<GeneratedContentResponse>(sampleRecipeData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recipe_or_article' | 'media' | 'seo_audit' | 'all'>('recipe_or_article');
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let msg = data.error || 'Failed to generate content';
        if (typeof msg === 'string' && msg.includes('503')) {
          msg = 'Gemini free models are currently experiencing high global traffic spikes. Please click Retry below to use our high-availability route.';
        }
        throw new Error(msg);
      }

      setContent(normalizeContentResponse(data));
      setActiveTab('recipe_or_article');
    } catch (err: any) {
      console.error('Generation error:', err);
      let errMsg = err?.message || 'Generation failed. Check your parameters or network connection.';
      // Clean up raw JSON error string if present
      if (typeof errMsg === 'string' && errMsg.includes('{"error"')) {
        try {
          const parsed = JSON.parse(errMsg);
          if (parsed?.error?.message) {
            errMsg = parsed.error.message;
          }
        } catch {
          // Keep errMsg
        }
      }
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRecipePreset = () => {
    setContent(sampleRecipeData);
    setActiveTab('recipe_or_article');
  };

  const handleLoadArticlePreset = () => {
    setContent(sampleArticleData);
    setActiveTab('recipe_or_article');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        onSelectRecipePreset={handleLoadRecipePreset}
        onSelectArticlePreset={handleLoadArticlePreset}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-500/50 p-4 rounded-2xl flex items-center justify-between text-rose-200 text-xs shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white font-bold ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MODULE 1: SEO ARTICLE & RECIPE GENERATOR */}
        {currentModule === 1 && (
          <div className="space-y-8">
            {/* Top Generator Form (Editor Mode) */}
            {activeView === 'editor' && (
              <section className="transition-all">
                <GeneratorForm
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                  onLoadPreset={(type) => {
                    if (type === 'recipe') handleLoadRecipePreset();
                    else handleLoadArticlePreset();
                  }}
                />
              </section>
            )}

            {/* Quick Action Banner to send assets directly to Module 2 */}
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border border-red-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    Distribute this content via Pinterest Bulk Publishing Engine
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Pair these generated thumbnails & recipe details with an Excel spreadsheet and bulk deploy multiple Pins simultaneously.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentModule(2)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 transition-transform active:scale-95 cursor-pointer"
              >
                <span>Launch Pinterest Bulk Engine (Module 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Output Sub-Tabs */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('recipe_or_article')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'recipe_or_article'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {content.recipeData ? <ChefHat className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {content.recipeData ? 'Custom Recipe Template' : 'SEO Pillar Article'}
                  {content.recipeData && (
                    <span className="text-[10px] bg-slate-950/20 text-slate-950 px-1.5 py-0.5 rounded font-black">
                      PDF Ready
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('media')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'media'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Automated Media & High-CTR Studio
                </button>

                <button
                  onClick={() => setActiveTab('seo_audit')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'seo_audit'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" />
                  SEO & Long-Tail Keyword Engine
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Score: {content.seoScore}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  All Modules View
                </button>
              </div>

              <div className="text-xs text-slate-400 hidden xl:flex items-center gap-2 pr-2">
                <span className="text-amber-400 font-semibold font-mono">Target:</span>
                <span className="truncate max-w-xs text-slate-300">"{content.primaryKeyword}"</span>
              </div>
            </section>

            {/* Content Tabs */}
            <div className="space-y-8">
              {(activeTab === 'recipe_or_article' || activeTab === 'all') && (
                <section className="space-y-8">
                  {content.recipeData && (
                    <RecipeTemplate recipe={content.recipeData} />
                  )}
                  <ArticleView content={content} />
                </section>
              )}

              {(activeTab === 'media' || activeTab === 'all') && (
                <section>
                  <ThumbnailStudio
                    media={content.suggestedMedia}
                    topicTitle={content.recipeData?.recipeTitle || content.h1Title}
                  />
                </section>
              )}

              {(activeTab === 'seo_audit' || activeTab === 'all') && (
                <section>
                  <SeoAuditPanel content={content} />
                </section>
              )}
            </div>
          </div>
        )}

        {/* MODULE 2: PINTEREST BULK PUBLISHING ENGINE */}
        {currentModule === 2 && (
          <section className="transition-all">
            <PinterestEngine
              currentModule1Content={content}
              onNavigateToModule1={() => setCurrentModule(1)}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">RankCraft</span>
            <span>• SEO Content, Recipe Generator & Pinterest Bulk Publishing Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pinterest Bulk API & CSV Compatible</span>
            <span>E-E-A-T Compliant</span>
            <span>Schema.org 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
