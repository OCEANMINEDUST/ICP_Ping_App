import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export interface AdminUser {
  id: string
  email: string
  role: "super_admin" | "moderator" | "analyst"
  permissions: string[]
  createdAt: Date
  lastLoginAt: Date
}

export interface AdminTokenPayload {
  userId: string
  email: string
  role: "super_admin" | "moderator" | "analyst"
  permissions: string[]
  exp: number
  iat: number
}

// Permission definitions
export const ADMIN_PERMISSIONS = {
  // User management
  VIEW_USERS: "view_users",
  MANAGE_USERS: "manage_users",
  BAN_USERS: "ban_users",

  // Content moderation
  VIEW_REPORTS: "view_reports",
  INVESTIGATE_FRAUD: "investigate_fraud",
  MODERATE_CONTENT: "moderate_content",

  // Analytics and reporting
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_DATA: "export_data",
  VIEW_FINANCIAL_DATA: "view_financial_data",

  // System administration
  MANAGE_SETTINGS: "manage_settings",
  SYSTEM_ADMIN: "system_admin",
  MANAGE_ADMINS: "manage_admins",
} as const

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<AdminUser["role"], string[]> = {
  analyst: [
    ADMIN_PERMISSIONS.VIEW_USERS,
    ADMIN_PERMISSIONS.VIEW_REPORTS,
    ADMIN_PERMISSIONS.VIEW_ANALYTICS,
    ADMIN_PERMISSIONS.EXPORT_DATA,
  ],
  moderator: [
    ADMIN_PERMISSIONS.VIEW_USERS,
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.VIEW_REPORTS,
    ADMIN_PERMISSIONS.INVESTIGATE_FRAUD,
    ADMIN_PERMISSIONS.MODERATE_CONTENT,
    ADMIN_PERMISSIONS.VIEW_ANALYTICS,
    ADMIN_PERMISSIONS.EXPORT_DATA,
  ],
  super_admin: [...Object.values(ADMIN_PERMISSIONS)],
}

export class AdminAuthService {
  static async generateAdminToken(user: AdminUser): Promise<string> {
    const payload: Omit<AdminTokenPayload, "exp" | "iat"> = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Admin tokens expire in 24 hours
      .sign(JWT_SECRET)

    return token
  }

  static async verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload as AdminTokenPayload
    } catch (error) {
      console.error("Admin token verification failed:", error)
      return null
    }
  }

  static async getCurrentAdmin(request?: NextRequest): Promise<AdminUser | null> {
    let token: string | null = null

    if (request) {
      // Get token from request headers or cookies
      const authHeader = request.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      } else {
        const tokenCookie = request.cookies.get("ping_admin_token")
        token = tokenCookie?.value || null
      }
    } else {
      // Server-side: get token from cookies
      const cookieStore = await cookies()
      const tokenCookie = cookieStore.get("ping_admin_token")
      token = tokenCookie?.value || null
    }

    if (!token) return null

    const payload = await this.verifyAdminToken(token)
    if (!payload) return null

    // In a real app, you'd fetch the full user data from database
    // For now, reconstruct from token payload
    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }
  }

  static async signInAdmin(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
    // In a real app, verify credentials against database
    // For demo purposes, use hardcoded admin accounts
    const adminAccounts = [
      {
        id: "admin_001",
        email: "admin@ping.app",
        password: "admin123", // In production, use hashed passwords
        role: "super_admin" as const,
      },
      {
        id: "admin_002",
        email: "moderator@ping.app",
        password: "mod123",
        role: "moderator" as const,
      },
      {
        id: "admin_003",
        email: "analyst@ping.app",
        password: "analyst123",
        role: "analyst" as const,
      },
    ]

    const account = adminAccounts.find((acc) => acc.email === email && acc.password === password)
    if (!account) return null

    const user: AdminUser = {
      id: account.id,
      email: account.email,
      role: account.role,
      permissions: ROLE_PERMISSIONS[account.role],
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }

    const token = await this.generateAdminToken(user)

    return { user, token }
  }

  static hasPermission(user: AdminUser, permission: string): boolean {
    return user.permissions.includes(permission)
  }

  static hasAnyPermission(user: AdminUser, permissions: string[]): boolean {
    return permissions.some((permission) => user.permissions.includes(permission))
  }

  static async signOut(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete("ping_admin_token")
  }

  static async setAdminCookie(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set("ping_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })
  }
}

// Utility function to get admin info from middleware headers
export function getAdminFromHeaders(request: NextRequest): Partial<AdminUser> | null {
  const userId = request.headers.get("x-admin-user-id")
  const role = request.headers.get("x-admin-role")
  const email = request.headers.get("x-admin-email")
  const permissionsHeader = request.headers.get("x-admin-permissions")

  if (!userId || !role || !email) return null

  let permissions: string[] = []
  try {
    permissions = permissionsHeader ? JSON.parse(permissionsHeader) : []
  } catch (error) {
    console.error("Failed to parse admin permissions from headers:", error)
  }

  return {
    id: userId,
    role: role as AdminUser["role"],
    email,
    permissions,
  }
}
