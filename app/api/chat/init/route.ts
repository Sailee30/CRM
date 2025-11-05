// Initialize chat session
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    let body = {}
    try {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > 0) {
        body = await request.json()
      }
    } catch (e) {
      // Empty body is OK, use defaults
    }

    const { userId = "anonymous", isAuthenticated = false } = body as any

    const sessionId = uuidv4()
    const session = {
      id: sessionId,
      userId: userId || "anonymous",
      isAuthenticated,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    }

    console.log("[v0] Chat session initialized:", sessionId)

    return Response.json({ sessionId, session }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error initializing chat:", error)
    return Response.json({ error: "Failed to initialize chat" }, { status: 500 })
  }
}