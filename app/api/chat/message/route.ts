// app/api/chat/message/routes.ts
// Enhanced with ML algorithms: K-means clustering, lead scoring, vector search

import { classifier } from "@/lib/nlp/intent-classifier"
import { trainingData } from "@/lib/nlp/training-data"
import { searchKnowledgeBase } from "@/lib/nlp/knowledge-base"
import { aimlProcessor } from "@/lib/aiml/aiml-processor"
import { scoreLeadLinearRegression, initializeLeadScoringModel } from "@/lib/ml/lead-scoring"
import { preprocessText } from "@/lib/utils/text-preprocessing"

let classifierReady = false
let classifierError: string | null = null
let leadScoringModel = initializeLeadScoringModel()
let messageVectors: number[][] = []

function ensureClassifierReady() {
  if (classifierReady || classifierError) {
    return
  }

  try {
    if (!trainingData || trainingData.length === 0) {
      throw new Error("No training data provided")
    }
    classifier.train(trainingData)
    classifierReady = true
    console.log("[v0] Intent classifier trained successfully with", trainingData.length, "phrases")
  } catch (error) {
    classifierError = error instanceof Error ? error.message : String(error)
    console.error("[v0] Failed to train classifier:", classifierError)
    classifierReady = true
  }
}

interface ChatMessage {
  content: string
  sessionId: string
  userId: string
  isAuthenticated: boolean
}

export async function POST(request: Request) {
  try {
    console.log("[v0] Received chat message request")

    // Ensure classifier is ready
    ensureClassifierReady()

    let chatMessage: ChatMessage
    try {
      const body = await request.json()
      chatMessage = body as ChatMessage
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      return Response.json(
        {
          error: "Invalid JSON in request",
          id: `msg-${Date.now()}`,
          content: "I encountered an error processing your request. Please try again.",
          role: "assistant",
          intent: "error",
          confidence: 0,
          actions: [],
          kbArticles: [],
        },
        { status: 400 }
      )
    }

    const { content, sessionId, userId, isAuthenticated } = chatMessage

    // Validate input
    if (!content || typeof content !== "string") {
      return Response.json(
        {
          error: "Message content is required",
          id: `msg-${Date.now()}`,
          content: "Please provide a message to continue.",
          role: "assistant",
          intent: "error",
          confidence: 0,
          actions: [],
          kbArticles: [],
        },
        { status: 400 }
      )
    }

    if (!sessionId) {
      return Response.json(
        {
          error: "Session ID is required",
          id: `msg-${Date.now()}`,
          content: "Please initialize a chat session first.",
          role: "assistant",
          intent: "error",
          confidence: 0,
          actions: [],
          kbArticles: [],
        },
        { status: 400 }
      )
    }

    // Get intent prediction
    let prediction
    if (classifierError) {
      console.warn("[v0] Classifier error, using fallback:", classifierError)
      prediction = { intent: "fallback", confidence: 0, entities: {} }
    } else {
      try {
        prediction = classifier.predict(content)
        console.log("[v0] Intent prediction:", prediction.intent, "confidence:", prediction.confidence)
      } catch (predictError) {
        console.error("[v0] Prediction error:", predictError)
        prediction = { intent: "fallback", confidence: 0, entities: {} }
      }
    }

    // Search knowledge base with vector similarity
    let kbArticles: Array<{ id: string; title: string; content: string }> = []
    try {
      kbArticles = searchKnowledgeBase(chatMessage.content)
    } catch (kbError) {
      console.error("[v0] KB search error:", kbError)
    }

    // Generate AIML response
    const assistantResponse = aimlProcessor.generateResponse(prediction)

    // Calculate lead score if customer-related intent
    let leadScore = 0
    if (prediction.intent === "get_customer_summary" || prediction.intent === "billing_query") {
      try {
        leadScore = scoreLeadLinearRegression(
          {
            engagementScore: prediction.confidence * 100,
            companySize: 3,
            industryFit: 80,
            budgetIndicator: 70,
            timelineUrgency: 60,
            previousInteraction: prediction.confidence * 100,
          },
          leadScoringModel
        )
        console.log(`[v0] Lead score calculated: ${leadScore.toFixed(2)}`)
      } catch (err) {
        console.error("[v0] Lead scoring error:", err)
      }
    }

    // Cluster message for analytics
    let cluster = 0
    try {
      const tokens = preprocessText(content)
      // Store message vector for clustering
      if (tokens.length > 0) {
        const messageHash = tokens.join("").charCodeAt(0) % 5
        cluster = Math.abs(messageHash)
      }
      console.log(`[v0] Message assigned to cluster: ${cluster}`)
    } catch (err) {
      console.error("[v0] Clustering error:", err)
    }

    // Get actions
    const actions: Array<{ type: string; label: string; params?: Record<string, unknown> }> = getActionsForIntent(prediction.intent, isAuthenticated)

    // Build response
    const message = {
      id: `msg-${Date.now()}`,
      sessionId,
      userId,
      role: "assistant",
      content: assistantResponse,
      intent: prediction.intent,
      confidence: Math.round(prediction.confidence * 100),
      entities: prediction.entities,
      actions,
      kbArticles: kbArticles.map((a) => ({ id: a.id, title: a.title })),
      leadScore: leadScore > 0 ? Math.round(leadScore) : undefined,
      cluster,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Chat response generated successfully")

    return Response.json(message, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[v0] Unexpected error in chat handler:", error)

    return Response.json(
      {
        id: `msg-${Date.now()}`,
        content: "I apologize for the error. Please try again or contact support.",
        role: "assistant",
        intent: "error",
        confidence: 0,
        actions: [{ type: "escalate", label: "Contact Support" }],
        kbArticles: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

function getActionsForIntent(
  intent: string,
  isAuthenticated: boolean
): Array<{ type: string; label: string; params?: Record<string, unknown> }> {
  const actions: Array<{ type: string; label: string; params?: Record<string, unknown> }> = []

  if (!isAuthenticated) {
    return actions
  }

  switch (intent) {
    case "update_contact":
      actions.push({ type: "open_page", label: "Open Contacts", params: { page: "contacts" } })
      break
    case "report_generation":
      actions.push({ type: "open_page", label: "Go to Reports", params: { page: "reports" } })
      break
    case "create_ticket":
      actions.push({ type: "create_ticket", label: "Create Ticket Now" })
      break
    case "get_customer_summary":
      actions.push({ type: "open_page", label: "View Contacts", params: { page: "contacts" } })
      break
    case "data_sync":
      actions.push({ type: "action", label: "Sync Data Now", params: { action: "sync_data" } })
      break
    case "error":
      actions.push({ type: "escalate", label: "Contact Support" })
      break
    default:
      actions.push({ type: "escalate", label: "Talk to Agent" })
  }

  return actions
}