// lib/nlp/similarity.ts
// ✅ FIXED VERSION - Copy entire file

import { cosineSimilarity } from '@/lib/ml/vector-search' 

export function calculateSimilarity(vec1: number[], vec2: number[]): number {
  return cosineSimilarity(vec1, vec2)
}

export function findMostSimilar(
  queryVector: number[],
  vectors: number[][]
): { index: number; similarity: number } {
  let maxSimilarity = -1
  let mostSimilarIndex = 0
  
  vectors.forEach((vec, idx) => {
    const similarity = cosineSimilarity(queryVector, vec)
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity
      mostSimilarIndex = idx
    }
  })
  
  return { index: mostSimilarIndex, similarity: maxSimilarity }
}

export function calculateConfidence(similarity: number): number {
  return Math.min(100, Math.max(0, Math.round(similarity * 100)))
}

export function filterBySimilarity(
  vectors: number[][],
  queryVector: number[],
  threshold: number = 0.3
): Array<{ index: number; similarity: number }> {
  const results: Array<{ index: number; similarity: number }> = []
  
  vectors.forEach((vec, idx) => {
    const similarity = cosineSimilarity(queryVector, vec)
    if (similarity >= threshold) {
      results.push({ index: idx, similarity })
    }
  })
  
  return results.sort((a, b) => b.similarity - a.similarity)
}

export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0))

  for (let i = 0; i <= len1; i++) matrix[i][0] = i
  for (let j = 0; j <= len2; j++) matrix[0][j] = j

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }

  return matrix[len1][len2]
}

// ✅ FIX: Properly initialized Damerau distance
export function damerauLevenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  
  const matrix: number[][] = []
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = []
    for (let j = 0; j <= len2; j++) {
      if (i === 0) matrix[i][j] = j
      else if (j === 0) matrix[i][j] = i
      else matrix[i][j] = 0
    }
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
      
      if (i > 1 && j > 1 && 
          str1[i - 1] === str2[j - 2] && 
          str1[i - 2] === str2[j - 1]) {
        matrix[i][j] = Math.min(
          matrix[i][j],
          matrix[i - 2][j - 2] + cost
        )
      }
    }
  }

  return matrix[len1][len2]
}

export function stringSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2)
  const maxLen = Math.max(str1.length, str2.length)
  if (maxLen === 0) return 1
  return 1 - (distance / maxLen)
}

// ✅ FIX: Much lower thresholds for typo tolerance
export function getTypoThreshold(wordLength: number): number {
  if (wordLength <= 2) return 0.40    // "a", "ai" → very lenient
  if (wordLength <= 3) return 0.50    // "del", "upd", "add"
  if (wordLength <= 4) return 0.55    // "delt", "mail", "evng"
  if (wordLength <= 5) return 0.55    // "delete", "email", "evening"
  if (wordLength <= 6) return 0.60    // "contact", "update", "create"
  if (wordLength <= 8) return 0.65    // "settings", "opportunity"
  return 0.55                          // Long words
}

// ✅ FIX: Better string similarity with case-insensitive
export function damerauStringSimilarity(str1: string, str2: string): number {
  const str1Lower = str1.toLowerCase()
  const str2Lower = str2.toLowerCase()
  
  if (str1Lower === str2Lower) return 1.0
  if (str1Lower.includes(str2Lower) || str2Lower.includes(str1Lower)) {
    return 0.95
  }
  
  const distance = damerauLevenshteinDistance(str1Lower, str2Lower)
  const maxLen = Math.max(str1Lower.length, str2Lower.length)
  if (maxLen === 0) return 1
  
  return 1 - (distance / maxLen)
}

export function fuzzyMatchWithDynamicThreshold(
  userString: string,
  targetString: string
): boolean {
  const similarity = stringSimilarity(userString, targetString)
  const threshold = getTypoThreshold(Math.min(userString.length, targetString.length))
  return similarity >= threshold
}

export function contextAwareFuzzyMatch(
  userWord: string,
  targetWord: string,
  isActionVerb: boolean = false
): boolean {
  const userLower = userWord.toLowerCase()
  const targetLower = targetWord.toLowerCase()
  
  if (userLower === targetLower) return true
  if (targetLower.includes(userLower) || userLower.includes(targetLower)) return true
  
  const similarity = damerauStringSimilarity(userLower, targetLower)
  let threshold = getTypoThreshold(Math.min(userLower.length, targetLower.length))
  
  if (isActionVerb) {
    threshold += 0.05
  }
  
  return similarity >= threshold
}

export function fuzzyMatch(
  userString: string,
  targetString: string,
  threshold: number = 0.75
): boolean {
  const similarity = stringSimilarity(userString, targetString)
  return similarity >= threshold
}