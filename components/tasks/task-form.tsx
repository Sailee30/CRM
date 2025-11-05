"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Flag, Tag, User } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function TaskForm({ onSubmit, onCancel }) {
  const [date, setDate] = useState(new Date())
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: format(new Date(), "PPP"),
    dueTime: "12:00 PM",
    priority: "medium",
    assignedTo: "Alex Johnson",
    relatedTo: "",
    tags: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setTask((prev) => ({ ...prev, dueDate: format(selectedDate, "PPP") }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert tags string to array
    const formattedTask = {
      ...task,
      tags: task.tags ? task.tags.split(",").map((tag) => tag.trim()) : [],
      assigneeAvatar: "/placeholder.svg?height=32&width=32", // Default avatar
    }

    onSubmit(formattedTask)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter task details"
            rows={3}
            value={task.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {task.dueDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueTime">Due Time</Label>
            <div className="flex w-full items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select value={task.dueTime} onValueChange={(value) => handleSelectChange("dueTime", value)}>
                <SelectTrigger id="dueTime" className="flex-1">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <div className="flex w-full items-center space-x-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <Select value={task.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority" className="flex-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <div className="flex w-full items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Select value={task.assignedTo} onValueChange={(value) => handleSelectChange("assignedTo", value)}>
                <SelectTrigger id="assignedTo" className="flex-1">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                  <SelectItem value="Sam Williams">Sam Williams</SelectItem>
                  <SelectItem value="Taylor Smith">Taylor Smith</SelectItem>
                  <SelectItem value="Jamie Brown">Jamie Brown</SelectItem>
                  <SelectItem value="Jordan Miller">Jordan Miller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relatedTo">Related To</Label>
          <div className="flex w-full items-center space-x-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Input
              id="relatedTo"
              name="relatedTo"
              placeholder="Deal, contact, or project name"
              value={task.relatedTo}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="Enter tags separated by commas (e.g., sales, followup)"
            value={task.tags}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Task</Button>
      </div>
    </form>
  )
}
