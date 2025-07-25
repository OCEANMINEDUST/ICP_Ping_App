"use client"

import type React from "react"

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import { AdminLayout } from "@/components/admin/admin-layout"

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminAuthGuard>
  )
}
