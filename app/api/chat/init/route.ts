import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    
    try {
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > 0) {
        body = await request.json()
      }
    } catch (e) {
      // Empty body is OK, use defaults
      console.log("[v0] No body in request, using defaults")
    }

    const { userId = "anonymous", isAuthenticated = false } = body

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const session = {
      id: sessionId,
      userId: userId || "anonymous",
      isAuthenticated,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    }

    console.log("[v0] Chat session initialized:", sessionId)

    return NextResponse.json({ sessionId, session }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error initializing chat:", error)
    return NextResponse.json({ error: "Failed to initialize chat" }, { status: 500 })
  }
}