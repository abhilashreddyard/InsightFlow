import { FeedbackItem } from '../types';
import { analyzeSentiment, predictCategory } from './nlp';

export interface ColumnMapping {
  textField: string;
  categoryField: string;
  dateField: string;
  ratingField: string;
  sourceField: string;
}

export interface ParseResult {
  headers: string[];
  previewRows: Record<string, string>[];
  totalRows: number;
}

/**
 * Robust CSV parser that properly handles quoted strings and comma delimiters
 */
export function parseCSV(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawTokens = parseLine(lines[i]);
    if (rawTokens.length === 1 && rawTokens[0] === '') continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      let val = rawTokens[idx] || '';
      // Strip outer quotes
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      rowObj[header] = val;
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Intelligent guess of column mappings based on common header names
 */
export function detectColumnMapping(headers: string[]): ColumnMapping {
  const findMatch = (candidates: string[]): string => {
    for (const cand of candidates) {
      const found = headers.find(h => h.toLowerCase().trim() === cand.toLowerCase());
      if (found) return found;
    }
    // Partial inclusion match
    for (const cand of candidates) {
      const found = headers.find(h => h.toLowerCase().includes(cand.toLowerCase()));
      if (found) return found;
    }
    return '';
  };

  return {
    textField: findMatch(['review', 'text', 'feedback', 'comment', 'message', 'body', 'content', 'description']),
    categoryField: findMatch(['category', 'label', 'topic', 'class', 'type', 'issue_type']),
    dateField: findMatch(['date', 'time', 'created', 'timestamp', 'created_at', 'date_added']),
    ratingField: findMatch(['rating', 'score', 'stars', 'star_rating', 'user_rating']),
    sourceField: findMatch(['source', 'channel', 'platform', 'origin', 'medium'])
  };
}

/**
 * Converts parsed raw rows into normalized FeedbackItems with NLP sentiment
 */
export function convertRowsToFeedbackItems(
  rows: Record<string, string>[],
  mapping: ColumnMapping
): FeedbackItem[] {
  // Aggregate identical comments to preserve mentions count and save credits
  const commentMap = new Map<string, { item: FeedbackItem; count: number }>();

  rows.forEach((row, idx) => {
    const rawText = (row[mapping.textField] || '').trim();
    if (!rawText) return;

    let category = mapping.categoryField && row[mapping.categoryField] ? row[mapping.categoryField].trim() : '';
    if (!category) {
      category = predictCategory(rawText);
    }

    const rawRating = mapping.ratingField && row[mapping.ratingField] ? parseFloat(row[mapping.ratingField]) : undefined;
    const rating = rawRating && !isNaN(rawRating) ? Math.min(5, Math.max(1, rawRating)) : undefined;

    const date = mapping.dateField && row[mapping.dateField] ? row[mapping.dateField].trim() : undefined;
    const source = mapping.sourceField && row[mapping.sourceField] ? row[mapping.sourceField].trim() : 'CSV Import';

    const cacheKey = `${rawText}___${category}`;
    if (commentMap.has(cacheKey)) {
      commentMap.get(cacheKey)!.count++;
    } else {
      const { sentiment, score } = analyzeSentiment(rawText, rating);
      const item: FeedbackItem = {
        id: `import-${idx + 1}`,
        text: rawText,
        category,
        sentiment,
        sentimentScore: score,
        source,
        date,
        rating,
        mentions: 1
      };
      commentMap.set(cacheKey, { item, count: 1 });
    }
  });

  return Array.from(commentMap.values()).map(({ item, count }) => ({
    ...item,
    mentions: count
  }));
}

/**
 * Exports feedback items into downloadable CSV format
 */
export function exportFeedbackToCSV(items: FeedbackItem[]): string {
  const headers = ['id', 'text', 'category', 'sentiment', 'sentiment_score', 'rating', 'source', 'date', 'mentions'];
  const csvLines = [headers.join(',')];

  items.forEach(it => {
    const escapedText = `"${it.text.replace(/"/g, '""')}"`;
    const line = [
      it.id,
      escapedText,
      `"${it.category}"`,
      it.sentiment,
      it.sentimentScore.toFixed(2),
      it.rating || '',
      `"${it.source}"`,
      it.date || '',
      it.mentions || 1
    ];
    csvLines.push(line.join(','));
  });

  return csvLines.join('\n');
}

/**
 * Exports Adaption-ready prepared dataset CSV format
 */
export function exportAdaptionPreparedCSV(items: FeedbackItem[]): string {
  const headers = ['prompt', 'context', 'completion', 'mentions'];
  const csvLines = [headers.join(',')];

  items.forEach(it => {
    const escapedPrompt = `"${(it.adaptedText || it.text).replace(/"/g, '""')}"`;
    const context = `Category: ${it.category} | Source: ${it.source} | Rating: ${it.rating || 'N/A'}`;
    const escapedContext = `"${context.replace(/"/g, '""')}"`;
    const completion = `Sentiment: ${it.sentiment} | Score: ${it.sentimentScore.toFixed(2)}`;
    const line = [
      escapedPrompt,
      escapedContext,
      `"${completion}"`,
      it.mentions || 1
    ];
    csvLines.push(line.join(','));
  });

  return csvLines.join('\n');
}

export function downloadBlob(content: string, filename: string, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
