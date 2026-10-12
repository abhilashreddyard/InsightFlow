# InsightFlow — Intelligent Customer Feedback & Decision Platform

A high-performance enterprise customer feedback intelligence platform that ingests raw multi-channel feedback, detects sentiment and recurring issues, runs an Adaption data cleaning and quality pipeline, computes explainable priority scores, and generates actionable executive decision reports.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your planning choices, InsightFlow is configured with:
> - **AI Engine**: Fast deterministic client NLP engine paired with the Adaption Adaptive Data cleaning/evaluation pipeline, plus optional live Gemini AI executive deep-dives.
> - **Default Dataset**: Preloaded with the full hackathon competition reviews dataset (1,000+ categorized records) with instant reset and synthetic multi-channel demo loaders.
> - **Visual Theme**: Enterprise SaaS analytics theme with light/dark posture, high-density data tables, tabular numerals, and responsive interactive visualizations.

---

### 1. Overview & Core Concept

InsightFlow bridges the gap between raw customer sentiment (reviews, surveys, support tickets) and executive product roadmaps. It solves the core business challenge: *Which issues should our engineering, operations, and support teams fix first, and what is the data-backed justification?*

- **Target Persona**: Product Managers, VP of Customer Experience, Operations Leads, and Executive Stakeholders.
- **Key Value**: Deterministic transparency — every priority score, category grouping, and sentiment label traces back to verbatim customer quotes, coupled with Adaption dataset quality assurance.

---

### 2. User Experience & Visual Design

#### A. Key User Flows
1. **Explore & Filter**: Upon launch, users see the preloaded hackathon dataset. They can search, filter by Category, Sentiment, Source, or Date, and inspect individual reviews.
2. **Import & Map**: Users can upload any custom CSV with a column-matching dialog that auto-detects `review`, `category`, `date`, `rating`, and `source`.
3. **Analytics Dashboard**: Real-time KPI summary (Total Reviews, Net Sentiment Score, Negative Ratio, Risk Index), category volume breakdown, sentiment distribution, and recurring phrase extraction.
4. **Prioritization Engine**: Issues ranked 1–10 using an explainable priority scoring formula (`Volume`, `Severity`, `Growth`, `Financial Impact`). Clicking an issue reveals root-cause analysis, verbatim customer quotes, and actionable recommendations with owners.
5. **Adaption Pipeline**: Visual workflow that masks PII, deduplicates comments with mention counters, runs the Adaption quality benchmark (Grade A–E, Score 0–10), and applies cleaned standardized text.
6. **Issue Tracking & Reports**: Save critical issues to an active Kanban/tracker board (Open, In Progress, Resolved) and export an executive HTML or Markdown report, or print to PDF.

#### B. Visual Identity & Theme Tokens
- **Theme**: Enterprise SaaS Analytics (Clean Slate / Dark Mode support).
- **Typography**: `Plus Jakarta Sans` for clean UI display and body, `JetBrains Mono` / `tabular-nums` for all metric figures, confidence percentages, and timestamps.
- **Palette**:
  - Background: Neutral slate (`#0B0F19` dark / `#F8FAFC` light)
  - Surfaces: Structural cards with 1px border (`#1E293B` dark / `#FFFFFF` light, border `#334155` / `#E2E8F0`)
  - Accent / Primary: Royal Indigo (`#4F46E5` / `#6366F1`)
  - Semantic Status: Emerald (`#10B981` positive), Amber (`#F59E0B` neutral/warning), Rose (`#EF4444` negative/fraud)
- **Top Bar Contract**: Single-line wordmark `InsightFlow` on left, clean navigation tabs (`Dashboard`, `Feedback`, `Priorities`, `Tracker & Report`, `Adaption Pipeline`) in center, and quick dataset / export actions on right.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Fast Client NLP + Adaption Pipeline**
  - *Approach*: Built-in lexical NLP engine for instantaneous filtering, sentiment scoring, and phrase extraction across thousands of rows without server lag or rate limits, paired with the Adaption dataset pipeline.
  - *Why*: Instantaneous UI responsiveness, 100% offline reliability, and zero risk of hitting API quota blocks during live evaluations.
