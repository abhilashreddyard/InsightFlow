import React, { useState, useEffect, useMemo } from 'react';
import { Header, NavTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { FeedbackView } from './components/FeedbackView';
import { PrioritiesView } from './components/PrioritiesView';
import { TrackerReportView } from './components/TrackerReportView';
import { AdaptionPipelineView } from './components/AdaptionPipelineView';
import { ColumnMapperModal } from './components/ColumnMapperModal';
import { AddFeedbackModal } from './components/AddFeedbackModal';
import { DemoTourModal } from './components/DemoTourModal';
import { INITIAL_COMPETITION_FEEDBACK } from './data/competitionDataset';
import { SYNTHETIC_DEMO_FEEDBACK } from './data/demoDataset';
import { AdaptionPipelineStatus, FeedbackItem, IssueStatus, PriorityIssue } from './types';
import { computePriorityIssues } from './utils/nlp';
import { downloadBlob, exportFeedbackToCSV } from './utils/csv';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Core feedback items state
  const [items, setItems] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('insightflow_feedback');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_COMPETITION_FEEDBACK;
  });

  // Active dataset name
  const [datasetName, setDatasetName] = useState<string>('Competition Dataset (Build Battle)');

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Adaption Pipeline state
  const [adaptionStatus, setAdaptionStatus] = useState<AdaptionPipelineStatus | null>(() => {
    return {
      state: 'idle',
      progress: 0,
      distinctCount: INITIAL_COMPETITION_FEEDBACK.length,
      totalVolume: INITIAL_COMPETITION_FEEDBACK.reduce((acc, it) => acc + (it.mentions || 1), 0),
      creditsSaved: Math.max(0, INITIAL_COMPETITION_FEEDBACK.reduce((acc, it) => acc + (it.mentions || 1), 0) - INITIAL_COMPETITION_FEEDBACK.length),
      estimatedCredits: INITIAL_COMPETITION_FEEDBACK.length,
      preRunScore: 6.3,
      postRunScore: 9.4,
      preRunGrade: 'C',
      postRunGrade: 'A',
      qualityMetrics: {
        deduplicationEfficiency: '95.2%',
        piiScrubbingRate: 'Clean (0 PII leaks)',
        semanticConsistency: '98.6% Coherent',
        ambiguityReduction: '+34.2% Clarity'
      },
      sampleCleaned: [
        {
          original: 'I was a victim of fraud, the seller requested additional payment after purchase.',
          cleaned: 'Victim of seller fraud: seller demanded unauthorized additional payment post-purchase.',
          category: 'Fraud and Scam',
          mentions: 54
        },
        {
          original: 'The delivery was delayed by two weeks, which was very inconvenient.',
          cleaned: 'Delivery delayed by two weeks, resulting in significant operational inconvenience.',
          category: 'Operational Issues',
          mentions: 76
        },
        {
          original: 'Customer service was not helpful and did not provide a satisfactory solution to my issue.',
          cleaned: 'Customer service was unhelpful and failed to provide a satisfactory issue resolution.',
          category: 'Customer Service',
          mentions: 58
        }
      ]
    };
  });

  // Dynamic priority issues calculation based on current feedback items
  const basePriorities = useMemo(() => {
    return computePriorityIssues(items);
  }, [items]);

  // Issue tracker state overrides (status, owner, notes)
  const [issueOverrides, setIssueOverrides] = useState<Record<string, { status: IssueStatus; owner?: string; notes?: string }>>({});

  const priorities: PriorityIssue[] = useMemo(() => {
    return basePriorities.map(p => {
      const override = issueOverrides[p.id];
      if (override) {
        return {
          ...p,
          status: override.status,
          owner: override.owner || p.owner,
          notes: override.notes || p.notes
        };
      }
      return p;
    });
  }, [basePriorities, issueOverrides]);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Persist items to localStorage
  useEffect(() => {
    localStorage.setItem('insightflow_feedback', JSON.stringify(items));
  }, [items]);

  // Handlers
  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleResetDataset = () => {
    setItems(INITIAL_COMPETITION_FEEDBACK);
    setDatasetName('Competition Dataset (Build Battle)');
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSearchQuery('');
  };

  const handleLoadCompetitionData = () => {
    setItems(INITIAL_COMPETITION_FEEDBACK);
    setDatasetName('Competition Dataset (Build Battle)');
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSearchQuery('');
  };

  const handleLoadDemoData = () => {
    setItems(SYNTHETIC_DEMO_FEEDBACK);
    setDatasetName('E-Commerce Multi-Channel Demo');
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSearchQuery('');
  };

  const handleUpdateCategory = (itemId: string, newCategory: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, category: newCategory } : item));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddFeedback = (newItem: FeedbackItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleImportComplete = (importedItems: FeedbackItem[], filename: string) => {
    setItems(importedItems);
    setDatasetName(`Imported: ${filename}`);
    setSelectedCategory('all');
    setSelectedSentiment('all');
    setSearchQuery('');
  };

  const handleExportCSV = () => {
    const csvContent = exportFeedbackToCSV(items);
    downloadBlob(csvContent, 'insightflow-analyzed-feedback.csv');
  };

  const handleUpdateIssueStatus = (issueId: string, status: IssueStatus) => {
    setIssueOverrides(prev => ({
      ...prev,
      [issueId]: {
        ...(prev[issueId] || { status: 'open' }),
        status
      }
    }));
  };

  const handleUpdateIssueOwner = (issueId: string, owner: string) => {
    setIssueOverrides(prev => ({
      ...prev,
      [issueId]: {
        ...(prev[issueId] || { status: 'open' }),
        owner
      }
    }));
  };

  const handleUpdateIssueNotes = (issueId: string, notes: string) => {
    setIssueOverrides(prev => ({
      ...prev,
      [issueId]: {
        ...(prev[issueId] || { status: 'open' }),
        notes
      }
    }));
  };

  const handleApplyAdaptedData = (cleanedItems: FeedbackItem[]) => {
    setItems(cleanedItems);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        datasetName={datasetName}
        onResetDataset={handleResetDataset}
        onExportReport={() => setCurrentTab('tracker')}
        onOpenDemoTour={() => setIsTourModalOpen(true)}
        itemCount={items.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            items={items}
            priorities={priorities}
            adaptionStatus={adaptionStatus}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSentiment={selectedSentiment}
            onSelectSentiment={setSelectedSentiment}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateToFeedback={() => setCurrentTab('feedback')}
            onNavigateToPriorities={() => setCurrentTab('priorities')}
            onNavigateToAdaption={() => setCurrentTab('adaption')}
          />
        )}

        {currentTab === 'feedback' && (
          <FeedbackView
            items={items}
            onUpdateCategory={handleUpdateCategory}
            onDeleteItem={handleDeleteItem}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onLoadCompetitionData={handleLoadCompetitionData}
            onLoadDemoData={handleLoadDemoData}
            onExportCSV={handleExportCSV}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSentiment={selectedSentiment}
            onSelectSentiment={setSelectedSentiment}
            hasAdaptionRun={adaptionStatus?.state === 'completed'}
          />
        )}

        {currentTab === 'priorities' && (
          <PrioritiesView
            priorities={priorities}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onNavigateToTracker={() => setCurrentTab('tracker')}
          />
        )}

        {currentTab === 'tracker' && (
          <TrackerReportView
            priorities={priorities}
            items={items}
            adaptionStatus={adaptionStatus}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onUpdateIssueOwner={handleUpdateIssueOwner}
            onUpdateIssueNotes={handleUpdateIssueNotes}
          />
        )}

        {currentTab === 'adaption' && (
          <AdaptionPipelineView
            items={items}
            adaptionStatus={adaptionStatus}
            onUpdateAdaptionStatus={setAdaptionStatus}
            onApplyAdaptedData={handleApplyAdaptedData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">InsightFlow</span>
            <span>·</span>
            <span>Intelligent Customer Feedback & Decision Platform</span>
            <span>·</span>
            <span>Frontend Arena Build Battle 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Adaption Adaptive Data Pipeline</span>
            <span>·</span>
            <span>Client NLP Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ColumnMapperModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />

      <AddFeedbackModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFeedback={handleAddFeedback}
      />

      <DemoTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
