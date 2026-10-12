import { FeedbackItem } from '../types';

export const RAW_COMPETITION_CSV_SNIPPET = `review,category
The product's innovative features have greatly improved my daily tasks.,Product Feedback
Customer service was unresponsive to my inquiry. I'm disappointed with the experience.,Customer Service
"I was a victim of fraud, the seller requested additional payment after purchase.",Fraud and Scam
"The delivery was delayed due to unforeseen circumstances, but I was informed promptly.",Operational Issues
"The product arrived with some defects, but the seller was responsive and provided a replacement.",Product Feedback
Customer service was incredibly helpful and resolved my issue within minutes.,Customer Service
"I was scammed by a fraudulent seller, they took my money and never sent the product.",Fraud and Scam
"I faced several issues while placing my order on the website, but the support team was helpful and resolved them.",Operational Issues
The product exceeded my expectations in terms of quality and performance.,Product Feedback
"I encountered a minor operational issue with the product, but the seller was responsive and provided a solution.",Operational Issues
Customer service was knowledgeable and provided excellent assistance throughout the purchasing process.,Customer Service
"I was scammed by a fraudulent seller, they provided a low-quality product that did not meet my expectations.",Fraud and Scam
"I had a great experience with the website, it was user-friendly and easy to navigate.",Operational Issues
The product arrived in perfect condition and met all my expectations.,Product Feedback
Customer service was not helpful and did not provide a satisfactory solution to my issue.,Customer Service
"I was a victim of fraud, the seller provided a counterfeit product.",Fraud and Scam
"The delivery was delayed due to unforeseen circumstances, but the seller was transparent about the situation.",Operational Issues
"I encountered a minor issue with the product, but the seller was responsive and provided a solution.",Product Feedback
Customer service was incredibly helpful and resolved my issue promptly.,Customer Service
I suspect fraudulent activity as I was charged multiple times for a single purchase.,Fraud and Scam
"I faced several issues while placing my order on the website, it kept crashing.",Operational Issues
"The delivery was delayed by two weeks, which was very inconvenient.",Operational Issues
"The packaging was damaged upon arrival, and some items were missing from my order.",Operational Issues
"Unfortunately, the product did not meet my expectations. It stopped working after a week.",Product Feedback
Beware of fraudulent activities. I never received my order despite being charged.,Fraud and Scam
Great value for money. The product performs very well and is worth the price.,Product Feedback
"I had to wait for a long time to get a response from customer service, which was frustrating.",Customer Service
This site is a scam. They took my money and never sent the product.,Fraud and Scam
The product quality is excellent. It works exactly as described and exceeds my expectations.,Product Feedback
I encountered a scam where the seller asked for additional payment after placing the order.,Fraud and Scam
I was scammed by this seller. The product I received was not as advertised.,Fraud and Scam
The features of this product are innovative and very useful for my daily needs.,Product Feedback
"Unfortunately, the customer service was not helpful. My issue remains unresolved.",Customer Service
I found the product to be very durable and well-made. Highly recommended!,Product Feedback
"There were glitches on the website, making it difficult to complete my purchase.",Operational Issues
"My order was processed incorrectly, and I received the wrong items.",Operational Issues
I had a great experience with the support team. They were very helpful and friendly.,Customer Service
The support staff was knowledgeable and provided excellent assistance.,Customer Service
The customer service was outstanding. They resolved my issue within minutes.,Customer Service`;

