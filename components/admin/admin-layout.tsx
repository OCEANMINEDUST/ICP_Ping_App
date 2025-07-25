"use client"

import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
