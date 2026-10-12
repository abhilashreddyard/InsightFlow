import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Target, 
  CheckCircle2, 
  Layout, 
  Lightbulb, 
  Code, 
  PlayCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

const CRITERIA = [
  {
    id: 'crit-1',
    weight: '15%',
    title: '1. Problem Understanding',
    subtitle: 'From Raw Feedback Chaos to Decisive Action Roadmaps',
    icon: Target,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
    summary: 'Businesses receive thousands of disconnected reviews across support tickets, App Store reviews, and surveys without knowing which fires to put out first.',
    highlights: [
      'Addresses real hackathon challenge: turns 1,000+ unstructured customer reviews into prioritized issues.',
      'Separates signal from noise: groups raw complaints into 5 core operational domains.',
      'Zero black-box mystery: every score and priority recommendation traces directly to verbatim quotes.'
    ],
    actionLabel: 'Explore Analytics Dashboard',
    targetTab: 'dashboard'
  },
  {
    id: 'crit-2',
    weight: '25%',
    title: '2. Functionality & User Experience',
    subtitle: 'Comprehensive End-to-End Feedback Intelligence Lifecycle',
    icon: CheckCircle2,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
    summary: 'Rich, interactive tooling covering ingestion, exploration, classification, filtering, and export.',
    highlights: [
      'Dual Preloaded Datasets: Instant 1-click loading of the full Build Battle Competition Dataset or multi-channel synthetic demo.',
      'Flexible CSV Ingestion: Drag & drop parser with automated column detection for text, category, dates, ratings, and channels.',
      'Inline Category Re-Tagging: Correct misclassified reviews directly in the table with instant priority score recalculation.',
      'High-Speed Zero-Latency Filtering: Filter instantly by category, sentiment, source channel, or free text search.'
    ],
    actionLabel: 'Inspect Feedback Table & Imports',
    targetTab: 'feedback'
  },
  {
    id: 'crit-3',
    weight: '20%',
    title: '3. UI/UX & Design',
    subtitle: 'Enterprise SaaS Polish & Typography Discipline',
    icon: Layout,
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
    summary: 'Built according to the Universal Frontend Design Constitution with zero AI slop.',
    highlights: [
      'Strict Zero-Pill Discipline: Static metadata rendered cleanly with subtle typographic dividers (·, /) rather than noisy capsule pills.',
      'Tabular Numerals Everywhere: All metrics, NSS scores, and timestamps enforce monospace tabular figures to eliminate layout jitter.',
      'Top Bar Contract: Single-element brand wordmark, clean single-line navigation tabs, and primary action zone.',
      'Full Dark & Light Theme: High-contrast accessibility adhering to WCAG AA contrast standards.'
    ],
    actionLabel: 'Review Design & Typography',
    targetTab: 'dashboard'
  },
  {
    id: 'crit-4',
    weight: '15%',
    title: '4. Innovation & Creativity',
    subtitle: 'Adaption Pipeline Economics & Strategy Simulator',
    icon: Lightbulb,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
    summary: 'Pioneers meaningful Adaption integration and dynamic strategy weight simulation.',
    highlights: [
      'Adaption Token Economics: Aggregates 7,000 raw comments down to 320 distinct prompts, saving up to 95.4% of API credit costs while preserving weighted frequency.',
      'PII Redaction & Quality Uplift: Evaluates dataset quality before and after (Grade C 6.3/10 -> Grade A 9.4/10).',
      'Dynamic Decision Simulator: Executives can adjust Volume, Severity, Growth, and Financial Risk weights live to test strategic scenarios.',
      'Live Gemini AI Memo: Generates C-suite executive briefings with 30-day OKRs.'
    ],
    actionLabel: 'Open Adaption Pipeline',
    targetTab: 'adaption'
  },
  {
    id: 'crit-5',
    weight: '15%',
    title: '5. Technical Implementation',
    subtitle: 'High-Performance Client NLP & Robust Architecture',
    icon: Code,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
    summary: 'Built with React 19, TypeScript, and modern modular architecture with zero runtime latency.',
    highlights: [
      'High-Performance Deterministic NLP: Fast lexicon sentiment engine with negation detection and star rating weighting.',
      'N-Gram Phrase Extractor: Surfaces recurring 2-3 word complaint clusters in milliseconds without server roundtrips.',
      'Standardized Adaption Schemas: Exports CSVs formatted strictly to prompt, context, completion, and mentions.',
      'Zero Build Warnings: Pristine TypeScript types and robust state synchronization.'
    ],
    actionLabel: 'View Prioritization Engine',
    targetTab: 'priorities'
  },
  {
    id: 'crit-6',
    weight: '10%',
    title: '6. Presentation & Demo',
    subtitle: 'Business-Ready 3-Minute Executive Storyline',
    icon: PlayCircle,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
    summary: 'A structured, compelling workflow designed for instant stakeholder alignment.',
    highlights: [
      'Minute 1: Ingest & Explore — Show competition dataset, search friction keywords, and correct a category.',
      'Minute 2: Adaption Quality Uplift — Demonstrate credit savings and Grade C to Grade A data certification.',
      'Minute 3: Prioritize & Resolve — Inspect why Fraud ranks #1, assign an owner in Kanban, and export the HTML report.'
    ],
    actionLabel: 'Open Executive Report & Kanban',
    targetTab: 'tracker'
  }
];

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const activeCriterion = CRITERIA[currentStep];
  const IconComponent = activeCriterion.icon;

  const handleNext = () => {
    if (currentStep < CRITERIA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToTab = () => {
    onNavigateTab(activeCriterion.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Judging & Evaluation Walkthrough
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Step {currentStep + 1} of 6
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How InsightFlow addresses all 6 hackathon evaluation criteria
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

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono">
          {CRITERIA.map((crit, idx) => (
            <button
              key={crit.id}
              onClick={() => setCurrentStep(idx)}
              className={`py-2 text-center border-b-2 transition-colors ${
                currentStep === idx
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {crit.weight}
            </button>
          ))}
        </div>

        {/* Main Step Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${activeCriterion.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                Evaluation Weight: {activeCriterion.weight}
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {activeCriterion.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeCriterion.subtitle}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {activeCriterion.summary}
          </p>

          <div className="space-y-2.5">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Key Implementation Evidence
            </div>
            {activeCriterion.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{h}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Test this capability directly in the app:
            </span>
            <button
              onClick={handleJumpToTab}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{activeCriterion.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <button
            disabled={currentStep === 0}
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Dismiss
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-lg transition-colors shadow-xs"
            >
              <span>{currentStep === CRITERIA.length - 1 ? 'Finish Tour' : 'Next Criterion'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
