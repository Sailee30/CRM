"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot, X, Send, Minimize2, Maximize2, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Sample CRM data for the chatbot to use
const crmData = {
  products: [
    { id: 1, name: "CRM Pro", description: "Our flagship CRM solution for enterprise customers", price: "$99/month" },
    { id: 2, name: "CRM Lite", description: "Simplified CRM for small businesses", price: "$49/month" },
    { id: 3, name: "CRM Mobile", description: "On-the-go CRM solution", price: "$29/month" },
  ],
  faq: [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for all our plans with no credit card required.",
    },
    {
      question: "How can I upgrade my plan?",
      answer: "You can upgrade your plan by going to Settings > Billing > Upgrade Plan.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team via email at support@crmmaster.com or through the chat widget on our website.",
    },
  ],
}

// Type definitions for messages
type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content: "Hello! I'm your CRM assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
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
      // Create context from previous messages
      const conversationContext = messages
        .slice(-5)
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      // Create a system prompt with CRM knowledge
      const systemPrompt = `
        You are a helpful CRM assistant for CRMaster. Answer questions based on the following CRM data:
        
        PRODUCTS:
        ${crmData.products.map((p) => `- ${p.name}: ${p.description} (${p.price})`).join("\n")}
        
        FAQ:
        ${crmData.faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}
        
        If you don't know the answer, politely say so and offer to connect the user with a human agent.
        Keep responses concise, professional, and helpful. Use a friendly tone.
      `

      // Generate response using AI SDK
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: input,
        system: systemPrompt,
      })

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: text,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I encountered an error. Please try again or contact our support team.",
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
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Chatbot" />
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm font-medium">CRM Assistant</CardTitle>
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
                <div
                  key={message.id}
                  className={cn("flex gap-2 max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
                >
                  <Avatar className="h-8 w-8 mt-0.5">
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
                  <div
                    className={cn(
                      "rounded-lg p-2 text-sm",
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                    )}
                  >
                    {message.content}
                  </div>
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

          <CardFooter className="p-3 pt-0">
            <div className="relative w-full">
              <Input
                placeholder="Type a message..."
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
