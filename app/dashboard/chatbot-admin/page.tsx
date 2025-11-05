"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react"

interface Intent {
  name: string
  phrases: string[]
  responses: string[]
}

interface QA {
  id: string
  question: string
  answer: string
  category: string
}

export default function ChatbotAdminPage() {
  const [intents, setIntents] = useState<Intent[]>([
    {
      name: "update_contact",
      phrases: ["I can't update contact", "when I click save nothing happens", "change phone number for John Doe"],
      responses: ["I can help you troubleshoot contact updates", "Let me guide you through the process"],
    },
  ])

  const [qas, setQas] = useState<QA[]>([
    {
      id: "1",
      question: "How do I update a contact?",
      answer: "Navigate to Contacts, click Edit, make changes, and click Save.",
      category: "Contacts",
    },
  ])

  const [newPhrase, setNewPhrase] = useState("")
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [selectedIntent, setSelectedIntent] = useState<string>(intents[0]?.name || "")
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "success" | "error">("idle")

  const handleAddPhrase = () => {
    if (newPhrase.trim() && selectedIntent) {
      setIntents(
        intents.map((intent) =>
          intent.name === selectedIntent ? { ...intent, phrases: [...intent.phrases, newPhrase] } : intent,
        ),
      )
      setNewPhrase("")
    }
  }

  const handleRemovePhrase = (intentName: string, phraseIdx: number) => {
    setIntents(
      intents.map((intent) =>
        intent.name === intentName ? { ...intent, phrases: intent.phrases.filter((_, i) => i !== phraseIdx) } : intent,
      ),
    )
  }

  const handleAddQA = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      setQas([
        ...qas,
        {
          id: Date.now().toString(),
          question: newQuestion,
          answer: newAnswer,
          category: "General",
        },
      ])
      setNewQuestion("")
      setNewAnswer("")
    }
  }

  const handleRemoveQA = (id: string) => {
    setQas(qas.filter((qa) => qa.id !== id))
  }

  const handleRetrain = async () => {
    setTrainingStatus("training")
    try {
      const trainingData = intents.flatMap((intent) =>
        intent.phrases.map((phrase) => ({ phrase, intent: intent.name })),
      )

      const response = await fetch("/api/chat/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customTrainingData: trainingData, includeDefaults: true }),
      })

      if (response.ok) {
        setTrainingStatus("success")
        setTimeout(() => setTrainingStatus("idle"), 3000)
      } else {
        setTrainingStatus("error")
      }
    } catch (error) {
      console.error("[v0] Retraining error:", error)
      setTrainingStatus("error")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chatbot Admin</h2>
          <p className="text-muted-foreground">Manage intents, training phrases, and Q&A for the CRM assistant</p>
        </div>

        {trainingStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Model trained successfully!</AlertDescription>
          </Alert>
        )}

        {trainingStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Training failed. Please try again.</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="intents" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="intents">Intents</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          {/* Intents Tab */}
          <TabsContent value="intents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Intent Management</CardTitle>
                <CardDescription>Manage conversation intents and training phrases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Intent</label>
                  <select
                    value={selectedIntent}
                    onChange={(e) => setSelectedIntent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    {intents.map((intent) => (
                      <option key={intent.name} value={intent.name}>
                        {intent.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedIntent && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Training Phrases</label>
                      <div className="space-y-2">
                        {intents
                          .find((i) => i.name === selectedIntent)
                          ?.phrases.map((phrase, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 border rounded bg-muted/50">
                              <span className="text-sm">{phrase}</span>
                              <Button size="sm" variant="ghost" onClick={() => handleRemovePhrase(selectedIntent, idx)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Add new training phrase..."
                        value={newPhrase}
                        onChange={(e) => setNewPhrase(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddPhrase()}
                      />
                      <Button onClick={handleAddPhrase}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Q&A Management</CardTitle>
                <CardDescription>Manage frequently asked questions and answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Question</label>
                    <Input
                      placeholder="Enter question..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Answer</label>
                    <Textarea
                      placeholder="Enter answer..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddQA} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Q&A
                  </Button>
                </div>

                <div className="space-y-2 mt-6">
                  <h4 className="font-medium">Existing Q&A</h4>
                  {qas.map((qa) => (
                    <Card key={qa.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-sm">{qa.question}</p>
                          <p className="text-xs text-muted-foreground">{qa.answer}</p>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleRemoveQA(qa.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Training</CardTitle>
                <CardDescription>Train and manage the NLP intent classifier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">Model Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Model Version:</span> v1.0
                    </p>
                    <p>
                      <span className="text-muted-foreground">Last Trained:</span> {new Date().toLocaleString()}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Training Samples:</span>{" "}
                      {intents.reduce((sum, i) => sum + i.phrases.length, 0)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Active Intents:</span> {intents.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3">
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                    </Card>
                    <Card className="p-3">
                      <p className="text-xs text-muted-foreground">Precision</p>
                      <p className="text-2xl font-bold text-blue-600">91.7%</p>
                    </Card>
                  </div>
                </div>

                <Button onClick={handleRetrain} disabled={trainingStatus === "training"} className="w-full" size="lg">
                  {trainingStatus === "training" ? "Training..." : "Retrain Model"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
