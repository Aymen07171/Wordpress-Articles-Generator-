import React, { useState } from 'react';
import { ContentType } from '../types';
import {
  Wand2,
  Sparkles,
  Key,
  Plus,
  X,
  ChefHat,
  BookOpen,
  Sliders,
  Check,
  RefreshCw,
  Target,
  Flame,
  Clock
} from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (formData: any) => Promise<void>;
  isLoading: boolean;
  onLoadPreset: (type: 'recipe' | 'article') => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onGenerate,
  isLoading,
  onLoadPreset,
}) => {
  const [contentType, setContentType] = useState<ContentType>('recipe');
  const [topic, setTopic] = useState('Creamy Tuscan Garlic Chicken Skillet with Sun-Dried Tomatoes');
  const [primaryKeyword, setPrimaryKeyword] = useState('creamy tuscan garlic chicken');
  const [currentLongTailInput, setCurrentLongTailInput] = useState('');
  const [longTailKeywords, setLongTailKeywords] = useState<string[]>([
    'easy 30 minute skillet chicken dinner',
    'creamy sun dried tomato chicken sauce',
    'low carb keto tuscan chicken',
    'restaurant style garlic parmesan chicken breast',
  ]);
  const [targetAudience, setTargetAudience] = useState('Home cooks and foodies looking for quick, restaurant-quality dinners');
  const [tone, setTone] = useState('culinary_gourmet');
  const [wordCountTarget, setWordCountTarget] = useState(1200);

  // Recipe specific fields
  const [cuisine, setCuisine] = useState('Italian-American Gourmet');
  const [servings, setServings] = useState(4);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([
    'Keto-Friendly',
    'Gluten-Free',
    '30-Minute Meal',
  ]);

  // Long-tail keyword tag management
  const handleAddLongTail = () => {
    if (!currentLongTailInput.trim()) return;
    const clean = currentLongTailInput.trim().toLowerCase();
    if (!longTailKeywords.includes(clean)) {
      setLongTailKeywords([...longTailKeywords, clean]);
    }
    setCurrentLongTailInput('');
  };

  const handleRemoveLongTail = (indexToRemove: number) => {
    setLongTailKeywords(longTailKeywords.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleDietaryTag = (tag: string) => {
    if (dietaryPreferences.includes(tag)) {
      setDietaryPreferences(dietaryPreferences.filter((t) => t !== tag));
    } else {
      setDietaryPreferences([...dietaryPreferences, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !primaryKeyword) return;

    onGenerate({
      contentType,
      topic,
      primaryKeyword,
      longTailKeywords,
      targetAudience,
      tone,
      wordCountTarget,
      cuisine,
      servings,
      dietaryPreferences,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Fast Preset Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            SEO & Content Generation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft high-ranking content with long-tail keyword placement, automated media, & recipe cards.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick Inspiration:</span>
          <button
            type="button"
            onClick={() => {
              setContentType('recipe');
              setTopic('Creamy Tuscan Garlic Chicken Skillet with Sun-Dried Tomatoes');
              setPrimaryKeyword('creamy tuscan garlic chicken');
              setLongTailKeywords([
                'easy 30 minute skillet chicken dinner',
                'creamy sun dried tomato chicken sauce',
                'low carb keto tuscan chicken',
                'restaurant style garlic parmesan chicken breast',
              ]);
              setCuisine('Italian-American Gourmet');
              onLoadPreset('recipe');
            }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg border border-slate-700 font-medium transition-colors cursor-pointer"
          >
            🍳 Tuscan Chicken Recipe
          </button>
          <button
            type="button"
            onClick={() => {
              setContentType('article');
              setTopic('Sourdough Bread Hydration Guide: Master Open Crumb & Proofing');
              setPrimaryKeyword('sourdough bread hydration guide');
              setLongTailKeywords([
                'high hydration sourdough crumb structure',
                'bakers percentages sourdough water ratio',
                'how to handle sticky high hydration dough',
                'sourdough bulk fermentation temperature tips',
              ]);
              onLoadPreset('article');
            }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 font-medium transition-colors cursor-pointer"
          >
            📝 Sourdough SEO Guide
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Content Type Selector (Article vs Recipe) */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Module Formatting Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setContentType('recipe')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                contentType === 'recipe'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${contentType === 'recipe' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Custom Recipe Template
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    Includes PDF Download
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Structured culinary card, scaled ingredients checklist, step timers, nutrition, & Schema.org JSON-LD.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setContentType('article')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                contentType === 'article'
                  ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${contentType === 'article' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  Authoritative SEO Article
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                    Pillar Guide
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Long-form editorial guide with H1-H3 hierarchy, E-E-A-T callouts, FAQ snippet section, & SERP audit.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Topic & Primary Keyword */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Article or Recipe Topic <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Creamy Tuscan Garlic Chicken Skillet"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Primary Target Keyword <span className="text-rose-400">*</span></span>
              <span className="text-[11px] text-amber-400">Exact SERP Target</span>
            </label>
            <input
              type="text"
              required
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              placeholder="e.g. creamy tuscan garlic chicken"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Long-Tail Keywords Optimization Engine */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Strategic Long-Tail Keywords (Engine Injection)
            </label>
            <span className="text-[11px] text-slate-400">
              {longTailKeywords.length} Active Targets
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Add high-intent long-tail phrases to outrank high-competition broad terms on Google Search:
          </p>

          {/* Keyword Tag Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {(longTailKeywords || []).map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 text-amber-300 border border-slate-700 text-xs font-medium group hover:border-amber-500/50 transition-colors"
              >
                <span>"{kw}"</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLongTail(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Keyword Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentLongTailInput}
              onChange={(e) => setCurrentLongTailInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLongTail();
                }
              }}
              placeholder="Type long-tail keyword (e.g. 'quick 30 minute weeknight dinner keto') and press Enter"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddLongTail}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Target
            </button>
          </div>
        </div>

        {/* Recipe Specific Config if Recipe Mode is Active */}
        {contentType === 'recipe' && (
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" />
              Recipe Template Customization Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cuisine Style
                </label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Default Servings
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Word Count
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min={600}
                    max={2500}
                    step={100}
                    value={wordCountTarget}
                    onChange={(e) => setWordCountTarget(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400 min-w-[50px]">
                    {wordCountTarget}w
                  </span>
                </div>
              </div>
            </div>

            {/* Dietary Preference Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Dietary & SEO Feature Badges
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gluten-Free',
                  'Keto-Friendly',
                  'Low-Carb',
                  '30-Minute Meal',
                  'Dairy-Free',
                  'High-Protein',
                  'One-Pan Skillet',
                  'Meal Prep Ready',
                ].map((tag) => {
                  const isSelected = dietaryPreferences.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietaryTag(tag)}
                      className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tone and Audience (Optional Controls) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Editorial Voice & Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="culinary_gourmet">Culinary Gourmet & Enthusiastic (Food Blog Standard)</option>
              <option value="expert">Authoritative & Technical (Masterclass Style)</option>
              <option value="conversational">Warm, Friendly & Conversational</option>
              <option value="step_by_step">Strictly Instructional & Concise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Search Intent Alignment
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating High-Ranking {contentType === 'recipe' ? 'Recipe' : 'Article'} & Media Assets...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Generate SEO-Optimized {contentType === 'recipe' ? 'Recipe & Media' : 'Article & Media'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
