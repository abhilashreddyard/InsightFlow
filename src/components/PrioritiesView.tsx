import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Quote, 
  Sliders, 
  BookmarkCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PriorityIssue, IssueStatus } from '../types';

interface PrioritiesViewProps {
  priorities: PriorityIssue[];
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
  onNavigateToTracker: () => void;
}

export const PrioritiesView: React.FC<PrioritiesViewProps> = ({
  priorities,
  onUpdateIssueStatus,
  onNavigateToTracker
}) => {
  // Dynamic Weight Simulator States
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [volWeight, setVolWeight] = useState(40);
  const [sevWeight, setSevWeight] = useState(25);
  const [growthWeight, setGrowthWeight] = useState(20);
  const [riskWeight, setRiskWeight] = useState(15);

  // Recalculate priority issues dynamically based on custom weights
  const dynamicPriorities = useMemo(() => {
    const totalWeights = volWeight + sevWeight + growthWeight + riskWeight || 1;
    const wVol = volWeight / totalWeights;
    const wSev = sevWeight / totalWeights;
    const wGro = growthWeight / totalWeights;
    const wRisk = riskWeight / totalWeights;

    const maxVolume = Math.max(1, ...priorities.map(p => p.negativeCount));

    return priorities.map(issue => {
      const normVol = (issue.negativeCount / maxVolume) * 100;
      const normSev = issue.severityScore;
      const normGro = Math.max(0, Math.min(100, 50 + issue.growthRate * 0.8));
      const normRisk = issue.financialRiskScore;

      const dynamicScore = Math.round(
        (normVol * wVol) +
        (normSev * wSev) +
        (normGro * wGro) +
        (normRisk * wRisk)
      );

      return {
        ...issue,
        overallScore: Math.min(100, Math.max(1, dynamicScore)),
        scoreFactors: {
          volumeWeight: Math.round(wVol * 100),
          severityWeight: Math.round(wSev * 100),
          growthWeight: Math.round(wGro * 100),
          financialWeight: Math.round(wRisk * 100)
        }
      };
    }).sort((a, b) => b.overallScore - a.overallScore);
  }, [priorities, volWeight, sevWeight, growthWeight, riskWeight]);

  const [selectedIssueId, setSelectedIssueId] = useState<string>(dynamicPriorities[0]?.id || '');
  const activeIssue = dynamicPriorities.find(p => p.id === selectedIssueId) || dynamicPriorities[0];

  const applyPreset = (preset: 'balanced' | 'crisis' | 'scale') => {
    if (preset === 'balanced') {
      setVolWeight(40);
      setSevWeight(25);
      setGrowthWeight(20);
      setRiskWeight(15);
    } else if (preset === 'crisis') {
      setVolWeight(15);
      setSevWeight(45);
      setGrowthWeight(10);
      setRiskWeight(30);
    } else if (preset === 'scale') {
      setVolWeight(50);
      setSevWeight(15);
      setGrowthWeight(30);
      setRiskWeight(5);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formula & Explainability Banner */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Intelligent Prioritization Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Issues are ranked deterministically by a multi-factor mathematical impact model. Tweak weights or select strategic presets to simulate executive decision trade-offs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isSimulatorOpen ? 'Hide Strategy Simulator' : 'Customize Scoring Weights'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Weight Simulator Drawer */}
        {isSimulatorOpen && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 pt-4 mt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Strategy Presets:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyPreset('balanced')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Balanced Standard (40/25/20/15)
                </button>
                <button
                  onClick={() => applyPreset('crisis')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                >
                  Crisis & Fraud Containment
                </button>
                <button
                  onClick={() => applyPreset('scale')}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  High-Growth & Volume Scale
                </button>
                <button
                  onClick={() => applyPreset('balanced')}
                  title="Reset to default"
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span>Volume Weight</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{volWeight}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={volWeight}
                  onChange={(e) => setVolWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span>Severity Weight</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{sevWeight}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={sevWeight}
                  onChange={(e) => setSevWeight(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span>Growth Velocity</span>
                  <span className="font-bold text-amber-500">{growthWeight}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={growthWeight}
                  onChange={(e) => setGrowthWeight(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] mb-1">
                  <span>Financial Risk</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{riskWeight}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={riskWeight}
                  onChange={(e) => setRiskWeight(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Ranked Issue Selector & Deep Dive Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ranked List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ranked Issues ({dynamicPriorities.length})
            </h3>
            <span className="text-[11px] text-slate-400">Click to inspect</span>
          </div>

          {dynamicPriorities.map((issue, idx) => {
            const isSelected = issue.id === activeIssue?.id;

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono ${
                      idx === 0 ? 'bg-rose-500 text-white' :
                      idx === 1 ? 'bg-amber-500 text-white' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {issue.category}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {issue.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 font-mono font-bold text-sm">
                      <span className={`${
                        issue.overallScore >= 75 ? 'text-rose-600 dark:text-rose-400' :
                        issue.overallScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                        'text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {issue.overallScore}
                      </span>
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-slate-400">
                      {issue.negativeCount} complaints
                    </span>
                  </div>
                </div>

                {/* Score Factor Chips */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span>Severity: <strong className="text-slate-800 dark:text-slate-200">{issue.severityScore}%</strong></span>
                    <span>·</span>
                    <span>Risk: <strong className="text-slate-800 dark:text-slate-200">{issue.financialRiskScore}%</strong></span>
                  </div>
                  <span className={`capitalize font-medium ${
                    issue.status === 'resolved' ? 'text-emerald-500' :
                    issue.status === 'in_progress' ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Dive & Verbatim Evidence */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {activeIssue ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{activeIssue.category}</span>
                    <span>·</span>
                    <span>Assigned to {activeIssue.owner || 'Operations Lead'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeIssue.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeIssue.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                      Priority Score
                    </div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 mt-0.5">
                      {activeIssue.overallScore}
                    </div>
                    <div className="text-[10px] text-slate-500">out of 100</div>
                  </div>
                </div>
              </div>

              {/* "Why It Matters" Box */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Why It Deserves Immediate Attention</span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                  {activeIssue.whyItMatters}
                </p>
              </div>

              {/* Customer Verbatim Quotes */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Verified Customer Quotes</span>
                </h4>
                <div className="space-y-2">
                  {activeIssue.sampleQuotes.map((quote, qIdx) => (
                    <div 
                      key={qIdx}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs italic text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      "{quote}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Actionable Recommendations</span>
                </h4>
                <div className="space-y-3">
                  {activeIssue.recommendations.map(rec => (
                    <div 
                      key={rec.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {rec.title}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {rec.confidence}% Confidence
                          </span>
                          <span>·</span>
                          <span className={`uppercase font-bold ${
                            rec.urgency === 'high' ? 'text-rose-500' : 'text-amber-500'
                          }`}>
                            {rec.urgency} Urgency
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rec.action}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400">
                        <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{rec.ownerTeam}</strong></span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">{rec.impactEstimate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issue Status & Tracking Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={activeIssue.status}
                    onChange={(e) => onUpdateIssueStatus(activeIssue.id, e.target.value as IssueStatus)}
                    className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value="open">Open (Backlog)</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={onNavigateToTracker}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Open in Issue Tracker</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Select an issue from the list to inspect root cause insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
