"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Plus,
  UserPlus,
  Calendar,
  MoreHorizontal,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DealForm from "@/components/sales/deal-form"
import SalesForecasting from "@/components/dashboard/sales-forecasting"

// Sample data
const initialDeals = {
  prospecting: [
    {
      id: "d1",
      title: "Software License - TechCorp",
      value: 24000,
      client: "TechCorp",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Nov 15, 2024",
      owner: "Alex Johnson",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 20,
      tags: ["Software", "Enterprise"],
      activities: 5,
      lastActivity: "2 days ago",
      nextStep: "Product demo",
    },
    {
      id: "d2",
      title: "Annual Subscription - Finance Pulse",
      value: 18500,
      client: "Finance Pulse",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Nov 22, 2024",
      owner: "Sam Williams",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 15,
      tags: ["Finance", "Subscription"],
      activities: 3,
      lastActivity: "Yesterday",
      nextStep: "Follow-up call",
    },
  ],
  qualification: [
    {
      id: "d3",
      title: "Marketing Platform - CreativeFlow",
      value: 32000,
      client: "CreativeFlow",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Dec 5, 2024",
      owner: "Taylor Smith",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 35,
      tags: ["Marketing", "SaaS"],
      activities: 8,
      lastActivity: "Today",
      nextStep: "Technical assessment",
    },
    {
      id: "d9",
      title: "Data Analytics Suite - InsightCorp",
      value: 42000,
      client: "InsightCorp",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Dec 10, 2024",
      owner: "Jordan Miller",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 40,
      tags: ["Analytics", "Enterprise"],
      activities: 6,
      lastActivity: "3 days ago",
      nextStep: "Proposal review",
    },
  ],
  proposal: [
    {
      id: "d4",
      title: "Enterprise Solution - MegaCorp",
      value: 85000,
      client: "MegaCorp",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Nov 28, 2024",
      owner: "Alex Johnson",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 60,
      tags: ["Enterprise", "Solution"],
      activities: 12,
      lastActivity: "Yesterday",
      nextStep: "Executive presentation",
    },
    {
      id: "d5",
      title: "Consulting Package - InnovateNow",
      value: 47500,
      client: "InnovateNow",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Dec 12, 2024",
      owner: "Jordan Miller",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 55,
      tags: ["Consulting", "Startup"],
      activities: 7,
      lastActivity: "4 days ago",
      nextStep: "Scope finalization",
    },
  ],
  negotiation: [
    {
      id: "d6",
      title: "Analytics Suite - DataDriven",
      value: 54000,
      client: "DataDriven",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Nov 30, 2024",
      owner: "Sam Williams",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 80,
      tags: ["Analytics", "Enterprise"],
      activities: 15,
      lastActivity: "Today",
      nextStep: "Contract review",
    },
    {
      id: "d10",
      title: "Security Implementation - SecureBank",
      value: 68000,
      client: "SecureBank",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Dec 8, 2024",
      owner: "Taylor Smith",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 75,
      tags: ["Security", "Financial"],
      activities: 10,
      lastActivity: "Yesterday",
      nextStep: "Final negotiation",
    },
  ],
  closed: [
    {
      id: "d7",
      title: "Security Package - SecureTech",
      value: 38000,
      client: "SecureTech",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Completed",
      owner: "Jamie Brown",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 100,
      tags: ["Security", "Technology"],
      activities: 18,
      lastActivity: "1 week ago",
      nextStep: "Implementation",
    },
    {
      id: "d8",
      title: "Support Contract - HealthPlus",
      value: 29500,
      client: "HealthPlus",
      clientAvatar: "/placeholder.svg?height=32&width=32",
      dueDate: "Completed",
      owner: "Taylor Smith",
      ownerAvatar: "/placeholder.svg?height=24&width=24",
      probability: 100,
      tags: ["Healthcare", "Support"],
      activities: 14,
      lastActivity: "2 weeks ago",
      nextStep: "Onboarding",
    },
  ],
}

const stages = {
  prospecting: {
    label: "Prospecting",
    bgColor: "bg-blue-100 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-900",
    hoverColor: "hover:border-blue-300 dark:hover:border-blue-800",
  },
  qualification: {
    label: "Qualification",
    bgColor: "bg-purple-100 dark:bg-purple-950",
    borderColor: "border-purple-200 dark:border-purple-900",
    hoverColor: "hover:border-purple-300 dark:hover:border-purple-800",
  },
  proposal: {
    label: "Proposal",
    bgColor: "bg-orange-100 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-900",
    hoverColor: "hover:border-orange-300 dark:hover:border-orange-800",
  },
  negotiation: {
    label: "Negotiation",
    bgColor: "bg-amber-100 dark:bg-amber-950",
    borderColor: "border-amber-200 dark:border-amber-900",
    hoverColor: "hover:border-amber-300 dark:hover:border-amber-800",
  },
  closed: {
    label: "Closed Won",
    bgColor: "bg-green-100 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-900",
    hoverColor: "hover:border-green-300 dark:hover:border-green-800",
  },
}

