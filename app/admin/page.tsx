"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Users,
  Eye,
  AlertTriangle,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
  Shield,
  MapPin,
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserTask {
  id: string
  userId: string
  userName: string
  type: "scan" | "recycle"
  description: string
  timestamp: number
  status: "completed" | "pending" | "flagged"
  reward: number
  location?: string
}

interface ScanLog {
  id: string
  userId: string
  userName: string
  productName: string
  qrCode: string
  result: "authentic" | "counterfeit" | "unknown"
  timestamp: number
  ipAddress: string
  deviceInfo: string
}

interface FraudCase {
  id: string
  userId: string
  userName: string
  type: "suspicious_scanning" | "fake_recycling" | "multiple_accounts"
  description: string
  severity: "low" | "medium" | "high"
  status: "open" | "investigating" | "resolved" | "dismissed"
  reportedAt: number
  evidence: string[]
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const { toast } = useToast()

  // Mock data
  const [userTasks] = useState<UserTask[]>([
    {
      id: "ut_001",
      userId: "user_001",
      userName: "john.doe@email.com",
      type: "scan",
      description: "Coca-Cola 500ml verified",
      timestamp: Date.now() - 3600000,
      status: "completed",
      reward: 50,
      location: "New York, NY",
    },
    {
      id: "ut_002",
      userId: "user_002",
      userName: "jane.smith@email.com",
      type: "recycle",
      description: "PET bottle recycled at Mall Center",
      timestamp: Date.now() - 7200000,
      status: "flagged",
      reward: 25,
      location: "Los Angeles, CA",
    },
    {
      id: "ut_003",
      userId: "user_003",
      userName: "bob.wilson@email.com",
      type: "scan",
      description: "Pepsi 330ml verified",
      timestamp: Date.now() - 10800000,
      status: "pending",
      reward: 40,
      location: "Chicago, IL",
    },
  ])

  const [scanLogs] = useState<ScanLog[]>([
    {
      id: "sl_001",
      userId: "user_001",
      userName: "john.doe@email.com",
      productName: "Coca-Cola 500ml",
      qrCode: "CC500ML001",
      result: "authentic",
      timestamp: Date.now() - 3600000,
      ipAddress: "192.168.1.100",
      deviceInfo: "iPhone 14 Pro, iOS 16.1",
    },
    {
      id: "sl_002",
      userId: "user_004",
      userName: "suspicious.user@email.com",
      productName: "Unknown Product",
      qrCode: "FAKE001",
      result: "counterfeit",
      timestamp: Date.now() - 5400000,
      ipAddress: "10.0.0.50",
      deviceInfo: "Android 12, Chrome 108",
    },
  ])

  const [fraudCases] = useState<FraudCase[]>([
    {
      id: "fc_001",
      userId: "user_004",
      userName: "suspicious.user@email.com",
      type: "suspicious_scanning",
      description: "User scanned 50+ products in 1 hour from same location",
      severity: "high",
      status: "investigating",
      reportedAt: Date.now() - 86400000,
      evidence: ["Multiple rapid scans", "Same geolocation", "Unusual pattern"],
    },
    {
      id: "fc_002",
      userId: "user_005",
      userName: "fake.recycler@email.com",
      type: "fake_recycling",
      description: "Claimed recycling rewards without valid drop-off verification",
      severity: "medium",
      status: "open",
      reportedAt: Date.now() - 172800000,
      evidence: ["No geolocation match", "Timestamp inconsistencies"],
    },
  ])

  const handleManualOverride = (taskId: string, action: "approve" | "reject") => {
    toast({
      title: `Task ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `Task ${taskId} has been ${action}d manually`,
    })
  }

  const handleFraudAction = (caseId: string, action: string) => {
    toast({
      title: "Fraud Case Updated",
      description: `Case ${caseId} status changed to ${action}`,
    })
  }

  const exportData = (type: string) => {
    toast({
      title: "Export Started",
      description: `${type} data export has been initiated`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "flagged":
        return "text-red-600"
      case "investigating":
        return "text-orange-600"
      case "resolved":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const quickActions = [
    {
      title: "Analytics Dashboard",
      description: "View detailed platform analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-blue-500",
    },
    {
      title: "Real-time Monitor",
      description: "Live activity monitoring",
      icon: Activity,
      href: "/admin/monitor",
      color: "bg-green-500",
    },
    {
      title: "User Management",
      description: "Manage platform users",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500",
    },
    {
      title: "Security Center",
      description: "Fraud detection and security",
      icon: Shield,
      href: "/admin/security",
      color: "bg-red-500",
    },
    {
      title: "Drop Points",
      description: "Manage recycling locations",
      icon: MapPin,
      href: "/admin/drop-points",
      color: "bg-emerald-500",
    },
    {
      title: "Token Economics",
      description: "JET token management",
      icon: Coins,
      href: "/admin/tokens",
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage Ping platform activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">12,543</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Scans</p>
                <p className="text-3xl font-bold">8,921</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-green-600 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Cases</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm text-red-600 mt-2 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold">99.9%</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access key admin functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">User Tasks</TabsTrigger>
          <TabsTrigger value="scans">Scan Logs</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Cases</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.description}</p>
                        <p className="text-sm text-gray-500">{task.userName}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Important system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">High Fraud Activity</h4>
                      <p className="text-sm text-yellow-700">Unusual scanning patterns detected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Settings className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">System Update</h4>
                      <p className="text-sm text-green-700">All systems running smoothly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Tasks Management</CardTitle>
              <CardDescription>Review and manage user scanning and recycling activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{task.description}</h4>
                        <p className="text-sm text-gray-600">{task.userName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.timestamp).toLocaleString()} • {task.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        <p className="text-sm font-semibold mt-1">+{task.reward} JET</p>
                      </div>
                    </div>

                    {task.status === "flagged" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleManualOverride(task.id, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleManualOverride(task.id, "reject")}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scan Logs Tab */}
        <TabsContent value="scans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Logs</CardTitle>
              <CardDescription>Detailed logs of all product scans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{log.productName}</h4>
                        <p className="text-sm text-gray-600">QR: {log.qrCode}</p>
                        <p className="text-xs text-gray-500">{log.userName}</p>
                      </div>
                      <Badge
                        className={
                          log.result === "authentic"
                            ? "bg-green-100 text-green-800"
                            : log.result === "counterfeit"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {log.result}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Time: {new Date(log.timestamp).toLocaleString()}</p>
                      <p>IP: {log.ipAddress}</p>
                      <p>Device: {log.deviceInfo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraud Cases Tab */}
        <TabsContent value="fraud" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Cases</CardTitle>
              <CardDescription>Monitor and investigate suspicious activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudCases.map((fraudCase) => (
                  <div key={fraudCase.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{fraudCase.type.replace(/_/g, " ").toUpperCase()}</h4>
                        <p className="text-sm text-gray-600">{fraudCase.description}</p>
                        <p className="text-xs text-gray-500">
                          User: {fraudCase.userName} • Reported: {new Date(fraudCase.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className={getSeverityColor(fraudCase.severity)}>{fraudCase.severity} severity</Badge>
                        <Badge variant="outline" className={getStatusColor(fraudCase.status)}>
                          {fraudCase.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-sm font-semibold mb-1">Evidence:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {fraudCase.evidence.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFraudAction(fraudCase.id, "investigating")}
                      >
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleFraudAction(fraudCase.id, "resolved")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleFraudAction(fraudCase.id, "dismissed")}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
