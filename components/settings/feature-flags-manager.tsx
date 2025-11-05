"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { FeatureFlags } from "@/lib/settings/settings-manager"

interface FeatureFlagsManagerProps {
  initialFlags: FeatureFlags
  onSave: (flags: FeatureFlags) => void
}

const FEATURE_DESCRIPTIONS: Record<keyof FeatureFlags, string> = {
  aiInsightsEnabled: "Enable AI-powered insights and recommendations",
  advancedReportsEnabled: "Enable advanced reporting and custom reports",
  customWorkflowsEnabled: "Enable custom workflow automation",
  apiAccessEnabled: "Enable API access for integrations",
  twoFactorAuthRequired: "Require two-factor authentication for all users",
  advancedSecurityEnabled: "Enable advanced security features",
  predictiveAnalyticsEnabled: "Enable predictive analytics and forecasting",
  mlClusteringEnabled: "Enable machine learning-based customer clustering",
}

export default function FeatureFlagsManager({ initialFlags, onSave }: FeatureFlagsManagerProps) {
  const [flags, setFlags] = useState(initialFlags)
  const { toast } = useToast()

  const handleToggle = (feature: keyof FeatureFlags) => {
    setFlags((prev) => ({ ...prev, [feature]: !prev[feature] }))
  }

  const handleSave = () => {
    onSave(flags)
    toast({
      title: "Features updated",
      description: "Feature flags have been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>Enable or disable v8 features for your organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(flags).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label className="text-base font-medium cursor-pointer">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                <p className="text-sm text-muted-foreground mt-1">{FEATURE_DESCRIPTIONS[key as keyof FeatureFlags]}</p>
              </div>
              <Switch checked={value as boolean} onCheckedChange={() => handleToggle(key as keyof FeatureFlags)} />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Feature Flags
        </Button>
      </CardContent>
    </Card>
  )
}
