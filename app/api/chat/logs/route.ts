// Get chat logs and analytics (admin only)
import { sessionManager } from "@/lib/chat/session-manager"

export async function GET(request: Request) {
  try {
    // In production, verify admin role here
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let sessions
    if (userId) {
      sessions = sessionManager.getUserSessions(userId)
    } else {
      sessions = sessionManager.getAllSessions()
    }

    // Sort by most recent first
    sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    // Apply limit
    const paginatedSessions = sessions.slice(0, limit)

    return Response.json(
      {
        sessions: paginatedSessions,
        total: sessions.length,
        analytics: sessionManager.getAnalytics(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching logs:", error)
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
