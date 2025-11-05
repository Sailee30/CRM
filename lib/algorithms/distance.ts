// lib/algorithms/distance.ts

export function euclideanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length')
  }
  
  let sumSquares = 0
  for (let i = 0; i < vec1.length; i++) {
    const diff = vec1[i] - vec2[i]
    sumSquares += diff * diff
  }
  
  return Math.sqrt(sumSquares)
}

export function manhattanDistance(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length')
  }
  
  let sum = 0
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.abs(vec1[i] - vec2[i])
  }
  
  return sum
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length')
  }
  
  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    norm1 += vec1[i] * vec1[i]
    norm2 += vec2[i] * vec2[i]
  }
  
  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2)
  if (denominator === 0) return 0
  
  return dotProduct / denominator
}