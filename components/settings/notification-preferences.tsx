"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { NotificationSettings } from "@/lib/settings/settings-manager"

interface NotificationPreferencesProps {
  initialSettings: NotificationSettings
  onSave: (settings: NotificationSettings) => void
}

export default function NotificationPreferences({ initialSettings, onSave }: NotificationPreferencesProps) {
  const [settings, setSettings] = useState(initialSettings)
  const { toast } = useToast()

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSelect = (field: keyof NotificationSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(settings)
    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been saved.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Notification Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
              <Label htmlFor="email-notifications" className="cursor-pointer">
                Email Notifications
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="slack-notifications"
                checked={settings.slackNotifications}
                onCheckedChange={() => handleToggle("slackNotifications")}
              />
              <Label htmlFor="slack-notifications" className="cursor-pointer">
                Slack Notifications
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="desktop-notifications"
                checked={settings.desktopNotifications}
                onCheckedChange={() => handleToggle("desktopNotifications")}
              />
              <Label htmlFor="desktop-notifications" className="cursor-pointer">
                Desktop Notifications
              </Label>
            </div>
          </div>
        </div>

        {settings.emailNotifications && (
          <div className="space-y-2">
            <Label htmlFor="email-digest">Email Digest Frequency</Label>
            <Select
              value={settings.emailDigestFrequency}
              onValueChange={(value: any) => handleSelect("emailDigestFrequency", value)}
            >
              <SelectTrigger id="email-digest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Notification Types</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="notify-lead"
                checked={settings.notifyOnNewLead}
                onCheckedChange={() => handleToggle("notifyOnNewLead")}
              />
              <Label htmlFor="notify-lead" className="cursor-pointer">
                New Lead Added
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="notify-deal"
                checked={settings.notifyOnDealUpdate}
                onCheckedChange={() => handleToggle("notifyOnDealUpdate")}
              />
              <Label htmlFor="notify-deal" className="cursor-pointer">
                Deal Updated
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="notify-task"
                checked={settings.notifyOnTaskAssignment}
                onCheckedChange={() => handleToggle("notifyOnTaskAssignment")}
              />
              <Label htmlFor="notify-task" className="cursor-pointer">
                Task Assigned to Me
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="notify-mentions"
                checked={settings.notifyOnMentions}
                onCheckedChange={() => handleToggle("notifyOnMentions")}
              />
              <Label htmlFor="notify-mentions" className="cursor-pointer">
                I'm Mentioned
              </Label>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
