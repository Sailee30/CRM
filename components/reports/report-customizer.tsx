"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save } from "lucide-react"
import type { ReportConfig, FilterCondition } from "@/lib/reports/report-builder"

interface ReportCustomizerProps {
  onSave: (config: ReportConfig) => void
  initialConfig?: ReportConfig
}

export default function ReportCustomizer({ onSave, initialConfig }: ReportCustomizerProps) {
  const [reportName, setReportName] = useState(initialConfig?.name || "")
  const [reportType, setReportType] = useState<any>(initialConfig?.type || "sales_pipeline")
  const [visualization, setVisualization] = useState(initialConfig?.visualization || "table")
  const [groupBy, setGroupBy] = useState(initialConfig?.groupBy || "")
  const [metrics, setMetrics] = useState<string[]>(initialConfig?.metrics || [])
  const [filters, setFilters] = useState<FilterCondition[]>(initialConfig?.filters || [])

  const addFilter = () => {
    setFilters([...filters, { field: "", operator: "eq", value: "" }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (index: number, filter: FilterCondition) => {
    const updated = [...filters]
    updated[index] = filter
    setFilters(updated)
  }

  const toggleMetric = (metric: string) => {
    setMetrics((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  const handleSave = () => {
    const config: ReportConfig = {
      id: `report-${Date.now()}`,
      name: reportName,
      type: reportType,
      filters,
      groupBy: groupBy || undefined,
      timeRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
      metrics,
      visualization,
      createdAt: new Date(),
      updatedAt: new Date(),
      isTemplate: false,
    }
    onSave(config)
  }

  const metricOptions = ["count", "total_value", "average_value", "conversion_rate", "sla_compliance"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
        <CardDescription>Create and customize your own reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_pipeline">Sales Pipeline</SelectItem>
                  <SelectItem value="lead_conversion">Lead Conversion</SelectItem>
                  <SelectItem value="activity_log">Activity Log</SelectItem>
                  <SelectItem value="customer_segmentation">Customer Segmentation</SelectItem>
                  <SelectItem value="sla_metrics">SLA Metrics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-by">Group By (Optional)</Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger id="group-by">
                  <SelectValue placeholder="Select grouping field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualization">Visualization Type</Label>
              <Select value={visualization} onValueChange={setVisualization}>
                <SelectTrigger id="visualization">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="pivot">Pivot Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-4">
            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <Input
                    placeholder="Field"
                    value={filter.field}
                    onChange={(e) => updateFilter(index, { ...filter, field: e.target.value })}
                    className="flex-1"
                  />
                  <Select
                    value={filter.operator}
                    onValueChange={(op: any) => updateFilter(index, { ...filter, operator: op })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eq">Equals</SelectItem>
                      <SelectItem value="gt">Greater Than</SelectItem>
                      <SelectItem value="lt">Less Than</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="in">In List</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, { ...filter, value: e.target.value })}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => removeFilter(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addFilter} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" /> Add Filter
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="space-y-3">
              {metricOptions.map((metric) => (
                <div key={metric} className="flex items-center gap-2">
                  <Checkbox
                    id={metric}
                    checked={metrics.includes(metric)}
                    onCheckedChange={() => toggleMetric(metric)}
                  />
                  <Label htmlFor={metric} className="cursor-pointer text-sm">
                    {metric.replace(/_/g, " ").toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full mt-6">
          <Save className="mr-2 h-4 w-4" /> Save Report
        </Button>
      </CardContent>
    </Card>
  )
}
