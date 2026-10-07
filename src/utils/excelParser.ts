import * as XLSX from 'xlsx';
import { PinterestPinRow } from '../types';

export function parsePinterestSpreadsheet(file: File): Promise<PinterestPinRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          throw new Error('The uploaded spreadsheet contains no data rows.');
        }

        const parsedRows: PinterestPinRow[] = rawJson.map((row, index) => {
          // Normalize column headers
          const getVal = (possibleKeys: string[]) => {
            for (const key of possibleKeys) {
              for (const rowKey of Object.keys(row)) {
                if (rowKey.toLowerCase().trim() === key.toLowerCase().trim()) {
                  return String(row[rowKey] || '').trim();
                }
              }
            }
            return '';
          };

          const title = getVal(['title', 'pin title', 'headline', 'name']);
          const description = getVal(['description', 'pin description', 'body', 'copy']);
          const keywords = getVal(['keywords', 'tags', 'seo keywords', 'hashtags']);
          const link = getVal(['link', 'target link', 'website link', 'destination url', 'url']);
          const board = getVal(['pinterest board', 'board', 'board_name', 'category']) || 'Main Board';
          const mediaUrl = getVal(['media url', 'media', 'image url', 'video url', 'image_url']);
          const publishAt = getVal(['publish at', 'published_at', 'schedule', 'date']);

          return {
            id: `row_${Date.now()}_${index}`,
            title: title || `Untitled Pin ${index + 1}`,
            description: description || '',
            keywords: keywords || '',
            link: link || 'https://rankcraft.preview.app',
            board: board || 'Recipes & Guides',
            mediaUrl: mediaUrl || '',
            mediaType: 'image',
            thumbnailTitle: `Imported Row ${index + 1}`,
            publishAt: publishAt || undefined,
            status: 'draft',
          };
        });

        resolve(parsedRows);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

// Generate Official Pinterest Bulk Upload CSV
export function exportPinterestBulkCsv(pins: PinterestPinRow[], filename = 'pinterest-bulk-upload.csv') {
  const safePins = Array.isArray(pins) ? pins : [];
  // Column names conform to Pinterest's official bulk upload guide
  const csvData = safePins.map((pin) => ({
    'Title': (pin.title || '').substring(0, 100),
    'Description': (pin.description || '').substring(0, 500),
    'Media URL': pin.mediaUrl || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=1200',
    'Pinterest board': pin.board || 'Main Board',
    'Link': pin.link || 'https://rankcraft.preview.app',
    'Publish at': pin.publishAt || '',
    'Keywords': pin.keywords || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(csvData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate Official Pinterest Excel Spreadsheet (.xlsx)
export function exportPinterestExcel(pins: PinterestPinRow[], filename = 'pinterest-bulk-pins.xlsx') {
  const safePins = Array.isArray(pins) ? pins : [];
  const exportData = safePins.map((pin) => ({
    'Title': (pin.title || '').substring(0, 100),
    'Description': (pin.description || '').substring(0, 500),
    'Media URL': pin.mediaUrl || '',
    'Pinterest board': pin.board || 'Main Board',
    'Link': pin.link || '',
    'Publish at': pin.publishAt || '',
    'Keywords': pin.keywords || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pinterest Bulk Upload');
  XLSX.writeFile(workbook, filename);
}
