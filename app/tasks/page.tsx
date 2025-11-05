"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Check,
  Clock,
  Plus,
  Search,
  Tag,
  User,
  Bell,
  CalendarIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import TaskForm from "@/components/tasks/task-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

// Sample task data
const initialTasks = [
  {
    id: "t1",
    title: "Follow up with TechCorp about proposal",
    description: "Send detailed information about enterprise pricing and implementation timeline",
    dueDate: "Today, 5:00 PM",
    priority: "high",
    status: "todo",
    assignedTo: "Alex Johnson",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "TechCorp deal",
    tags: ["sales", "followup"],
    createdAt: "2 days ago",
    reminderSet: true,
    attachments: 2,
    comments: 3,
    type: "call",
  },
  {
    id: "t2",
    title: "Prepare quarterly sales report",
    description: "Analyze sales data and create presentation for executive meeting",
    dueDate: "Tomorrow, 12:00 PM",
    priority: "medium",
    status: "in_progress",
    assignedTo: "Sam Williams",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Q4 Review",
    tags: ["report", "quarterly"],
    createdAt: "1 day ago",
    reminderSet: true,
    attachments: 5,
    comments: 2,
    type: "task",
  },
  {
    id: "t3",
    title: "Schedule product demo with InnovateNow",
    description: "Coordinate with product team for a customized demonstration",
    dueDate: "Nov 15, 2024",
    priority: "medium",
    status: "todo",
    assignedTo: "Taylor Smith",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "InnovateNow opportunity",
    tags: ["demo", "sales"],
    createdAt: "3 days ago",
    reminderSet: false,
    attachments: 0,
    comments: 1,
    type: "meeting",
  },
  {
    id: "t4",
    title: "Review and approve marketing materials",
    description: "Check new brochures and social media campaign assets",
    dueDate: "Nov 12, 2024",
    priority: "low",
    status: "todo",
    assignedTo: "Jordan Miller",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Q4 Marketing Campaign",
    tags: ["marketing", "approval"],
    createdAt: "Yesterday",
    reminderSet: false,
    attachments: 8,
    comments: 4,
    type: "task",
  },
  {
    id: "t5",
    title: "Finalize contract with DataDriven",
    description: "Review legal terms and get final approvals",
    dueDate: "Today, 3:00 PM",
    priority: "high",
    status: "in_progress",
    assignedTo: "Alex Johnson",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "DataDriven deal",
    tags: ["contract", "legal"],
    createdAt: "4 days ago",
    reminderSet: true,
    attachments: 3,
    comments: 7,
    type: "task",
  },
  {
    id: "t6",
    title: "Customer onboarding call with SecureTech",
    description: "Introduce support team and review implementation plan",
    dueDate: "Nov 14, 2024",
    priority: "medium",
    status: "todo",
    assignedTo: "Jamie Brown",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "SecureTech account",
    tags: ["onboarding", "customer"],
    createdAt: "2 days ago",
    reminderSet: true,
    attachments: 1,
    comments: 0,
    type: "call",
  },
  {
    id: "t7",
    title: "Update CRM documentation",
    description: "Add new feature explanations and update screenshots",
    dueDate: "Nov 18, 2024",
    priority: "low",
    status: "todo",
    assignedTo: "Jordan Miller",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Product Documentation",
    tags: ["documentation", "internal"],
    createdAt: "1 week ago",
    reminderSet: false,
    attachments: 0,
    comments: 2,
    type: "task",
  },
  {
    id: "t8",
    title: "Send proposal to MediaSphere",
    description: "Finalize pricing and service details for the proposal",
    dueDate: "Nov 13, 2024",
    priority: "high",
    status: "todo",
    assignedTo: "Sam Williams",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "MediaSphere opportunity",
    tags: ["proposal", "sales"],
    createdAt: "Yesterday",
    reminderSet: true,
    attachments: 4,
    comments: 1,
    type: "task",
  },
  {
    id: "t9",
    title: "Weekly team meeting",
    description: "Review progress, discuss blockers, and plan for next week",
    dueDate: "Nov 11, 2024, 10:00 AM",
    priority: "medium",
    status: "todo",
    assignedTo: "Alex Johnson",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Team Management",
    tags: ["meeting", "internal"],
    createdAt: "3 days ago",
    reminderSet: true,
    attachments: 1,
    comments: 5,
    type: "meeting",
  },
  {
    id: "t10",
    title: "Follow up with HealthPlus about support issues",
    description: "Address recent technical issues and ensure customer satisfaction",
    dueDate: "Today, 1:00 PM",
    priority: "high",
    status: "in_progress",
    assignedTo: "Taylor Smith",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "HealthPlus account",
    tags: ["support", "customer"],
    createdAt: "Today",
    reminderSet: true,
    attachments: 2,
    comments: 8,
    type: "call",
  },
  {
    id: "t11",
    title: "Prepare demo environment for Future Innovations",
    description: "Set up customized demo with sample data relevant to their industry",
    dueDate: "Nov 16, 2024",
    priority: "medium",
    status: "todo",
    assignedTo: "Jamie Brown",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Future Innovations opportunity",
    tags: ["demo", "technical"],
    createdAt: "2 days ago",
    reminderSet: false,
    attachments: 0,
    comments: 3,
    type: "task",
  },
  {
    id: "t12",
    title: "Review Q4 budget allocation",
    description: "Analyze department spending and prepare recommendations for adjustments",
    dueDate: "Nov 20, 2024",
    priority: "medium",
    status: "todo",
    assignedTo: "Jordan Miller",
    assigneeAvatar: "/placeholder.svg?height=32&width=32",
    relatedTo: "Finance",
    tags: ["finance", "planning"],
    createdAt: "1 week ago",
    reminderSet: false,
    attachments: 6,
    comments: 2,
    type: "task",
  },
]

