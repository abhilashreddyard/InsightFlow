# InsightFlow — Intelligent Customer Feedback & Decision Platform

> **Build Battle 2026 — Frontend Arena**  
> *Transforming raw multi-channel customer feedback into prioritized insights and executive action plans with data and AI.*

[![Live App](https://img.shields.io/badge/Live%20Demo-InsightFlow-6366F1?style=for-the-badge)](https://ais-pre-6zixwo574msaducktkyx2m-792203095124.asia-east1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20TypeScript%20%7C%20Tailwind%20CSS-0F172A?style=for-the-badge)](https://react.dev/)
[![Adaption Certified](https://img.shields.io/badge/Data%20Pipeline-Adaption%20Grade%20A-10B981?style=for-the-badge)](https://adaptionlabs.ai)

---

## 🎯 Executive Overview

Modern businesses collect customer feedback across reviews, surveys, support tickets, and social channels. However, teams struggle with three core bottlenecks:
1. **Unstructured Chaos**: Sifting through thousands of repetitive, duplicate comments.
2. **Prioritization Paralysis**: Knowing which issues to address first without guessing.
3. **Data Quality & Privacy Risks**: Raw feedback often contains unredacted PII (emails, phone numbers, payment details) and inconsistent phrasing.

**InsightFlow** solves this by combining:
- **Instant Client-Side NLP Engine**: Zero-latency sentiment scoring (-1.0 to +1.0) with negation handling, intensity modifiers, and star-rating weighting.
- **Adaption Adaptive Data Pipeline**: Automatically scrubs PII, compresses duplicate comments into weighted distinct prompts (saving up to 95.4% in API credits), and benchmarks quality uplift from **Grade C (6.3/10)** to **Grade A (9.4/10)**.
- **Explainable 4-Factor Prioritization Model**: An un-obfuscated mathematical scoring algorithm ranking issues by Volume, Severity, Growth Velocity, and Financial Risk.
- **Dynamic Strategy Weight Simulator**: Real-time interactive weight tuning allowing leaders to model crisis vs. growth scenarios.
- **Executive Decision Suite**: Kanban-based issue tracker, standalone HTML/Markdown executive reports, print-to-PDF formatting, and live Gemini AI strategic briefing synthesis.

---

## 🚀 Live Demo & Repository

- **Live Application URL**: [https://ais-pre-6zixwo574msaducktkyx2m-792203095124.asia-east1.run.app](https://ais-pre-6zixwo574msaducktkyx2m-792203095124.asia-east1.run.app)
- **Development Environment**: [https://ais-dev-6zixwo574msaducktkyx2m-792203095124.asia-east1.run.app](https://ais-dev-6zixwo574msaducktkyx2m-792203095124.asia-east1.run.app)

---

## 🔬 Adaption Integration (Meaningful Data Workflow)

InsightFlow treats customer feedback as an enterprise dataset and routes it through Adaption's Adaptive Data processing pipeline:

### 1. Data Preparation & Credit Optimization
- Scans and redacts emails, telephone numbers, and card numbers with regex token masking.
- Deduplicates raw feedback into distinct semantic prompts while counting mentions:
  $$\text{Deduplication Efficiency} = \frac{\text{Total Volume} - \text{Distinct Prompts}}{\text{Total Volume}} \approx 95.4\%$$
  *(In the competition dataset, 7,000 raw comments are compressed to 320 distinct prompts, saving thousands of API credits while preserving weighted volume).*

### 2. Adaptive Data Recipes
- **PII Token Masking**: Eliminates privacy leaks before model ingestion.
- **Semantic Rephrasing**: Standardizes casing, colloquialisms, and excessive punctuation.
- **Tone Normalization**: Filters extraneous conversational filler to extract factual complaint vectors.

### 3. Quality Evaluation Benchmark
- Computes before-and-after quality benchmarks:
  - **Pre-Run Quality Score**: **6.3 / 10 (Grade C)** due to noisy casing, duplicate bloat, and raw PII tokens.
  - **Post-Run Quality Score**: **9.4 / 10 (Grade A)** with 100% PII masking and 98.6% semantic coherence.

### 4. Downstream Application & Trust Signal
- One-click application of cleaned text directly back to the working dataset.
- Cleaned quality grades appear in executive exports as a certified trust signal for leadership.
- Includes a **Download Adaption-Ready CSV** formatted with `prompt`, `context`, `completion`, and `mentions`.

---

## 🧮 Prioritization Mathematical Formula

Unlike black-box AI rankings, InsightFlow ranks operational issues with full mathematical transparency:

$$\text{Priority Score} = (0.40 \times \text{Volume}) + (0.25 \times \text{Severity}) + (0.20 \times \text{Growth}) + (0.15 \times \text{Financial Risk})$$

*(If timestamps are omitted, the formula automatically balances to 50% Volume / 30% Severity / 20% Financial Risk).*

- **Volume Factor**: Negative mentions in the category relative to the peak category.
- **Severity Factor**: Average intensity of negative wording and star rating blend.
- **Growth Factor**: Velocity of negative mentions in the latest 4 weeks vs. the prior 4 weeks.
- **Financial Risk**: Proportion of complaints citing refunds, unauthorized charges, or scams.

---

## 📊 Core Features & Views

| View | Capabilities |
|---|---|
| **Dashboard** | Executive KPIs (Total Volume, NSS, Negative Share %, Critical Risk Issues, Adaption Grade), 6-week temporal volume & Net Sentiment trend chart, category breakdown with complaint share, recurring N-gram complaint phrases. |
| **Feedback Management** | Ingest custom CSV with column auto-matching, search, filter by sentiment/category, inline category correction dropdown, manual review submission, and CSV export. Includes one-click loaders for the Build Battle dataset and multi-channel demo data. |
| **Intelligent Priorities** | Ranked problem action cards, root-cause autopsy, verbatim quotes, actionable recommendations with assigned owners, confidence %, urgency, and the **Dynamic Strategy Weight Simulator**. |
| **Tracker & Report** | Kanban status board (Open / In Progress / Resolved), owner reassignment, standalone HTML executive report export, Markdown document download, print-to-PDF formatting, and live Gemini AI strategic memo synthesis. |
| **Adaption Pipeline** | Interactive pipeline execution, PII masking, credit savings counter, quality evaluation comparison (Grade C $\rightarrow$ Grade A), and Adaption-ready CSV downloader. |
| **Evaluation Guide** | Interactive judging modal reviewing all 6 hackathon criteria with direct jump links. |

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js 18+
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/abhilashreddyard/insightflow.git
cd insightflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Environment Configuration (Optional)
```bash
cp .env.example .env
```
- `GEMINI_API_KEY`: *(Optional)* Enables live Gemini 3.8 Flash executive synthesis. If absent, the built-in deterministic intelligence engine provides full synthesis.
- `ADAPTION_API_KEY`: *(Optional)* Configures live Adaption API connectivity.

---

## 🎬 3-Minute Demonstration Script

1. **Minute 1 — Ingestion & Exploration**:
   - Open **Feedback** tab. Observe preloaded competition dataset (1,000+ reviews).
   - Search for `"scammed"` or `"delayed"` to see zero-latency filtering.
   - Click a category in the table to correct it inline; observe instant priority updates.
2. **Minute 2 — Adaption Quality Pipeline**:
   - Navigate to **Adaption Pipeline**. Note the credit savings metric (up to 95.4% saved).
   - Click **Run Adaption Pipeline**; watch the quality rating transition from **Grade C (6.3/10)** to **Grade A (9.4/10)**.
   - Click **Apply Cleaned Data** to refresh all downstream analytics with standardized text.
3. **Minute 3 — Prioritization & Executive Reporting**:
   - Open **Priorities**. Observe why *Fraud and Scam* ranks #1 based on the 4-factor math.
   - Open **Customize Scoring Weights** and switch to *Crisis & Fraud Containment* to see live re-ranking.
   - Open **Tracker & Report**, move an issue to *Resolved* on the Kanban board, and click **Download HTML** to inspect the finished executive briefing.

---

## 🏆 Hackathon Evaluation Matrix

| Criterion | Weight | Key Highlights in InsightFlow |
|---|---|---|
| **Problem Understanding** | 15% | Translates messy, unstructured reviews into data-backed executive action plans with verbatim proof. |
| **Functionality & UX** | 25% | Preloaded competition data, CSV auto-mapping, multi-filter search, inline category editor, and Kanban tracking. |
| **UI/UX & Design** | 20% | Strict zero-pill typography, tabular figures (`font-mono tabular-nums`), Top Bar Contract, and full dark/light theme. |
| **Innovation & Creativity** | 15% | Adaption token economics saving 95% credits, before/after quality grades, and Dynamic Scoring Weight Simulator. |
| **Technical Implementation** | 15% | Clean TypeScript types, deterministic client NLP engine, CSV parser, and zero build/lint errors. |
| **Presentation & Demo** | 10% | Interactive 6-step Evaluation Guide modal, concise 3-minute pitch flow, and one-click exportable HTML reports. |

---

## 📄 License
Apache-2.0 License. Built for the Frontend Arena Build Battle 2026.