- **Decision 2: Explainable Multi-Factor Priority Algorithm**
  - *Approach*: `Priority Score = (0.40 × Volume) + (0.25 × Severity) + (0.20 × Growth) + (0.15 × Financial Risk)` (adjusted to 50/30/20 when dataset lacks timestamps).
  - *Why*: Business leaders reject black-box rankings; displaying the exact math builds immediate stakeholder trust.
- **Decision 3: Dual Dataset Support**
  - *Approach*: Full competition dataset (Fraud & Scam, Customer Service, Operational Issues, Product Feedback) plus a synthetic multi-channel timestamped e-commerce dataset.
  - *Why*: Demonstrates both real hackathon data and time-series growth capabilities.

---

### 4. Technical Architecture & System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        InsightFlow Application                         │
├────────────────────────────────────────────────────────────────────────┤
│ Top Navigation & Workspace Header (Brand · Tabs · Theme · Datasets)    │
├───────────────────┬────────────────────────────────────────────────────┤
│ Main Viewport     │ ┌────────────────────────────────────────────────┐ │
│                   │ │ 1. Dashboard View                              │ │
│                   │ │    - Executive KPI Cards (Volume, NSS, Risk)   │ │
│                   │ │    - Sentiment Distribution & Category Splits  │ │
│                   │ │    - Recurring Complaints & Keyword Clusters   │ │
│                   │ ├────────────────────────────────────────────────┤ │
│                   │ │ 2. Feedback Management View                    │ │
│                   │ │    - Table with Search, Filter & Pagination    │ │
│                   │ │    - CSV Import with Column Auto-Mapping Modal │ │
│                   │ │    - Quick Category Correction & Manual Entry  │ │
│                   │ ├────────────────────────────────────────────────┤ │
│                   │ │ 3. Intelligent Priorities View                 │ │
│                   │ │    - Ranked Issues (Score breakdown formula)   │ │
│                   │ │    - Root Cause Analysis & Verbatim Quotes     │ │
│                   │ │    - Action Recommendations (Owner, Confidence)│ │
│                   │ ├────────────────────────────────────────────────┤ │
│                   │ │ 4. Adaption Pipeline View                      │ │
│                   │ │    - PII Masking & Comment Deduplication       │ │
│                   │ │    - Run Execution & Credit Estimator          │ │
│                   │ │    - Quality Score (0-10) & Grade (A-E)        │ │
│                   │ │    - Apply Cleaned Data & Download CSV         │ │
│                   │ ├────────────────────────────────────────────────┤ │
│                   │ │ 5. Tracker & Executive Report View             │ │
│                   │ │    - Interactive Kanban (Open/Progress/Done)   │ │
│                   │ │    - Printable Executive HTML / PDF / Markdown │ │
│                   │ └────────────────────────────────────────────────┘ │
├───────────────────┴────────────────────────────────────────────────────┤
│ Data Layer: LocalStorage State · Competition Dataset · NLP Engine      │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Implementation Phases

1. **Core Data & NLP Service**: Preload hackathon competition data, rule-based sentiment analyzer, category clustering, and phrase extractor.
2. **Feedback Management & CSV Ingestion**: File upload, delimiter parser, column auto-matcher modal, search, pagination, category re-tagging.
3. **Analytics Dashboard**: Interactive charts, KPI counters, net sentiment calculation, category drill-downs.
4. **Priorities & Decision Engine**: Scoring algorithm, impact factor chips, customer quotes, recommendation builder, track issue action.
5. **Adaption Adaptive Data Pipeline**: PII scrubbing, frequency aggregation, recipe controls, quality evaluation metrics, before/after comparison.
6. **Issue Tracking & Executive Report**: Issue kanban board, executive report builder with one-click HTML/Markdown/print download.
7. **Refinement & Polish**: Keyboard shortcuts, dark/light theme persistence, zero-pill typography polish, responsive validation.