const getPriorityBadge = (priority) => {
  const classes = {
    low: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
  }

  return (
    <Badge variant="outline" className={cn("transition-colors", classes[priority])}>
      {labels[priority]}
    </Badge>
  )
}

const getTaskTypeIcon = (type) => {
  switch (type) {
    case "call":
      return <Bell className="h-3.5 w-3.5" />
    case "meeting":
      return <CalendarIcon className="h-3.5 w-3.5" />
    case "task":
    default:
      return <CheckCircle2 className="h-3.5 w-3.5" />
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [selectedTasks, setSelectedTasks] = useState([])
  const [view, setView] = useState("list")
  const { toast } = useToast()

  // Filter tasks based on status, search term, date, priority, type, and assignee
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.relatedTo && task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    // Date filtering logic (simplified)
    const matchesDate = !selectedDate || task.dueDate.includes(format(selectedDate, "MMM d, yyyy"))

    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    const matchesType = typeFilter === "all" || task.type === typeFilter

    const matchesAssignee = assigneeFilter === "all" || task.assignedTo === assigneeFilter

    return matchesFilter && matchesSearch && matchesDate && matchesPriority && matchesType && matchesAssignee
  })

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))

    setTasks(updatedTasks)

    const task = tasks.find((t) => t.id === taskId)

    toast({
      title: "Task updated",
      description: `"${task.title}" marked as ${newStatus === "completed" ? "complete" : "in progress"}.`,
    })
  }

  const handleAddTask = (newTask) => {
    const taskWithId = {
      id: `t${tasks.length + 1}`,
      ...newTask,
      status: "todo",
      createdAt: "Just now",
      reminderSet: newTask.reminderSet || false,
      attachments: 0,
      comments: 0,
      type: newTask.type || "task",
    }

    setTasks([taskWithId, ...tasks])
    setIsAddTaskOpen(false)

    toast({
      title: "Task added",
      description: `"${newTask.title}" has been added to your tasks.`,
    })
  }

  const handleSelectTask = (taskId) => {
    setSelectedTasks((prev) => {
      if (prev.includes(taskId)) {
        return prev.filter((id) => id !== taskId)
      } else {
        return [...prev, taskId]
      }
    })
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(filteredTasks.map((task) => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  const handleBulkAction = (action) => {
    if (selectedTasks.length === 0) {
      toast({
        title: "No tasks selected",
        description: "Please select at least one task to perform this action.",
        variant: "destructive",
      })
      return
    }

    let message = ""
    let updatedTasks = [...tasks]

    switch (action) {
      case "complete":
        updatedTasks = tasks.map((task) => (selectedTasks.includes(task.id) ? { ...task, status: "completed" } : task))
        message = `${selectedTasks.length} task(s) marked as complete`
        break
      case "delete":
        updatedTasks = tasks.filter((task) => !selectedTasks.includes(task.id))
        message = `${selectedTasks.length} task(s) deleted`
        break
      case "remind":
        updatedTasks = tasks.map((task) => (selectedTasks.includes(task.id) ? { ...task, reminderSet: true } : task))
        message = `Reminders set for ${selectedTasks.length} task(s)`
        break
      case "assign":
        message = `${selectedTasks.length} task(s) reassigned`
        break
    }

    setTasks(updatedTasks)
    setSelectedTasks([])

    toast({
      title: "Action completed",
      description: message,
    })
  }

  const taskStatusCounts = {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  }

  // Get all unique assignees
  const assignees = [...new Set(tasks.map((task) => task.assignedTo))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage and track your team's tasks and activities</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Tasks ({taskStatusCounts.all})</TabsTrigger>
              <TabsTrigger value="todo">To Do ({taskStatusCounts.todo})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({taskStatusCounts.in_progress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({taskStatusCounts.completed})</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[1px]">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddTaskOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="transform transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Task Management</CardTitle>

                <div className="flex items-center gap-2">
                  <Button
                    variant={view === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("list")}
                    className="px-3"
                  >
                    List
                  </Button>
                  <Button
                    variant={view === "board" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("board")}
                    className="px-3"
                  >
                    Board
                  </Button>
                  <Button
                    variant={view === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("calendar")}
                    className="px-3"
                  >
                    Calendar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tasks..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="flex gap-2">
                          <Calendar className="h-4 w-4" />
                          {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Due Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                        {selectedDate && (
                          <div className="p-3 border-t">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)} className="w-full">
                              Clear Date
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assignees</SelectItem>
                        {assignees.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>
                            {assignee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedTasks.length > 0 && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all tasks"
                      />
                      <span className="text-sm text-muted-foreground">{selectedTasks.length} selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("complete")}>
                        <Check className="mr-2 h-4 w-4" /> Complete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("remind")}>
                        <Bell className="mr-2 h-4 w-4" /> Set Reminder
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("assign")}>
                        <User className="mr-2 h-4 w-4" /> Reassign
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("delete")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}

                {view === "list" && (
                  <div className="space-y-2">
                    {filteredTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="text-muted-foreground">No tasks found</div>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchTerm("")
                            setSelectedDate(null)
                            setPriorityFilter("all")
                            setTypeFilter("all")
                            setAssigneeFilter("all")
                          }}
                          className="mt-2"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "group p-4 rounded-lg border transition-all duration-200",
                            task.status === "completed" ? "bg-muted/50" : "hover:shadow-md hover:border-primary/20",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 pt-0.5">
                              <Checkbox
                                checked={selectedTasks.includes(task.id) || task.status === "completed"}
                                onCheckedChange={(checked) => {
                                  if (task.status === "completed") {
                                    handleStatusChange(task.id, "todo")
                                  } else if (checked) {
                                    handleSelectTask(task.id)
                                  } else {
                                    setSelectedTasks((prev) => prev.filter((id) => id !== task.id))
                                  }
                                }}
                                className="transition-transform group-hover:scale-110 data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=checked]:border-green-500"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3
                                  className={cn(
                                    "font-medium flex items-center gap-2",
                                    task.status === "completed" && "line-through text-muted-foreground",
                                  )}
                                >
                                  <span className="text-muted-foreground">{getTaskTypeIcon(task.type)}</span>
                                  {task.title}
                                  {task.reminderSet && (
                                    <span className="text-amber-500">
                                      <Bell className="h-3 w-3" />
                                    </span>
                                  )}
                                </h3>
                                <div className="flex items-center flex-wrap gap-2">
                                  {getPriorityBadge(task.priority)}

                                  {task.status === "in_progress" && (
                                    <Badge
                                      variant="outline"
                                      className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
                                    >
                                      In Progress
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground">{task.description}</p>

                              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{task.dueDate}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarImage src={task.assigneeAvatar} alt={task.assignedTo} />
                                      <AvatarFallback>{task.assignedTo[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{task.assignedTo}</span>
                                  </div>
                                </div>

                                {task.relatedTo && (
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>{task.relatedTo}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-1 ml-auto">
                                  <span className="text-xs">Created {task.createdAt}</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap justify-between items-center pt-2">
                                <div className="flex flex-wrap gap-1">
                                  {task.tags &&
                                    task.tags.length > 0 &&
                                    task.tags.map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {task.attachments > 0 && (
                                    <span className="flex items-center gap-1">
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
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                      </svg>
                                      {task.attachments}
                                    </span>
                                  )}

                                  {task.comments > 0 && (
                                    <span className="flex items-center gap-1">
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
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                      </svg>
                                      {task.comments}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex-shrink-0">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15"
                                      height="15"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="12" cy="12" r="1"></circle>
                                      <circle cx="12" cy="5" r="1"></circle>
                                      <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleStatusChange(task.id, task.status === "completed" ? "todo" : "completed")
                                    }
                                  >
                                    {task.status === "completed" ? "Mark as Incomplete" : "Mark as Complete"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                  <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                  <DropdownMenuItem>Add Attachment</DropdownMenuItem>
                                  <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {view === "board" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center">
                          <span className="mr-2 text-blue-500">
                            <AlertCircle className="h-4 w-4" />
                          </span>
                          To Do
                          <Badge className="ml-2">{filteredTasks.filter((t) => t.status === "todo").length}</Badge>
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddTaskOpen(true)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredTasks
                          .filter((t) => t.status === "todo")
                          .map((task) => (
                            <div
                              key={task.id}
                              className="border rounded-lg p-3 bg-background shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={task.assigneeAvatar} alt={task.assignedTo} />
                                    <AvatarFallback>{task.assignedTo[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignedTo}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                              </div>
                            </div>
                          ))}
                        {filteredTasks.filter((t) => t.status === "todo").length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <p className="text-sm">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center">
                          <span className="mr-2 text-purple-500">
                            <Clock className="h-4 w-4" />
                          </span>
                          In Progress
                          <Badge className="ml-2">
                            {filteredTasks.filter((t) => t.status === "in_progress").length}
                          </Badge>
                        </h3>
                      </div>
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredTasks
                          .filter((t) => t.status === "in_progress")
                          .map((task) => (
                            <div
                              key={task.id}
                              className="border rounded-lg p-3 bg-background shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={task.assigneeAvatar} alt={task.assignedTo} />
                                    <AvatarFallback>{task.assignedTo[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignedTo}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                              </div>
                            </div>
                          ))}
                        {filteredTasks.filter((t) => t.status === "in_progress").length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <p className="text-sm">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center">
                          <span className="mr-2 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          Completed
                          <Badge className="ml-2">{filteredTasks.filter((t) => t.status === "completed").length}</Badge>
                        </h3>
                      </div>
                      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredTasks
                          .filter((t) => t.status === "completed")
                          .map((task) => (
                            <div
                              key={task.id}
                              className="border rounded-lg p-3 bg-background shadow-sm hover:shadow-md transition-all opacity-70"
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-sm line-through">{task.title}</h4>
                                {getPriorityBadge(task.priority)}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={task.assigneeAvatar} alt={task.assignedTo} />
                                    <AvatarFallback>{task.assignedTo[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{task.assignedTo}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                              </div>
                            </div>
                          ))}
                        {filteredTasks.filter((t) => t.status === "completed").length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <p className="text-sm">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {view === "calendar" && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <Calendar className="h-10 w-10 mb-2" />
                        <p>Calendar view would display tasks organized by due dates</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all">{/* Content for All Tasks tab */}</TabsContent>
          <TabsContent value="todo">{/* Content for To Do tab */}</TabsContent>
          <TabsContent value="in_progress">{/* Content for In Progress tab */}</TabsContent>
          <TabsContent value="completed">{/* Content for Completed tab */}</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
