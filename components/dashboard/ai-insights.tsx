import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight } from "lucide-react"

export default function AIInsights() {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 transform transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="rounded-md bg-card p-3 shadow-sm">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mb-2">Sales Opportunity</Badge>
            <p className="text-sm">
              TechCorp has 3 related products they haven't purchased yet. Consider cross-selling during your next
              follow-up.
            </p>
          </div>

          <div className="rounded-md bg-card p-3 shadow-sm">
            <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 mb-2">Follow-up Needed</Badge>
            <p className="text-sm">
              DataDriven hasn't responded in 7 days. Their historical response time is 2-3 days.
            </p>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-2 bg-background/80">
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
