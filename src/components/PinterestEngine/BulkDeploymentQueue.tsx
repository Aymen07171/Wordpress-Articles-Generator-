import React, { useState } from 'react';
import { PinterestPinRow, PinterestBoard } from '../../types';
import { exportPinterestBulkCsv, exportPinterestExcel } from '../../utils/excelParser';
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Download,
  RotateCcw,
  Layers,
  Sparkles,
  Calendar,
  Share2,
  Bookmark,
  Check,
  TrendingUp,
  Globe
} from 'lucide-react';

interface BulkDeploymentQueueProps {
  pins: PinterestPinRow[];
  setPins: React.Dispatch<React.SetStateAction<PinterestPinRow[]>>;
  boards: PinterestBoard[];
  onPrevStep: () => void;
}

export const BulkDeploymentQueue: React.FC<BulkDeploymentQueueProps> = ({
  pins,
  setPins,
  boards,
  onPrevStep,
}) => {
  const [scheduleCadence, setScheduleCadence] = useState<'immediate' | 'staggered_30m' | 'daily'>('immediate');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [deploymentSummary, setDeploymentSummary] = useState<{
    total: number;
    published: number;
    failed: number;
    timestamp: string;
  } | null>(null);
  const [savedPinsLocally, setSavedPinsLocally] = useState<Record<string, boolean>>({});

  const safePins = Array.isArray(pins) ? pins : [];
  const publishedPins = safePins.filter((p) => p.status === 'published');
  const hasPublishedAny = publishedPins.length > 0;

  // Deploy Pins in Bulk via Backend API Pipeline
  const handleStartBulkDeployment = async () => {
    setIsDeploying(true);
    setDeploymentProgress(10);

    // Set all pins to queued
    setPins((prev) => (Array.isArray(prev) ? prev : []).map((p) => ({ ...p, status: 'queued' })));

    try {
      // Step 1: Validation simulation
      await new Promise((r) => setTimeout(r, 600));
      setDeploymentProgress(35);
      setPins((prev) => (Array.isArray(prev) ? prev : []).map((p) => ({ ...p, status: 'validating' })));

      // Step 2: Uploading / Publishing simulation
      await new Promise((r) => setTimeout(r, 800));
      setDeploymentProgress(60);
      setPins((prev) => (Array.isArray(prev) ? prev : []).map((p) => ({ ...p, status: 'publishing' })));

      // Call server endpoint
      const response = await fetch('/api/pinterest/bulk-deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pins: safePins, scheduleCadence }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete bulk deployment');
      }

      const data = await response.json();
      setDeploymentProgress(100);

      if (data?.pins && Array.isArray(data.pins)) {
        setPins(data.pins);
        setDeploymentSummary({
          total: data.summary?.total ?? data.pins.length,
          published: data.summary?.published ?? data.pins.filter((p: any) => p.status === 'published').length,
          failed: data.summary?.failed ?? 0,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (err: any) {
      console.error(err);
      // Mark failed
      setPins((prev) => (Array.isArray(prev) ? prev : []).map((p) => ({ ...p, status: 'failed', error: 'Network error during publish' })));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleToggleSaveMock = (pinId: string) => {
    setSavedPinsLocally((prev) => ({
      ...prev,
      [pinId]: !prev[pinId],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Deployment Configuration Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-400" />
              Automated Bulk Deployment Engine
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
              {safePins.length} Pins Ready in Queue
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish multiple mapped pins simultaneously directly to your targeted Pinterest boards.
          </p>
        </div>

        {/* Schedule Cadence Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 font-semibold px-2">Cadence:</span>
            <button
              onClick={() => setScheduleCadence('immediate')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                scheduleCadence === 'immediate'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Publish Immediately
            </button>
            <button
              onClick={() => setScheduleCadence('staggered_30m')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                scheduleCadence === 'staggered_30m'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Every 30 Mins
            </button>
            <button
              onClick={() => setScheduleCadence('daily')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                scheduleCadence === 'daily'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Cadence
            </button>
          </div>

          {/* Trigger Deployment Button */}
          <button
            onClick={handleStartBulkDeployment}
            disabled={isDeploying || safePins.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-red-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Deploying {safePins.length} Pins to Pinterest...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Deploy {safePins.length} Pins to Pinterest</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar & Deployment Stats */}
      {isDeploying && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              Automated Pinterest Bulk Publishing Queue Active
            </span>
            <span className="font-mono font-bold text-amber-400">
              {deploymentProgress}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
              style={{ width: `${deploymentProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>[1] Validating metadata</span>
            <span>[2] Processing 2:3 media</span>
            <span>[3] Pushing to Pinterest API</span>
            <span>[4] Live pin validation</span>
          </div>
        </div>
      )}

      {/* Deployment Success Banner */}
      {deploymentSummary && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-200 text-sm">
                Bulk Deployment Complete!
              </h4>
              <p className="text-slate-300 text-[11px]">
                {deploymentSummary.published} of {deploymentSummary.total} Pins deployed to Pinterest at {deploymentSummary.timestamp}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPinterestBulkCsv(safePins, 'pinterest-published-pins.csv')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              Export Bulk Deployment CSV
            </button>
          </div>
        </div>
      )}

      {/* Deployment Status Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Live Queue & Deployment Status
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {safePins.filter((p) => p.status === 'published').length} Published • {safePins.filter((p) => p.status === 'draft').length} Drafts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold">
              <tr>
                <th className="py-3 px-4">Pin Title & Target Board</th>
                <th className="py-3 px-4">Media</th>
                <th className="py-3 px-4">Publish Cadence</th>
                <th className="py-3 px-4">Deployment Status</th>
                <th className="py-3 px-4 text-right">Live Pin Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {safePins.map((pin) => (
                <tr key={pin.id} className="hover:bg-slate-950/40">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100 max-w-md line-clamp-1">
                      {pin.title}
                    </div>
                    <div className="text-[11px] text-amber-400 mt-0.5">
                      Board: {pin.board}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="w-10 h-14 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                      {pin.mediaUrl ? (
                        <img
                          src={pin.mediaUrl}
                          alt={pin.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                          None
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {pin.publishAt ? new Date(pin.publishAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Immediate'}
                  </td>

                  <td className="py-3 px-4">
                    {pin.status === 'published' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" /> Published Live
                      </span>
                    ) : pin.status === 'publishing' || pin.status === 'validating' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <RotateCcw className="w-3 h-3 animate-spin" /> In Progress
                      </span>
                    ) : pin.status === 'failed' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                        <AlertCircle className="w-3 h-3" /> {pin.error || 'Failed'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 w-fit">
                        Ready to Deploy
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {pin.publishedUrl ? (
                      <a
                        href={pin.publishedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-rose-400 hover:text-rose-300 font-bold inline-flex items-center gap-1 hover:underline text-[11px]"
                      >
                        <span>View on Pinterest</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Pending Deploy</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Pinterest Feed Mockup Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              P
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Live Pinterest Feed Simulation
              </h3>
              <p className="text-xs text-slate-400">
                Visual preview of how your deployed pins will appear to users on the Pinterest home and search feeds.
              </p>
            </div>
          </div>

          <span className="text-xs px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-mono">
            Standard 2:3 Vertical Pins
          </span>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {safePins.map((pin) => {
            const isSaved = savedPinsLocally[pin.id] || false;

            return (
              <div
                key={pin.id}
                className="group bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Media Image Container with Hover Red Save Button */}
                <div className="relative aspect-[2/3] bg-slate-900 overflow-hidden">
                  {pin.mediaUrl ? (
                    <img
                      src={pin.mediaUrl}
                      alt={pin.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2 p-4 text-center">
                      <Sparkles className="w-8 h-8 text-amber-500/50" />
                      <span className="text-xs font-medium">Standard 2:3 Vertical Graphic</span>
                    </div>
                  )}

                  {/* Pinterest Red Save Button on Hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleSaveMock(pin.id)}
                      className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-2xl transition-transform active:scale-95 cursor-pointer ${
                        isSaved
                          ? 'bg-slate-900 text-white border border-slate-700'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? 'Saved!' : 'Save'}</span>
                    </button>
                  </div>

                  {/* Board Tag Badge */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-800 max-w-[80%] truncate">
                    📌 {pin.board}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col gap-2">
                  <h4 className="font-bold text-xs text-slate-100 line-clamp-2 leading-snug">
                    {pin.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {pin.description}
                  </p>

                  {/* Destination Link Pill */}
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 truncate text-amber-400/90 font-mono">
                      <Globe className="w-3 h-3" />
                      rankcraft.app
                    </span>
                    {pin.status === 'published' && (
                      <span className="text-emerald-400 font-bold">Live</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onPrevStep}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          ← Back to Media Mapping
        </button>
      </div>
    </div>
  );
};
