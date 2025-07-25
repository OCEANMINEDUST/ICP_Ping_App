"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Users, Eye, AlertTriangle, RefreshCw, Pause, Play } from "lucide-react"

interface LiveActivity {
  id: string
  type: "scan" | "recycle" | "signup" | "fraud"
  user: string
  description: string
  timestamp: number
  location?: string
  status: "success" | "warning" | "error"
}

export default function RealTimeMonitorPage() {
  const [activities, setActivities] = useState<LiveActivity[]>([])
  const [isLive, setIsLive] = useState(true)
  const [stats, setStats] = useState({
    activeUsers: 1247,
    scansPerMinute: 23,
    alertsToday: 5,
    systemHealth: 99.8,
  })

  // Simulate real-time data
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        type: ["scan", "recycle", "signup", "fraud"][Math.floor(Math.random() * 4)] as any,
        user: `user_${Math.floor(Math.random() * 1000)}`,
        description: generateRandomActivity(),
        timestamp: Date.now(),
        location: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.1 ? "success" : Math.random() > 0.5 ? "warning" : "error",
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, 49)]) // Keep last 50 activities

      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats((prev) => ({
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
          scansPerMinute: Math.max(0, prev.scansPerMinute + Math.floor(Math.random() * 6 - 3)),
          alertsToday: prev.alertsToday + (Math.random() > 0.9 ? 1 : 0),
          systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 0.2)),
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  const generateRandomActivity = () => {
    const activities = [
      "Scanned Coca-Cola 500ml bottle",
      "Recycled PET bottle at Mall Center",
      "New user registration completed",
      "Suspicious scanning pattern detected",
      "Verified product authenticity",
      "Claimed recycling reward",
      "Failed authentication attempt",
      "Location verification successful",
    ]
    return activities[Math.floor(Math.random() * activities.length)]
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "scan":
        return <Eye className="h-4 w-4" />
      case "recycle":
        return <Activity className="h-4 w-4" />
      case "signup":
        return <Users className="h-4 w-4" />
      case "fraud":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "error":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-time Monitor</h1>
          <p className="text-gray-600">Live platform activity and system status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scans/Minute</p>
                <p className="text-3xl font-bold">{stats.scansPerMinute}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts Today</p>
                <p className="text-3xl font-bold">{stats.alertsToday}</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold">{stats.systemHealth.toFixed(1)}%</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Live Activity Feed
                {isLive && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </CardTitle>
              <CardDescription>Real-time platform events and user activities</CardDescription>
            </div>
            <Badge variant={isLive ? "default" : "secondary"} className={isLive ? "bg-green-600" : ""}>
              {isLive ? "LIVE" : "PAUSED"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm">Activity will appear here in real-time</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${getStatusColor(
                      activity.status,
                    )}`}
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            activity.type === "fraud"
                              ? "border-red-200 text-red-700"
                              : activity.type === "scan"
                                ? "border-blue-200 text-blue-700"
                                : activity.type === "recycle"
                                  ? "border-green-200 text-green-700"
                                  : "border-purple-200 text-purple-700"
                          }`}
                        >
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                        <span>User: {activity.user}</span>
                        {activity.location && <span>Location: {activity.location}</span>}
                        <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