export default function SalesPage() {
  const [deals, setDeals] = useState(initialDeals)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTag, setFilterTag] = useState("all")
  const [filterOwner, setFilterOwner] = useState("all")
  const [isAddDealOpen, setIsAddDealOpen] = useState(false)
  const { toast } = useToast()

  const handleDragStart = (e, id, currentStage) => {
    e.dataTransfer.setData("dealId", id)
    e.dataTransfer.setData("currentStage", currentStage)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetStage) => {
    const dealId = e.dataTransfer.getData("dealId")
    const currentStage = e.dataTransfer.getData("currentStage")

    if (currentStage === targetStage) return

    // Find the deal in the current stage
    const deal = deals[currentStage].find((d) => d.id === dealId)
    if (!deal) return

    // Update probability based on new stage
    const updatedDeal = { ...deal }
    switch (targetStage) {
      case "prospecting":
        updatedDeal.probability = 20
        break
      case "qualification":
        updatedDeal.probability = 40
        break
      case "proposal":
        updatedDeal.probability = 60
        break
      case "negotiation":
        updatedDeal.probability = 80
        break
      case "closed":
        updatedDeal.probability = 100
        break
    }

    // Remove from current stage
    const newDeals = { ...deals }
    newDeals[currentStage] = deals[currentStage].filter((d) => d.id !== dealId)

    // Add to target stage
    newDeals[targetStage] = [...deals[targetStage], updatedDeal]

    setDeals(newDeals)

    toast({
      title: "Deal moved",
      description: `${deal.title} moved to ${stages[targetStage].label}`,
    })
  }

  const handleAddDeal = (newDeal) => {
    const dealWithId = {
      id: `d${Object.values(deals).flat().length + 1}`,
      ...newDeal,
      probability: 20,
      activities: 0,
      lastActivity: "Just now",
      nextStep: "Initial contact",
    }

    setDeals({
      ...deals,
      prospecting: [dealWithId, ...deals.prospecting],
    })

    setIsAddDealOpen(false)

    toast({
      title: "Deal added",
      description: `${newDeal.title} has been added to your pipeline.`,
    })
  }

  // Filter deals based on search term, tags, and owner
  const filteredDeals = Object.entries(deals).reduce((acc, [stage, stageDeals]) => {
    acc[stage] = stageDeals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.client.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTag = filterTag === "all" || deal.tags.includes(filterTag)

      const matchesOwner = filterOwner === "all" || deal.owner === filterOwner

      return matchesSearch && matchesTag && matchesOwner
    })
    return acc
  }, {})

  // Calculate total pipeline value
  const totalValue = Object.values(deals)
    .flat()
    .reduce((sum, deal) => sum + deal.value, 0)

  // Calculate weighted pipeline value (based on probability)
  const weightedValue = Object.values(deals)
    .flat()
    .reduce((sum, deal) => sum + (deal.value * deal.probability) / 100, 0)

  // Get all unique tags from deals
  const allTags = [
    ...new Set(
      Object.values(deals)
        .flat()
        .flatMap((deal) => deal.tags),
    ),
  ]

  // Get all unique owners from deals
  const allOwners = [
    ...new Set(
      Object.values(deals)
        .flat()
        .map((deal) => deal.owner),
    ),
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-muted-foreground">Track and manage your deals through the sales process</p>
        </div>

        <Tabs defaultValue="pipeline" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[1px]">
                    <Plus className="mr-2 h-4 w-4" /> New Deal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Deal</DialogTitle>
                  </DialogHeader>
                  <DealForm onSubmit={handleAddDeal} onCancel={() => setIsAddDealOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="pipeline" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Total Pipeline Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Compared to previous month</p>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Weighted Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</div>
                    <div className="flex items-center text-red-500">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">3%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on deal probability</p>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Active Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{Object.values(deals).flat().length}</div>
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">5</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">New deals this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search deals..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterOwner} onValueChange={setFilterOwner}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    {allOwners.map((owner) => (
                      <SelectItem key={owner} value={owner}>
                        {owner}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" /> More Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-auto pb-4">
              {Object.entries(stages).map(([stageKey, stage]) => (
                <div
                  key={stageKey}
                  className={cn(
                    "flex flex-col h-full min-h-[70vh] rounded-lg border-2 transition-colors",
                    stage.borderColor,
                    stage.hoverColor,
                  )}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stageKey)}
                >
                  <div className={cn("p-3 rounded-t-md font-medium", stage.bgColor)}>
                    <div className="flex justify-between items-center">
                      <span>{stage.label}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background">
                          {filteredDeals[stageKey].length}
                        </Badge>
                        <Badge variant="outline" className="bg-background">
                          ${filteredDeals[stageKey].reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                    {filteredDeals[stageKey].length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
                        <div className="mb-2">No deals in this stage</div>
                        {stageKey === "prospecting" && (
                          <Button variant="outline" size="sm" onClick={() => setIsAddDealOpen(true)}>
                            <Plus className="mr-1 h-3 w-3" /> Add Deal
                          </Button>
                        )}
                      </div>
                    ) : (
                      filteredDeals[stageKey].map((deal) => (
                        <Card
                          key={deal.id}
                          className="transform transition-all duration-200 hover:shadow-md active:scale-[0.98]"
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id, stageKey)}
                        >
                          <CardContent className="p-3 space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm line-clamp-2">{deal.title}</h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                                  <DropdownMenuItem>Add Note</DropdownMenuItem>
                                  <DropdownMenuItem>Add Task</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete Deal</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">${deal.value.toLocaleString()}</span>
                              <Badge variant="outline" className="ml-auto text-xs">
                                {deal.probability}%
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {deal.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={deal.clientAvatar} alt={deal.client} />
                                  <AvatarFallback>{deal.client[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{deal.client}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{deal.dueDate}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <UserPlus className="h-3 w-3" />
                                <span>{deal.owner}</span>
                              </div>
                              <span>{deal.activities} activities</span>
                            </div>

                            <div className="text-xs pt-1 border-t">
                              <span className="font-medium">Next: </span>
                              <span className="text-muted-foreground">{deal.nextStep}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <SalesForecasting expanded={true} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Analysis of your sales team performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-10 w-10 mb-2" />
                      <p>Sales performance charts and analytics would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Conversion Rates</CardTitle>
                  <CardDescription>Stage-by-stage conversion analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-10 w-10 mb-2" />
                      <p>Conversion rate charts and analytics would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
