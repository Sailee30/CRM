// lib/algorithms/word-embedding.ts

const wordVectors = new Map<string, number[]>()

export function initializeWordVectors(vocabulary: string[]): void {
  vocabulary.forEach(word => {
    const vector: number[] = []
    for (let i = 0; i < 50; i++) {
      // Simple hash-based embedding
      const hash = word.split('').reduce((h, c) => {
        return ((h << 5) - h) + c.charCodeAt(0)
      }, 0)
      vector.push(Math.sin(hash / 100 + i) * 0.5 + 0.5)
    }
    wordVectors.set(word, vector)
  })
}

export function getWordVector(word: string): number[] {
  const normalized = word.toLowerCase()
  if (!wordVectors.has(normalized)) {
    // Generate random vector if not found
    const vector: number[] = []
    for (let i = 0; i < 50; i++) {
      vector.push(Math.random())
    }
    return vector
  }
  return wordVectors.get(normalized) || []
}

export function getTextVector(tokens: string[]): number[] {
  if (tokens.length === 0) {
    return Array(50).fill(0)
  }
  
  const vectors = tokens.map(token => getWordVector(token))
  const combined: number[] = Array(50).fill(0)
  
  // Average the word vectors
  vectors.forEach(vec => {
    for (let i = 0; i < 50; i++) {
      combined[i] += vec[i]
    }
  })
  
  for (let i = 0; i < 50; i++) {
    combined[i] /= tokens.length
  }
  
  return combined
}