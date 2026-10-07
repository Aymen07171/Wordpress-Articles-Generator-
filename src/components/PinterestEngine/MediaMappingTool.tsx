import React, { useState, useRef, useEffect } from 'react';
import { PinterestPinRow, GeneratedContentResponse } from '../../types';
import {
  Image as ImageIcon,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  Layers,
  ArrowRight,
  RefreshCw,
  Wand2,
  Sliders,
  Eye,
  Plus,
  Link,
  Upload
} from 'lucide-react';

interface MediaMappingToolProps {
  pins: PinterestPinRow[];
  setPins: React.Dispatch<React.SetStateAction<PinterestPinRow[]>>;
  currentModule1Content: GeneratedContentResponse;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const MediaMappingTool: React.FC<MediaMappingToolProps> = ({
  pins,
  setPins,
  currentModule1Content,
  onNextStep,
  onPrevStep,
}) => {
  const [selectedPinId, setSelectedPinId] = useState<string>(pins[0]?.id || '');
  const [customMediaUrl, setCustomMediaUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'module1_assets' | 'vertical_studio' | 'custom_url'>('module1_assets');

  // Vertical 2:3 Pinterest Pin Studio Canvas state
  const verticalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [verticalHeadline, setVerticalHeadline] = useState(
    currentModule1Content.recipeData?.recipeTitle || '30-MIN TUSCAN CHICKEN'
  );
  const [verticalBadge, setVerticalBadge] = useState('VIRAL RECIPE');
  const [verticalTheme, setVerticalTheme] = useState<'amber' | 'emerald' | 'crimson' | 'dark'>('amber');

  // Module 1 Media Library Assets
  const module1MediaAssets = [
    {
      id: 'm1_hero',
      title: 'Module 1 High-CTR Skillet Thumbnail',
      url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
      badge: currentModule1Content?.suggestedMedia?.thumbnailBadge || 'RANK #1',
      aspect: '2:3 Vertical Optimized',
      tag: 'Module 1 Main Asset',
    },
    {
      id: 'm1_sauce',
      title: 'Velvety Garlic Parmesan Sauce Sizzle',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      badge: 'SAUCE SECRET',
      aspect: 'Culinary Close-up',
      tag: 'In-Content Media #1',
    },
    {
      id: 'm1_sear',
      title: 'Golden Sear Cutlets in Skillet',
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
      badge: 'SEARING HACK',
      aspect: 'Step Photo',
      tag: 'In-Content Media #2',
    },
    {
      id: 'm1_plate',
      title: 'Finished Plated Tuscan Dish with Basil',
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
      badge: 'PLATING PERFECTION',
      aspect: 'Editorial Presentation',
      tag: 'Gourmet Showcase',
    },
    {
      id: 'm1_sourdough',
      title: 'Artisan Open Crumb Boule Cross-Section',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      badge: 'OPEN CRUMB',
      aspect: 'Macro Texture',
      tag: 'Baking Pillar',
    },
  ];

  // Render 2:3 Vertical Pinterest Pin to Canvas
  useEffect(() => {
    const canvas = verticalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pinterest standard vertical size: 1000 x 1500 (2:3 aspect ratio)
    const width = 600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (verticalTheme === 'amber') {
      grad.addColorStop(0, '#451a03');
      grad.addColorStop(0.5, '#78350f');
      grad.addColorStop(1, '#0f172a');
    } else if (verticalTheme === 'emerald') {
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#047857');
      grad.addColorStop(1, '#0f172a');
    } else if (verticalTheme === 'crimson') {
      grad.addColorStop(0, '#881337');
      grad.addColorStop(0.5, '#9f1239');
      grad.addColorStop(1, '#0f172a');
    } else {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#020617');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle decorative rings
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.35, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Pin Badge (Top Center)
    if (verticalBadge) {
      ctx.save();
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      const text = verticalBadge.toUpperCase();
      const badgeW = ctx.measureText(text).width + 36;
      const badgeH = 40;
      const badgeX = (width - badgeW) / 2;
      const badgeY = 60;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 20);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillText(text, badgeX + 18, badgeY + 27);
      ctx.restore();
    }

    // Main Punchy Headline (High-CTR Pinterest Format)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;

    const words = verticalHeadline.split(' ');
    let line = '';
    const lines: string[] = [];
    const maxW = width - 80;

    for (let i = 0; i < words.length; i++) {
      const test = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    const startY = height * 0.42;
    lines.forEach((l, idx) => {
      ctx.fillStyle = idx === 0 ? '#fde047' : '#ffffff';
      ctx.fillText(l.toUpperCase(), 40, startY + idx * 56);
    });
    ctx.restore();

    // Call to Action Bottom Box
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(30, height - 120, width - 60, 70);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, height - 120, width - 60, 70);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TAP TO GET PRINTABLE RECIPE', 60, height - 76);
    ctx.restore();

  }, [verticalHeadline, verticalBadge, verticalTheme]);

  // Pair selected media to a specific pin row
  const handleAssignMediaToPin = (mediaUrl: string, pinId: string) => {
    setPins((prev) =>
      (prev || []).map((p) => {
        if (p.id === pinId) {
          return { ...p, mediaUrl };
        }
        return p;
      })
    );
  };

  // Pair generated canvas to the active pin row
  const handleApplyVerticalCanvasToPin = () => {
    const canvas = verticalCanvasRef.current;
    if (!canvas || !selectedPinId) return;
    const dataUrl = canvas.toDataURL('image/png');
    handleAssignMediaToPin(dataUrl, selectedPinId);
  };

  // Auto-Pair All Pins Sequentially from Module 1 Library
  const handleAutoPairAll = () => {
    setPins((prev) =>
      (prev || []).map((pin, index) => {
        const asset = module1MediaAssets[index % module1MediaAssets.length];
        return {
          ...pin,
          mediaUrl: asset.url,
          thumbnailTitle: asset.title,
        };
      })
    );
  };

  const safePins = Array.isArray(pins) ? pins : [];
  const selectedPin = safePins.find((p) => p.id === selectedPinId) || safePins[0];
  const mappedCount = safePins.filter((p) => p.mediaUrl && p.mediaUrl.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Top Media Mapping Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Pinterest Media Mapping Studio
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
              {mappedCount} of {safePins.length} Pins Paired
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pair Module 1 catchy thumbnails, in-content food photos, or 2:3 vertical Pinterest pins with each spreadsheet row.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoPairAll}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Auto-Pair All Pins with Module 1 Media
          </button>
        </div>
      </div>

      {/* Main Two-Column Mapping Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spreadsheet Pin Rows Selection */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col gap-3 max-h-[720px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Pin Row to Pair
            </span>
            <span className="text-[11px] text-slate-500">
              Click a row, then click an image on the right
            </span>
          </div>

          <div className="space-y-2.5">
            {safePins.map((pin, idx) => {
              const isSelected = pin.id === selectedPinId;
              const hasMedia = Boolean(pin.mediaUrl);

              return (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail Preview or Empty Icon */}
                  <div className="w-14 h-18 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                    {hasMedia ? (
                      <img
                        src={pin.mediaUrl}
                        alt={pin.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                    {hasMedia && (
                      <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-400 truncate">
                        {pin.board}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                      {pin.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      {hasMedia ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Media Mapped
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> No Media Assigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Media Asset Picker & 2:3 Vertical Studio */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
          {/* Active Target Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Currently Pairing Media For:
              </span>
              <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                {selectedPin ? selectedPin.title : 'No Pin Selected'}
              </h4>
            </div>
            {selectedPin?.mediaUrl && (
              <span className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium shrink-0">
                ✓ Media Attached
              </span>
            )}
          </div>

          {/* Media Source Tab Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('module1_assets')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'module1_assets'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Module 1 Visual Media Assets
            </button>
            <button
              onClick={() => setActiveTab('vertical_studio')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'vertical_studio'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2:3 Vertical Pin Studio
            </button>
            <button
              onClick={() => setActiveTab('custom_url')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'custom_url'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Media URL
            </button>
          </div>

          {/* Tab 1: Module 1 Visual Assets */}
          {activeTab === 'module1_assets' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Click any asset below to assign it immediately to the selected Pin row:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {module1MediaAssets.map((asset) => {
                  const isCurrent = selectedPin?.mediaUrl === asset.url;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => handleAssignMediaToPin(asset.url, selectedPinId)}
                      className={`group relative rounded-2xl overflow-hidden border p-2 bg-slate-950 transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-slate-900 relative">
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md">
                          {asset.badge}
                        </div>
                      </div>

                      <div className="text-[11px] font-bold text-slate-200 line-clamp-1 mb-1">
                        {asset.title}
                      </div>

                      <button
                        type="button"
                        className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300'
                        }`}
                      >
                        {isCurrent ? '✓ Assigned' : 'Pair with Pin'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: 2:3 Vertical Pinterest Pin Studio */}
          {activeTab === 'vertical_studio' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Canvas Preview */}
              <div className="md:col-span-6 flex flex-col items-center">
                <canvas
                  ref={verticalCanvasRef}
                  className="w-full max-w-[260px] h-auto rounded-2xl shadow-2xl border border-slate-800"
                />
              </div>

              {/* Controls */}
              <div className="md:col-span-6 flex flex-col justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    2:3 Vertical Pin Customizer
                  </h5>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Bold Headline Text
                    </label>
                    <input
                      type="text"
                      value={verticalHeadline}
                      onChange={(e) => setVerticalHeadline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Badge Sticker Tag
                    </label>
                    <input
                      type="text"
                      value={verticalBadge}
                      onChange={(e) => setVerticalBadge(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Palette Style
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['amber', 'emerald', 'crimson', 'dark'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setVerticalTheme(t)}
                          className={`py-1 rounded text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                            verticalTheme === t
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyVerticalCanvasToPin}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer mt-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Assign 2:3 Canvas to Selected Pin
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Custom Media URL */}
          {activeTab === 'custom_url' && (
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-bold text-slate-200">
                Direct Image URL (HTTPS public link ending in .jpg, .png)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMediaUrl}
                  onChange={(e) => setCustomMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or your CDN URL"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (customMediaUrl.trim()) {
                      handleAssignMediaToPin(customMediaUrl.trim(), selectedPinId);
                      setCustomMediaUrl('');
                    }
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Attach to Pin
                </button>
              </div>

              {selectedPin?.mediaUrl && (
                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 block mb-1">Current URL:</span>
                  <p className="text-[11px] font-mono text-emerald-400 bg-slate-900 p-2 rounded-lg truncate">
                    {selectedPin.mediaUrl}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Step Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onPrevStep}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              ← Back to Spreadsheet
            </button>

            <button
              onClick={onNextStep}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span>Proceed to Bulk Deployment Queue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
