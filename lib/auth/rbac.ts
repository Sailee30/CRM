// Role-Based Access Control system
export type UserRole = "admin" | "manager" | "sales" | "support" | "viewer"

export interface Permission {
  resource: string
  actions: ("create" | "read" | "update" | "delete")[]
}

export interface Role {
  id: string
  name: UserRole
  description: string
  permissions: Permission[]
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  joinedAt: Date
  lastLogin?: Date
  isActive: boolean
}

// Default RBAC permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    { resource: "users", actions: ["create", "read", "update", "delete"] },
    { resource: "reports", actions: ["create", "read", "update", "delete"] },
    { resource: "settings", actions: ["create", "read", "update", "delete"] },
    { resource: "contacts", actions: ["create", "read", "update", "delete"] },
    { resource: "deals", actions: ["create", "read", "update", "delete"] },
    { resource: "tasks", actions: ["create", "read", "update", "delete"] },
    { resource: "integrations", actions: ["create", "read", "update", "delete"] },
    { resource: "workflows", actions: ["create", "read", "update", "delete"] },
  ],
  manager: [
    { resource: "users", actions: ["read", "update"] },
    { resource: "reports", actions: ["create", "read", "update"] },
    { resource: "contacts", actions: ["create", "read", "update"] },
    { resource: "deals", actions: ["create", "read", "update"] },
    { resource: "tasks", actions: ["create", "read", "update", "delete"] },
    { resource: "team-reports", actions: ["create", "read"] },
  ],
  sales: [
    { resource: "contacts", actions: ["create", "read", "update"] },
    { resource: "deals", actions: ["create", "read", "update"] },
    { resource: "tasks", actions: ["create", "read", "update"] },
    { resource: "reports", actions: ["read"] },
    { resource: "dashboard", actions: ["read"] },
  ],
  support: [
    { resource: "contacts", actions: ["read", "update"] },
    { resource: "tasks", actions: ["read", "update"] },
    { resource: "tickets", actions: ["create", "read", "update"] },
    { resource: "dashboard", actions: ["read"] },
  ],
  viewer: [
    { resource: "contacts", actions: ["read"] },
    { resource: "reports", actions: ["read"] },
    { resource: "dashboard", actions: ["read"] },
  ],
}

// RBAC Engine
export class RBACManager {
  private roles: Map<string, Role> = new Map()
  private userRoles: Map<string, UserRole> = new Map()

  constructor() {
    this.initializeDefaultRoles()
  }

  private initializeDefaultRoles() {
    const roleNames: UserRole[] = ["admin", "manager", "sales", "support", "viewer"]

    for (const roleName of roleNames) {
      const role: Role = {
        id: `role-${roleName}`,
        name: roleName,
        description: this.getRoleDescription(roleName),
        permissions: ROLE_PERMISSIONS[roleName],
        createdAt: new Date(),
      }
      this.roles.set(roleName, role)
    }
  }

  private getRoleDescription(role: UserRole): string {
    const descriptions: Record<UserRole, string> = {
      admin: "Full system access and administration capabilities",
      manager: "Team management and reporting capabilities",
      sales: "Sales and deal management capabilities",
      support: "Customer support and ticket management",
      viewer: "Read-only access to reports and dashboards",
    }
    return descriptions[role]
  }

  getRole(roleName: UserRole): Role | undefined {
    return this.roles.get(roleName)
  }

  getAllRoles(): Role[] {
    return Array.from(this.roles.values())
  }

  assignUserRole(userId: string, role: UserRole): void {
    this.userRoles.set(userId, role)
  }

  getUserRole(userId: string): UserRole | undefined {
    return this.userRoles.get(userId)
  }

  // Check if user has permission
  hasPermission(userId: string, resource: string, action: "create" | "read" | "update" | "delete"): boolean {
    const userRole = this.getUserRole(userId)
    if (!userRole) return false

    const role = this.getRole(userRole)
    if (!role) return false

    const resourcePermission = role.permissions.find((p) => p.resource === resource)
    return resourcePermission?.actions.includes(action) ?? false
  }

  // Check multiple permissions
  hasAnyPermission(userId: string, checks: Array<{ resource: string; action: string }>): boolean {
    return checks.some((check) => this.hasPermission(userId, check.resource, check.action as any))
  }

  hasAllPermissions(userId: string, checks: Array<{ resource: string; action: string }>): boolean {
    return checks.every((check) => this.hasPermission(userId, check.resource, check.action as any))
  }

  // Get all accessible resources for a user
  getAccessibleResources(userId: string): string[] {
    const userRole = this.getUserRole(userId)
    if (!userRole) return []

    const role = this.getRole(userRole)
    if (!role) return []

    return role.permissions.map((p) => p.resource)
  }

  // Create custom role
  createCustomRole(name: string, description: string, permissions: Permission[]): Role {
    const role: Role = {
      id: `role-${name}-${Date.now()}`,
      name: name as UserRole,
      description,
      permissions,
      createdAt: new Date(),
    }
    this.roles.set(name, role)
    return role
  }

  // Update role permissions
  updateRolePermissions(roleName: UserRole, permissions: Permission[]): void {
    const role = this.roles.get(roleName)
    if (role) {
      role.permissions = permissions
    }
  }
}

// Singleton instance
export const rbacManager = new RBACManager()
