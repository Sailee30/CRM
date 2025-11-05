// lib/nlp/vectorizer.ts

interface DocumentFrequency {
  termFrequency: Map<string, number>
  documentFrequency: Map<string, number>
  totalDocuments: number
}

const docFrequency: DocumentFrequency = {
  termFrequency: new Map(),
  documentFrequency: new Map(),
  totalDocuments: 0,
}

export function calculateTFIDF(
  tokens: string[],
  vocabulary: string[]
): number[] {
  const vector: number[] = []
  
  // Calculate TF (Term Frequency)
  const termCount = new Map<string, number>()
  tokens.forEach(token => {
    termCount.set(token, (termCount.get(token) || 0) + 1)
  })
  
  vocabulary.forEach(term => {
    const tf = (termCount.get(term) || 0) / tokens.length
    
    // Calculate IDF (Inverse Document Frequency)
    const df = docFrequency.documentFrequency.get(term) || 1
    const idf = Math.log((docFrequency.totalDocuments + 1) / (df + 1))
    
    // TF-IDF = TF * IDF
    const tfidf = tf * idf
    vector.push(tfidf)
  })
  
  return vector
}

export function updateDocumentFrequency(tokens: string[]): void {
  docFrequency.totalDocuments += 1
  
  const uniqueTerms = new Set(tokens)
  uniqueTerms.forEach(term => {
    docFrequency.documentFrequency.set(
      term,
      (docFrequency.documentFrequency.get(term) || 0) + 1
    )
  })
}

export function getVocabulary(): string[] {
  return Array.from(docFrequency.documentFrequency.keys())
}