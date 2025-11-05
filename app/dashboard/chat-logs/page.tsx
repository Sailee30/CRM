"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Download, Eye } from "lucide-react"

interface ChatSession {
  id: string
  userId: string
  isAuthenticated: boolean
  startedAt: string
  updatedAt: string
  messages: { id: string; content: string; role: string; intent?: string }[]
  resolved: boolean
}

interface Analytics {
  totalSessions: number
  resolvedSessions: number
  avgMessagesPerSession: number
  authenticatedSessions: number
  anonymousSessions: number
}

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/chat/logs")
      const data = await response.json()
      setSessions(data.sessions)
      setAnalytics(data.analytics)
    } catch (error) {
      console.error("[v0] Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(
    (session) => session.userId.includes(searchTerm) || session.id.includes(searchTerm),
  )

  const chartData = [
    { name: "Mon", sessions: 24, resolved: 18 },
    { name: "Tue", sessions: 30, resolved: 25 },
    { name: "Wed", sessions: 28, resolved: 22 },
    { name: "Thu", sessions: 35, resolved: 30 },
    { name: "Fri", sessions: 32, resolved: 28 },
  ]

  const pieData = analytics
    ? [
        { name: "Authenticated", value: analytics.authenticatedSessions },
        { name: "Anonymous", value: analytics.anonymousSessions },
      ]
    : []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chat Logs & Analytics</h2>
          <p className="text-muted-foreground">Monitor conversations and chat performance</p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Chat Logs</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {analytics && (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalSessions}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{analytics.resolvedSessions}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.avgMessagesPerSession.toFixed(1)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Authenticated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.authenticatedSessions}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Anonymous</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.anonymousSessions}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sessions Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sessions" stroke="#3b82f6" />
                          <Line type="monotone" dataKey="resolved" stroke="#10b981" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#6b7280" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat Sessions</CardTitle>
                <CardDescription>View and search all chat conversations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by user ID or session ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="space-y-2">
                  {loading ? (
                    <p className="text-center text-muted-foreground py-8">Loading...</p>
                  ) : filteredSessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No sessions found</p>
                  ) : (
                    filteredSessions.map((session) => (
                      <Card key={session.id} className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <p className="font-medium text-sm">Session {session.id.substring(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">User: {session.userId}</p>
                            <p className="text-xs text-muted-foreground">Messages: {session.messages.length}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.startedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                session.resolved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {session.resolved ? "Resolved" : "Open"}
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
