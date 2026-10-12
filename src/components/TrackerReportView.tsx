import React, { useState } from 'react';
import { 
  KanbanSquare, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  User, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { AdaptionPipelineStatus, FeedbackItem, IssueStatus, PriorityIssue } from '../types';
import { downloadBlob } from '../utils/csv';
import { generateExecutiveMemo } from '../utils/gemini';

interface TrackerReportViewProps {
  priorities: PriorityIssue[];
  items: FeedbackItem[];
  adaptionStatus: AdaptionPipelineStatus | null;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus) => void;
  onUpdateIssueOwner: (issueId: string, owner: string) => void;
  onUpdateIssueNotes: (issueId: string, notes: string) => void;
}

export const TrackerReportView: React.FC<TrackerReportViewProps> = ({
  priorities,
  items,
  adaptionStatus,
  onUpdateIssueStatus,
  onUpdateIssueOwner,
  onUpdateIssueNotes
}) => {
  const [subTab, setSubTab] = useState<'tracker' | 'report'>('tracker');
  const [copied, setCopied] = useState(false);
  const [isGeneratingAiMemo, setIsGeneratingAiMemo] = useState(false);
  const [aiMemo, setAiMemo] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string>('');

  // Kanban groupings
  const openIssues = priorities.filter(p => p.status === 'open');
  const inProgressIssues = priorities.filter(p => p.status === 'in_progress');
  const resolvedIssues = priorities.filter(p => p.status === 'resolved');

  // Key metrics
  const totalVolume = items.reduce((acc, it) => acc + (it.mentions || 1), 0);
  const negCount = items.filter(it => it.sentiment === 'negative').reduce((acc, it) => acc + (it.mentions || 1), 0);
  const posCount = items.filter(it => it.sentiment === 'positive').reduce((acc, it) => acc + (it.mentions || 1), 0);
  const nss = Math.round(((posCount - negCount) / Math.max(1, totalVolume)) * 100);

  const handleGenerateAiMemo = async () => {
    setIsGeneratingAiMemo(true);
    try {
      const res = await generateExecutiveMemo(items, priorities, nss);
      setAiMemo(res.memo);
      setAiModelUsed(res.modelUsed);
    } finally {
      setIsGeneratingAiMemo(false);
    }
  };

  // Markdown Report Generator
  const generateMarkdownReport = () => {
    return `# InsightFlow — Executive Feedback & Decision Intelligence Report
Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

## Executive Summary
Analysis of ${totalVolume.toLocaleString()} feedback mentions reveals a Net Sentiment Score (NSS) of ${nss > 0 ? `+${nss}` : nss}. 
High-priority operational and trust vulnerabilities require immediate executive interventions, notably in ${priorities[0]?.category || 'Operations'}.

${aiMemo ? `\n## AI Executive Synthesis (${aiModelUsed})\n${aiMemo}\n` : ''}

## Core Metrics
- Total Feedback Analyzed: ${totalVolume.toLocaleString()}
- Positive Mentions: ${posCount} (${Math.round((posCount / Math.max(1, totalVolume)) * 100)}%)
- Negative Complaints: ${negCount} (${Math.round((negCount / Math.max(1, totalVolume)) * 100)}%)
- Net Sentiment Score (NSS): ${nss}
- Adaption Data Quality: Grade ${adaptionStatus?.postRunGrade || 'C'} (${adaptionStatus?.postRunScore || '6.3'}/10)

## Top Prioritized Issues
${priorities.slice(0, 4).map((p, i) => `
### ${i + 1}. ${p.category}: ${p.title}
- **Priority Impact Score:** ${p.overallScore}/100
- **Complaints Volume:** ${p.negativeCount}
- **Assigned Lead:** ${p.owner || 'Unassigned'}
- **Current Status:** ${p.status.toUpperCase()}
- **Why It Matters:** ${p.whyItMatters}
- **Key Action:** ${p.recommendations[0]?.action || 'Audit root cause.'} (${p.recommendations[0]?.impactEstimate || 'Immediate impact'})
`).join('\n')}

---
Certified by InsightFlow Adaptive Intelligence Engine.
`;
  };

  // HTML Report Generator
  const generateHTMLReport = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>InsightFlow Executive Intelligence Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; color: #1e293b; line-height: 1.6; }
    h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #4f46e5; padding-bottom: 12px; }
    h2 { font-size: 18px; color: #334155; margin-top: 28px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; }
    .kpi-val { font-size: 22px; font-weight: bold; color: #4f46e5; }
    .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .issue-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .issue-head { display: flex; justify-content: space-between; font-weight: bold; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: #fee2e2; color: #991b1b; }
    .quote { background: #f1f5f9; padding: 8px 12px; border-left: 3px solid #6366f1; font-style: italic; font-size: 13px; margin: 10px 0; }
    footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>InsightFlow — Executive Customer Intelligence Report</h1>
  <p>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} · Data Pipeline: Adaption Grade ${adaptionStatus?.postRunGrade || 'C'}</p>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-val">${totalVolume.toLocaleString()}</div>
      <div class="kpi-label">Total Volume</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${nss > 0 ? `+${nss}` : nss}</div>
      <div class="kpi-label">Net Sentiment</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">${negCount}</div>
      <div class="kpi-label">Negative Mentions</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">Grade ${adaptionStatus?.postRunGrade || 'C'}</div>
      <div class="kpi-label">Data Quality</div>
    </div>
  </div>

  <h2>Prioritized Problem Action Plan</h2>
  ${priorities.map((p, idx) => `
    <div class="issue-card">
      <div class="issue-head">
        <span>#${idx + 1} ${p.category} — ${p.title}</span>
        <span class="badge">Score ${p.overallScore}/100</span>
      </div>
      <p style="font-size: 13px; color: #475569; margin: 8px 0;">${p.description}</p>
      <div class="quote">"${p.sampleQuotes[0] || 'Customer feedback reported.'}"</div>
      <p style="font-size: 12px;"><strong>Recommended Action:</strong> ${p.recommendations[0]?.action} (Owner: ${p.owner || 'Operations Lead'})</p>
    </div>
  `).join('')}

  <footer>
    Report prepared for Executive Leadership · Powered by InsightFlow
  </footer>
</body>
</html>`;
  };

  const handleDownloadMarkdown = () => {
    downloadBlob(generateMarkdownReport(), 'insightflow-executive-report.md', 'text/markdown;charset=utf-8;');
  };

  const handleDownloadHTML = () => {
    downloadBlob(generateHTMLReport(), 'insightflow-executive-report.html', 'text/html;charset=utf-8;');
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Segmented Control */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setSubTab('tracker')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'tracker'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Issue Tracking Board ({priorities.length})</span>
          </button>

          <button
            onClick={() => setSubTab('report')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTab === 'report'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>Executive Insights Report</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML</span>
          </button>
        </div>
      </div>

      {/* VIEW A: KANBAN TRACKER BOARD */}
      {subTab === 'tracker' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Column 1: Open */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Open (Backlog)</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                {openIssues.length}
              </span>
            </div>

            <div className="space-y-3">
              {openIssues.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No open issues</div>
              ) : (
                openIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {issue.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
                        Score {issue.overallScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {issue.title}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{issue.owner || 'Unassigned'}</span>
                      </span>
                      <button
                        onClick={() => onUpdateIssueStatus(issue.id, 'in_progress')}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        Start &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>In Progress</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                {inProgressIssues.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressIssues.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No issues currently in progress</div>
              ) : (
                inProgressIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {issue.category}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-amber-500">
                        Score {issue.overallScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {issue.title}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <button
                        onClick={() => onUpdateIssueStatus(issue.id, 'open')}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        &larr; Back
                      </button>
                      <button
                        onClick={() => onUpdateIssueStatus(issue.id, 'resolved')}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                      >
                        Resolve &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Resolved */}
          <div className="bg-slate-100/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Resolved & Mitigated</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                {resolvedIssues.length}
              </span>
            </div>

            <div className="space-y-3">
              {resolvedIssues.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No resolved issues yet</div>
              ) : (
                resolvedIssues.map(issue => (
                  <div
                    key={issue.id}
                    className="p-4 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs space-y-3 opacity-90"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white line-through text-slate-500">
                        {issue.category}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {issue.title}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Mitigated</span>
                      <button
                        onClick={() => onUpdateIssueStatus(issue.id, 'in_progress')}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Re-open
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: EXECUTIVE INSIGHTS REPORT */}
      {subTab === 'report' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs max-w-4xl mx-auto space-y-8">
          {/* Executive Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase mb-1">
                Executive Briefing
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                InsightFlow Customer Feedback & Decision Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Prepared for Executive Leadership · {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Data Quality</div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Grade {adaptionStatus?.postRunGrade || 'C'} ({adaptionStatus?.postRunScore || '6.3'}/10)
                </div>
              </div>
            </div>
          </div>

          {/* AI Executive Memo Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                  AI Strategic Executive Memo
                </h3>
                {aiModelUsed && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-800/60 text-indigo-800 dark:text-indigo-300">
                    {aiModelUsed}
                  </span>
                )}
              </div>

              <button
                disabled={isGeneratingAiMemo}
                onClick={handleGenerateAiMemo}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAiMemo ? 'Synthesizing...' : aiMemo ? 'Regenerate Memo' : 'Generate AI Memo'}</span>
              </button>
            </div>

            {aiMemo ? (
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 pt-2 whitespace-pre-line border-t border-indigo-100 dark:border-indigo-900">
                {aiMemo}
              </div>
            ) : (
              <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80">
                Click "Generate AI Memo" to run live synthesis across the dataset for C-suite situation assessment, root causes, and 30-day OKRs.
              </p>
            )}
          </div>

          {/* Executive Summary Narrative */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Executive Takeaway
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Based on the comprehensive NLP synthesis of <strong>{totalVolume.toLocaleString()}</strong> customer feedback touchpoints across multi-channel customer interactions, the organization currently operates at a Net Sentiment Score (NSS) of <strong className={nss < 0 ? 'text-rose-500' : 'text-emerald-500'}>{nss > 0 ? `+${nss}` : nss}</strong>. The most acute business threat stems from <strong>{priorities[0]?.category}</strong>, where repeat complaints directly jeopardize customer retention and payment processor standing.
            </p>
          </div>

          {/* Metric Summary Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              2. Core Performance Indicators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {totalVolume.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Total Mentions
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {Math.round((posCount / Math.max(1, totalVolume)) * 100)}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Positive Ratio
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                  {Math.round((negCount / Math.max(1, totalVolume)) * 100)}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Negative Ratio
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-lg font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {priorities.filter(p => p.status === 'open').length} Open
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                  Action Items
                </div>
              </div>
            </div>
          </div>

          {/* Prioritized Action Matrix */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              3. Strategic Action Roadmap (Ranked by 4-Factor Impact Formula)
            </h3>

            <div className="space-y-4">
              {priorities.slice(0, 4).map((p, idx) => (
                <div 
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300">
                        Priority #{idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {p.category} — {p.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      Score: {p.overallScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Root Cause & Why It Matters:</strong> {p.whyItMatters}
                  </p>

                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg text-xs italic text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
                    "{p.sampleQuotes[0]}"
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>Recommended Action: <strong className="text-slate-800 dark:text-slate-200">{p.recommendations[0]?.action}</strong></span>
                    <span>Assigned: <strong className="text-indigo-600 dark:text-indigo-400">{p.owner}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Options Bar */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Export options: Download full report package in HTML or Markdown.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadMarkdown}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Download Markdown (.md)
              </button>
              <button
                onClick={handleDownloadHTML}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
              >
                Download Standalone HTML (.html)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
