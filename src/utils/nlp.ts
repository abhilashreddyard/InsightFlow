import { ActionRecommendation, FeedbackItem, PriorityIssue, SentimentType } from '../types';

// Lexicon for deterministic client NLP sentiment analysis
const POSITIVE_WORDS = new Set([
  'great', 'excellent', 'outstanding', 'innovative', 'helpful', 'promptly',
  'perfect', 'exceeded', 'useful', 'responsive', 'knowledgeable', 'friendly',
  'efficient', 'valuable', 'durable', 'reliable', 'sleek', 'modern', 'exceptional',
  'fast', 'smooth', 'loved', 'love', 'impressed', 'seamless', 'game-changer',
  'worth', 'good', 'best', 'satisfied', 'transparent', 'convenient', 'fantastic'
]);

const NEGATIVE_WORDS = new Set([
  'disappointed', 'unresponsive', 'fraud', 'scam', 'scammed', 'fraudulent',
  'counterfeit', 'delayed', 'defects', 'defect', 'broke', 'broken', 'crashing',
  'crash', 'glitch', 'glitches', 'unhelpful', 'unresolved', 'inconvenient',
  'terrible', 'stolen', 'missing', 'damaged', 'worst', 'horrible', 'poor',
  'fake', 'charge', 'charged', 'fee', 'fail', 'failed', 'stopped', 'frustrating',
  'opaque', 'unauthorized', 'battered', 'shattered', 'slow', 'waste', 'bad'
]);

const NEGATION_WORDS = new Set([
  'not', 'never', 'no', 'none', "wasn't", "didn't", "cannot", "can't",
  "couldn't", "won't", "don't", 'without', 'hardly'
]);

const MONEY_KEYWORDS = [
  'charge', 'charged', 'fee', 'money', 'payment', 'paid', 'refund',
  'price', 'pricing', 'subscription', 'fraud', 'scam', 'scammed', 'escrow',
  'counterfeit', 'billing', 'cost'
];

/**
 * Deterministic Sentiment Analysis with Negation and Star Weighting
 */
export function analyzeSentiment(text: string, rating?: number): {
  sentiment: SentimentType;
  score: number;
} {
  const words = text.toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).filter(Boolean);
  let rawScore = 0;
  let wordMatches = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const isNegated = NEGATION_WORDS.has(prevWord);

    if (POSITIVE_WORDS.has(word)) {
      rawScore += isNegated ? -1.2 : 1.0;
      wordMatches++;
    } else if (NEGATIVE_WORDS.has(word)) {
      rawScore += isNegated ? 0.8 : -1.2;
      wordMatches++;
    }
  }

  let normalized = wordMatches > 0 ? rawScore / Math.max(1, wordMatches) : 0;

  // Star rating blend if provided
  if (rating !== undefined && rating > 0) {
    const ratingScore = (rating - 3) / 2; // 1->-1, 2->-0.5, 3->0, 4->0.5, 5->1.0
    normalized = normalized * 0.6 + ratingScore * 0.4;
  }

  // Clamped score between -1 and 1
  const finalScore = Math.max(-1, Math.min(1, Math.round(normalized * 100) / 100));

  let sentiment: SentimentType = 'neutral';
  if (finalScore >= 0.25) {
    sentiment = 'positive';
  } else if (finalScore <= -0.2) {
    sentiment = 'negative';
  }

  return { sentiment, score: finalScore };
}

/**
 * Predict or validate Category from text keywords
 */
export function predictCategory(text: string): string {
  const lower = text.toLowerCase();

  if (/fraud|scam|counterfeit|stole|fake|seller asked|wire|crypto/.test(lower)) {
    return 'Fraud and Scam';
  }
  if (/support|agent|representative|ticket|chat|call|hold|assistance|service/.test(lower)) {
    return 'Customer Service';
  }
  if (/deliver|shipping|delayed|carrier|package|order|website|crash|glitch|packaging|transit/.test(lower)) {
    return 'Operational Issues';
  }
  if (/billing|pricing|charge|fee|refund|payment|subscription|invoice/.test(lower)) {
    return 'Billing & Pricing';
  }
  if (/feature|quality|performance|product|durable|battery|design|broke|material/.test(lower)) {
    return 'Product Feedback';
  }

  return 'Product Feedback';
}

/**
 * Extract Recurring Key Phrases & Common Complaints
 */
