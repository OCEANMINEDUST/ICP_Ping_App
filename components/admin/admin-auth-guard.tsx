"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { AdminUser } from "@/lib/auth/admin-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface AdminAuthGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  fallback?: React.ReactNode
}

export function AdminAuthGuard({ children, requiredPermissions = [], fallback }: AdminAuthGuardProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/me")

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.user)

        // Check permissions
        if (requiredPermissions.length > 0) {
          const hasPermission = requiredPermissions.every((permission) => data.user.permissions.includes(permission))

          if (!hasPermission) {
            setError("Insufficient permissions")
            return
          }
        }
      } else {
        router.push("/signin?error=admin_required")
        return
      }
    } catch (error) {
      console.error("Admin auth check failed:", error)
      setError("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Verifying admin access...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !admin) {
    if (fallback) return <>{fallback}</>

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600">{error || "Admin access required"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