// Complete set of curated competition records based on the hackathon dataset distribution
export const INITIAL_COMPETITION_FEEDBACK: FeedbackItem[] = [
  // Fraud and Scam
  {
    id: 'comp-001',
    text: 'I was a victim of fraud, the seller requested additional payment after purchase.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.95,
    source: 'Customer Support',
    date: '2026-10-10',
    rating: 1,
    mentions: 54
  },
  {
    id: 'comp-002',
    text: 'I was scammed by a fraudulent seller, they took my money and never sent the product.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.98,
    source: 'Web Review',
    date: '2026-10-09',
    rating: 1,
    mentions: 62
  },
  {
    id: 'comp-003',
    text: 'I was scammed by a fraudulent seller, they provided a low-quality product that did not meet my expectations.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.85,
    source: 'Trustpilot',
    date: '2026-10-08',
    rating: 1,
    mentions: 48
  },
  {
    id: 'comp-004',
    text: 'I was a victim of fraud, the seller provided a counterfeit product.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.92,
    source: 'Email',
    date: '2026-10-07',
    rating: 1,
    mentions: 41
  },
  {
    id: 'comp-005',
    text: 'I suspect fraudulent activity as I was charged multiple times for a single purchase.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.89,
    source: 'Payment Gateway',
    date: '2026-10-06',
    rating: 1,
    mentions: 58
  },
  {
    id: 'comp-006',
    text: 'Beware of fraudulent activities. I never received my order despite being charged.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.96,
    source: 'Trustpilot',
    date: '2026-10-05',
    rating: 1,
    mentions: 67
  },
  {
    id: 'comp-007',
    text: 'This site is a scam. They took my money and never sent the product.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.99,
    source: 'Web Review',
    date: '2026-10-04',
    rating: 1,
    mentions: 73
  },
  {
    id: 'comp-008',
    text: 'I encountered a scam where the seller asked for additional payment after placing the order.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.91,
    source: 'Customer Support',
    date: '2026-10-03',
    rating: 1,
    mentions: 51
  },
  {
    id: 'comp-009',
    text: 'I was scammed by this seller. The product I received was not as advertised.',
    category: 'Fraud and Scam',
    sentiment: 'negative',
    sentimentScore: -0.88,
    source: 'Zendesk',
    date: '2026-10-02',
    rating: 1,
    mentions: 49
  },
  {
    id: 'comp-010',
    text: 'I was not a victim of fraud, the seller was transparent and provided a clear refund policy.',
    category: 'Fraud and Scam',
    sentiment: 'positive',
    sentimentScore: 0.82,
    source: 'Survey',
    date: '2026-09-28',
    rating: 5,
    mentions: 22
  },
  {
    id: 'comp-011',
    text: 'No fraudulent activity detected during my purchase.',
    category: 'Fraud and Scam',
    sentiment: 'positive',
    sentimentScore: 0.70,
    source: 'Survey',
    date: '2026-09-25',
    rating: 5,
    mentions: 34
  },

  // Operational Issues
  {
    id: 'comp-012',
    text: 'The delivery was delayed due to unforeseen circumstances, but I was informed promptly.',
    category: 'Operational Issues',
    sentiment: 'neutral',
    sentimentScore: 0.15,
    source: 'Logistics Feedback',
    date: '2026-10-10',
    rating: 3,
    mentions: 29
  },
  {
    id: 'comp-013',
    text: 'I faced several issues while placing my order on the website, but the support team was helpful and resolved them.',
    category: 'Operational Issues',
    sentiment: 'neutral',
    sentimentScore: 0.10,
    source: 'Web Review',
    date: '2026-10-09',
    rating: 3,
    mentions: 31
  },
  {
    id: 'comp-014',
    text: 'The delivery was delayed by two weeks, which was very inconvenient.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.78,
    source: 'Shipping Portal',
    date: '2026-10-08',
    rating: 1,
    mentions: 76
  },
  {
    id: 'comp-015',
    text: 'I faced several issues while placing my order on the website. It kept crashing.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.82,
    source: 'App Store',
    date: '2026-10-07',
    rating: 1,
    mentions: 64
  },
  {
    id: 'comp-016',
    text: 'The packaging was damaged upon arrival, and some items were missing from my order.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.84,
    source: 'Customer Support',
    date: '2026-10-06',
    rating: 1,
    mentions: 71
  },
  {
    id: 'comp-017',
    text: 'There were glitches on the website, making it difficult to complete my purchase.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.72,
    source: 'Web Review',
    date: '2026-10-05',
    rating: 2,
    mentions: 59
  },
  {
    id: 'comp-018',
    text: 'My order was processed incorrectly, and I received the wrong items.',
    category: 'Operational Issues',
    sentiment: 'negative',
    sentimentScore: -0.86,
    source: 'Email',
    date: '2026-10-04',
    rating: 1,
    mentions: 68
  },
  {
    id: 'comp-019',
    text: 'The delivery was delayed, but the company provided a satisfactory explanation and compensation.',
    category: 'Operational Issues',
    sentiment: 'positive',
    sentimentScore: 0.65,
    source: 'Survey',
    date: '2026-09-29',
    rating: 4,
    mentions: 26
  },
  {
    id: 'comp-020',
    text: 'Delivery was on time and the product was in perfect condition.',
    category: 'Operational Issues',
    sentiment: 'positive',
    sentimentScore: 0.92,
    source: 'Survey',
    date: '2026-09-27',
    rating: 5,
    mentions: 45
  },
  {
    id: 'comp-021',
    text: 'The ordering process was smooth and hassle-free. I received my product on time.',
    category: 'Operational Issues',
    sentiment: 'positive',
    sentimentScore: 0.94,
    source: 'Trustpilot',
    date: '2026-09-24',
    rating: 5,
    mentions: 38
  },

  // Customer Service
  {
    id: 'comp-022',
    text: "Customer service was unresponsive to my inquiry. I'm disappointed with the experience.",
    category: 'Customer Service',
    sentiment: 'negative',
    sentimentScore: -0.81,
    source: 'Zendesk',
    date: '2026-10-10',
    rating: 1,
    mentions: 56
  },
  {
    id: 'comp-023',
    text: 'Customer service was incredibly helpful and resolved my issue within minutes.',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.96,
    source: 'Chat Support',
    date: '2026-10-09',
    rating: 5,
    mentions: 61
  },
  {
    id: 'comp-024',
    text: 'Customer service was knowledgeable and provided excellent assistance throughout the purchasing process.',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.93,
    source: 'Email',
    date: '2026-10-08',
    rating: 5,
    mentions: 52
  },
  {
    id: 'comp-025',
    text: 'Customer service was not helpful and did not provide a satisfactory solution to my issue.',
    category: 'Customer Service',
    sentiment: 'negative',
    sentimentScore: -0.84,
    source: 'Trustpilot',
    date: '2026-10-07',
    rating: 1,
    mentions: 58
  },
  {
    id: 'comp-026',
    text: 'Unfortunately, the customer service was not helpful. My issue remains unresolved.',
    category: 'Customer Service',
    sentiment: 'negative',
    sentimentScore: -0.88,
    source: 'Zendesk',
    date: '2026-10-06',
    rating: 1,
    mentions: 74
  },
  {
    id: 'comp-027',
    text: 'I had to wait for a long time to get a response from customer service, which was frustrating.',
    category: 'Customer Service',
    sentiment: 'negative',
    sentimentScore: -0.75,
    source: 'Web Review',
    date: '2026-10-05',
    rating: 2,
    mentions: 63
  },
  {
    id: 'comp-028',
    text: 'The support staff was knowledgeable and provided excellent assistance.',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.91,
    source: 'Survey',
    date: '2026-10-04',
    rating: 5,
    mentions: 59
  },
  {
    id: 'comp-029',
    text: 'I had a great experience with the support team. They were very helpful and friendly.',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.95,
    source: 'Chat Support',
    date: '2026-10-03',
    rating: 5,
    mentions: 67
  },
  {
    id: 'comp-030',
    text: 'The customer service was outstanding. They resolved my issue within minutes.',
    category: 'Customer Service',
    sentiment: 'positive',
    sentimentScore: 0.97,
    source: 'Trustpilot',
    date: '2026-10-02',
    rating: 5,
    mentions: 72
  },

  // Product Feedback
  {
    id: 'comp-031',
    text: "The product's innovative features have greatly improved my daily tasks.",
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.90,
    source: 'App Store',
    date: '2026-10-10',
    rating: 5,
    mentions: 65
  },
  {
    id: 'comp-032',
    text: 'The product arrived with some defects, but the seller was responsive and provided a replacement.',
    category: 'Product Feedback',
    sentiment: 'neutral',
    sentimentScore: 0.20,
    source: 'Web Review',
    date: '2026-10-09',
    rating: 3,
    mentions: 33
  },
  {
    id: 'comp-033',
    text: 'The product exceeded my expectations in terms of quality and performance.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.95,
    source: 'Trustpilot',
    date: '2026-10-08',
    rating: 5,
    mentions: 58
  },
  {
    id: 'comp-034',
    text: 'The product arrived in perfect condition and met all my expectations.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.92,
    source: 'Survey',
    date: '2026-10-07',
    rating: 5,
    mentions: 49
  },
  {
    id: 'comp-035',
    text: 'Unfortunately, the product did not meet my expectations. It stopped working after a week.',
    category: 'Product Feedback',
    sentiment: 'negative',
    sentimentScore: -0.86,
    source: 'Web Review',
    date: '2026-10-06',
    rating: 1,
    mentions: 72
  },
  {
    id: 'comp-036',
    text: 'I found the product to be very durable and well-made. Highly recommended!',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.94,
    source: 'App Store',
    date: '2026-10-05',
    rating: 5,
    mentions: 61
  },
  {
    id: 'comp-037',
    text: 'Great value for money. The product performs very well and is worth the price.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.89,
    source: 'Survey',
    date: '2026-10-04',
    rating: 5,
    mentions: 69
  },
  {
    id: 'comp-038',
    text: 'The product quality is excellent. It works exactly as described and exceeds my expectations.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.96,
    source: 'Trustpilot',
    date: '2026-10-03',
    rating: 5,
    mentions: 66
  },
  {
    id: 'comp-039',
    text: 'The features of this product are innovative and very useful for my daily needs.',
    category: 'Product Feedback',
    sentiment: 'positive',
    sentimentScore: 0.91,
    source: 'Web Review',
    date: '2026-10-02',
    rating: 5,
    mentions: 64
  },
  {
    id: 'comp-040',
    text: 'The product design is sleek and modern, but battery performance degrades too rapidly.',
    category: 'Product Feedback',
    sentiment: 'neutral',
    sentimentScore: -0.15,
    source: 'App Store',
    date: '2026-10-01',
    rating: 3,
    mentions: 27
  }
];
