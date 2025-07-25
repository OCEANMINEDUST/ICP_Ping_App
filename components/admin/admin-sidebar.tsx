"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  Eye,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Bell,
  Database,
  MapPin,
  Coins,
  FileText,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/admin",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
        badge: null,
      },
      {
        title: "Real-time Monitor",
        url: "/admin/monitor",
        icon: Activity,
        badge: "Live",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
        badge: "12.5K",
      },
      {
        title: "User Tasks",
        url: "/admin/tasks",
        icon: Eye,
        badge: "23",
      },
      {
        title: "Scan Logs",
        url: "/admin/scans",
        icon: Database,
        badge: null,
      },
    ],
  },
  {
    title: "Security & Fraud",
    items: [
      {
        title: "Fraud Cases",
        url: "/admin/fraud",
        icon: AlertTriangle,
        badge: "5",
      },
      {
        title: "Security Alerts",
        url: "/admin/security",
        icon: Shield,
        badge: "2",
      },
      {
        title: "Audit Logs",
        url: "/admin/audit",
        icon: FileText,
        badge: null,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Drop Points",
        url: "/admin/drop-points",
        icon: MapPin,
        badge: null,
      },
      {
        title: "Token Economics",
        url: "/admin/tokens",
        icon: Coins,
        badge: null,
      },
      {
        title: "Notifications",
        url: "/admin/notifications",
        icon: Bell,
        badge: null,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        badge: null,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Mock admin user data
  const adminUser = {
    name: "Admin User",
    email: "admin@ping.com",
    role: "Super Admin",
    avatar: "/placeholder.svg?height=32&width=32&text=AU",
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/admin/auth/signout", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of the admin portal",
        })
        router.push("/admin/login")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Ping Admin</h2>
            <p className="text-xs text-gray-500">Management Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge
                            variant={item.badge === "Live" ? "default" : "secondary"}
                            className={`text-xs ${
                              item.badge === "Live"
                                ? "bg-green-100 text-green-800 animate-pulse"
                                : item.title === "Fraud Cases" || item.title === "Security Alerts"
                                  ? "bg-red-100 text-red-800"
                                  : ""
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{adminUser.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{adminUser.name}</p>
                      <p className="text-xs text-gray-500">{adminUser.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
