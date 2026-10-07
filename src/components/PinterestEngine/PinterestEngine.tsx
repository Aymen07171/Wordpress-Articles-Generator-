import React, { useState } from 'react';
import { PinterestPinRow, PinterestBoard, GeneratedContentResponse } from '../../types';
import { initialPinterestBoards, samplePinterestPins } from '../../data/samplePinterestData';
import { ExcelDataIngestion } from './ExcelDataIngestion';
import { MediaMappingTool } from './MediaMappingTool';
import { BulkDeploymentQueue } from './BulkDeploymentQueue';
import {
  FileSpreadsheet,
  Layers,
  Rocket,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface PinterestEngineProps {
  currentModule1Content: GeneratedContentResponse;
  onNavigateToModule1: () => void;
}

export const PinterestEngine: React.FC<PinterestEngineProps> = ({
  currentModule1Content,
  onNavigateToModule1,
}) => {
  const [activeStep, setActiveStep] = useState<'ingestion' | 'mapping' | 'deployment'>('ingestion');
  const [pins, setPins] = useState<PinterestPinRow[]>(samplePinterestPins);
  const [boards] = useState<PinterestBoard[]>(initialPinterestBoards);

  const safePins = Array.isArray(pins) ? pins : [];
  const mappedCount = safePins.filter((p) => p.mediaUrl && p.mediaUrl.length > 0).length;
  const publishedCount = safePins.filter((p) => p.status === 'published').length;

  return (
    <div className="space-y-8">
      {/* Module 2 Header & Overview Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                P
              </span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Module 2: Pinterest Bulk Publishing Engine
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Distribute Content & Media Directly to Pinterest
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
              Upload spreadsheets, pair Module 1 catchy thumbnails, and deploy high-converting Pinterest Pins simultaneously following the official Pinterest bulk specification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToModule1}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>← Back to Module 1 Creator</span>
            </button>
          </div>
        </div>

        {/* 3-Step Interactive Process Navigation Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          {/* Step 1 */}
          <button
            onClick={() => setActiveStep('ingestion')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
              activeStep === 'ingestion'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl font-bold ${
                activeStep === 'ingestion'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400">Step 1</div>
              <div className="font-bold text-xs text-slate-100">Excel / CSV Data Ingestion</div>
              <div className="text-[11px] text-slate-400">{safePins.length} Metadata Rows</div>
            </div>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => setActiveStep('mapping')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
              activeStep === 'mapping'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl font-bold ${
                activeStep === 'mapping'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400">Step 2</div>
              <div className="font-bold text-xs text-slate-100">Media Mapping Tool</div>
              <div className="text-[11px] text-slate-400">{mappedCount}/{safePins.length} Paired</div>
            </div>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => setActiveStep('deployment')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
              activeStep === 'deployment'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 text-white'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div
              className={`p-2.5 rounded-xl font-bold ${
                activeStep === 'deployment'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-400">Step 3</div>
              <div className="font-bold text-xs text-slate-100">Bulk Deployment Queue</div>
              <div className="text-[11px] text-slate-400">{publishedCount} Published Live</div>
            </div>
          </button>
        </div>
      </div>

      {/* Active Step Content */}
      <div className="transition-all">
        {activeStep === 'ingestion' && (
          <ExcelDataIngestion
            pins={pins}
            setPins={setPins}
            currentModule1Content={currentModule1Content}
            onNextStep={() => setActiveStep('mapping')}
          />
        )}

        {activeStep === 'mapping' && (
          <MediaMappingTool
            pins={pins}
            setPins={setPins}
            currentModule1Content={currentModule1Content}
            onNextStep={() => setActiveStep('deployment')}
            onPrevStep={() => setActiveStep('ingestion')}
          />
        )}

        {activeStep === 'deployment' && (
          <BulkDeploymentQueue
            pins={pins}
            setPins={setPins}
            boards={boards}
            onPrevStep={() => setActiveStep('mapping')}
          />
        )}
      </div>
    </div>
  );
};
