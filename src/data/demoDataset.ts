import { FeedbackItem } from '../types';

export const SYNTHETIC_DEMO_FEEDBACK: FeedbackItem[] = [
  {
    id: 'demo-101',
    text: 'Unauthorized recurring fee charged to my card even after canceling my subscription during the free trial.',
    category: 'Billing & Pricing',
    sentiment: 'negative',
    sentimentScore: -0.94,
    source: 'Payment Gateway',
    date: '2026-10-11',
    rating: 1,
    mentions: 38
  },
  {
    id: 'demo-102',
    text: 'The checkout portal crashed three times when applying the promotional discount code.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.76,
    source: 'Web Review',
    date: '2026-10-10',
    rating: 2,
    mentions: 42
  },
  {
    id: 'demo-103',
    text: 'Customer support resolved my account recovery ticket in less than 4 minutes via live chat. Very polite agent!',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.95,
    source: 'Zendesk',
    date: '2026-10-10',
    rating: 5,
    mentions: 51
  },
  {
    id: 'demo-104',
    text: 'A third-party merchant claimed my order was delivered, but tracking showed no dispatch. Total scam!',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.98,
    source: 'Trustpilot',
    date: '2026-10-09',
    rating: 1,
    mentions: 64
  },
  {
    id: 'demo-105',
    text: 'The new dashboard layout and export tools save our analytics team hours every Monday.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.92,
    source: 'In-App Survey',
    date: '2026-10-08',
    rating: 5,
    mentions: 47
  },
  {
    id: 'demo-106',
    text: 'Package arrived soaked and battered. Two of the glass bottles were shattered inside.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.89,
    source: 'Customer Support',
    date: '2026-10-07',
    rating: 1,
    mentions: 33
  },
  {
    id: 'demo-107',
    text: 'Seller asked me to send crypto or direct wire outside of the official escrow payment system.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.97,
    source: 'Trustpilot',
    date: '2026-10-06',
    rating: 1,
    mentions: 59
  },
  {
    id: 'demo-108',
    text: 'The battery life is decent for light use, but heavy workload drains it in under 3 hours.',
    category: 'Product Feedback',
    sentiment: 'neutral',
    sentimentScore: -0.10,
    source: 'Tech Forum',
    date: '2026-10-05',
    rating: 3,
    mentions: 24
  },
  {
    id: 'demo-109',
    text: 'Support agent put me on hold for 45 minutes and then disconnected the call without following up.',
    category: 'Customer Service',
    sentiment: 'negative',
    sentimentScore: -0.87,
    source: 'Phone Support',
    date: '2026-10-04',
    rating: 1,
    mentions: 49
  },
  {
    id: 'demo-110',
    text: 'Seamless onboarding and great keyboard shortcuts. Exactly what our team needed.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.96,
    source: 'App Store',
    date: '2026-10-03',
    rating: 5,
    mentions: 53
  },
  {
    id: 'demo-111',
    text: 'Pricing tiers are opaque. I was hit with an unannounced enterprise surcharging fee.',
    category: 'Billing & Pricing',
    sentiment: 'negative',
    sentimentScore: -0.79,
    source: 'Email',
    date: '2026-10-02',
    rating: 2,
    mentions: 36
  },
  {
    id: 'demo-112',
    text: 'Delivery arrived two days ahead of schedule in eco-friendly packaging.',
    category: 'Operational Issues',
    sentiment: 'positive',
    sentimentScore: 0.88,
    source: 'Survey',
    date: '2026-09-30',
    rating: 5,
    mentions: 40
  }
];
