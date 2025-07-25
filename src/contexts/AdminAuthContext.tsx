"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminUser {
  id: string
  username: string
  role: "super_admin" | "admin" | "moderator"
  permissions: string[]
  name: string
  email: string
}

interface AdminAuthContextType {
  adminUser: AdminUser | null
  isAdminAuthenticated: boolean
  adminLogin: (credentials: { username: string; password: string }) => Promise<boolean>
  adminLogout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}

interface AdminAuthProviderProps {
  children: ReactNode
}

// Demo admin accounts
const DEMO_ADMINS = [
  {
    id: "admin_1",
    username: "superadmin",
    password: "admin123",
    role: "super_admin" as const,
    permissions: ["all"],
    name: "Super Administrator",
    email: "super@ping.com",
  },
  {
    id: "admin_2",
    username: "admin",
    password: "admin123",
    role: "admin" as const,
    permissions: ["users", "analytics", "monitor"],
    name: "System Administrator",
    email: "admin@ping.com",
  },
  {
    id: "admin_3",
    username: "moderator",
    password: "mod123",
    role: "moderator" as const,
    permissions: ["monitor", "users"],
    name: "Content Moderator",
    email: "mod@ping.com",
  },
]

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored admin authentication
    const storedAdmin = localStorage.getItem("ping_admin_user")
    const storedToken = localStorage.getItem("ping_admin_token")

    if (storedAdmin && storedToken) {
      try {
        const adminData = JSON.parse(storedAdmin)
        setAdminUser(adminData)
        setIsAdminAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored admin data:", error)
        localStorage.removeItem("ping_admin_user")
        localStorage.removeItem("ping_admin_token")
      }
    }
    setLoading(false)
  }, [])

  const adminLogin = async (credentials: { username: string; password: string }): Promise<boolean> => {
    const admin = DEMO_ADMINS.find((a) => a.username === credentials.username && a.password === credentials.password)

    if (admin) {
      const adminData = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        name: admin.name,
        email: admin.email,
      }

      setAdminUser(adminData)
      setIsAdminAuthenticated(true)
      localStorage.setItem("ping_admin_user", JSON.stringify(adminData))
      localStorage.setItem("ping_admin_token", `admin_token_${admin.id}`)
      return true
    }

    return false
  }

  const adminLogout = () => {
    setAdminUser(null)
    setIsAdminAuthenticated(false)
    localStorage.removeItem("ping_admin_user")
    localStorage.removeItem("ping_admin_token")
  }

  const value = {
    adminUser,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    loading,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}
