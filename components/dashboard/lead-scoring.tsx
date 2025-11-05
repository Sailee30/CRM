import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

// Sample lead scoring data
const leadScores = [
  {
    id: "1",
    name: "TechGlobal Inc.",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 92,
    status: "Hot Lead",
    lastActivity: "2 days ago",
    source: "Website",
    engagementLevel: "High",
    conversionProbability: "85%",
  },
  {
    id: "2",
    name: "MediaSphere",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 78,
    status: "Warm Lead",
    lastActivity: "Yesterday",
    source: "Referral",
    engagementLevel: "Medium",
    conversionProbability: "65%",
  },
  {
    id: "3",
    name: "Future Innovations",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 85,
    status: "Hot Lead",
    lastActivity: "Today",
    source: "LinkedIn",
    engagementLevel: "High",
    conversionProbability: "75%",
  },
  {
    id: "4",
    name: "Apex Consulting",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 65,
    status: "Warm Lead",
    lastActivity: "3 days ago",
    source: "Email Campaign",
    engagementLevel: "Medium",
    conversionProbability: "55%",
  },
]

export default function LeadScoring({ expanded = false }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Hot Lead":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{status}</Badge>
      case "Warm Lead":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{status}</Badge>
      case "Cold Lead":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="transform transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Lead Scoring</CardTitle>
        <CardDescription>AI-powered lead scoring based on engagement and behavior</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leadScores.slice(0, expanded ? 4 : 2).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                  <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Source: {lead.source}</span>
                    <span>•</span>
                    <span>Last activity: {lead.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(lead.status)}
                <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
              </div>
            </div>
          ))}

          {expanded && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-medium">Scoring Factors</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span>Website Visits</span>
                      <span className="font-medium">30%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Email Engagement</span>
                      <span className="font-medium">25%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Content Downloads</span>
                      <span className="font-medium">20%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Social Media Interaction</span>
                      <span className="font-medium">15%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Form Submissions</span>
                      <span className="font-medium">10%</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-medium">Recommended Actions</h4>
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
                      <span>Schedule sales calls with hot leads within 24 hours</span>
                    </li>
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
                      <span>Send personalized content to warm leads</span>
                    </li>
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
                      <span>Nurture cold leads with automated email sequences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <Button variant="link" className="w-full mt-2" size="sm">
            View All Leads <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
