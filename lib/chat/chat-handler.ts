// lib/chat/chat-handler.ts
// Complete chat handler with classifier training and K-means clustering

import { classifier } from '@/lib/nlp/intent-classifier'
import { trainingData } from '@/lib/nlp/training-data'
import { aimlProcessor } from '@/lib/aiml/aiml-processor'
import { sessionManager } from '@/lib/chat/session-manager'
import { KMeansClusterer } from '@/lib/algorithms/kmeans'
import { getTextVector } from '@/lib/algorithms/word-embedding'
import { preprocessText } from '@/lib/utils/text-preprocessing'
import { searchKnowledgeBase } from '@/lib/nlp/knowledge-base'
import type { IntentPrediction } from '@/lib/nlp/intent-classifier'
/**
 * Initialize chatbot - train classifier once
 * Call this in your API route or app startup
 */
export function initializeChatbot(): void {
  console.log('Training classifier with', trainingData.length, 'phrases...')
  classifier.train(trainingData)
  console.log('Classifier ready!')
}

/**
 * Process user message and generate response
 */
export async function handleChatMessage(
  userId: string,
  sessionId: string,
  userMessage: string,
  isAuthenticated: boolean
): Promise<{
  response: string
  intent: string
  confidence: number
  articles: Array<{ id: string; title: string }>
  cluster?: number
}> {
  // Ensure classifier is trained
  initializeChatbot()

  // Predict intent
  const prediction = classifier.predict(userMessage)
  console.log(`Intent: ${prediction.intent}, Confidence: ${prediction.confidence}`)

// Get response from AIML processor
  const response = aimlProcessor.generateResponse(prediction, userMessage)  // ← ADD userMessage parameter

  // Search knowledge base for relevant articles
  // Priority: search by intent first, then by query
  let articles = searchKnowledgeBase(userMessage) 
  
  // Get or create session
  let session = sessionManager.getSession(sessionId)
  if (!session) {
    session = sessionManager.createSession(userId, isAuthenticated)
  }

  // Add user message to session
  sessionManager.addMessage(sessionId, {
    sessionId,
    content: userMessage,
    role: 'user',
    intent: prediction.intent,
    timestamp: new Date(),
  })

  // Add assistant response to session
  sessionManager.addMessage(sessionId, {
    sessionId,
    content: response,
    role: 'assistant',
    intent: prediction.intent,
    timestamp: new Date(),
  })

  // Calculate cluster for this message (for analytics)
  const cluster = await clusterMessageIntent(userMessage, prediction)

  return {
    response,
    intent: prediction.intent,
    confidence: Math.round(prediction.confidence * 100),
    articles:articles.map((a: { id: string; title: string }) => ({ id: a.id, title: a.title })),
    cluster,
  }
}

/**
 * Cluster user message using K-means
 * Groups similar user intents together for analytics
 */
async function clusterMessageIntent(
  userMessage: string,
  prediction: IntentPrediction
): Promise<number> {
  try {
    // Preprocess text
    const tokens = preprocessText(userMessage)
    
    // Convert to vector
    const messageVector = getTextVector(tokens)
    
    // Get all messages from all sessions for clustering context
    const allSessions = sessionManager.getAllSessions()
    const userMessages = allSessions
      .flatMap(s => s.messages)
      .filter(m => m.role === 'user' && m.intent === prediction.intent)
      .slice(0, 20) // Limit to 20 messages for performance

    // If not enough messages, skip clustering
    if (userMessages.length < 3) {
      return 0
    }

    // Convert messages to vectors
    const messageVectors = userMessages.map(m => {
      const tokens = preprocessText(m.content)
      return getTextVector(tokens)
    })

    // Apply K-means clustering
    const k = Math.min(3, Math.ceil(userMessages.length / 5)) // Dynamic k
    const clusterer = new KMeansClusterer(k, 50, 0.001)
    const result = clusterer.fit(messageVectors)

    // Predict cluster for current message
    const cluster = clusterer.predict(messageVector, result.centroids)
    
    console.log(`Message clustered into group: ${cluster}`)
    return cluster
  } catch (error) {
    console.error('Clustering error:', error)
    return 0
  }
}

/**
 * Get chat analytics with intent clustering
 */
export function getChatAnalytics(): {
  totalSessions: number
  resolvedSessions: number
  avgMessagesPerSession: number
  intentsDistribution: Record<string, number>
  topIntents: Array<{ intent: string; count: number }>
  authenticatedVsAnonymous: { authenticated: number; anonymous: number }
} {
  const sessions = sessionManager.getAllSessions()
  
  // Count intents
  const intentsDistribution: Record<string, number> = {}
  sessions.forEach(session => {
    session.messages.forEach(msg => {
      if (msg.intent) {
        intentsDistribution[msg.intent] = (intentsDistribution[msg.intent] || 0) + 1
      }
    })
  })

  // Sort intents by frequency
  const topIntents = Object.entries(intentsDistribution)
    .map(([intent, count]) => ({ intent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    totalSessions: sessions.length,
    resolvedSessions: sessions.filter(s => s.resolved).length,
    avgMessagesPerSession:
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.messages.length, 0) / sessions.length
        : 0,
    intentsDistribution,
    topIntents,
    authenticatedVsAnonymous: {
      authenticated: sessions.filter(s => s.isAuthenticated).length,
      anonymous: sessions.filter(s => !s.isAuthenticated).length,
    },
  }
}

/**
 * Get intent clustering insights
 */
export function getIntentClusteringInsights(): {
  intentPatterns: Record<string, { vectorRepresentation: number[]; frequency: number }>
  clusterSummary: string
} {
  const sessions = sessionManager.getAllSessions()
  const intentMessages: Record<string, string[]> = {}

  // Group messages by intent
  sessions.forEach(session => {
    session.messages.forEach(msg => {
      if (msg.intent && msg.role === 'user') {
        if (!intentMessages[msg.intent]) {
          intentMessages[msg.intent] = []
        }
        intentMessages[msg.intent].push(msg.content)
      }
    })
  })

  // Create vector representation for each intent
  const intentPatterns: Record<string, { vectorRepresentation: number[]; frequency: number }> = {}

  Object.entries(intentMessages).forEach(([intent, messages]) => {
    if (messages.length > 0) {
      // Average vector for all messages of this intent
      const vectors = messages.map(m => {
        const tokens = preprocessText(m)
        return getTextVector(tokens)
      })

      const avgVector = Array(50).fill(0)
      vectors.forEach(vec => {
        for (let i = 0; i < 50; i++) {
          avgVector[i] += vec[i] / vectors.length
        }
      })

      intentPatterns[intent] = {
        vectorRepresentation: avgVector,
        frequency: messages.length,
      }
    }
  })

  const clusterSummary = `Identified ${Object.keys(intentPatterns).length} intent patterns from ${Object.values(intentPatterns).reduce((sum, p) => sum + p.frequency, 0)} user messages`

  return {
    intentPatterns,
    clusterSummary,
  }
}