// Settings and configuration management
export interface GlobalSettings {
  companyName: string
  timezone: string
  currency: string
  language: string
  dateFormat: string
  timeFormat: string
  companyLogo?: string
  contactEmail: string
  supportPhone?: string
  website?: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  slackNotifications: boolean
  desktopNotifications: boolean
  emailDigestFrequency: "immediate" | "daily" | "weekly"
  notifyOnNewLead: boolean
  notifyOnDealUpdate: boolean
  notifyOnTaskAssignment: boolean
  notifyOnMentions: boolean
}

export interface IntegrationSettings {
  emailProvider: string
  smtpHost?: string
  smtpPort?: number
  emailVerified: boolean
  slackWorkspaceId?: string
  slackConnected: boolean
  webhookUrl?: string
  webhookActive: boolean
}

export interface FeatureFlags {
  aiInsightsEnabled: boolean
  advancedReportsEnabled: boolean
  customWorkflowsEnabled: boolean
  apiAccessEnabled: boolean
  twoFactorAuthRequired: boolean
  advancedSecurityEnabled: boolean
  predictiveAnalyticsEnabled: boolean
  mlClusteringEnabled: boolean
}

export class SettingsManager {
  private globalSettings: GlobalSettings = {
    companyName: "Your Company",
    timezone: "UTC",
    currency: "USD",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    contactEmail: "contact@example.com",
  }

  private notificationSettings: NotificationSettings = {
    emailNotifications: true,
    slackNotifications: false,
    desktopNotifications: true,
    emailDigestFrequency: "daily",
    notifyOnNewLead: true,
    notifyOnDealUpdate: true,
    notifyOnTaskAssignment: true,
    notifyOnMentions: true,
  }

  private integrationSettings: IntegrationSettings = {
    emailProvider: "smtp",
    emailVerified: false,
    slackConnected: false,
    webhookActive: false,
  }

  private featureFlags: FeatureFlags = {
    aiInsightsEnabled: true,
    advancedReportsEnabled: true,
    customWorkflowsEnabled: true,
    apiAccessEnabled: true,
    twoFactorAuthRequired: false,
    advancedSecurityEnabled: false,
    predictiveAnalyticsEnabled: true,
    mlClusteringEnabled: true,
  }

  // Global Settings
  getGlobalSettings(): GlobalSettings {
    return { ...this.globalSettings }
  }

  updateGlobalSettings(updates: Partial<GlobalSettings>): GlobalSettings {
    this.globalSettings = { ...this.globalSettings, ...updates }
    return this.globalSettings
  }

  // Notification Settings
  getNotificationSettings(): NotificationSettings {
    return { ...this.notificationSettings }
  }

  updateNotificationSettings(updates: Partial<NotificationSettings>): NotificationSettings {
    this.notificationSettings = { ...this.notificationSettings, ...updates }
    return this.notificationSettings
  }

  // Integration Settings
  getIntegrationSettings(): IntegrationSettings {
    return { ...this.integrationSettings }
  }

  updateIntegrationSettings(updates: Partial<IntegrationSettings>): IntegrationSettings {
    this.integrationSettings = { ...this.integrationSettings, ...updates }
    return this.integrationSettings
  }

  // Feature Flags
  getFeatureFlags(): FeatureFlags {
    return { ...this.featureFlags }
  }

  updateFeatureFlags(updates: Partial<FeatureFlags>): FeatureFlags {
    this.featureFlags = { ...this.featureFlags, ...updates }
    return this.featureFlags
  }

  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.featureFlags[feature]
  }

  toggleFeature(feature: keyof FeatureFlags): boolean {
    this.featureFlags[feature] = !this.featureFlags[feature]
    return this.featureFlags[feature]
  }

  // Get all settings
  getAllSettings() {
    return {
      global: this.globalSettings,
      notifications: this.notificationSettings,
      integrations: this.integrationSettings,
      featureFlags: this.featureFlags,
    }
  }
}

export const settingsManager = new SettingsManager()
