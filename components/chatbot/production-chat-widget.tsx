"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, X, Send, Minimize2, Maximize2, MessageSquare, CheckCircle2, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  intent?: string
  confidence?: number     
  cluster?: number    
  actions?: Array<{ type: string; label: string; params?: Record<string, unknown> }>
  kbArticles?: Array<{ id: string; title: string }>
}

interface ChatAction {
  type: string
  label: string
  params?: Record<string, unknown>
}

interface ProductionChatWidgetProps {
  isAuthenticated?: boolean
  userId?: string
}

export default function ProductionChatWidget({
  isAuthenticated = false,
  userId = "anonymous",
}: ProductionChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: isAuthenticated
        ? "Welcome back! I can help you with contact updates, reports, support tickets, and more. What can I do for you?"
        : "Hello! I'm your CRM assistant. I can answer questions about our products and help with support. How can I help?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await fetch("/api/chat/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, isAuthenticated }),
        })
        const data = await response.json()
        setSessionId(data.sessionId)
        console.log("[Chat] Session initialized:", data.sessionId)
      } catch (error) {
        console.error("[Chat] Failed to initialize session:", error)
      }
    }

    initChat()
  }, [userId, isAuthenticated])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 100) + 'px'
    }
  }, [input])

  // ✅ FIX #1: CAPTURE INPUT VALUE BEFORE CLEARING STATE
  const handleSendMessage = async () => {
    const trimmedInput = input.trim()
    
    if (!trimmedInput || !sessionId) {
      console.warn('[Chat] Cannot send: missing input or sessionId')
      return
    }

    // ✅ CAPTURE INPUT IMMEDIATELY
    const userInput = trimmedInput

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: userInput,  // ✅ Use captured value
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      if (!sessionId) {
        throw new Error('Session not initialized')
      }

      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: userInput,  // ✅ USE CAPTURED VALUE, NOT input
          sessionId,
          userId,
          isAuthenticated,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: data.id || `assistant-${Date.now()}`,
        content: data.content || 'No response',
        role: "assistant",
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence ?? 0,
        cluster: data.cluster,
        actions: data.actions || [],
        kbArticles: data.kbArticles || [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('[Chat] Error:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: error instanceof Error ? error.message : 'Unknown error. Please try again.',
        role: "assistant",
        timestamp: new Date(),
        intent: 'error',  // ✅ Mark as error for styling
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // ✅ FIX #4: AUTO-FOCUS AND SCROLL INTO VIEW
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }

  const handleAction = (action: ChatAction) => {
    console.log("[Chat] Executing action:", action)

    switch (action.type) {
      case "open_page":
        window.location.href = `/${action.params?.page}`
        break
      case "create_ticket":
        window.location.href = "/dashboard/support/new-ticket"
        break
      case "action":
        console.log("[Chat] Running action:", action.params?.action)
        break
      case "escalate":
        setInput("Can I speak to a human agent?")
        break
      default:
        console.log("[Chat] Unknown action type:", action.type)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          // INSTANT FOCUS + SCROLL TO INPUT
          setTimeout(() => {
            const input = document.querySelector('textarea[placeholder="Ask me anything..."]') as HTMLTextAreaElement
            if (input) {
              input.focus()
              input.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          }, 100)
        }}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-50 shadow-xl transition-all duration-300 ease-in-out flex flex-col",
        isMinimized ? "h-14 w-80" : "h-[600px] w-96",
      )}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary-foreground/10">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">CRM Assistant</CardTitle>
            <p className="text-xs text-primary-foreground/70">Powered by NLP</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto flex-1 min-h-0">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div
                    className={cn("flex gap-2 max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
                  >
                    <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback>U</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      {/* ✅ FIX #6: ADD ERROR MESSAGE STYLING */}
                      <div
                        className={cn(
                          "rounded-lg p-3 text-sm break-words",
                          message.role === "assistant"
                            ? message.intent === 'error'
                              ? "bg-red-100 text-red-900 border border-red-300"
                              : "bg-muted"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>

                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-10">
                      {message.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 bg-transparent"
                          onClick={() => handleAction(action)}
                        >
                          {action.type === "open_page" && <LinkIcon className="h-3 w-3 mr-1" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {message.kbArticles && message.kbArticles.length > 0 && (
                    <div className="mt-2 ml-10 text-xs space-y-1">
                      <p className="text-muted-foreground font-semibold">Relevant articles:</p>
                      {message.kbArticles.map((article) => (
                        <div key={article.id} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600 flex-shrink-0" />
                          <a href={`/kb/${article.id}`} className="text-blue-600 hover:underline">
                            {article.title}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-3 pt-0 flex-shrink-0 border-t">
            <div className="flex w-full gap-2 items-end">
              {/* ✅ FIX #5: REMOVED REDUNDANT onClick HANDLER */}
              <textarea
                ref={textareaRef}
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                disabled={isLoading}
                aria-label="Chat input"
                rows={1}
                style={{ overflow: 'hidden' }}
              />
              <Button
                size="icon"
                className="rounded-lg flex-shrink-0"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}