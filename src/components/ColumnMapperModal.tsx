import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { ColumnMapping, convertRowsToFeedbackItems, detectColumnMapping, parseCSV } from '../utils/csv';
import { FeedbackItem } from '../types';

interface ColumnMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (items: FeedbackItem[], filename: string) => void;
}

export const ColumnMapperModal: React.FC<ColumnMapperModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    textField: '',
    categoryField: '',
    dateField: '',
    ratingField: '',
    sourceField: ''
  });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    processFile(selectedFile);
  };

  const processFile = (fileToProcess: File) => {
    setError(null);
    setFile(fileToProcess);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.headers.length === 0 || parsed.rows.length === 0) {
          setError('CSV file appears empty or formatted improperly.');
          return;
        }

        setHeaders(parsed.headers);
        setRows(parsed.rows);
        const guessed = detectColumnMapping(parsed.headers);
        setMapping(guessed);
      } catch (err) {
        setError('Failed to parse CSV file. Please verify delimiter format.');
      }
    };
    reader.readAsText(fileToProcess);
  };

  const handleConfirmImport = () => {
    if (!mapping.textField) {
      setError('Please select a column for the feedback review text.');
      return;
    }

    const items = convertRowsToFeedbackItems(rows, mapping);
    onImportComplete(items, file?.name || 'Uploaded CSV');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Import CSV Dataset
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your customer feedback dataset and align column mappings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Picker Zone */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileText className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Click or drag your CSV file here to upload
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Supports review, category, timestamp, rating, and channel columns
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{file.name}</span>
                <span className="text-slate-400">({rows.length.toLocaleString()} rows detected)</span>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setHeaders([]);
                  setRows([]);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Choose another file
              </button>
            </div>
          )}

          {/* Column Alignment Selectors */}
          {headers.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Column Alignments
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Feedback Review Text (Required) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Feedback / Review Text <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={mapping.textField}
                    onChange={(e) => setMapping({ ...mapping, textField: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Column --</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category (Optional)
                  </label>
                  <select
                    value={mapping.categoryField}
                    onChange={(e) => setMapping({ ...mapping, categoryField: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Auto-predict with AI rules</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Star Rating 1-5 (Optional)
                  </label>
                  <select
                    value={mapping.ratingField}
                    onChange={(e) => setMapping({ ...mapping, ratingField: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">None / Not in dataset</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date / Timestamp (Optional)
                  </label>
                  <select
                    value={mapping.dateField}
                    onChange={(e) => setMapping({ ...mapping, dateField: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">None / Undated</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                {/* Source / Channel */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Source Channel (Optional)
                  </label>
                  <select
                    value={mapping.sourceField}
                    onChange={(e) => setMapping({ ...mapping, sourceField: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Default to "CSV Import"</option>
                    {headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Preview (First 3 rows) */}
              <div className="mt-4">
                <h5 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Preview Sample Records (First 3 Rows)
                </h5>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        {headers.slice(0, 4).map(h => (
                          <th key={h} className="py-2 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rows.slice(0, 3).map((r, i) => (
                        <tr key={i}>
                          {headers.slice(0, 4).map(h => (
                            <td key={h} className="py-2 px-3 text-slate-700 dark:text-slate-300 truncate max-w-xs">
                              {r[h] || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!file || !mapping.textField}
            onClick={handleConfirmImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
          >
            Import & Run NLP Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
