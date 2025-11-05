"use client"

import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Send, Paperclip, Mic, Video, Phone, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for contacts
const contacts = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Let me know when you've reviewed the proposal",
    timestamp: "10:32 AM",
    unread: 2,
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp",
  },
  {
    id: "2",
    name: "Sam Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "I've sent you the updated marketing materials",
    timestamp: "Yesterday",
    unread: 0,
    email: "sam@example.com",
    phone: "+1 (555) 765-4321",
    company: "Marketing Pro",
  },
  {
    id: "3",
    name: "Taylor Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thanks for your help with the design review",
    timestamp: "Yesterday",
    unread: 0,
    email: "taylor@example.com",
    phone: "+1 (555) 987-6543",
    company: "Design Studio",
  },
  {
    id: "4",
    name: "Jamie Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Can we schedule a call to discuss the contract?",
    timestamp: "Monday",
    unread: 0,
    email: "jamie@example.com",
    phone: "+1 (555) 456-7890",
    company: "Finance Inc.",
  },
  {
    id: "5",
    name: "Jordan Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "I'll be in the office tomorrow if you want to meet",
    timestamp: "Monday",
    unread: 0,
    email: "jordan@example.com",
    phone: "+1 (555) 789-0123",
    company: "Healthcare Plus",
  },
  {
    id: "6",
    name: "TechCorp Team",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Alex: We need to finalize the implementation timeline",
    timestamp: "Tuesday",
    unread: 5,
    isGroup: true,
    members: ["Alex Johnson", "Jamie Brown", "You"],
  },
  {
    id: "7",
    name: "Marketing Strategy",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Sam: Let's review the Q4 campaign next week",
    timestamp: "Tuesday",
    unread: 0,
    isGroup: true,
    members: ["Sam Williams", "Jordan Miller", "Taylor Smith", "You"],
  },
]

// Sample conversation data
const initialConversations = {
  "1": [
    {
      id: "m1",
      sender: "Alex Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Hi there! I wanted to follow up on our meeting yesterday. Have you had a chance to review the proposal I sent?",
      timestamp: "10:15 AM",
      status: "read",
    },
    {
      id: "m2",
      sender: "You",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Hey Alex! I'm going through it right now. The pricing structure looks good, but I had a question about the implementation timeline.",
      timestamp: "10:20 AM",
      status: "read",
    },
    {
      id: "m3",
      sender: "Alex Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Of course! What specifically would you like to know about the timeline?",
      timestamp: "10:22 AM",
      status: "read",
    },
    {
      id: "m4",
      sender: "You",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "I'm wondering if we can accelerate the initial setup phase. Our team is ready to go and we'd like to launch sooner if possible.",
      timestamp: "10:25 AM",
      status: "read",
    },
    {
      id: "m5",
      sender: "Alex Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "I think we can definitely work with that. Let me check with our implementation team and see if we can move up the schedule.",
      timestamp: "10:30 AM",
      status: "read",
    },
    {
      id: "m6",
      sender: "Alex Johnson",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Just heard back from the team. We can start the setup next Monday instead of waiting until the end of the month. Would that work for you?",
      timestamp: "10:32 AM",
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "m1",
      sender: "Sam Williams",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Hi! I've just sent over the updated marketing materials for your review.",
      timestamp: "Yesterday, 2:45 PM",
      status: "read",
    },
    {
      id: "m2",
      sender: "You",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Thanks Sam! I'll take a look at them this afternoon.",
      timestamp: "Yesterday, 3:00 PM",
      status: "read",
    },
    {
      id: "m3",
      sender: "Sam Williams",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: "Great! Let me know if you need any changes or have questions.",
      timestamp: "Yesterday, 3:05 PM",
      status: "read",
    },
    {
      id: "m4",
      sender: "Sam Williams",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content:
        "Also, I've included some new social media templates that I think would work well for your upcoming campaign.",
      timestamp: "Yesterday, 3:10 PM",
      status: "read",
    },
  ],
}

// Message templates for quick replies
const messageTemplates = [
  "Thanks for your message. I'll get back to you as soon as possible.",
  "I've reviewed your proposal and would like to schedule a call to discuss further.",
  "Could you please provide more information about this?",
  "I'm available for a meeting tomorrow between 10 AM and 2 PM.",
  "I've attached the requested documents for your review.",
]

