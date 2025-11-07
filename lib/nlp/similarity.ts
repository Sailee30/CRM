// lib/nlp/similarity.ts

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
  // Convert similarity (0-1) to confidence percentage
  return Math.min(100, Math.max(0, Math.round(similarity * 100)))  // ✅ Bounded 0-100
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