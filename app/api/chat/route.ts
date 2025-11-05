// app/api/chat/route.ts
// Chat API endpoint with NLP and K-means clustering

import { NextRequest, NextResponse } from 'next/server'
import {
  handleChatMessage,
  initializeChatbot,
  getChatAnalytics,
  getIntentClusteringInsights,
} from '@/lib/chat/chat-handler'

/**
 * POST /api/chat
 * Handle chat messages and return AI responses
 */
export async function POST(request: NextRequest) {
  try {
    // Initialize chatbot on first request
    initializeChatbot()

    const body = await request.json()
    const { message, sessionId, userId, isAuthenticated = false } = body

    // Validation
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Process message
    const result = await handleChatMessage(
      userId,
      sessionId,
      message.trim(),
      isAuthenticated
    )

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/chat/analytics
 * Get chat analytics and insights
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    initializeChatbot()

    if (type === 'clustering') {
      const insights = getIntentClusteringInsights()
      return NextResponse.json(
        {
          success: true,
          data: insights,
        },
        { status: 200 }
      )
    }

    // Default: return general analytics
    const analytics = getChatAnalytics()
    return NextResponse.json(
      {
        success: true,
        data: analytics,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}