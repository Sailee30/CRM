// lib/nlp/intent-classifier.ts
// Smart Hybrid Classifier: Keyword Detection + Semantic Similarity

export interface IntentPrediction {
  intent: string
  confidence: number
  entities: Record<string, unknown>
}

export interface TrainingData {
  phrase: string
  intent: string
  entities?: Record<string, unknown>
}

class SmartClassifier {
  private trainingData: TrainingData[] = []
  private intentKeywords: Map<string, string[]> = new Map()

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
  }

  // Extract important keywords from training data (automatic!)
private extractKeywords(phrase: string): string[] {
  const tokens = this.tokenize(phrase)
  
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'to', 'for'])
  
  let keywords = tokens.filter(word => !commonWords.has(word) && word.length > 2)
  
  // ✅ Normalize plural forms to singular
  keywords = keywords.map(kw => this.singularizeKeyword(kw))
  
    // ✅ ADD THIS: Keep important action verbs intact
  const actionVerbs = ['update', 'edit', 'delete', 'remove', 'create', 'add', 'change', 'modify']
  const hasActionVerb = keywords.some(kw => actionVerbs.includes(kw))
  if (hasActionVerb) {
    // Boost priority by keeping action verbs
    const verbs = keywords.filter(kw => actionVerbs.includes(kw))
    return [...new Set([...verbs, ...keywords])] // Dedupe but prioritize verbs
  }

  return keywords
}

// ✅ ADD THIS NEW METHOD to SmartClassifier class:
private singularizeKeyword(word: string): string {
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
  if (word.endsWith('ed')) return word
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  if (word.endsWith('ches')) return word.slice(0, -2)
  if (word.endsWith('sses')) return word.slice(0, -2)
  if (word.endsWith('xes')) return word.slice(0, -2)
  if (word.endsWith('zes')) return word.slice(0, -2)
  if (word.endsWith('s')) return word.slice(0, -1)

  return word
}

  // Build keyword map from training data automatically
  private buildKeywordMap(data: TrainingData[]): void {
    this.intentKeywords.clear()

    for (const item of data) {
      const keywords = this.extractKeywords(item.phrase)
      
      if (!this.intentKeywords.has(item.intent)) {
        this.intentKeywords.set(item.intent, [])
      }

      // Add extracted keywords to intent
      const intentKeywordList = this.intentKeywords.get(item.intent)!
      for (const keyword of keywords) {
        if (!intentKeywordList.includes(keyword)) {
          intentKeywordList.push(keyword)
        }
      }
    }
  }

  // Calculate similarity between two token sets
  private calculateSimilarity(userTokens: string[], trainingTokens: string[]): number {
    if (userTokens.length === 0 || trainingTokens.length === 0) return 0

    let matches = 0
    for (const token of userTokens) {
      if (trainingTokens.includes(token)) {
        matches++
      }
    }

    // Jaccard similarity: intersection / union
    const union = new Set([...userTokens, ...trainingTokens]).size
    return matches / union
  }

  private checkKeywordMatch(userTokens: string[], intent: string): number {
    const intentKeywords = this.intentKeywords.get(intent) || []
    if (intentKeywords.length === 0) return 0

    let matches = 0
    for (const token of userTokens) {
      if (intentKeywords.includes(token)) {
        matches++
      }
    }

    // Use Jaccard similarity: intersection / union
    const union = new Set([...userTokens, ...intentKeywords]).size
    return union > 0 ? matches / union : 0
  }

