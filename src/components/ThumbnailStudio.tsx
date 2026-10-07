import React, { useRef, useEffect, useState } from 'react';
import { SuggestedMedia } from '../types';
import { Download, Sparkles, Copy, Check, Image as ImageIcon, Sliders, RefreshCw, Wand2, Eye } from 'lucide-react';

interface ThumbnailStudioProps {
  media: SuggestedMedia;
  topicTitle: string;
}

type AspectRatio = '16:9' | '4:3' | '1:1';
type ThemeStyle = 'rustic' | 'emerald' | 'sunset' | 'midnight' | 'crimson';

export const ThumbnailStudio: React.FC<ThumbnailStudioProps> = ({ media, topicTitle }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Thumbnail customizable state
  const [headline, setHeadline] = useState(media?.thumbnailHeadlineOverlay || 'EASY 30-MIN MEAL!');
  const [badge, setBadge] = useState(media?.thumbnailBadge || 'RANK #1 RECIPE');
  const [subtext, setSubtext] = useState('Tested & Perfected • Step-by-Step Guide');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('rustic');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [activeTab, setActiveTab] = useState<'thumbnail' | 'in_content'>('thumbnail');

  // In-content image generation states
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  // Sync when media prop changes
  useEffect(() => {
    if (media?.thumbnailHeadlineOverlay) {
      setHeadline(media.thumbnailHeadlineOverlay);
    }
    if (media?.thumbnailBadge) {
      setBadge(media.thumbnailBadge);
    }
  }, [media]);

  // Render Canvas Thumbnail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1280;
    let height = 720;
    if (aspectRatio === '4:3') {
      width = 1200;
      height = 900;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    }

    canvas.width = width;
    canvas.height = height;

    // Background Gradient based on Theme
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (themeStyle === 'rustic') {
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.5, '#292524');
      grad.addColorStop(1, '#451a03');
    } else if (themeStyle === 'emerald') {
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#022c22');
      grad.addColorStop(1, '#111827');
    } else if (themeStyle === 'sunset') {
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.5, '#9a3412');
      grad.addColorStop(1, '#1e1b4b');
    } else if (themeStyle === 'midnight') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.6, '#1e293b');
      grad.addColorStop(1, '#020617');
    } else if (themeStyle === 'crimson') {
      grad.addColorStop(0, '#881337');
      grad.addColorStop(0.5, '#4c0519');
      grad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric flare / subtle lighting rings
    ctx.save();
    const radialGlow = ctx.createRadialGradient(width * 0.75, height * 0.35, 20, width * 0.75, height * 0.35, width * 0.6);
    radialGlow.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
    radialGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(width * 0.75, height * 0.35, width * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Subtle Grid / Accent Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 60; x < width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 60; y < height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Golden Accent Border
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    ctx.restore();

    // Draw Badge (Top Left Pill)
    if (badge) {
      ctx.save();
      const badgeText = badge.toUpperCase();
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 48;
      const badgeHeight = 52;
      const badgeX = 64;
      const badgeY = 64;

      // Badge Background (Solid Gold / Amber)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 10);
      ctx.fill();

      // Badge Text
      ctx.fillStyle = '#0f172a';
      ctx.fillText(badgeText, badgeX + 24, badgeY + 36);
      ctx.restore();
    }

    // Draw Main Headline (Huge, Punchy CTR Typography)
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 76px "Plus Jakarta Sans", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;

    // Word wrap headline for high CTR impact
    const words = (headline || topicTitle).split(' ');
    let currentLine = '';
    const lines: string[] = [];
    const maxTextWidth = width - 140;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      if (ctx.measureText(testLine).width > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const startY = height * 0.42;
    lines.forEach((line, index) => {
      // First line colored gold, second white
      if (index === 0) {
        ctx.fillStyle = '#fde047';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillText(line.toUpperCase(), 64, startY + index * 84);
    });
    ctx.restore();

    // Draw Subtext / Value Prop Tagline
    if (subtext) {
      ctx.save();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 32px "Plus Jakarta Sans", sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 8;
      const subY = startY + lines.length * 84 + 20;
      ctx.fillText(subtext, 64, Math.min(subY, height - 120));
      ctx.restore();
    }

    // Bottom Branding Banner
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(25, height - 74, width - 50, 49);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillText('⚡ RANKCRAFT HIGH-CTR MEDIA ASSET • OPTIMIZED SERP THUMBNAIL', 64, height - 42);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('100% PROVEN', width - 240, height - 42);
    ctx.restore();

  }, [headline, badge, subtext, aspectRatio, themeStyle, topicTitle]);

  // Handle Download PNG
  const handleDownloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `high-ctr-thumbnail-${aspectRatio.replace(':', 'x')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy HTML Tag for Image
  const handleCopyHtmlTag = () => {
    const tag = `<img src="/assets/images/thumbnail.png" alt="${headline}" width="1280" height="720" loading="lazy" class="rounded-xl shadow-2xl" />`;
    navigator.clipboard.writeText(tag);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Copy In-Content Prompt
  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  // Generate Image from Server
  const handleGenerateServerImage = async (prompt: string, idx: number) => {
    setGeneratingIndex(idx);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: '16:9' }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImages((prev) => ({ ...prev, [idx]: data.imageUrl }));
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setGeneratingIndex(null);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Studio Header */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
              Automated Media & Click-Through Creation Studio
              <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 font-medium">
                High-CTR Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generate catchy thumbnails for YouTube, Pinterest, & Google Discover, plus in-content visual assets.
            </p>
          </div>
        </div>

        {/* Studio Tab Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('thumbnail')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'thumbnail'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Catchy Thumbnail Studio
          </button>
          <button
            onClick={() => setActiveTab('in_content')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'in_content'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            In-Content Images ({media.inContentImagePrompts?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'thumbnail' ? (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Canvas Preview Area */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                Live CTR Preview ({aspectRatio})
              </span>
              <span className="text-emerald-400 font-medium">1080p Ultra-Sharp Output</span>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-2 flex items-center justify-center min-h-[300px]">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg shadow-2xl transition-all"
                style={{
                  maxHeight: '340px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Quick Actions Under Canvas */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleDownloadThumbnail}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Thumbnail (PNG)
              </button>
              <button
                onClick={handleCopyHtmlTag}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedHtml ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedHtml ? 'Copied HTML!' : 'Copy Img Tag'}
              </button>
            </div>
          </div>

          {/* Thumbnail Customization Controls */}
          <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              CTR Optimization Controls
            </h4>

            {/* Headline Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Punchy Headline Overlay (Max 5 Words)
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. 30-MIN DINNER!"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Badge Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Visual Badge Tag (Top-Left Pill)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. CHEF SECRET / KETO"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Subtext */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Supporting Value Prop Subtext
              </label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="e.g. Tested & Proven • Step-by-Step"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Aspect Ratio Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['16:9', '4:3', '1:1'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                      aspectRatio === ratio
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ratio}
                    <span className="block text-[10px] text-slate-500 font-normal">
                      {ratio === '16:9' ? 'YouTube/Web' : ratio === '4:3' ? 'Discover' : 'Social'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Background Style */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Vibrant Theme Palette
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'rustic', label: 'Rustic', color: 'from-amber-900 to-stone-900' },
                  { id: 'emerald', label: 'Fresh', color: 'from-emerald-900 to-teal-950' },
                  { id: 'sunset', label: 'Sunset', color: 'from-orange-800 to-indigo-950' },
                  { id: 'midnight', label: 'Studio', color: 'from-slate-900 to-cyan-950' },
                  { id: 'crimson', label: 'Luxe', color: 'from-rose-950 to-slate-950' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeStyle(t.id as ThemeStyle)}
                    className={`p-2 rounded-lg border text-center text-[10px] font-medium transition-all cursor-pointer ${
                      themeStyle === t.id
                        ? 'border-amber-400 ring-2 ring-amber-400/20 bg-slate-850 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-full h-3 rounded bg-gradient-to-r ${t.color} mb-1`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Image Prompt Suggestion */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-[11px] text-amber-400 font-semibold block mb-1">
                Recommended Photorealistic Prompt:
              </span>
              <p className="text-slate-400 italic text-[11px] line-clamp-3">
                "{media?.thumbnailPrompt || 'Professional food photography with rich colors and soft natural light'}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* In-Content Images Tab */
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              In-content visual media boosts time-on-page and unlocks image search rankings with SEO-optimized alt text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(media?.inContentImagePrompts || []).map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[11px]">
                      Slot {idx + 1}: {item.title}
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(item.prompt, idx)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPromptIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedPromptIndex === idx ? 'Copied' : 'Copy Prompt'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-1.5">{item.prompt}</p>

                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px] flex flex-col gap-1">
                    <span className="text-slate-400">
                      <strong className="text-amber-400/90">SEO Alt Text:</strong> {item.altText}
                    </span>
                    <span className="text-slate-400">
                      <strong className="text-slate-300">Caption:</strong> {item.caption}
                    </span>
                  </div>
                </div>

                {/* Generated or Placeholder Preview */}
                {generatedImages[idx] ? (
                  <div className="relative rounded-lg overflow-hidden border border-emerald-500/40">
                    <img
                      src={generatedImages[idx]}
                      alt={item.altText}
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-600">
                      Generated Live
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-dashed border-slate-800 rounded-lg p-4 text-center flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                    <span className="text-xs text-slate-400">Visual asset prompt ready for generation</span>
                    <button
                      onClick={() => handleGenerateServerImage(item.prompt, idx)}
                      disabled={generatingIndex === idx}
                      className="mt-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {generatingIndex === idx ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          Synthesizing Media...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                          Generate Visual Asset
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
