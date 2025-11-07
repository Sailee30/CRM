// Vector search and similarity matching for RAG
export interface VectorEntry {
  id: string
  text: string
  embedding: number[]
  metadata?: Record<string, any>
}

import { calculateTFIDF, updateDocumentFrequency } from '@/lib/nlp/vectorizer'
import { preprocessText } from '@/lib/utils/text-preprocessing'

export function createSimpleEmbedding(text: string, dimension = 100): number[] {
  // Preprocess text first
  const tokens = preprocessText(text)
  
  // Update document frequency for TF-IDF calculation
  updateDocumentFrequency(tokens)
  
  // Get vocabulary
  const vocabulary = Array.from(new Set(tokens)) // Get unique tokens
  
  // If using TF-IDF (better approach)
  // For now, use simpler but improved approach: normalized term frequency
  const embedding = Array(dimension).fill(0)
  
  if (tokens.length === 0) return embedding
  
  // Count term frequencies
  const termFreq = new Map<string, number>()
  tokens.forEach(token => {
    termFreq.set(token, (termFreq.get(token) || 0) + 1)
  })
  
  // Create hash-based embedding with better distribution
  for (const [term, freq] of termFreq.entries()) {
    // Better hash function (DJB2)
    let hash = 5381
    for (let i = 0; i < term.length; i++) {
      hash = ((hash << 5) + hash) + term.charCodeAt(i)
    }
    
    const index = Math.abs(hash % dimension)  // Distribute across dimension
    const normalizedFreq = freq / tokens.length
    embedding[index] += normalizedFreq
  }
  
  // Normalize embedding to unit length
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  if (norm > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm
    }
  }
  
  return embedding
}

// Cosine similarity
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    magnitude1 += vec1[i] * vec1[i]
    magnitude2 += vec2[i] * vec2[i]
  }

  const denominator = Math.sqrt(magnitude1) * Math.sqrt(magnitude2)
  return denominator === 0 ? 0 : dotProduct / denominator
}

export class VectorStore {
  private entries: Map<string, VectorEntry> = new Map()
  private dimension: number  // ✅ Don't initialize here

  constructor(dimension = 100) {  // ✅ Now properly used
    this.dimension = dimension
  }

  add(entry: VectorEntry): void {
    this.entries.set(entry.id, entry)
  }

  addBatch(entries: VectorEntry[]): void {
    for (const entry of entries) {
      this.entries.set(entry.id, entry)
    }
  }

  search(queryEmbedding: number[], topK = 5): VectorEntry[] {
    const scores: Array<[string, number]> = []

    for (const [id, entry] of this.entries) {
      const similarity = cosineSimilarity(queryEmbedding, entry.embedding)
      scores.push([id, similarity])
    }

    return scores
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(([id]) => this.entries.get(id)!)
  }

  searchByText(query: string, topK = 5, minSimilarity = 0.2): VectorEntry[] {
    const queryEmbedding = createSimpleEmbedding(query, this.dimension)
    const results = this.search(queryEmbedding, topK)
    
    // Filter by minimum similarity threshold
    return results.filter(entry => {
      const similarity = cosineSimilarity(queryEmbedding, entry.embedding)
      return similarity >= minSimilarity
    })
  }

  getAll(): VectorEntry[] {
    return Array.from(this.entries.values())
  }

  size(): number {
    return this.entries.size
  }

  clear(): void {
    this.entries.clear()
  }
}