export default function MessagesPage() {
  const [activeContact, setActiveContact] = useState(contacts[0])
  const [conversations, setConversations] = useState(initialConversations)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showTemplates, setShowTemplates] = useState(false)
  const messagesEndRef = useRef(null)
  const { toast } = useToast()

  // Filter contacts based on search term and status
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    scrollToBottom()
  }, [activeContact, conversations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: `m${Date.now()}`,
      sender: "You",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      content: message,
      timestamp: "Just now",
      status: "sent",
    }

    // Update conversations state
    setConversations((prev) => {
      const contactId = activeContact.id
      const updatedConversation = prev[contactId] ? [...prev[contactId], newMessage] : [newMessage]

      return {
        ...prev,
        [contactId]: updatedConversation,
      }
    })

    // Clear input
    setMessage("")

    // Simulate reply after delay (for demo purposes)
    setTimeout(() => {
      const replyMessage = {
        id: `m${Date.now() + 1}`,
        sender: activeContact.name,
        senderAvatar: activeContact.avatar,
        content: `Thanks for your message! This is an automated reply for demonstration purposes.`,
        timestamp: "Just now",
        status: "delivered",
      }

      setConversations((prev) => ({
        ...prev,
        [activeContact.id]: [...prev[activeContact.id], replyMessage],
      }))

      // Update unread count for demo purposes
      const updatedContacts = contacts.map((contact) =>
        contact.id === activeContact.id ? { ...contact, unread: 0 } : contact,
      )
    }, 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleContactClick = (contact) => {
    setActiveContact(contact)

    // Mark messages as read when opening conversation
    const updatedContacts = contacts.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c))
  }

  const handleAttachFile = () => {
    toast({
      title: "File attachment",
      description: "File attachment functionality would be implemented here.",
    })
  }

  const handleVoiceMessage = () => {
    toast({
      title: "Voice message",
      description: "Voice message recording functionality would be implemented here.",
    })
  }

  const handleVideoCall = () => {
    toast({
      title: "Video call",
      description: `Initiating video call with ${activeContact.name}...`,
    })
  }

  const handleAudioCall = () => {
    toast({
      title: "Audio call",
      description: `Initiating audio call with ${activeContact.name}...`,
    })
  }

  const handleTemplateSelect = (template) => {
    setMessage(template)
    setShowTemplates(false)
  }

  const getStatusIndicator = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        )
      case "delivered":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <polyline points="9 10 4 15 9 20"></polyline>
            <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
          </svg>
        )
      case "read":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M18 6L7 17l-5-5"></path>
            <path d="M22 10L7 17l-5-5"></path>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">Communicate with your contacts across multiple channels</p>
        </div>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="transform transition-all duration-300 hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex h-[75vh]">
                  {/* Contacts sidebar */}
                  <div className="w-full max-w-xs border-r">
                    <div className="p-4 border-b">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search contacts..."
                          className="pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="away">Away</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="h-3.5 w-3.5 mr-1" /> Filter
                        </Button>

                        <Button variant="outline" size="sm" className="h-8">
                          <Plus className="h-3.5 w-3.5 mr-1" /> New
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-y-auto h-[calc(75vh-73px)]">
                      {filteredContacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                          <p>No contacts found</p>
                          <Button
                            variant="link"
                            onClick={() => {
                              setSearchTerm("")
                              setStatusFilter("all")
                            }}
                          >
                            Clear filters
                          </Button>
                        </div>
                      ) : (
                        filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            className={cn(
                              "flex items-center gap-3 p-3 cursor-pointer transition-colors",
                              activeContact.id === contact.id ? "bg-muted" : "hover:bg-muted/50",
                            )}
                            onClick={() => handleContactClick(contact)}
                          >
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={contact.avatar} alt={contact.name} />
                                <AvatarFallback>{contact.name[0]}</AvatarFallback>
                              </Avatar>
                              <span
                                className={cn(
                                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                  getStatusIndicator(contact.status),
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">{contact.name}</p>
                                <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                            </div>
                            {contact.unread > 0 && <Badge className="ml-auto">{contact.unread}</Badge>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 flex flex-col">
                    {/* Chat header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                          <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{activeContact.name}</h3>
                            <span className={cn("h-2 w-2 rounded-full", getStatusIndicator(activeContact.status))} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {activeContact.isGroup
                              ? `${activeContact.members.join(", ")}`
                              : activeContact.status === "online"
                                ? "Online"
                                : activeContact.status === "away"
                                  ? "Away"
                                  : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={handleAudioCall}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Contact</DropdownMenuItem>
                            <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Clear Conversation</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {conversations[activeContact.id]?.length > 0 ? (
                        conversations[activeContact.id].map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3 max-w-[80%]",
                              msg.sender === "You" ? "ml-auto flex-row-reverse" : "",
                            )}
                          >
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={msg.senderAvatar} alt={msg.sender} />
                              <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div
                                className={cn(
                                  "rounded-lg p-3",
                                  msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted",
                                )}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                                {msg.sender === "You" && getMessageStatus(msg.status)}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation by sending a message</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message input */}
                    <div className="border-t p-4">
                      <div className="relative">
                        <Input
                          placeholder="Type a message..."
                          className="pr-24"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <div className="absolute right-1 top-1 flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAttachFile}>
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleVoiceMessage}>
                            <Mic className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowTemplates(!showTemplates)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                              <line x1="8" y1="8" x2="16" y2="8"></line>
                              <line x1="8" y1="16" x2="12" y2="16"></line>
                            </svg>
                          </Button>
                        </div>
                      </div>

                      {showTemplates && (
                        <div className="mt-2 p-2 border rounded-md bg-background">
                          <p className="text-xs font-medium mb-1">Quick Replies</p>
                          <div className="space-y-1">
                            {messageTemplates.map((template, index) => (
                              <div
                                key={index}
                                className="text-sm p-2 hover:bg-muted rounded cursor-pointer"
                                onClick={() => handleTemplateSelect(template)}
                              >
                                {template}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end mt-2">
                        <Button onClick={handleSendMessage} className="gap-2">
                          Send <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-4"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <p className="text-lg font-medium mb-2">Email Integration</p>
                  <p className="text-center max-w-md mb-4">
                    Connect your email account to send and receive emails directly from the CRM.
                  </p>
                  <Button>Connect Email Account</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-4"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p className="text-lg font-medium mb-2">SMS Integration</p>
                  <p className="text-center max-w-md mb-4">
                    Connect your SMS provider to send and receive text messages directly from the CRM.
                  </p>
                  <Button>Connect SMS Provider</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
