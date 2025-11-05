"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import DashboardCharts from "@/components/dashboard/dashboard-charts"
import RecentActivities from "@/components/dashboard/recent-activities"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UpcomingTasks from "@/components/dashboard/upcoming-tasks"
import AIInsights from "@/components/dashboard/ai-insights"
import LeadScoring from "@/components/dashboard/lead-scoring"
import CustomerSegmentation from "@/components/dashboard/customer-segmentation"
import SalesForecasting from "@/components/dashboard/sales-forecasting"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, Calendar, MessageSquare, Users } from "lucide-react"
import Link from "next/link"
import ProductionChatWidget from "@/components/chatbot/production-chat-widget"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your CRM performance and insights.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <DashboardCharts className="lg:col-span-5" />
              <div className="space-y-4 lg:col-span-2">
                <UpcomingTasks />
                <AIInsights />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2 transform transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates from your team and customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivities limit={5} />
                </CardContent>
              </Card>

              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used tools and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/contacts/new">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Users className="mr-2 h-4 w-4" />
                        Add Contact
                      </Button>
                    </Link>
                    <Link href="/tasks/new">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Calendar className="mr-2 h-4 w-4" />
                        New Task
                      </Button>
                    </Link>
                    <Link href="/messages">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </Link>
                    <Link href="/notifications">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-2 font-medium">Suggested Action</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      5 leads haven't been contacted in the last 7 days. Follow up to increase conversion chances.
                    </p>
                    <Button size="sm" className="w-full mt-2">
                      View Leads <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <SalesForecasting />
              <LeadScoring />
            </div>
            <Card className="p-4 border rounded-lg">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Detailed metrics and pipeline analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive sales metrics and pipeline analysis would appear here.
                </p>
                <Link href="/sales">
                  <Button>
                    View Full Sales Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <CustomerSegmentation />
            <Card className="p-4 border rounded-lg">
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Segmentation and relationship data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Customer segmentation and relationship data would appear here.
                </p>
                <Link href="/contacts">
                  <Button>
                    View All Contacts <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="p-4 border rounded-lg">
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Comprehensive task overview and assignment tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comprehensive task overview and assignment tools would appear here.
              </p>
              <Link href="/tasks">
                <Button>
                  View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <AIInsights expanded={true} />
              <Card className="transform transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered analysis of customer communications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Sentiment</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-500">Positive</span>
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Positive</span>
                        <span>68%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Neutral</span>
                        <span>24%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: "24%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Negative</span>
                        <span>8%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: "8%" }}></div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                      <h4 className="mb-2 font-medium">Key Insights</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 rounded-full bg-green-500/20 p-1 text-green-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                          <span>Product quality mentioned positively in 42% of communications</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 rounded-full bg-red-500/20 p-1 text-red-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </span>
                          <span>Support response time mentioned negatively in 6% of communications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="transform transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle>Predictive Customer Behavior</CardTitle>
                <CardDescription>AI-powered predictions based on historical data and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-2 font-medium">Churn Risk Analysis</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on activity patterns, these customers may be at risk of churning in the next 30 days.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-2">
                            <span className="font-medium">TG</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">TechGlobal Inc.</p>
                            <p className="text-xs text-muted-foreground">Last activity: 28 days ago</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-red-500">High Risk (87%)</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 mr-2">
                            <span className="font-medium">MS</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">MediaSphere</p>
                            <p className="text-xs text-muted-foreground">Last activity: 14 days ago</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-yellow-500">Medium Risk (62%)</div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      View All At-Risk Customers
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/50 p-4">
                    <h4 className="mb-2 font-medium">Upsell Opportunities</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      These customers show patterns similar to others who upgraded their plans.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-2">
                            <span className="font-medium">FI</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Future Innovations</p>
                            <p className="text-xs text-muted-foreground">Current plan: Professional</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-green-500">93% match</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-2">
                            <span className="font-medium">AC</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Apex Consulting</p>
                            <p className="text-xs text-muted-foreground">Current plan: Basic</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-green-500">89% match</div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      View All Opportunities
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <ProductionChatWidget isAuthenticated={true} userId="user-dashboard" />
    </DashboardLayout>
  )
}
