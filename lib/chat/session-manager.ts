// Chat session and conversation history management
import { v4 as uuidv4 } from "uuid"

export interface ChatMessage {
  id: string
  sessionId: string
  content: string
  role: "user" | "assistant"
  intent?: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  userId: string
  isAuthenticated: boolean
  startedAt: Date
  updatedAt: Date
  messages: ChatMessage[]
  resolved: boolean
  ticketId?: string
}

// In-memory session storage (in production, use database)
const sessions = new Map<string, ChatSession>()

export const sessionManager = {
  // Create new session
  createSession(userId: string, isAuthenticated: boolean): ChatSession {
    const session: ChatSession = {
      id: uuidv4(),
      userId,
      isAuthenticated,
      startedAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      resolved: false,
    }
    sessions.set(session.id, session)
    return session
  },

  // Get session by ID
  getSession(sessionId: string): ChatSession | null {
    return sessions.get(sessionId) || null
  },

  // Add message to session
  addMessage(sessionId: string, message: Omit<ChatMessage, "id">): ChatMessage {
    const session = sessions.get(sessionId)
    if (!session) throw new Error("Session not found")

    const chatMessage: ChatMessage = {
      id: uuidv4(),
      ...message,
    }
    session.messages.push(chatMessage)
    session.updatedAt = new Date()
    return chatMessage
  },

  // Get all messages for session
  getMessages(sessionId: string): ChatMessage[] {
    const session = sessions.get(sessionId)
    return session?.messages || []
  },

  // Mark session as resolved
  resolveSession(sessionId: string, ticketId?: string): void {
    const session = sessions.get(sessionId)
    if (session) {
      session.resolved = true
      session.updatedAt = new Date()
      if (ticketId) session.ticketId = ticketId
    }
  },

  // Get all sessions (for analytics)
  getAllSessions(): ChatSession[] {
    return Array.from(sessions.values())
  },

  // Get sessions for user
  getUserSessions(userId: string): ChatSession[] {
    return Array.from(sessions.values()).filter((s) => s.userId === userId)
  },

  // Get analytics data
  getAnalytics() {
    const allSessions = Array.from(sessions.values())
    return {
      totalSessions: allSessions.length,
      resolvedSessions: allSessions.filter((s) => s.resolved).length,
      avgMessagesPerSession:
        allSessions.length > 0 ? allSessions.reduce((sum, s) => sum + s.messages.length, 0) / allSessions.length : 0,
      authenticatedSessions: allSessions.filter((s) => s.isAuthenticated).length,
      anonymousSessions: allSessions.filter((s) => !s.isAuthenticated).length,
    }
  },
}