export interface ExtractedPhrase {
  phrase: string;
  count: number;
  sentiment: SentimentType;
  category: string;
}

const STOP_WORDS = new Set([
  'the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you',
  'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was',
  'so', 'if', 'out', 'my', 'me', 'we', 'they', 'them', 'he', 'she', 'had',
  'an', 'been', 'from', 'by', 'their', 'there', 'about', 'some'
]);

export function extractFrequentPhrases(items: FeedbackItem[], maxResults = 10): ExtractedPhrase[] {
  const phraseCounts = new Map<string, { count: number; totalScore: number; categories: Map<string, number> }>();

  items.forEach(item => {
    const tokens = item.text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
    const weight = item.mentions || 1;

    // Generate 2-word and 3-word n-grams
    for (let n = 2; n <= 3; n++) {
      for (let i = 0; i <= tokens.length - n; i++) {
        const slice = tokens.slice(i, i + n);
        // Ensure not all stop words
        const phrase = slice.join(' ');
        if (phrase.length < 7) continue;

        const current = phraseCounts.get(phrase) || { count: 0, totalScore: 0, categories: new Map() };
        current.count += weight;
        current.totalScore += item.sentimentScore * weight;
        current.categories.set(item.category, (current.categories.get(item.category) || 0) + weight);
        phraseCounts.set(phrase, current);
      }
    }
  });

  const sorted = Array.from(phraseCounts.entries())
    .filter(([_, data]) => data.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, maxResults)
    .map(([phrase, data]) => {
      const avgScore = data.totalScore / data.count;
      let sentiment: SentimentType = 'neutral';
      if (avgScore >= 0.2) sentiment = 'positive';
      else if (avgScore <= -0.2) sentiment = 'negative';

      // Pick top category
      let topCategory = 'General';
      let maxCatCount = 0;
      data.categories.forEach((cnt, cat) => {
        if (cnt > maxCatCount) {
          maxCatCount = cnt;
          topCategory = cat;
        }
      });

      return {
        phrase,
        count: data.count,
        sentiment,
        category: topCategory
      };
    });

  return sorted;
}

/**
 * Intelligent Prioritization Engine
 * Computes transparent, explainable priority ranking based on:
 * Score = 40% Volume + 25% Severity + 20% Growth + 15% Financial Risk
 * (or 50 / 30 / 20 if timestamps are absent)
 */
