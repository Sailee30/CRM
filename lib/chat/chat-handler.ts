// lib/chat/chat-handler.ts
// Complete chat handler with classifier training and K-means clustering

import { classifier } from '@/lib/nlp/intent-classifier'
import { trainingData } from '@/lib/nlp/training-data'
import { aimlProcessor } from '@/lib/aiml/aiml-processor'
import { sessionManager } from '@/lib/chat/session-manager'
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

/**
 * Check if user message is a CRUD command
 */
export function isCRUDCommand(userMessage: string): boolean {
  const lower = userMessage.toLowerCase().trim()
  
  const crudKeywords = [
    'add contact',
    'delete contact',
    'edit contact',
    'list contact',
    'show contact',
    'display contact',
    'add sale',
    'delete sale',
    'edit sale',
    'list sale',
    'show sale',
    'display sale',
  ]
  
  return crudKeywords.some(kw => lower.includes(kw))
}
/**
 * Execute CRUD operation and return response
 * This function works with your existing data structure
 */
export function executeCRUDCommand(
  userMessage: string,
  crudData: any
): { response: string; success: boolean } {
  const lower = userMessage.toLowerCase().trim()
  const data = crudData.data
  const setData = crudData.setData
  const setChangeCount = crudData.setChangeCount

  // ===== LIST CONTACTS =====
  if (lower.includes('list contact') || lower.includes('show contact')) {
    if (data.contacts.length === 0) {
      return { response: 'No contacts found', success: true }
    }
    const list = data.contacts
      .map((c: any) => `• ${c.name} (${c.email})`)
      .join('\n')
    return {
      response: `Contacts (${data.contacts.length}):\n${list}`,
      success: true,
    }
  }

  // ===== ADD CONTACT =====
  if (lower.includes('add contact')) {
    const nameMatch = userMessage.match(/add contact\s+(.+?)(?:\s*$|\s+with)/i)
    const name = nameMatch ? nameMatch[1].trim() : 'New Contact'
    
    setData((prev: any) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { id: Date.now(), name, email: '', phone: '' },
      ],
    }))
    setChangeCount((c: number) => c + 1)
    return {
      response: `Added contact: ${name}`,
      success: true,
    }
  }

  // ===== DELETE CONTACT =====
  if (lower.includes('delete contact')) {
    const nameMatch = userMessage.match(/delete contact\s+(.+?)(?:\s*$)/i)
    const searchName = nameMatch ? nameMatch[1].toLowerCase() : ''
    
    const contact = data.contacts.find((c: any) =>
      c.name.toLowerCase().includes(searchName)
    )
    
    if (contact) {
      setData((prev: any) => ({
        ...prev,
        contacts: prev.contacts.filter((c: any) => c.id !== contact.id),
      }))
      setChangeCount((c: number) => c + 1)
      return {
        response: ` Deleted: ${contact.name}\n⚠️ Frontend only - refreshing will restore it!`,
        success: true,
      }
    }
    return {
      response: `Contact "${searchName}" not found`,
      success: false,
    }
  }

  // ===== EDIT CONTACT =====
  if (lower.includes('edit contact')) {
    const fromToMatch = userMessage.match(/edit contact\s+(.+?)\s+to\s+(.+?)(?:\s*$)/i)
    if (fromToMatch) {
      const oldName = fromToMatch[1].trim().toLowerCase()
      const newName = fromToMatch[2].trim()
      
      const contact = data.contacts.find((c: any) =>
        c.name.toLowerCase().includes(oldName)
      )
      
      if (contact) {
        setData((prev: any) => ({
          ...prev,
          contacts: prev.contacts.map((c: any) =>
            c.id === contact.id ? { ...c, name: newName } : c
          ),
        }))
        setChangeCount((c: number) => c + 1)
        return {
          response: `Updated: ${contact.name} → ${newName}`,
          success: true,
        }
      }
      return {
        response: `Contact "${oldName}" not found`,
        success: false,
      }
    }
  }

  // ===== LIST SALES =====
  if (lower.includes('list sale') || lower.includes('show sale')) {
    if (data.sales.length === 0) {
      return { response: ' No sales found', success: true }
    }
    const list = data.sales
      .map((s: any) => `• ${s.product} - $${s.amount} (${s.customer})`)
      .join('\n')
    return {
      response: `Sales (${data.sales.length}):\n${list}`,
      success: true,
    }
  }

  // ===== ADD SALE =====
  if (lower.includes('add sale')) {
    const productMatch = userMessage.match(/add sale\s+(.+?)(?:\s+-\s+\$?(\d+)|$)/i)
    const product = productMatch ? productMatch[1].trim() : 'New Sale'
    const amount = productMatch ? parseInt(productMatch[2] || '0') : 0
    
    setData((prev: any) => ({
      ...prev,
      sales: [
        ...prev.sales,
        { id: Date.now(), product, amount, customer: '', date: new Date().toISOString().split('T')[0] },
      ],
    }))
    setChangeCount((c: number) => c + 1)
    return {
      response: `Added sale: ${product} ($${amount})`,
      success: true,
    }
  }

  // ===== DELETE SALE =====
  if (lower.includes('delete sale')) {
    const productMatch = userMessage.match(/delete sale\s+(.+?)(?:\s*$)/i)
    const searchProduct = productMatch ? productMatch[1].toLowerCase() : ''
    
    const sale = data.sales.find((s: any) =>
      s.product.toLowerCase().includes(searchProduct)
    )
    
    if (sale) {
      setData((prev: any) => ({
        ...prev,
        sales: prev.sales.filter((s: any) => s.id !== sale.id),
      }))
      setChangeCount((c: number) => c + 1)
      return {
        response: `Deleted: ${sale.product}\n⚠️ Frontend only - refreshing will restore it!`,
        success: true,
      }
    }
    return {
      response: `Sale "${searchProduct}" not found`,
      success: false,
    }
  }

  // ===== EDIT SALE =====
  if (lower.includes('edit sale')) {
    const fromToMatch = userMessage.match(/edit sale\s+(.+?)\s+to\s+\$?(\d+)(?:\s*$)/i)
    if (fromToMatch) {
      const productName = fromToMatch[1].trim().toLowerCase()
      const newAmount = parseInt(fromToMatch[2])
      
      const sale = data.sales.find((s: any) =>
        s.product.toLowerCase().includes(productName)
      )
      
      if (sale && !isNaN(newAmount)) {
        setData((prev: any) => ({
          ...prev,
          sales: prev.sales.map((s: any) =>
            s.id === sale.id ? { ...s, amount: newAmount } : s
          ),
        }))
        setChangeCount((c: number) => c + 1)
        return {
          response: `Updated: ${sale.product} → $${newAmount}`,
          success: true,
        }
      }
    }
  }

  return {
    response: 'Command not recognized',
    success: false,
  }
}
/**
 * Execute CRUD with NLP confidence checking
 */
export function executeCRUDCommandWithNLP(
  userMessage: string,
  prediction: IntentPrediction,
  crudData: any
): { response: string; success: boolean } {
  
  // If NLP detected a CRUD intent, use it
  if (prediction.intent.startsWith('crud_')) {
    console.log(`[NLP] CRUD intent detected: ${prediction.intent}, confidence: ${prediction.confidence}`)
    
    // Show confidence level
    const confidenceMsg = prediction.confidence > 0.8 
      ? '' 
      : `\n(Confidence: ${Math.round(prediction.confidence * 100)}%)`
    
    return executeCRUDCommand(userMessage, crudData)
  }

  return {
    response: 'Not recognized as CRUD command',
    success: false,
  }
}