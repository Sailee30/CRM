// lib/utils/text-preprocessing.ts

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