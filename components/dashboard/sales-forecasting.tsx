import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Calendar, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SalesForecasting({ expanded = false }) {
  return (
    <Card className="transform transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Sales Forecasting</CardTitle>
        <CardDescription>AI-powered sales predictions based on historical data and pipeline</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Revenue</div>
                <div className="text-2xl font-bold">$245,000</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Deals</div>
                <div className="text-2xl font-bold">18</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+3 from last month</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Monthly Breakdown</h4>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  Next 30 Days
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 text-xs text-muted-foreground">
                  <div>Stage</div>
                  <div>Expected Revenue</div>
                  <div>Probability</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Qualification</div>
                  <div className="text-sm">$35,000</div>
                  <div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      40%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Proposal</div>
                  <div className="text-sm">$85,000</div>
                  <div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                      60%
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Negotiation</div>
                  <div className="text-sm">$125,000</div>
                  <div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500">
                      80%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {expanded && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-medium">Risk Factors</h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="mr-2 rounded-full bg-red-500/20 p-1 text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
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
                    <span>3 deals with high value ($50k+) are in early stages with low probability</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2 rounded-full bg-red-500/20 p-1 text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
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
                    <span>2 deals have been in the same stage for over 30 days</span>
                  </div>
                  <div className="flex items-start">
                    <span className="mr-2 rounded-full bg-amber-500/20 p-1 text-amber-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </span>
                    <span>Historical data shows Q4 typically has 15% lower close rates</span>
                  </div>
                </div>
              </div>
            )}

            <Button variant="link" className="w-full" size="sm">
              View Detailed Forecast <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="quarterly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Revenue</div>
                <div className="text-2xl font-bold">$720,000</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+8% from last quarter</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Deals</div>
                <div className="text-2xl font-bold">52</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+5 from last quarter</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Quarterly Breakdown</h4>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  Next 90 Days
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 text-xs text-muted-foreground">
                  <div>Month</div>
                  <div>Expected Revenue</div>
                  <div>Deals</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Month 1</div>
                  <div className="text-sm">$245,000</div>
                  <div className="text-sm">18</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Month 2</div>
                  <div className="text-sm">$215,000</div>
                  <div className="text-sm">16</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Month 3</div>
                  <div className="text-sm">$260,000</div>
                  <div className="text-sm">18</div>
                </div>
              </div>
            </div>

            <Button variant="link" className="w-full" size="sm">
              View Detailed Forecast <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Revenue</div>
                <div className="text-2xl font-bold">$2.8M</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+15% from last year</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Forecasted Deals</div>
                <div className="text-2xl font-bold">210</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+32 from last year</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Yearly Breakdown</h4>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  Next 12 Months
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 text-xs text-muted-foreground">
                  <div>Quarter</div>
                  <div>Expected Revenue</div>
                  <div>Deals</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Q1</div>
                  <div className="text-sm">$720,000</div>
                  <div className="text-sm">52</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Q2</div>
                  <div className="text-sm">$650,000</div>
                  <div className="text-sm">48</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Q3</div>
                  <div className="text-sm">$680,000</div>
                  <div className="text-sm">50</div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <div className="text-sm font-medium">Q4</div>
                  <div className="text-sm">$750,000</div>
                  <div className="text-sm">60</div>
                </div>
              </div>
            </div>

            <Button variant="link" className="w-full" size="sm">
              View Detailed Forecast <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
