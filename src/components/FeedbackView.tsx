import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Upload, 
  Plus, 
  Download, 
  Trash2, 
  Sparkles, 
  Check, 
  Database, 
  ChevronLeft, 
  ChevronRight,
  Star
} from 'lucide-react';
import { FeedbackItem, SentimentType } from '../types';

interface FeedbackViewProps {
  items: FeedbackItem[];
  onUpdateCategory: (itemId: string, newCategory: string) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenImportModal: () => void;
  onOpenAddModal: () => void;
  onLoadCompetitionData: () => void;
  onLoadDemoData: () => void;
  onExportCSV: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedSentiment: string;
  onSelectSentiment: (sentiment: string) => void;
  hasAdaptionRun: boolean;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  items,
  onUpdateCategory,
  onDeleteItem,
  onOpenImportModal,
  onOpenAddModal,
  onLoadCompetitionData,
  onLoadDemoData,
  onExportCSV,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSentiment,
  onSelectSentiment,
  hasAdaptionRun
}) => {
  const [showAdaptedText, setShowAdaptedText] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [editingCategoryItemId, setEditingCategoryItemId] = useState<string | null>(null);

  // Available unique categories
  const allCategories = useMemo(() => {
    return Array.from(new Set(items.map(i => i.category))).filter(Boolean);
  }, [items]);

  // Standard category choices for correction
  const standardCategories = [
    'Fraud and Scam',
    'Operational Issues',
    'Customer Service',
    'Product Feedback',
    'Billing & Pricing'
  ];

  // Filtering
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedSentiment !== 'all' && item.sentiment !== selectedSentiment) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = item.text.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesSource = item.source.toLowerCase().includes(query);
        if (!matchesText && !matchesCategory && !matchesSource) return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedSentiment, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[260px] flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feedback text, category, or source..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => {
              onSelectCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories ({allCategories.length})</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedSentiment}
            onChange={(e) => {
              onSelectSentiment(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          {/* Adapted Text Toggle if Adaption ran */}
          {hasAdaptionRun && (
            <button
              onClick={() => setShowAdaptedText(!showAdaptedText)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                showAdaptedText
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{showAdaptedText ? 'Showing Cleaned' : 'Show Cleaned Text'}</span>
            </button>
          )}

          {/* Action Buttons */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Download analyzed CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Dataset Preset Buttons Quick Bar */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Quick Datasets:</span>
          <button
            onClick={onLoadCompetitionData}
            className="px-2.5 py-1 rounded bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors font-medium"
          >
            Load Competition Dataset (1,000+ reviews)
          </button>
          <button
            onClick={onLoadDemoData}
            className="px-2.5 py-1 rounded bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors font-medium"
          >
            Load E-Commerce Multi-Channel Demo
          </button>
        </div>

        <div className="font-mono tabular-nums">
          Showing {filteredItems.length} of {items.length} records
        </div>
      </div>

      {/* Main Feedback Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4 w-28">Sentiment</th>
                <th className="py-3 px-4">Customer Feedback</th>
                <th className="py-3 px-4 w-44">Category</th>
                <th className="py-3 px-4 w-24 text-center">Rating</th>
                <th className="py-3 px-4 w-32">Source</th>
                <th className="py-3 px-4 w-24">Date</th>
                <th className="py-3 px-4 w-20 text-center font-mono">Volume</th>
                <th className="py-3 px-3 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No feedback records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isEditingCat = editingCategoryItemId === item.id;
                  const displayContent = (showAdaptedText && item.adaptedText) ? item.adaptedText : item.text;

                  return (
                    <tr 
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Sentiment */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono tabular-nums">
                          <span className={`w-2 h-2 rounded-full ${
                            item.sentiment === 'positive' ? 'bg-emerald-500' :
                            item.sentiment === 'negative' ? 'bg-rose-500' : 'bg-amber-400'
                          }`} />
                          <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                            {item.sentiment}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore})
                          </span>
                        </div>
                      </td>

                      {/* Text */}
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 max-w-md">
                        <div className="leading-relaxed">
                          {displayContent}
                        </div>
                        {item.adaptedText && !showAdaptedText && (
                          <div className="text-[11px] text-indigo-500/80 dark:text-indigo-400/80 mt-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Adaption cleaned available</span>
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isEditingCat ? (
                          <div className="flex items-center gap-1">
                            <select
                              defaultValue={item.category}
                              onChange={(e) => {
                                onUpdateCategory(item.id, e.target.value);
                                setEditingCategoryItemId(null);
                              }}
                              onBlur={() => setEditingCategoryItemId(null)}
                              autoFocus
                              className="text-xs px-2 py-1 bg-white dark:bg-slate-800 border border-indigo-500 rounded text-slate-900 dark:text-white"
                            >
                              {standardCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingCategoryItemId(item.id)}
                            title="Click to correct category"
                            className="text-left font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                          >
                            {item.category}
                          </button>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.rating ? (
                          <div className="flex items-center justify-center gap-0.5 text-amber-500">
                            <span className="font-mono tabular-nums font-semibold">{item.rating}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {item.source}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
                        {item.date || 'Undated'}
                      </td>

                      {/* Mentions (Deduplicated Occurrences) */}
                      <td className="py-3 px-4 text-center font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {item.mentions || 1}x
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete feedback entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono tabular-nums">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