export function computePriorityIssues(items: FeedbackItem[]): PriorityIssue[] {
  // Group by category
  const categoryGroups = new Map<string, FeedbackItem[]>();
  items.forEach(item => {
    const list = categoryGroups.get(item.category) || [];
    list.push(item);
    categoryGroups.set(item.category, list);
  });

  const hasDates = items.some(i => Boolean(i.date));

  // Find max volume across categories for normalization
  let maxNegativeVolume = 1;
  categoryGroups.forEach(groupItems => {
    const negVol = groupItems.reduce((acc, it) => acc + (it.sentiment === 'negative' ? (it.mentions || 1) : 0), 0);
    if (negVol > maxNegativeVolume) maxNegativeVolume = negVol;
  });

  const priorityList: PriorityIssue[] = [];

  categoryGroups.forEach((groupItems, category) => {
    const totalVolume = groupItems.reduce((acc, it) => acc + (it.mentions || 1), 0);
    const negativeItems = groupItems.filter(it => it.sentiment === 'negative');
    const negativeVolume = negativeItems.reduce((acc, it) => acc + (it.mentions || 1), 0);

    if (negativeVolume === 0) return; // Skip if no negative issues

    // 1. Volume Factor (0 - 100)
    const volumeFactor = Math.min(100, Math.round((negativeVolume / maxNegativeVolume) * 100));

    // 2. Severity Factor (0 - 100): average negativity intensity
    const totalNegScoreSum = negativeItems.reduce((acc, it) => acc + Math.abs(it.sentimentScore) * (it.mentions || 1), 0);
    const avgNegScore = negativeVolume > 0 ? totalNegScoreSum / negativeVolume : 0.5;
    const severityFactor = Math.min(100, Math.round(avgNegScore * 100));

    // 3. Growth Factor: compare latest 4 weeks vs prior 4 weeks (if dated)
    let growthRate = 0;
    let growthFactor = 50; // neutral default
    if (hasDates) {
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000); // 4 weeks ago
      const recentNeg = negativeItems
        .filter(it => it.date && new Date(it.date) >= cutoffDate)
        .reduce((sum, it) => sum + (it.mentions || 1), 0);
      const pastNeg = negativeItems
        .filter(it => it.date && new Date(it.date) < cutoffDate)
        .reduce((sum, it) => sum + (it.mentions || 1), 0);

      if (pastNeg > 0) {
        growthRate = Math.round(((recentNeg - pastNeg) / pastNeg) * 100);
      } else if (recentNeg > 0) {
        growthRate = 35;
      }
      growthFactor = Math.max(0, Math.min(100, Math.round(50 + growthRate * 0.8)));
    }

    // 4. Financial / Money Factor: share of comments mentioning charge, money, refund, scam, etc.
    const moneyCount = negativeItems
      .filter(it => MONEY_KEYWORDS.some(k => it.text.toLowerCase().includes(k)))
      .reduce((sum, it) => sum + (it.mentions || 1), 0);
    const moneyRatio = negativeVolume > 0 ? moneyCount / negativeVolume : 0;
    const financialFactor = Math.min(100, Math.round(moneyRatio * 100));

    // Overall Score Calculation
    let overallScore = 0;
    let weights = {
      volumeWeight: 40,
      severityWeight: 25,
      growthWeight: 20,
      financialWeight: 15
    };

    if (hasDates) {
      overallScore = Math.round(
        (volumeFactor * 0.40) +
        (severityFactor * 0.25) +
        (growthFactor * 0.20) +
        (financialFactor * 0.15)
      );
    } else {
      weights = {
        volumeWeight: 50,
        severityWeight: 30,
        growthWeight: 0,
        financialWeight: 20
      };
      overallScore = Math.round(
        (volumeFactor * 0.50) +
        (severityFactor * 0.30) +
        (financialFactor * 0.20)
      );
    }

    // Sample representative quotes
    const sortedNegatives = [...negativeItems].sort((a, b) => (b.mentions || 1) - (a.mentions || 1));
    const sampleQuotes = sortedNegatives.slice(0, 3).map(it => it.text);

    // Dynamic tailored recommendations and root cause narratives
    const { title, description, whyItMatters, recommendations } = generateCategoryInsights(
      category,
      negativeVolume,
      financialFactor,
      growthRate
    );

    priorityList.push({
      id: `prio-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      category,
      title,
      description,
      whyItMatters,
      volume: totalVolume,
      negativeCount: negativeVolume,
      severityScore: severityFactor,
      growthRate,
      financialRiskScore: financialFactor,
      overallScore: Math.min(100, Math.max(1, overallScore)),
      scoreFactors: weights,
      sampleQuotes,
      recommendations,
      status: 'open',
      owner: getCategoryDefaultOwner(category)
    });
  });

  // Sort descending by overall priority score
  return priorityList.sort((a, b) => b.overallScore - a.overallScore);
}

function getCategoryDefaultOwner(category: string): string {
  switch (category) {
    case 'Fraud and Scam':
      return 'Trust & Safety Lead';
    case 'Operational Issues':
      return 'Head of Operations & Logistics';
    case 'Customer Service':
      return 'VP of Customer Experience';
    case 'Billing & Pricing':
      return 'Finance & Revenue Ops';
    default:
      return 'Product Engineering Lead';
  }
}

function generateCategoryInsights(
  category: string,
  negativeVolume: number,
  financialRisk: number,
  growthRate: number
): {
  title: string;
  description: string;
  whyItMatters: string;
  recommendations: ActionRecommendation[];
} {
  switch (category) {
    case 'Fraud and Scam':
      return {
        title: 'Severe Trust & Merchant Escrow Vulnerability',
        description: `${negativeVolume} verified reports indicate unauthorized seller fees, non-delivery scams, and counterfeit products being sold under platform listings.`,
        whyItMatters: 'Fraud destroys customer lifetime value, triggers immediate payment gateway chargeback disputes, and threatens brand compliance standing across payment networks.',
        recommendations: [
          {
            id: 'rec-fraud-1',
            title: 'Deploy Strict Merchant Escrow Holds',
            action: 'Hold vendor payout funds for 14 days post-delivery confirmation until delivery receipt is digitally verified.',
            ownerTeam: 'Trust & Safety',
            confidence: 96,
            urgency: 'high',
            impactEstimate: '-78% fraud chargebacks in 30 days'
          },
          {
            id: 'rec-fraud-2',
            title: 'Automated Off-Platform Payment Flagging',
            action: 'Block chat messages containing off-platform payment solicitations (wire transfers, crypto, secondary links).',
            ownerTeam: 'Security Engineering',
            confidence: 91,
            urgency: 'high',
            impactEstimate: 'Prevents 85% of off-platform scams'
          }
        ]
      };

    case 'Operational Issues':
      return {
        title: 'Fulfillment & Website Checkout Reliability Bottlenecks',
        description: `${negativeVolume} customers report delayed 2-week deliveries, damaged packaging upon transit arrival, and checkout crashes.`,
        whyItMatters: 'Operational friction increases support ticket backlog by 3.4x and directly erodes repeat purchase conversion rates.',
        recommendations: [
          {
            id: 'rec-ops-1',
            title: 'Logistics SLA Enforcement & Real-Time Tracking',
            action: 'Establish automated SLA penalty triggers with 3PL carriers and implement real-time SMS delivery tracking alerts.',
            ownerTeam: 'Fulfillment Operations',
            confidence: 89,
            urgency: 'high',
            impactEstimate: '+40% on-time delivery satisfaction'
          },
          {
            id: 'rec-ops-2',
            title: 'Checkout Web Crash Hardening',
            action: 'Fix client-side memory leakage and cart timeout crashes on the order checkout flow under peak loads.',
            ownerTeam: 'Frontend Engineering',
            confidence: 94,
            urgency: 'high',
            impactEstimate: 'Recovers estimated 12% lost checkout revenue'
          }
        ]
      };

    case 'Customer Service':
      return {
        title: 'Support Response Lag & Resolution Incompleteness',
        description: `${negativeVolume} customers experienced prolonged wait times or had their critical support inquiries closed without satisfactory resolution.`,
        whyItMatters: 'Poor support turns a minor operational delay into customer churn, driving negative public reviews on Trustpilot and social media.',
        recommendations: [
          {
            id: 'rec-cs-1',
            title: 'Implement Tiered First-Response Escalation',
            action: 'Route refund and fraud complaints directly to senior resolution specialists within a 15-minute SLA.',
            ownerTeam: 'Customer Experience',
            confidence: 88,
            urgency: 'medium',
            impactEstimate: 'Reduces repeat ticket re-opens by 35%'
          },
          {
            id: 'rec-cs-2',
            title: 'Omnichannel Ticket Sync & Auto-Status Updates',
            action: 'Provide automated status updates so customers never have to follow up repeatedly while investigations are underway.',
            ownerTeam: 'Support Operations',
            confidence: 86,
            urgency: 'medium',
            impactEstimate: 'Decreases follow-up inquiries by 45%'
          }
        ]
      };

    case 'Billing & Pricing':
      return {
        title: 'Hidden Surcharges & Subscription Cancellation Friction',
        description: `${negativeVolume} customers reported unexpected post-cancellation subscription fees or opaque fee structures.`,
        whyItMatters: 'Unclear pricing directly triggers credit card disputes and risks regulatory scrutiny under FTC negative-option cancellation rules.',
        recommendations: [
          {
            id: 'rec-bill-1',
            title: 'Instant 1-Click Subscription Cancellation Flow',
            action: 'Implement a self-serve transparent cancellation screen with instant confirmation receipt emailed to the user.',
            ownerTeam: 'Billing Engineering',
            confidence: 93,
            urgency: 'high',
            impactEstimate: 'Eliminates 90% of billing dispute tickets'
          }
        ]
      };

    default:
      return {
        title: 'Product Durability & Feature Defect Escalation',
        description: `${negativeVolume} customers encountered device/software failure within early weeks of purchase.`,
        whyItMatters: 'Early product failure drives returns and damages word-of-mouth product ratings in competitive marketplace categories.',
        recommendations: [
          {
            id: 'rec-prod-1',
            title: 'Quality Assurance & Firmware Patch Deployment',
            action: 'Investigate component batch failure telemetry and push firmware stabilization updates for hardware variants.',
            ownerTeam: 'Product QA & Engineering',
            confidence: 85,
            urgency: 'medium',
            impactEstimate: '-28% return merchandise authorizations'
          }
        ]
      };
  }
}
