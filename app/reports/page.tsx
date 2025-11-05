"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ReportCustomizer from "@/components/reports/report-customizer"
import ReportViewer from "@/components/reports/report-viewer"
import { ReportBuilder } from "@/lib/reports/report-builder"
import type { ReportConfig } from "@/lib/reports/report-builder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus } from "lucide-react"

// Sample CRM data for demo
const SAMPLE_DATA = [
  {
    id: 1,
    stage: "Lead",
    source: "Website",
    value: 5000,
    owner: "John",
    converted: false,
    team: "Sales",
    sla_met: true,
  },
  {
    id: 2,
    stage: "Prospect",
    source: "Email",
    value: 15000,
    owner: "Jane",
    converted: true,
    team: "Sales",
    sla_met: true,
  },
  {
    id: 3,
    stage: "Negotiation",
    source: "Referral",
    value: 50000,
    owner: "Bob",
    converted: false,
    team: "Enterprise",
    sla_met: false,
  },
  {
    id: 4,
    stage: "Closed",
    source: "Website",
    value: 100000,
    owner: "Alice",
    converted: true,
    team: "Enterprise",
    sla_met: true,
  },
  {
    id: 5,
    stage: "Lead",
    source: "Partner",
    value: 8000,
    owner: "John",
    converted: false,
    team: "Sales",
    sla_met: true,
  },
]

export default function ReportsPage() {
  const [reportBuilder] = useState(new ReportBuilder())
  const [currentReport, setCurrentReport] = useState<any>(null)
  const [savedReports, setSavedReports] = useState<ReportConfig[]>([])

  const handleSaveReport = (config: ReportConfig) => {
    setSavedReports([...savedReports, config])
    const report = reportBuilder.buildReport(SAMPLE_DATA, config)
    setCurrentReport(report)
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = reportBuilder.getTemplate(templateId)
    if (template) {
      const report = reportBuilder.buildReport(SAMPLE_DATA, template)
      setCurrentReport(report)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Create custom reports with filters, grouping, and visualizations</p>
        </div>

        <Tabs defaultValue="templates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="templates">Pre-built Templates</TabsTrigger>
            <TabsTrigger value="custom">Create Custom</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {reportBuilder.getAllTemplates().map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLoadTemplate(template.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" /> Load Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <ReportCustomizer onSave={handleSaveReport} />
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedReports.length > 0 ? (
              <div className="grid gap-4">
                {savedReports.map((report) => (
                  <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{report.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const builtReport = reportBuilder.buildReport(SAMPLE_DATA, report)
                          setCurrentReport(builtReport)
                        }}
                      >
                        View Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No saved reports yet. Create one using the custom builder.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {currentReport && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
            <ReportViewer report={currentReport} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
