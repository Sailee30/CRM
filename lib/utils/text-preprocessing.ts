// lib/utils/text-preprocessing.ts

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

export function preprocessText(text: string): string[] {
  const cleaned = cleanText(text)
  const tokens = tokenize(cleaned)
  return removeStopwords(tokens)
}