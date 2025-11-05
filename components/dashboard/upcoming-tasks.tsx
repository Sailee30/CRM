import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample upcoming tasks
const upcomingTasks = [
  {
    id: 1,
    title: "Follow up with TechCorp",
    dueTime: "Today, 2:00 PM",
    priority: "high",
  },
  {
    id: 2,
    title: "Prepare presentation for MegaCorp",
    dueTime: "Today, 5:00 PM",
    priority: "medium",
  },
  {
    id: 3,
    title: "Review Q4 marketing campaign",
    dueTime: "Tomorrow, 10:00 AM",
    priority: "medium",
  },
  {
    id: 4,
    title: "Schedule demo with InnovateNow",
    dueTime: "Tomorrow, 3:30 PM",
    priority: "low",
  },
]

export default function UpcomingTasks() {
  const getPriorityColor = (priority) => {
    const classes = {
      low: "bg-blue-500/10 text-blue-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      high: "bg-red-500/10 text-red-500",
    }

    return classes[priority] || ""
  }

  return (
    <Card className="transform transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="rounded-md border p-2.5 transition-all hover:shadow-sm">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {task.dueTime}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("ml-auto text-xs whitespace-nowrap", getPriorityColor(task.priority))}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2">
            <CalendarClock className="mr-2 h-4 w-4" />
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