private getIntentSpecificity(userTokens: string[], intent: string): number {
  const conflictingIntents: Record<string, string[]> = {
    // ✅ DELETE operations should NOT match if user mentions error/failure
    'delete_contact': ['update', 'edit', 'change', 'failed', 'error', 'issue', 'problem'],
    'delete_deal': ['update', 'edit', 'change', 'failed', 'error', 'issue'],
    'delete_task': ['update', 'edit', 'change', 'failed', 'error', 'issue'],
    'delete_report': ['update', 'edit', 'change', 'failed', 'error', 'issue'],
    'delete_message': ['update', 'edit', 'change', 'failed', 'error', 'issue'],
    'delete_settings': ['update', 'edit', 'change', 'failed', 'error', 'issue'],
    
    // ✅ UPDATE operations should NOT match if user mentions error/failure
    'update_contact': ['delete', 'remove', 'erase', 'failed', 'error', 'issue', 'problem'],
    'update_deal': ['delete', 'remove', 'failed', 'error', 'issue'],
    'update_task': ['delete', 'remove', 'failed', 'error', 'issue'],
    'update_report': ['delete', 'remove', 'failed', 'error', 'issue'],
    'update_settings': ['delete', 'remove', 'failed', 'error', 'issue'],
    
    // ✅ CREATE operations should NOT match if user mentions error/failure
    'create_deal': ['delete', 'remove', 'failed', 'error', 'issue'],
    'create_task': ['delete', 'remove', 'failed', 'error', 'issue'],
    'create_ticket': ['delete', 'remove', 'failed', 'error'],
  }
  
  const conflicts = conflictingIntents[intent] || []
  for (const token of userTokens) {
    if (conflicts.includes(token)) {
      return 0 // Block this intent - conflict detected
    }
  }
  
  return 1 // Allow this intent
}

  // Extract entities from phrase
  private extractEntities(phrase: string): Record<string, unknown> {
    const entities: Record<string, unknown> = {}

    // Extract person names (capitalized words)
    const nameMatch = phrase.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/)
    if (nameMatch) {
      entities.person = nameMatch[0]
    }

    // Extract emails
    const emailMatch = phrase.match(/[\w\.-]+@[\w\.-]+\.\w+/)
    if (emailMatch) {
      entities.email = emailMatch[0]
    }

    // Extract dates
    const dateMatch = phrase.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/)
    if (dateMatch) {
      entities.date = dateMatch[0]
    }

    // Extract amounts (currency)
    const amountMatch = phrase.match(/\$\d+\.?\d*/)
    if (amountMatch) {
      entities.amount = amountMatch[0]
    }

    return entities
  }

  public train(data: TrainingData[]): void {
    this.trainingData = data
    this.buildKeywordMap(data)

    console.log(`[Classifier] Training with ${data.length} phrases`)
    console.log(`[Classifier] Intents found: ${this.intentKeywords.size}`)
    
    // Show extracted keywords per intent
    this.intentKeywords.forEach((keywords, intent) => {
      console.log(`[Classifier] ${intent}: ${keywords.slice(0, 10).join(', ')}...`)
    })
  }

public predict(phrase: string): IntentPrediction {
  if (this.trainingData.length === 0) {
    return { intent: 'fallback', confidence: 0, entities: {} }
  }

  const userTokens = this.extractKeywords(phrase)
  
  if (userTokens.length === 0) {
    return { intent: 'fallback', confidence: 0, entities: {} }
  }

  const scores: { intent: string; confidence: number; method: string }[] = []

  // Method 1: Check keyword overlap
  this.intentKeywords.forEach((keywords, intent) => {
    // ✅ CHECK SPECIFICITY FIRST
    const specificity = this.getIntentSpecificity(userTokens, intent)
    if (specificity === 0) return // Skip conflicting intents
    
    const keywordScore = this.checkKeywordMatch(userTokens, intent)
    if (keywordScore > 0) {
      scores.push({
        intent,
        confidence: keywordScore,
        method: 'keyword',
      })
    }
  })

  // Method 2: Semantic similarity
  for (const trainingPhrase of this.trainingData) {
    // ✅ CHECK SPECIFICITY
    const specificity = this.getIntentSpecificity(userTokens, trainingPhrase.intent)
    if (specificity === 0) continue
    
    const trainingTokens = this.extractKeywords(trainingPhrase.phrase)
    const similarity = this.calculateSimilarity(userTokens, trainingTokens)
    
    if (similarity > 0) {
      const existingScore = scores.find(s => s.intent === trainingPhrase.intent)
      if (existingScore) {
        existingScore.confidence = (existingScore.confidence * 0.8) + (similarity * 0.2)
      } else {
        scores.push({
          intent: trainingPhrase.intent,
          confidence: similarity,
          method: 'similarity',
        })
      }
    }
  }

  if (scores.length === 0) {
    return { intent: 'fallback', confidence: 0, entities: {} }
  }

  scores.sort((a, b) => b.confidence - a.confidence)
  const top3 = scores.slice(0, 3)
  const bestIntent = top3[0].intent
  const bestConfidence = top3[0].confidence

  // ✅ INCREASE CONFIDENCE THRESHOLD
  const confidenceDrop = top3.length > 1 ? top3[0].confidence - top3[1].confidence : 1
  const adjustedConfidence = bestConfidence * (1 + confidenceDrop)

  console.log(`[Classifier] User phrase: "${phrase}"`)
  console.log(`[Classifier] Top matches:`)
  top3.forEach((s, i) => {
    console.log(`[Classifier]   ${i + 1}. ${s.intent}: ${Math.round(s.confidence * 100)}%`)
  })

  // ✅ INCREASE MIN CONFIDENCE THRESHOLD
  const MIN_CONFIDENCE = 0.2 // Changed from 0.05
  const finalIntent = adjustedConfidence < MIN_CONFIDENCE ? 'fallback' : bestIntent

  return {
    intent: finalIntent,
    confidence: adjustedConfidence,
    entities: this.extractEntities(phrase),
  }
}

  public getModelVersion(): string {
    return '3.0-hybrid'
  }
}

export const classifier = new SmartClassifier()