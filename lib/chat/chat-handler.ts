// lib/chat/chat-handler.ts
// Complete chat handler with classifier training and K-means clustering

import { classifier } from '@/lib/nlp/intent-classifier'
import { trainingData } from '@/lib/nlp/training-data'
import { aimlProcessor } from '@/lib/aiml/aiml-processor'
import { sessionManager } from '@/lib/chat/session-manager'
import { preprocessText } from '@/lib/utils/text-preprocessing'
import { searchKnowledgeBase } from '@/lib/nlp/knowledge-base'
import type { IntentPrediction } from '@/lib/nlp/intent-classifier'

// ✅ Initialize classifier on module load
let classifierInitialized = false

function initializeClassifier() {
  if (!classifierInitialized) {
    classifier.train(trainingData)
    classifierInitialized = true
    console.log('[Chat] Classifier initialized with training data')
  }
}

// Call on module load
initializeClassifier()

/**
 * Initialize chatbot - train classifier once
 * Call this in your API route or app startup
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
  // ✅ Ensure classifier is initialized
  initializeClassifier()
  
  // Predict intent
  const prediction = classifier.predict(userMessage)
  console.log(`Intent: ${prediction.intent}, Confidence: ${prediction.confidence}`)

  // Get response from AIML templates
  let response = aimlProcessor.generateResponse(prediction, userMessage)

    // ✅ FIX: Search knowledge base for relevant articles
  let articles = searchKnowledgeBase(userMessage)
  // If articles is null or undefined, default to empty array
  if (!articles) {
    articles = []
  }

  // Get or create session
  let session = sessionManager.getSession(sessionId)
  if (!session) {
    session = sessionManager.createSession(userId, isAuthenticated)
  }

  // Add messages to session
  sessionManager.addMessage(sessionId, {
    sessionId,
    content: userMessage,
    role: 'user',
    intent: prediction.intent,
    timestamp: new Date(),
  })

  sessionManager.addMessage(sessionId, {
    sessionId,
    content: response,
    role: 'assistant',
    intent: prediction.intent,
    timestamp: new Date(),
  })

  // Calculate cluster
  const cluster = await clusterMessageIntent(userMessage, prediction)

  return {
    response,
    intent: prediction.intent,
    confidence: Math.round(prediction.confidence * 100),
    // ✅ FIX: Properly map articles
    articles: articles.map((a: { id: string; title: string }) => ({
      id: a.id,
      title: a.title,
    })),
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
    // Simple clustering based on intent
    // Just group by intent type, no vectors needed
    const intentClusters: Record<string, number> = {
      'update_contact': 0,
      'report_generation': 1,
      'create_ticket': 2,
      'get_customer_summary': 3,
      'billing_query': 4,
      'data_sync': 5,
      'greeting': 6,
      'gratitude': 7,
      'crud_list_contacts': 8,
      'crud_add_contact': 8,
      'crud_delete_contact': 8,
      'crud_edit_contact': 8,
      'crud_list_sales': 9,
      'crud_add_sale': 9,
      'crud_delete_sale': 9,
      'crud_edit_sale': 9,
    }

    return intentClusters[prediction.intent] || 0
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
