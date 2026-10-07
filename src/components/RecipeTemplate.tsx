import React, { useState, useEffect } from 'react';
import { RecipeData } from '../types';
import { downloadRecipePdf, downloadRecipeText } from '../utils/pdfGenerator';
import {
  Download,
  Clock,
  Flame,
  Users,
  ChefHat,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Printer,
  FileText,
  FileCode,
  Sparkles,
  UtensilsCrossed,
  Info,
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';

interface RecipeTemplateProps {
  recipe: RecipeData;
}

export const RecipeTemplate: React.FC<RecipeTemplateProps> = ({ recipe }) => {
  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const instructions = Array.isArray(recipe?.instructions) ? recipe.instructions : [];
  const equipment = Array.isArray(recipe?.equipment) ? recipe.equipment : [];
  const dietaryTags = Array.isArray(recipe?.dietaryTags) ? recipe.dietaryTags : [];
  const chefTips = Array.isArray(recipe?.chefTips) ? recipe.chefTips : [];
  const variations = Array.isArray(recipe?.variations) ? recipe.variations : [];

  // Serving scale multiplier (0.5x, 1x, 2x, 3x)
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);

  // Checked ingredients state for interactive prep checklist
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  // Active timers state: stepIndex -> { remainingSeconds, isRunning }
  const [timers, setTimers] = useState<Record<number, { remaining: number; running: boolean }>>({});

  // Download menu dropdown toggle
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);

  // Initialize timers when recipe changes
  useEffect(() => {
    const initialTimers: Record<number, { remaining: number; running: boolean }> = {};
    instructions.forEach((inst, idx) => {
      if (inst.timerMinutes) {
        initialTimers[idx] = { remaining: inst.timerMinutes * 60, running: false };
      }
    });
    setTimers(initialTimers);
    setCheckedIngredients({});
  }, [recipe]);

  // Timer tick interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        let hasChanges = false;
        const next = { ...prev };
        Object.keys(next).forEach((keyStr) => {
          const idx = Number(keyStr);
          if (next[idx].running && next[idx].remaining > 0) {
            hasChanges = true;
            next[idx] = { ...next[idx], remaining: next[idx].remaining - 1 };
          }
        });
        return hasChanges ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (stepIdx: number) => {
    setTimers((prev) => {
      const current = prev[stepIdx];
      if (!current) return prev;
      return {
        ...prev,
        [stepIdx]: { ...current, running: !current.running },
      };
    });
  };

  const resetTimer = (stepIdx: number, originalMinutes: number) => {
    setTimers((prev) => ({
      ...prev,
      [stepIdx]: { remaining: originalMinutes * 60, running: false },
    }));
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const copySchemaJson = () => {
    navigator.clipboard.writeText(recipe.schemaJsonLd || '');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const scaledServings = Math.round(recipe.servings * scaleMultiplier);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all">
      {/* Top Culinary Ribbon Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-6 py-2 flex flex-wrap items-center justify-between text-xs font-bold tracking-wide">
        <div className="flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          <span>STRUCTURED RECIPE ARTICLE TEMPLATE • SCHEMA.ORG VALIDATED</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4" />
          <span>100% E-E-A-T CULINARY FORMAT</span>
        </div>
      </div>

      {/* Main Recipe Card Header */}
      <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-[280px]">
            {/* Dietary Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {recipe.cuisine}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {recipe.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {recipe.difficulty} Difficulty
              </span>
              {dietaryTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight mb-2">
              {recipe.recipeTitle}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              {recipe.summary}
            </p>
          </div>

          {/* Action Center: Functional Download Recipe Button */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                id="download-recipe-btn"
              >
                <Download className="w-4 h-4" />
                <span>Download Recipe</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <button
                onClick={handlePrint}
                title="Print Recipe Card"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-3 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu for Download Formats */}
            {showDownloadMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                  Select Export Format
                </div>
                <button
                  onClick={() => {
                    downloadRecipePdf(recipe, { scaleMultiplier });
                    setShowDownloadMenu(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-xs text-left rounded-xl hover:bg-amber-500/10 hover:text-amber-300 text-slate-200 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold">Download PDF Recipe Card</div>
                    <div className="text-[10px] text-slate-400">Styled 2-column kitchen printout</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    downloadRecipeText(recipe, 'txt');
                    setShowDownloadMenu(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-xs text-left rounded-xl hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Plain Text (.txt)</div>
                    <div className="text-[10px] text-slate-400">Clean kitchen notes format</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    downloadRecipeText(recipe, 'md');
                    setShowDownloadMenu(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-xs text-left rounded-xl hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-200">Markdown (.md)</div>
                    <div className="text-[10px] text-slate-400">Formatted for blogs & Obsidian</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Prep Time</div>
              <div className="text-sm font-bold text-slate-100">{recipe.prepTimeMinutes} mins</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Cook Time</div>
              <div className="text-sm font-bold text-slate-100">{recipe.cookTimeMinutes} mins</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Time</div>
              <div className="text-sm font-bold text-slate-100">{recipe.totalTimeMinutes} mins</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Servings</div>
              <div className="text-sm font-bold text-slate-100">{scaledServings} servings</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Calories</div>
              <div className="text-sm font-bold text-slate-100">{recipe.caloriesPerServing} kcal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipe Body (2 Columns: Ingredients vs Instructions) */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Ingredients & Tools */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                Ingredients Checklist
              </h3>

              {/* Serving Scaler */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 px-1 font-semibold">Scale:</span>
                {[0.5, 1, 2, 3].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setScaleMultiplier(mult)}
                    className={`px-1.5 py-0.5 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                      scaleMultiplier === mult
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Checkable Ingredients List */}
            <ul className="space-y-2.5">
              {ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients[idx] || false;
                // scale numeric amount if present
                let displayAmount = ing.amount;
                const num = parseFloat(ing.amount);
                if (!isNaN(num) && scaleMultiplier !== 1) {
                  displayAmount = (num * scaleMultiplier).toFixed(scaleMultiplier % 1 === 0 ? 0 : 1);
                }

                return (
                  <li
                    key={idx}
                    onClick={() => toggleIngredientCheck(idx)}
                    className={`flex items-start gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-slate-900/40 text-slate-500 line-through'
                        : 'hover:bg-slate-900/80 text-slate-200'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-amber-400 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 hover:text-amber-400" />
                      )}
                    </button>
                    <div className="text-xs leading-snug">
                      <span className="font-bold text-amber-300">
                        {displayAmount} {ing.unit}{' '}
                      </span>
                      <span className={isChecked ? 'text-slate-500' : 'text-slate-200 font-medium'}>
                        {ing.item}
                      </span>
                      {ing.notes && (
                        <span className="text-[11px] text-slate-400 block italic">
                          ({ing.notes})
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Equipment Needed Box */}
          {equipment.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Recommended Equipment
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    • {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Facts Table */}
          {recipe.nutrition && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Nutrition Facts (Per Serving)</span>
                <span className="text-[10px] text-slate-400 lowercase font-normal">Approx.</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Calories</span>
                  <span className="font-bold text-amber-400">{recipe.nutrition?.calories || 'N/A'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Protein</span>
                  <span className="font-bold text-slate-100">{recipe.nutrition?.protein || 'N/A'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Net Carbs</span>
                  <span className="font-bold text-slate-100">{recipe.nutrition?.carbs || 'N/A'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Fat</span>
                  <span className="font-bold text-slate-100">{recipe.nutrition?.fat || 'N/A'}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Fiber</span>
                  <span className="font-bold text-slate-100">{recipe.nutrition?.fiber || 'N/A'}</span>
                </div>
                {recipe.nutrition?.sodium && (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sodium</span>
                    <span className="font-bold text-slate-100">{recipe.nutrition.sodium}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Step-by-Step Instructions with Timers */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              Step-by-Step Culinary Method
            </h3>
            <span className="text-xs text-slate-400">
              {instructions.length} Steps Total
            </span>
          </div>

          <div className="space-y-4">
            {instructions.map((inst, idx) => {
              const timerState = timers[idx];

              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                        {inst.stepNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">
                        {inst.title}
                      </h4>
                    </div>

                    {/* Integrated Interactive Countdown Timer */}
                    {inst.timerMinutes && timerState && (
                      <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          ⏱ {formatTimer(timerState.remaining)}
                        </span>
                        <button
                          onClick={() => toggleTimer(idx)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                          title={timerState.running ? 'Pause' : 'Start'}
                        >
                          {timerState.running ? (
                            <Pause className="w-3 h-3 text-amber-400" />
                          ) : (
                            <Play className="w-3 h-3 text-emerald-400" />
                          )}
                        </button>
                        <button
                          onClick={() => resetTimer(idx, inst.timerMinutes!)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                          title="Reset"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inst.text}
                  </p>

                  {/* Temperature or Heat Note */}
                  {inst.tempNote && (
                    <div className="text-[11px] font-mono text-orange-400/90 bg-orange-950/20 px-2.5 py-1 rounded-lg border border-orange-900/30 w-fit">
                      🔥 {inst.tempNote}
                    </div>
                  )}

                  {/* Chef Tip Callout */}
                  {inst.chefTip && (
                    <div className="bg-amber-950/20 border-l-2 border-amber-500 p-2.5 rounded-r-lg text-[11px] text-amber-200/90 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Chef Secret:</strong> {inst.chefTip}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chef Pro Tips Box */}
          {chefTips.length > 0 && (
            <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <ChefHat className="w-4 h-4" />
                Editorial Chef Tips & Secrets
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {chefTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Storage & Variations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.storageAndReheating && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs">
                <h5 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-400" />
                  Storage & Reheating
                </h5>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {recipe.storageAndReheating}
                </p>
              </div>
            )}

            {variations.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs">
                <h5 className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Recipe Variations
                </h5>
                <ul className="text-slate-400 space-y-1 text-[11px]">
                  {variations.map((v, i) => (
                    <li key={i}>• {v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Schema.org Recipe JSON-LD preview */}
          {recipe.schemaJsonLd && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Schema.org Recipe JSON-LD (Search Rich Snippets Ready)
                </span>
                <button
                  onClick={copySchemaJson}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {copiedSchema ? 'Copied!' : 'Copy JSON-LD'}
                </button>
              </div>
              <pre className="bg-slate-900 p-3 rounded-lg text-[10px] font-mono text-slate-400 overflow-x-auto max-h-36">
                {recipe.schemaJsonLd}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
