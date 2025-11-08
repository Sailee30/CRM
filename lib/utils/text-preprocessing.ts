// lib/utils/text-preprocessing.ts
import { damerauStringSimilarity, getTypoThreshold } from '@/lib/nlp/similarity'

// Singularize helper function
function singularize(word: string): string {
  const irregulars: Record<string, string> = {
    'contacts': 'contact',
    'deals': 'deal',
    'tasks': 'task',
    'messages': 'message',
    'reports': 'report',
    'settings': 'setting',
    'sales': 'sale',
    'opportunities': 'opportunity',
  }

  if (irregulars[word]) return irregulars[word]

  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('ches')) return word.slice(0, -2)
  if (word.endsWith('sses')) return word.slice(0, -2)
  if (word.endsWith('xes')) return word.slice(0, -2)
  if (word.endsWith('zes')) return word.slice(0, -2)
  if (word.endsWith('s')) return word.slice(0, -1)

  return word
}

export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
}

export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(word => word.length > 0)
}

export function removeStopwords(tokens: string[]): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her',
  ])
  
  return tokens.filter(token => !stopwords.has(token))
}

// ✅ MAIN FIX: Updated preprocessText with singular normalization
export function preprocessText(text: string): string[] {
  const cleaned = cleanText(text)
  const tokens = tokenize(cleaned)
  const withoutStopwords = removeStopwords(tokens)
  
  // Normalize plurals to singular
  return withoutStopwords.map(token => singularize(token))
}

// ✅ FIX : ADD FUZZY SINGULARIZATION FOR TYPOS
// If normal singularize doesn't work, try fuzzy match against known singular forms
export function singularizeWithFuzzyFallback(
  word: string,
  knownSingulars: string[] = [
    'contact', 'deal', 'task', 'message', 'report', 'setting', 'sale', 'opportunity'
  ]
): string {
  // Try exact singular form first
  const singular = singularize(word)
  
  // If it matches a known word, return it
  if (knownSingulars.includes(singular)) {
    return singular
  }
  
  // If not, try fuzzy match against known singulars
  for (const known of knownSingulars) {
    const similarity = damerauStringSimilarity(singular, known)
    const threshold = getTypoThreshold(Math.min(singular.length, known.length))
    
    if (similarity >= threshold) {
      return known  // Return corrected version
    }
  }
  
  // If still no match, return as-is
  return singular
}
