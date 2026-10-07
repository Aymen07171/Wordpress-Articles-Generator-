import React, { useState } from 'react';
import { GeneratedContentResponse } from '../types';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  Globe,
  Smartphone,
  Monitor,
  Target,
  Key,
  TrendingUp,
  BarChart2,
  FileSearch,
  Layers,
  Sparkles
} from 'lucide-react';

interface SeoAuditPanelProps {
  content: GeneratedContentResponse;
}

export const SeoAuditPanel: React.FC<SeoAuditPanelProps> = ({ content }) => {
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  const titleLength = content?.metaTitle?.length || 0;
  const metaLength = content?.metaDescription?.length || 0;

  const longTailAudits = Array.isArray(content?.longTailPlacementAudit) ? content.longTailPlacementAudit : [];
  const strengths = Array.isArray(content?.seoStrengths) ? content.seoStrengths : [];
  const recommendations = Array.isArray(content?.seoRecommendations) ? content.seoRecommendations : [];

  // Title checks (optimal: 45-60)
  const isTitleOptimal = titleLength >= 40 && titleLength <= 60;
  // Meta description checks (optimal: 120-160)
  const isMetaOptimal = metaLength >= 120 && metaLength <= 160;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
              SEO & Long-Tail Optimization Engine
              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                Audit Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live SERP simulation, semantic long-tail keyword placement audit, and Google E-E-A-T score.
            </p>
          </div>
        </div>

        {/* Big Overall SEO Score Gauge */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              SEO Health Score
            </span>
            <span className="text-xs font-bold text-emerald-400">High Ranking Rank #1 Potential</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-950/40 text-emerald-400 font-black text-lg">
            {content.seoScore || 95}
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SERP Google Snippet Preview */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              Live Google SERP Snippet Preview
            </h4>

            {/* Device Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDevicePreview('desktop')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  devicePreview === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Desktop Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevicePreview('mobile')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  devicePreview === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Mobile Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SERP Preview Box simulating Google Dark Mode Results */}
          <div
            className={`bg-[#202124] text-white p-5 rounded-2xl border border-slate-800 font-sans shadow-md transition-all ${
              devicePreview === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
          >
            {/* Site Favicon & Breadcrumb */}
            <div className="flex items-center gap-2 mb-1.5 text-xs text-[#bdc1c6]">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                ⚡
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#e8eaed] font-medium">RankCraft Magazine</span>
                <span className="text-[#9aa0a6]">› {content.recipeData ? 'recipes' : 'guides'} ›</span>
                <span className="text-[#9aa0a6] truncate max-w-[120px]">{content.urlSlug}</span>
              </div>
            </div>

            {/* Clickable Blue Google Title */}
            <h3 className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug mb-1">
              {content.metaTitle}
            </h3>

            {/* Recipe Star Rich Snippet if recipeData present */}
            {content.recipeData && (
              <div className="flex items-center gap-2 text-xs text-[#bdc1c6] mb-1.5">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <span className="font-semibold text-[#e8eaed]">4.9</span>
                <span className="text-[#9aa0a6]">(240+ reviews)</span>
                <span className="text-[#9aa0a6]">• {content.recipeData.totalTimeMinutes} mins</span>
                <span className="text-[#9aa0a6]">• {content.recipeData.caloriesPerServing} cal</span>
              </div>
            )}

            {/* Meta Description */}
            <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-3">
              {content.metaDescription}
            </p>
          </div>

          {/* Character Count Diagnostics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-[11px]">Title Tag Length</span>
                <span className={`font-bold font-mono ${isTitleOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {titleLength} / 60
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isTitleOptimal ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {isTitleOptimal ? '✓ Optimal snippet length' : 'Warning: May truncate on mobile SERP'}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-[11px]">Meta Description Length</span>
                <span className={`font-bold font-mono ${isMetaOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {metaLength} / 160
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${isMetaOptimal ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${Math.min((metaLength / 160) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {isMetaOptimal ? '✓ Optimal snippet length' : 'Keep between 120-160 characters'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Long-Tail Keyword Placement Audit & Checklist */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            Strategic Long-Tail Keyword Placement Audit
          </h4>

          {/* Long-Tail Audit Table */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Long-Tail Keyword</th>
                    <th className="py-2.5 px-2 text-center">Hits</th>
                    <th className="py-2.5 px-3">Sections Injected</th>
                    <th className="py-2.5 px-3">Intent Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {longTailAudits.map((audit, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-medium text-amber-300">
                        "{audit.keyword}"
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-400">
                        {audit.occurrences}x
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400">
                        {audit.sectionPlaced}
                      </td>
                      <td className="py-2.5 px-3 text-[10px]">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                          {audit.intentCoverage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* On-Page SEO Strengths & SERP Recommendations */}
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <div>
              <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified SEO Strengths
              </h5>
              <ul className="space-y-1 text-xs text-slate-300">
                {strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {recommendations.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Growth Opportunities for #1 Rank
                </h5>
                <ul className="space-y-1 text-xs text-slate-400">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
