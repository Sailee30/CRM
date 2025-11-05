import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Activity } from "lucide-react"

// Sample segment data
const segments = [
  {
    id: "1",
    name: "Enterprise Clients",
    count: 28,
    value: "$1.2M",
    growth: "+12%",
    retention: "92%",
    color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    description: "Large organizations with 500+ employees",
  },
  {
    id: "2",
    name: "Mid-Market",
    count: 145,
    value: "$850K",
    growth: "+8%",
    retention: "85%",
    color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    description: "Medium-sized businesses with 50-499 employees",
  },
  {
    id: "3",
    name: "Small Business",
    count: 312,
    value: "$420K",
    growth: "+15%",
    retention: "78%",
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    description: "Small companies with fewer than 50 employees",
  },
  {
    id: "4",
    name: "New Customers",
    count: 87,
    value: "$210K",
    growth: "+22%",
    retention: "65%",
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    description: "Customers acquired in the last 90 days",
  },
]

export default function CustomerSegmentation() {
  return (
    <Card className="transform transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>AI-powered customer segmentation based on behavior and value</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={segment.color}>{segment.name}</Badge>
                  <span className="text-sm text-muted-foreground">({segment.count} customers)</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-green-500">
                  {segment.growth}
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
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{segment.description}</p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{segment.value}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{segment.retention} retention</span>
                </div>
                <div className="flex items-center justify-end">
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button variant="link" className="w-full mt-2" size="sm">
            View All Segments <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
