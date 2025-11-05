"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import GlobalSettingsForm from "@/components/settings/global-settings-form"
import NotificationPreferences from "@/components/settings/notification-preferences"
import FeatureFlagsManager from "@/components/settings/feature-flags-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { settingsManager } from "@/lib/settings/settings-manager"
import { rbacManager } from "@/lib/auth/rbac"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Settings, Bell, Flag } from "lucide-react"

export default function SettingsPage() {
  const [globalSettings, setGlobalSettings] = useState(settingsManager.getGlobalSettings())
  const [notificationSettings, setNotificationSettings] = useState(settingsManager.getNotificationSettings())
  const [featureFlags, setFeatureFlags] = useState(settingsManager.getFeatureFlags())

  // Sample users for RBAC demo
  const sampleUsers = [
    { id: "user-1", email: "alice@company.com", name: "Alice Johnson", role: "admin" as const, joinedAt: "2024-01-15" },
    { id: "user-2", email: "bob@company.com", name: "Bob Smith", role: "manager" as const, joinedAt: "2024-02-20" },
    {
      id: "user-3",
      email: "charlie@company.com",
      name: "Charlie Brown",
      role: "sales" as const,
      joinedAt: "2024-03-10",
    },
    {
      id: "user-4",
      email: "diana@company.com",
      name: "Diana Prince",
      role: "support" as const,
      joinedAt: "2024-03-25",
    },
  ]

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    manager: "bg-blue-100 text-blue-800",
    sales: "bg-green-100 text-green-800",
    support: "bg-yellow-100 text-yellow-800",
    viewer: "bg-gray-100 text-gray-800",
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your CRM configuration, permissions, and feature flags</p>
        </div>

        <Tabs defaultValue="global" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="global">
              <Settings className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Global</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="rbac">
              <Users className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">RBAC</span>
            </TabsTrigger>
            <TabsTrigger value="features">
              <Flag className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <GlobalSettingsForm
              initialSettings={globalSettings}
              onSave={(settings) => {
                setGlobalSettings(settings)
                settingsManager.updateGlobalSettings(settings)
              }}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationPreferences
              initialSettings={notificationSettings}
              onSave={(settings) => {
                setNotificationSettings(settings)
                settingsManager.updateNotificationSettings(settings)
              }}
            />
          </TabsContent>

          <TabsContent value="rbac" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {rbacManager.getAllRoles().map((role) => (
                <Card key={role.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    <div className="text-xs">
                      <p className="font-semibold mb-2">Permissions:</p>
                      <ul className="space-y-1">
                        {role.permissions.slice(0, 3).map((perm) => (
                          <li key={perm.resource} className="text-muted-foreground">
                            • {perm.resource}: {perm.actions.join(", ")}
                          </li>
                        ))}
                        {role.permissions.length > 3 && (
                          <li className="text-muted-foreground">• +{role.permissions.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Roles & Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={roleColors[user.role]}>{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.joinedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <FeatureFlagsManager
              initialFlags={featureFlags}
              onSave={(flags) => {
                setFeatureFlags(flags)
                settingsManager.updateFeatureFlags(flags)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
