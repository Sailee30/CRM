"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ReportData } from "@/lib/reports/report-builder"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

interface ReportViewerProps {
  report: ReportData
}

export default function ReportViewer({ report }: ReportViewerProps) {
  const renderVisualization = () => {
    const { config, data, summary } = report

    switch (config.visualization) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.groupBy || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((metric, idx) => (
                <Bar key={metric} dataKey={metric} fill={COLORS[idx % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.groupBy || "name"} />
              <YAxis />
              <Tooltip />
              <Legend />
              {config.metrics.map((metric, idx) => (
                <Line key={metric} type="monotone" dataKey={metric} stroke={COLORS[idx % COLORS.length]} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey={config.metrics[0] || "count"}
                nameKey={config.groupBy || "name"}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "table":
      case "pivot":
      default:
        return (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {config.groupBy && <TableHead>{config.groupBy}</TableHead>}
                  {config.metrics.map((metric) => (
                    <TableHead key={metric}>{metric}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx}>
                    {config.groupBy && <TableCell>{row[config.groupBy]}</TableCell>}
                    {config.metrics.map((metric) => (
                      <TableCell key={metric}>{row[metric]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{report.config.name}</CardTitle>
        <CardDescription>
          Generated on {report.generatedAt.toLocaleDateString()} at {report.generatedAt.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(report.summary).map(([key, value]) => (
            <div key={key} className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">{key.replace(/_/g, " ")}</p>
              <p className="text-2xl font-bold">{typeof value === "number" ? value.toFixed(2) : value}</p>
            </div>
          ))}
        </div>

        {/* Visualization */}
        <div className="border rounded-lg p-4">{renderVisualization()}</div>
      </CardContent>
    </Card>
  )
}
