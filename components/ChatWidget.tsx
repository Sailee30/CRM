// components/ChatWidget.tsx
// Example React component using the NLP chat API

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  intent?: string
  confidence?: number
}

interface ChatResponse {
  response: string
  intent: string
  confidence: number
  articles: Array<{ id: string; title: string }>
  cluster?: number
}

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const [userId] = useState(() => uuidv4())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId,
          userId,
          isAuthenticated: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const { data } = (await response.json()) as { data: ChatResponse }

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-bold">AI</span>
        </div>
        <div>
          <h2 className="font-semibold">CRM Assistant</h2>
          <p className="text-sm text-blue-100">Powered by NLP</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.intent && (
                  <p className="text-xs mt-1 opacity-70">
                    Intent: {message.intent} ({message.confidence}%)
                  </p>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Example usage in a page
 * 
 * import { ChatWidget } from '@/components/ChatWidget'
 * 
 * export default function ChatPage() {
 *   return (
 *     <div className="h-screen bg-gray-100 p-4">
 *       <div className="max-w-2xl mx-auto h-full">
 *         <ChatWidget />
 *       </div>
 *     </div>
 *   )
 * }
 */