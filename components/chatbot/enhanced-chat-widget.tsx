"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, X, Send, Minimize2, Maximize2, MessageSquare, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { VectorStore, createSimpleEmbedding } from "@/lib/ml/vector-search"

const vectorStore = new VectorStore()

// Seed vector store with CRM knowledge
const initializeKnowledgeBase = () => {
  const crmDocuments = [
    {
      id: "product-crm-pro",
      text: "CRM Pro is our flagship enterprise CRM solution with advanced automation, AI insights, and unlimited contacts. Perfect for organizations with complex sales processes.",
      metadata: { category: "products", tier: "enterprise" },
    },
    {
      id: "product-crm-lite",
      text: "CRM Lite is a simplified CRM for small businesses with 1000 contacts limit, email integration, and basic automation. Great for startups.",
      metadata: { category: "products", tier: "starter" },
    },
    {
      id: "product-crm-mobile",
      text: "CRM Mobile provides on-the-go access to your CRM with offline capabilities, mobile-optimized interface, and push notifications.",
      metadata: { category: "products", tier: "mobile" },
    },
    {
      id: "faq-password",
      text: "To reset your password, click 'Forgot Password' on the login page, enter your email, and follow the verification link sent to your inbox.",
      metadata: { category: "faq", topic: "account" },
    },
    {
      id: "faq-payment",
      text: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers. Subscriptions auto-renew monthly unless cancelled.",
      metadata: { category: "faq", topic: "billing" },
    },
    {
      id: "faq-trial",
      text: "We offer a 14-day free trial with full access to all features. No credit card required. You can upgrade or cancel anytime.",
      metadata: { category: "faq", topic: "trial" },
    },
    {
      id: "faq-upgrade",
      text: "Upgrade your plan anytime by going to Settings > Billing > Plans. New charges are prorated based on your current cycle.",
      metadata: { category: "faq", topic: "billing" },
    },
    {
      id: "faq-support",
      text: "Contact support via email at support@crmmaster.com, through the in-app chat, or call +1-800-CRM-HELP. Average response time is under 2 hours.",
      metadata: { category: "faq", topic: "support" },
    },
    {
      id: "feature-automation",
      text: "CRM Pro includes workflow automation, email sequences, lead scoring, and custom triggers to automate repetitive tasks.",
      metadata: { category: "features", name: "automation" },
    },
    {
      id: "feature-ai-insights",
      text: "AI Insights provides predictive analytics, lead scoring, customer segmentation using machine learning, and sentiment analysis of communications.",
      metadata: { category: "features", name: "ai" },
    },
  ]

  vectorStore.addBatch(
    crmDocuments.map((doc) => ({
      ...doc,
      embedding: createSimpleEmbedding(doc.text),
    })),
  )
}

// Call this once on component mount
initializeKnowledgeBase()

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  sources?: Array<{ id: string; text: string; relevance: number }>
}

export default function EnhancedChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content:
        "Hello! I'm your AI-powered CRM assistant with access to CRM data and knowledge. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const relevantDocs = vectorStore.searchByText(input, 3)
      const contextText = relevantDocs.map((doc) => `Context: ${doc.text}`).join("\n\n")

      const conversationContext = messages
        .slice(-4)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      const systemPrompt = `
You are a helpful, knowledgeable CRM assistant for CRMaster. You have access to the following company knowledge and documentation:

${contextText || "No specific documentation found for this query."}

Guidelines:
- Answer questions based on the provided context and documentation
- If you don't have the answer, suggest contacting support
- Keep responses concise, professional, and friendly
- For product/feature questions, reference the specific information provided
- Always be helpful and try to solve the user's problem
- If asked about multiple topics, address each separately
- Provide actionable recommendations when possible
      `

      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: input,
        system: systemPrompt,
      })

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: text,
        role: "assistant",
        timestamp: new Date(),
        sources: relevantDocs.map((doc) => ({
          id: doc.id,
          text: doc.text,
          relevance: 0.95,
        })),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          "I encountered an error processing your request. Please try again or contact our support team at support@crmmaster.com.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        title="Open AI Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80 shadow-xl transition-all duration-300 ease-in-out",
        isMinimized ? "h-14" : "h-96",
      )}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary-foreground/10">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">CRM AI Assistant</CardTitle>
            <p className="text-xs opacity-75">Powered by AI</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-3 overflow-y-auto h-[calc(100%-7rem)]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "flex-row-reverse" : "")}>
                  <Avatar className="h-8 w-8 mt-0.5">
                    {message.role === "assistant" ? (
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback>U</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col gap-1 max-w-[70%]">
                    <div
                      className={cn(
                        "rounded-lg p-3 text-sm leading-relaxed",
                        message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                      )}
                    >
                      {message.content}
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="text-xs text-muted-foreground px-2">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Based on CRM knowledge
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
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

          <CardFooter className="p-3 pt-0">
            <div className="relative w-full">
              <Input
                placeholder="Ask about products, features, pricing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
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
