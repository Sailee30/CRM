// Vector search and similarity matching for RAG
export interface VectorEntry {
  id: string
  text: string
  embedding: number[]
  metadata?: Record<string, any>
}

// Simple embedding function (can be replaced with actual embeddings)
export function createSimpleEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/)
  const embedding = Array(100).fill(0)

  for (const word of words) {
    let hash = 0
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i)
      hash |= 0
    }

    const index = Math.abs(hash) % 100
    embedding[index] += 1 / words.length
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

// Vector store for semantic search
export class VectorStore {
  private entries: Map<string, VectorEntry> = new Map()

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

  searchByText(query: string, topK = 5): VectorEntry[] {
    const queryEmbedding = createSimpleEmbedding(query)
    return this.search(queryEmbedding, topK)
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
