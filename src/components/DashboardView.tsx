import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Sparkles, 
  Search,
  Filter,
  ArrowRight,
  Calendar,
  BarChart2
} from 'lucide-react';
import { AdaptionPipelineStatus, FeedbackItem, PriorityIssue } from '../types';
import { extractFrequentPhrases } from '../utils/nlp';

interface DashboardViewProps {
  items: FeedbackItem[];
  priorities: PriorityIssue[];
  adaptionStatus: AdaptionPipelineStatus | null;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedSentiment: string;
  onSelectSentiment: (sentiment: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateToFeedback: () => void;
  onNavigateToPriorities: () => void;
  onNavigateToAdaption: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  items,
  priorities,
  adaptionStatus,
  selectedCategory,
  onSelectCategory,
  selectedSentiment,
  onSelectSentiment,
  searchQuery,
  onSearchChange,
  onNavigateToFeedback,
  onNavigateToPriorities,
  onNavigateToAdaption
}) => {
  // Aggregate Metrics
  const totalVolume = useMemo(() => {
    return items.reduce((acc, it) => acc + (it.mentions || 1), 0);
  }, [items]);

  const sentimentStats = useMemo(() => {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    items.forEach(it => {
      const weight = it.mentions || 1;
      if (it.sentiment === 'positive') positive += weight;
      else if (it.sentiment === 'negative') negative += weight;
      else neutral += weight;
    });

    const total = Math.max(1, positive + neutral + negative);
    const posPercent = Math.round((positive / total) * 100);
    const negPercent = Math.round((negative / total) * 100);
    const neuPercent = Math.max(0, 100 - posPercent - negPercent);

    // Net Sentiment Score (-100 to +100)
    const nss = posPercent - negPercent;

    return { positive, neutral, negative, posPercent, negPercent, neuPercent, nss };
  }, [items]);

  // Category breakdown
  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; positive: number; negative: number; neutral: number }>();
    items.forEach(it => {
      const weight = it.mentions || 1;
      const cur = map.get(it.category) || { total: 0, positive: 0, negative: 0, neutral: 0 };
      cur.total += weight;
      if (it.sentiment === 'positive') cur.positive += weight;
      else if (it.sentiment === 'negative') cur.negative += weight;
      else cur.neutral += weight;
      map.set(it.category, cur);
    });

    return Array.from(map.entries())
      .map(([cat, data]) => ({
        category: cat,
        total: data.total,
        positive: data.positive,
        negative: data.negative,
        neutral: data.neutral,
        negativeShare: Math.round((data.negative / Math.max(1, data.total)) * 100)
      }))
      .sort((a, b) => b.total - a.total);
  }, [items]);

  // Frequent complaints & phrases
  const frequentPhrases = useMemo(() => {
    return extractFrequentPhrases(items, 8);
  }, [items]);

  // Critical risk issues count
  const criticalIssuesCount = useMemo(() => {
    return priorities.filter(p => p.overallScore >= 70).length;
  }, [priorities]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(items.map(i => i.category))).filter(Boolean);
  }, [items]);

  // Simulated 6-Week Temporal Trend
  const weeklyTrends = useMemo(() => {
    const weeks = [
      { week: 'W1 (Sep 01)', pos: 68, neg: 32, total: 320, nss: 36 },
      { week: 'W2 (Sep 08)', pos: 62, neg: 38, total: 390, nss: 24 },
      { week: 'W3 (Sep 15)', pos: 51, neg: 49, total: 440, nss: 2 },
      { week: 'W4 (Sep 22)', pos: 44, neg: 56, total: 580, nss: -12 },
      { week: 'W5 (Sep 29)', pos: 38, neg: 62, total: 710, nss: -24 },
      { week: 'W6 (Oct 06)', pos: Math.max(20, sentimentStats.posPercent), neg: Math.min(80, sentimentStats.negPercent), total: Math.min(950, Math.round(totalVolume * 0.4)), nss: sentimentStats.nss }
    ];
    return weeks;
  }, [sentimentStats, totalVolume]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Strip */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews, keywords, or complaints..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories ({items.length})</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-2">
            <span>Sentiment:</span>
          </div>
          <select
            value={selectedSentiment}
            onChange={(e) => onSelectSentiment(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive Only</option>
            <option value="neutral">Neutral Only</option>
            <option value="negative">Negative Only</option>
          </select>

          {(selectedCategory !== 'all' || selectedSentiment !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectSentiment('all');
                onSearchChange('');
              }}
              className="text-xs px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 4 Core Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Volume */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Analyzed Feedback</span>
            <span className="font-mono tabular-nums text-slate-400">{items.length} distinct</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
              {totalVolume.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% Ingested</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Multi-channel records normalized
          </div>
        </div>

        {/* KPI 2: Net Sentiment Score */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Net Sentiment Score (NSS)</span>
            <span className="text-xs">Scale -100 to +100</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono tabular-nums ${
              sentimentStats.nss > 0 ? 'text-emerald-600 dark:text-emerald-400' :
              sentimentStats.nss < -20 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {sentimentStats.nss > 0 ? `+${sentimentStats.nss}` : sentimentStats.nss}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {sentimentStats.posPercent}% Pos · {sentimentStats.negPercent}% Neg
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {sentimentStats.nss < 0 ? 'Negative sentiment dominates volume' : 'Overall positive brand posture'}
          </div>
        </div>

        {/* KPI 3: Critical Issues */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>High-Priority Issues</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {criticalIssuesCount} Critical
            </span>
            <button
              onClick={onNavigateToPriorities}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Ranked via 4-factor impact algorithm
          </div>
        </div>

        {/* KPI 4: Adaption Quality */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Adaption Quality Grade</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono tabular-nums ${
                adaptionStatus?.state === 'completed' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400'
              }`}>
                {adaptionStatus?.state === 'completed' ? `Grade ${adaptionStatus.postRunGrade}` : 'Grade C'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                {adaptionStatus?.state === 'completed' ? `${adaptionStatus.postRunScore}/10` : '6.3/10 (Pre-Run)'}
              </span>
            </div>
            <button
              onClick={onNavigateToAdaption}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              {adaptionStatus?.state === 'completed' ? 'Cleaned' : 'Run'}
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {adaptionStatus?.state === 'completed'
              ? 'PII scrubbed & deduplicated'
              : 'Deduplicate to boost data grade'}
          </div>
        </div>
      </div>

      {/* 6-Week Temporal Trend Chart Card */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span>Feedback Volume & Net Sentiment Trend (6-Week Movement)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tracks how negative complaint volume surge correlates with declining Net Sentiment Score
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Positive Ratio
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Negative Ratio
            </span>
          </div>
        </div>

        {/* Bar & Trend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
          {weeklyTrends.map((w, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2 text-center"
            >
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {w.week}
              </div>

              {/* Stacked Ratio Bar */}
              <div className="h-14 w-8 mx-auto bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden flex flex-col justify-end">
                <div 
                  style={{ height: `${w.pos}%` }} 
                  className="bg-emerald-500 w-full transition-all"
                  title={`Positive: ${w.pos}%`}
                />
                <div 
                  style={{ height: `${w.neg}%` }} 
                  className="bg-rose-500 w-full transition-all"
                  title={`Negative: ${w.neg}%`}
                />
              </div>

              <div className="font-mono text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {w.total} <span className="text-[10px] text-slate-400 font-normal">vol</span>
                </div>
                <div className={`text-[11px] font-semibold ${
                  w.nss > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  NSS {w.nss > 0 ? `+${w.nss}` : w.nss}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Sentiment Distribution & Category Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sentiment Distribution Visualizer */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Sentiment Distribution
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              {totalVolume} Total Reviews
            </span>
          </div>

          {/* Segmented Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <div 
              style={{ width: `${sentimentStats.posPercent}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Positive: ${sentimentStats.posPercent}%`}
            />
            <div 
              style={{ width: `${sentimentStats.neuPercent}%` }} 
              className="bg-amber-400 h-full transition-all duration-500"
              title={`Neutral: ${sentimentStats.neuPercent}%`}
            />
            <div 
              style={{ width: `${sentimentStats.negPercent}%` }} 
              className="bg-rose-500 h-full transition-all duration-500"
              title={`Negative: ${sentimentStats.negPercent}%`}
            />
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-3 pt-2">
            <div 
              onClick={() => onSelectSentiment(selectedSentiment === 'positive' ? 'all' : 'positive')}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedSentiment === 'positive' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Positive</span>
              </div>
              <div className="text-right font-mono tabular-nums text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{sentimentStats.positive}</span>
                <span className="text-slate-400 ml-1.5">({sentimentStats.posPercent}%)</span>
              </div>
            </div>

            <div 
              onClick={() => onSelectSentiment(selectedSentiment === 'neutral' ? 'all' : 'neutral')}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedSentiment === 'neutral' 
                  ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Neutral</span>
              </div>
              <div className="text-right font-mono tabular-nums text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{sentimentStats.neutral}</span>
                <span className="text-slate-400 ml-1.5">({sentimentStats.neuPercent}%)</span>
              </div>
            </div>

            <div 
              onClick={() => onSelectSentiment(selectedSentiment === 'negative' ? 'all' : 'negative')}
              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedSentiment === 'negative' 
                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Negative</span>
              </div>
              <div className="text-right font-mono tabular-nums text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">{sentimentStats.negative}</span>
                <span className="text-slate-400 ml-1.5">({sentimentStats.negPercent}%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Click any sentiment row above to instantly drill into matching feedback records in the workspace.
          </div>
        </div>

        {/* Right Columns: Category Volume & Problem Intensity */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Category Volume & Complaint Severity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Relative negative ratio versus total feedback per operational domain
              </p>
            </div>
            <button
              onClick={onNavigateToFeedback}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {categoryStats.map(stat => {
              const isSelected = selectedCategory === stat.category;

              return (
                <div 
                  key={stat.category}
                  onClick={() => onSelectCategory(isSelected ? 'all' : stat.category)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {stat.category}
                    </span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      <span>{stat.total} mentions</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className={`${stat.negativeShare > 40 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {stat.negativeShare}% negative
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar: Total bar with negative proportion */}
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                    <div 
                      style={{ width: `${stat.negativeShare}%` }} 
                      className="h-full bg-rose-500 transition-all duration-300"
                    />
                    <div 
                      style={{ width: `${100 - stat.negativeShare}%` }} 
                      className="h-full bg-emerald-500/80 transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recurring Complaints & Keyword Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Phrases / Complaints */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Frequently Recurring Phrases
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                N-gram patterns extracted across all feedback mentions
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {frequentPhrases.map((phrase, idx) => (
              <div 
                key={idx}
                onClick={() => onSearchChange(phrase.phrase)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono tabular-nums text-slate-400 w-4">
                    {idx + 1}.
                  </span>
                  <div>
                    <span className="text-xs font-medium text-slate-900 dark:text-slate-200">
                      "{phrase.phrase}"
                    </span>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{phrase.category}</span>
                      <span>·</span>
                      <span className={phrase.sentiment === 'negative' ? 'text-rose-500' : 'text-emerald-500'}>
                        {phrase.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {phrase.count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Priority Highlights Banner */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Executive Action Highlights
              </h3>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
                Top Priority #1: {priorities[0]?.category}
              </span>
            </div>

            {priorities[0] && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {priorities[0].title}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    Impact Score: {priorities[0].overallScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {priorities[0].description}
                </p>
                <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 italic">
                  "{priorities[0].sampleQuotes[0]}"
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {priorities.length} issues prioritized by mathematical formula
            </span>
            <button
              onClick={onNavigateToPriorities}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Inspect All Priorities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
