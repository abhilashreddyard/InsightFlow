export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface FeedbackItem {
  id: string;
  text: string;
  category: string;
  sentiment: SentimentType;
  sentimentScore: number; // -1.0 to 1.0
  source: string;
  date?: string; // YYYY-MM-DD
  rating?: number; // 1-5 stars
  mentions: number; // count of duplicate/identical occurrences
  adaptedText?: string;
  manualCategoryCorrection?: string;
}

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface ActionRecommendation {
  id: string;
  title: string;
  action: string;
  ownerTeam: string;
  confidence: number; // 0 - 100%
  urgency: 'high' | 'medium' | 'low';
  impactEstimate: string;
}

export interface PriorityIssue {
  id: string;
  category: string;
  title: string;
  description: string;
  whyItMatters: string;
  volume: number;
  negativeCount: number;
  severityScore: number; // 0 - 100
  growthRate: number; // % change, e.g. +24% or 0
  financialRiskScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  scoreFactors: {
    volumeWeight: number;
    severityWeight: number;
    growthWeight: number;
    financialWeight: number;
  };
  sampleQuotes: string[];
  recommendations: ActionRecommendation[];
  status: IssueStatus;
  owner?: string;
  notes?: string;
}

export interface AdaptionRecipeConfig {
  maskPii: boolean;
  deduplicate: boolean;
  rephrasePrompt: boolean;
  toneNormalize: boolean;
}

export interface AdaptionPipelineStatus {
  state: 'idle' | 'preparing' | 'running' | 'completed' | 'error';
  progress: number;
  distinctCount: number;
  totalVolume: number;
  creditsSaved: number;
  estimatedCredits: number;
  preRunScore: number; // e.g. 6.2 / 10
  postRunScore: number; // e.g. 9.4 / 10
  preRunGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  postRunGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  qualityMetrics: {
    deduplicationEfficiency: string;
    piiScrubbingRate: string;
    semanticConsistency: string;
    ambiguityReduction: string;
  };
  sampleCleaned: Array<{
    original: string;
    cleaned: string;
    category: string;
    mentions: number;
  }>;
}

export interface ExecutiveReportData {
  generatedAt: string;
  totalFeedback: number;
  netSentimentScore: number;
  negativeRatio: number;
  riskIssuesCount: number;
  dataQualityGrade: string;
  topPriorities: PriorityIssue[];
  executiveSummary: string;
}
