import React, { useState, useRef } from 'react';
import { PinterestPinRow, GeneratedContentResponse } from '../../types';
import { parsePinterestSpreadsheet, exportPinterestBulkCsv, exportPinterestExcel } from '../../utils/excelParser';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Search,
  ExternalLink,
  Edit2,
  FileDown,
  Layers,
  Wand2
} from 'lucide-react';

interface ExcelDataIngestionProps {
  pins: PinterestPinRow[];
  setPins: React.Dispatch<React.SetStateAction<PinterestPinRow[]>>;
  currentModule1Content: GeneratedContentResponse;
  onNextStep: () => void;
}

export const ExcelDataIngestion: React.FC<ExcelDataIngestionProps> = ({
  pins,
  setPins,
  currentModule1Content,
  onNextStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingAiPins, setIsGeneratingAiPins] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  // File Upload Handlers
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    try {
      const parsed = await parsePinterestSpreadsheet(file);
      setPins(parsed);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setUploadError(err?.message || 'Failed to parse Excel/CSV spreadsheet. Please verify format.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const safePins = Array.isArray(pins) ? pins : [];

  // Add new blank row
  const handleAddRow = () => {
    const newRow: PinterestPinRow = {
      id: `row_${Date.now()}`,
      title: 'New High-Ranking Pinterest Pin Title',
      description: 'Pin description featuring rich keywords and call to action. Tap link for recipe! #Recipe #Dinner',
      keywords: 'easy recipe, dinner ideas, quick meals',
      link: 'https://rankcraft.preview.app/recipe',
      board: 'Quick 30-Minute Dinners',
      mediaUrl: '',
      mediaType: 'image',
      status: 'draft',
    };
    setPins([newRow, ...safePins]);
    setEditingRowId(newRow.id);
  };

  // Duplicate row
  const handleDuplicateRow = (id: string) => {
    const target = safePins.find((p) => p.id === id);
    if (!target) return;
    const duplicated: PinterestPinRow = {
      ...target,
      id: `row_${Date.now()}_dup`,
      title: `${target.title} (Copy)`.substring(0, 100),
      status: 'draft',
    };
    setPins([...safePins, duplicated]);
  };

  // Delete row
  const handleDeleteRow = (id: string) => {
    setPins((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== id));
  };

  // Update row field
  const handleUpdateField = (id: string, field: keyof PinterestPinRow, val: string) => {
    setPins((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) => {
        if (p.id === id) {
          return { ...p, [field]: val };
        }
        return p;
      })
    );
  };

  // Generate Pin Rows from Module 1 Active Content
  const handleImportFromModule1 = async () => {
    setIsGeneratingAiPins(true);
    setUploadError(null);
    try {
      const topic = currentModule1Content?.recipeData?.recipeTitle || currentModule1Content?.h1Title || 'Gourmet Guide';
      const res = await fetch('/api/pinterest/generate-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          primaryKeyword: currentModule1Content?.primaryKeyword || 'recipe',
          destinationUrl: `https://rankcraft.preview.app/${currentModule1Content?.urlSlug || 'guide'}`,
          contentType: currentModule1Content?.recipeData ? 'recipe' : 'article',
          longTailKeywords: Array.isArray(currentModule1Content?.longTailKeywords) ? currentModule1Content.longTailKeywords : [],
          recipeTitle: currentModule1Content?.recipeData?.recipeTitle,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI Pin variants');
      }

      const data = await res.json();
      const rawPins = Array.isArray(data?.pins) ? data.pins : [];
      if (rawPins.length > 0) {
        // Pre-map with available media from Module 1 if available
        const mediaList = [
          'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
        ];

        const enrichedPins = rawPins.map((pin: PinterestPinRow, i: number) => ({
          ...pin,
          mediaUrl: mediaList[i % mediaList.length],
        }));

        setPins(enrichedPins);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || 'Could not auto-generate pins from Module 1 content.');
    } finally {
      setIsGeneratingAiPins(false);
    }
  };

  // Filtered rows for search
  const filteredPins = safePins.filter(
    (p) =>
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.board || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Dropzone & Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-7 border-2 border-dashed rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="font-bold text-slate-100 text-sm md:text-base">
            Upload Pinterest Excel (.xlsx) or CSV Spreadsheet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Drag and drop your spreadsheet with columns: <strong>Title</strong>, <strong>Description</strong>, <strong>Keywords</strong>, <strong>Board</strong>, and <strong>Link</strong>.
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-amber-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>Supports: .xlsx, .xls, .csv (Pinterest Bulk Upload Format)</span>
          </div>
        </div>

        {/* Right: Quick Action Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Automated Data Pipeline
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Instantly create ready-to-deploy Pin variations directly from the active article/recipe generated in Module 1.
            </p>

            <button
              onClick={handleImportFromModule1}
              disabled={isGeneratingAiPins}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAiPins ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-slate-950" />
                  Generating 6 Pin Variations from Module 1...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  Auto-Populate Pins from Active Module 1 Content
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Download Official Templates:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportPinterestBulkCsv(pins, 'pinterest-bulk-template.csv')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-400" />
                CSV Template
              </button>
              <button
                onClick={() => exportPinterestExcel(pins, 'pinterest-bulk-template.xlsx')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Spreadsheet Grid Manager Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm md:text-base">
                  Pinterest Metadata Spreadsheet Editor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
                  {safePins.length} Pins Loaded
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live compliance checks: Title (max 100 chars), Description (max 500 chars), SEO Hashtags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pins or boards..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48 sm:w-60"
              />
            </div>

            <button
              onClick={handleAddRow}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pin Row
            </button>
          </div>
        </div>

        {/* Spreadsheet Interactive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[260px]">Pin Title (Max 100)</th>
                <th className="py-3 px-4 min-w-[340px]">Description & Hashtags (Max 500)</th>
                <th className="py-3 px-4 min-w-[180px]">Target Board</th>
                <th className="py-3 px-4 min-w-[200px]">Website Destination Link</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPins.map((pin, idx) => {
                const titleLen = pin.title.length;
                const descLen = pin.description.length;
                const titleOver = titleLen > 100;
                const descOver = descLen > 500;

                return (
                  <tr
                    key={pin.id}
                    className="hover:bg-slate-950/40 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3 px-4 text-center font-mono text-slate-500 text-xs font-bold">
                      {idx + 1}
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        <textarea
                          rows={2}
                          value={pin.title}
                          onChange={(e) => handleUpdateField(pin.id, 'title', e.target.value)}
                          className={`w-full bg-slate-950/80 border rounded-lg p-2 text-xs text-white focus:outline-none transition-colors ${
                            titleOver ? 'border-rose-500 text-rose-200' : 'border-slate-800 focus:border-amber-500'
                          }`}
                        />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={titleOver ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                            {titleLen}/100 chars {titleOver ? '(Exceeds Pinterest Limit!)' : ''}
                          </span>
                          {titleLen >= 50 && titleLen <= 90 && (
                            <span className="text-emerald-400">✓ Optimal mobile length</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex flex-col gap-1">
                        <textarea
                          rows={3}
                          value={pin.description}
                          onChange={(e) => handleUpdateField(pin.id, 'description', e.target.value)}
                          className={`w-full bg-slate-950/80 border rounded-lg p-2 text-xs text-slate-200 focus:outline-none transition-colors ${
                            descOver ? 'border-rose-500 text-rose-200' : 'border-slate-800 focus:border-amber-500'
                          }`}
                        />
                        <div className="flex items-center justify-between text-[10px]">
                          <span className={descOver ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                            {descLen}/500 chars
                          </span>
                          <span className="text-amber-400/80 truncate max-w-[200px]">
                            Keywords: {pin.keywords || 'None'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target Board */}
                    <td className="py-3 px-4 align-top">
                      <input
                        type="text"
                        value={pin.board}
                        onChange={(e) => handleUpdateField(pin.id, 'board', e.target.value)}
                        placeholder="e.g. Quick Dinners"
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </td>

                    {/* Target Link */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={pin.link}
                          onChange={(e) => handleUpdateField(pin.id, 'link', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-amber-500"
                        />
                        {pin.link && (
                          <a
                            href={pin.link}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 align-top text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleDuplicateRow(pin.id)}
                          title="Duplicate row"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(pin.id)}
                          title="Delete row"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Total Pins: <strong className="text-white">{safePins.length}</strong></span>
            <span>Valid Pins: <strong className="text-emerald-400">{safePins.filter((p) => p.title.length <= 100 && p.description.length <= 500 && p.title.length > 0).length}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportPinterestBulkCsv(safePins)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Export Pinterest Bulk CSV
            </button>
            <button
              onClick={onNextStep}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <span>Proceed to Media Mapping</span>
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
