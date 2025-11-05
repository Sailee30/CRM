"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, DollarSign, User, Building, Tag } from "lucide-react"

export default function DealForm({ onSubmit, onCancel }) {
  const [date, setDate] = useState(new Date())
  const [deal, setDeal] = useState({
    title: "",
    value: "",
    client: "",
    clientAvatar: "/placeholder.svg?height=32&width=32",
    dueDate: format(new Date(), "MMM d, yyyy"),
    owner: "Alex Johnson",
    ownerAvatar: "/placeholder.svg?height=24&width=24",
    tags: [],
    description: "",
  })

  const [selectedTags, setSelectedTags] = useState([])
  const availableTags = [
    "Software",
    "Enterprise",
    "SaaS",
    "Subscription",
    "Marketing",
    "Consulting",
    "Analytics",
    "Security",
    "Support",
    "Technology",
    "Finance",
    "Healthcare",
    "Startup",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setDeal((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setDeal((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setDeal((prev) => ({ ...prev, dueDate: format(selectedDate, "MMM d, yyyy") }))
  }

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formattedDeal = {
      ...deal,
      value: Number.parseFloat(deal.value) || 0,
      tags: selectedTags,
    }

    onSubmit(formattedDeal)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Deal Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter deal title"
            value={deal.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value">Deal Value</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="value"
                name="value"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={deal.value}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deal.dueDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <div className="relative">
              <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="client"
                name="client"
                placeholder="Client name"
                className="pl-8"
                value={deal.client}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Deal Owner</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select value={deal.owner} onValueChange={(value) => handleSelectChange("owner", value)}>
                <SelectTrigger id="owner" className="pl-8">
                  <SelectValue placeholder="Select owner" />
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
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 p-2 border rounded-md">
            {availableTags.map((tag) => (
              <Button
                key={tag}
                type="button"
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="h-7"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter deal details"
            rows={3}
            value={deal.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Deal</Button>
      </div>
    </form>
  )
}
