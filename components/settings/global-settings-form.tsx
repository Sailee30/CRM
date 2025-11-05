"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { GlobalSettings } from "@/lib/settings/settings-manager"

interface GlobalSettingsFormProps {
  initialSettings: GlobalSettings
  onSave: (settings: GlobalSettings) => void
}

export default function GlobalSettingsForm({ initialSettings, onSave }: GlobalSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const { toast } = useToast()

  const handleChange = (field: keyof GlobalSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(settings)
    toast({
      title: "Settings saved",
      description: "Your global settings have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Settings</CardTitle>
        <CardDescription>Configure company-wide preferences and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input
            id="company-name"
            value={settings.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Contact Email</Label>
          <Input
            id="contact-email"
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="EST">EST (UTC-5)</SelectItem>
                <SelectItem value="CST">CST (UTC-6)</SelectItem>
                <SelectItem value="MST">MST (UTC-7)</SelectItem>
                <SelectItem value="PST">PST (UTC-8)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={settings.currency} onValueChange={(value) => handleChange("currency", value)}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="CAD">CAD ($)</SelectItem>
                <SelectItem value="AUD">AUD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date-format">Date Format</Label>
            <Select value={settings.dateFormat} onValueChange={(value) => handleChange("dateFormat", value)}>
              <SelectTrigger id="date-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-format">Time Format</Label>
            <Select value={settings.timeFormat} onValueChange={(value) => handleChange("timeFormat", value)}>
              <SelectTrigger id="time-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-Hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="support-phone">Support Phone (Optional)</Label>
          <Input
            id="support-phone"
            value={settings.supportPhone || ""}
            onChange={(e) => handleChange("supportPhone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            value={settings.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Global Settings
        </Button>
      </CardContent>
    </Card>
  )
}
