import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, Users, DollarSign, ShoppingCart, Activity } from "lucide-react"

export default function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="transform transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,853</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-3.5 w-3.5 text-green-500" />
            <span className="text-green-500">12%</span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="transform transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue this Quarter</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$574,382</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-3.5 w-3.5 text-green-500" />
            <span className="text-green-500">7.4%</span>
            <span className="ml-1">from last quarter</span>
          </div>
        </CardContent>
      </Card>

      <Card className="transform transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowDownRight className="mr-1 h-3.5 w-3.5 text-red-500" />
            <span className="text-red-500">3</span>
            <span className="ml-1">from last week</span>
          </div>
        </CardContent>
      </Card>

      <Card className="transform transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24.8%</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <ArrowUpRight className="mr-1 h-3.5 w-3.5 text-green-500" />
            <span className="text-green-500">2.1%</span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
