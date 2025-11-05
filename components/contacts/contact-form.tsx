"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactForm({ onSubmit, onCancel }) {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(contact)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter full name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={contact.phone}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            placeholder="Company name"
            value={contact.company}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={contact.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Contact</Button>
      </div>
    </form>
  )
}
