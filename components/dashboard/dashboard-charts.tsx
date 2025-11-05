"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Bar,
  BarChart,
  Line,
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export default function DashboardCharts({ className }) {
  // Sample sales data
  const salesData = [
    { name: "Jan", revenue: 45000, deals: 12 },
    { name: "Feb", revenue: 52000, deals: 15 },
    { name: "Mar", revenue: 49000, deals: 14 },
    { name: "Apr", revenue: 63000, deals: 18 },
    { name: "May", revenue: 58000, deals: 16 },
    { name: "Jun", revenue: 72000, deals: 21 },
    { name: "Jul", revenue: 78000, deals: 24 },
    { name: "Aug", revenue: 81000, deals: 25 },
    { name: "Sep", revenue: 77000, deals: 22 },
    { name: "Oct", revenue: 85000, deals: 26 },
    { name: "Nov", revenue: 89000, deals: 28 },
    { name: "Dec", revenue: 102000, deals: 32 },
  ]

  // Sample pipeline data
  const pipelineData = [
    { name: "Prospecting", value: 35 },
    { name: "Qualification", value: 20 },
    { name: "Proposal", value: 25 },
    { name: "Negotiation", value: 15 },
    { name: "Closed", value: 5 },
  ]

  // Sample customer segment data
  const segmentData = [
    { name: "Enterprise", value: 35 },
    { name: "Mid-market", value: 40 },
    { name: "Small Business", value: 25 },
  ]

  return (
    <Card className={cn("transform transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Track key metrics across sales, deals, and customer engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <BarChart data={salesData}>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Bar name="revenue" accessor="revenue" label="Revenue" color="primary" />
                  <Line name="deals" accessor="deals" label="Deals" color="green" />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <PieChart data={pipelineData}>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Pie
                    name="pipeline"
                    accessor="value"
                    valueFormatter={(value) => `${value}%`}
                    colorScale={["#2563eb", "#7c3aed", "#f59e0b", "#10b981", "#ef4444"]}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <div className="h-[300px]">
              <ChartContainer>
                <PieChart data={segmentData}>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Pie
                    name="segments"
                    accessor="value"
                    valueFormatter={(value) => `${value}%`}
                    colorScale={["#0ea5e9", "#8b5cf6", "#f97316"]}
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
