import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, DollarSign, MessageSquare, Phone, UserPlus } from "lucide-react"

// Sample activity data
const activities = [
  {
    id: 1,
    type: "call",
    title: "Call with TechCorp",
    description: "Discussed implementation timeline for the software upgrade",
    time: "Today, 10:30 AM",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    icon: Phone,
    iconColor: "text-blue-500 bg-blue-500/10",
  },
  {
    id: 2,
    type: "deal",
    title: "Deal Updated",
    description: "Marketing Platform - CreativeFlow moved to Qualification stage",
    time: "Today, 9:15 AM",
    user: {
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    icon: DollarSign,
    iconColor: "text-green-500 bg-green-500/10",
  },
  {
    id: 3,
    type: "contact",
    title: "New Contact Added",
    description: "Jamie Lee from InnovateNow has been added to your contacts",
    time: "Yesterday, 4:45 PM",
    user: {
      name: "Sam Williams",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    icon: UserPlus,
    iconColor: "text-purple-500 bg-purple-500/10",
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    description: "Sarah from DataDriven replied to your proposal email",
    time: "Yesterday, 2:30 PM",
    user: {
      name: "Jordan Miller",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    icon: MessageSquare,
    iconColor: "text-orange-500 bg-orange-500/10",
  },
  {
    id: 5,
    type: "meeting",
    title: "Meeting Scheduled",
    description: "Executive presentation for MegaCorp on Nov 28, 2:00 PM",
    time: "Yesterday, 11:20 AM",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    icon: Calendar,
    iconColor: "text-yellow-500 bg-yellow-500/10",
  },
]

export default function RecentActivities() {
  return (
    <Card className="transform transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates from your team and customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className={`mt-0.5 rounded-full p-2 ${activity.iconColor}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center pt-1">
                  <Avatar className="h-5 w-5 mr-1.5">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
