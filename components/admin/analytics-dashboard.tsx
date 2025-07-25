"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Users, Eye, Recycle, AlertTriangle, TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react"

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; activeUsers: number }>
  scanActivity: Array<{ date: string; scans: number; authentic: number; counterfeit: number }>
  recyclingData: Array<{ date: string; bottles: number; points: number }>
  fraudPatterns: Array<{ type: string; count: number; severity: string }>
  geographicData: Array<{ region: string; users: number; activity: number }>
  tokenEconomics: Array<{ date: string; issued: number; redeemed: number; circulating: number }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<AnalyticsData>({
    userGrowth: [
      { date: "2024-01-01", users: 1000, activeUsers: 800 },
      { date: "2024-01-02", users: 1050, activeUsers: 840 },
      { date: "2024-01-03", users: 1120, activeUsers: 890 },
      { date: "2024-01-04", users: 1200, activeUsers: 960 },
      { date: "2024-01-05", users: 1280, activeUsers: 1020 },
      { date: "2024-01-06", users: 1350, activeUsers: 1080 },
      { date: "2024-01-07", users: 1420, activeUsers: 1140 },
    ],
    scanActivity: [
      { date: "2024-01-01", scans: 500, authentic: 450, counterfeit: 50 },
      { date: "2024-01-02", scans: 520, authentic: 468, counterfeit: 52 },
      { date: "2024-01-03", scans: 580, authentic: 522, counterfeit: 58 },
      { date: "2024-01-04", scans: 620, authentic: 558, counterfeit: 62 },
      { date: "2024-01-05", scans: 650, authentic: 585, counterfeit: 65 },
      { date: "2024-01-06", scans: 680, authentic: 612, counterfeit: 68 },
      { date: "2024-01-07", scans: 720, authentic: 648, counterfeit: 72 },
    ],
    recyclingData: [
      { date: "2024-01-01", bottles: 200, points: 15 },
      { date: "2024-01-02", bottles: 220, points: 16 },
      { date: "2024-01-03", bottles: 250, points: 18 },
      { date: "2024-01-04", bottles: 280, points: 20 },
      { date: "2024-01-05", bottles: 300, points: 22 },
      { date: "2024-01-06", bottles: 320, points: 24 },
      { date: "2024-01-07", bottles: 350, points: 26 },
    ],
    fraudPatterns: [
      { type: "Suspicious Scanning", count: 15, severity: "high" },
      { type: "Fake Recycling", count: 8, severity: "medium" },
      { type: "Multiple Accounts", count: 12, severity: "high" },
      { type: "Location Spoofing", count: 5, severity: "low" },
      { type: "Bot Activity", count: 3, severity: "high" },
    ],
    geographicData: [
      { region: "North America", users: 5000, activity: 85 },
      { region: "Europe", users: 3500, activity: 78 },
      { region: "Asia Pacific", users: 4200, activity: 92 },
      { region: "Latin America", users: 1800, activity: 65 },
      { region: "Africa", users: 900, activity: 58 },
    ],
    tokenEconomics: [
      { date: "2024-01-01", issued: 10000, redeemed: 3000, circulating: 45000 },
      { date: "2024-01-02", issued: 12000, redeemed: 3500, circulating: 53500 },
      { date: "2024-01-03", issued: 15000, redeemed: 4000, circulating: 64500 },
      { date: "2024-01-04", issued: 18000, redeemed: 4500, circulating: 78000 },
      { date: "2024-01-05", issued: 20000, redeemed: 5000, circulating: 93000 },
      { date: "2024-01-06", issued: 22000, redeemed: 5500, circulating: 109500 },
      { date: "2024-01-07", issued: 25000, redeemed: 6000, circulating: 128500 },
    ],
  })

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const exportData = (type: string) => {
    // Simulate data export
    const dataToExport = JSON.stringify(data, null, 2)
    const blob = new Blob([dataToExport], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ping-analytics-${type}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights and platform metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData("all")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold">15,234</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs last period
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Scans</p>
                <p className="text-3xl font-bold">8,921</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3% vs yesterday
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bottles Recycled</p>
                <p className="text-3xl font-bold">45,678</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2% vs last week
                </p>
              </div>
              <Recycle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Fraud Cases</p>
                <p className="text-3xl font-bold">23</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5.2% vs last week
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="fraud">Fraud</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Total and active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan Activity</CardTitle>
                <CardDescription>Product verification results</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.scanActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="authentic" fill="#00C49F" />
                    <Bar dataKey="counterfeit" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.geographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, percent }) => `${region} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {data.geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Activity</CardTitle>
                <CardDescription>Activity levels by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.geographicData.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{region.users.toLocaleString()} users</div>
                        <div className="text-sm text-gray-500">{region.activity}% active</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recycling Activity</CardTitle>
              <CardDescription>Bottles recycled and drop points usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.recyclingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="bottles" stroke="#8884d8" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="points" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Pattern Analysis</CardTitle>
                <CardDescription>Types and frequency of fraudulent activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.fraudPatterns.map((pattern, index) => (
                    <div key={pattern.type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{pattern.type}</h4>
                        <p className="text-sm text-gray-500">{pattern.count} cases detected</p>
                      </div>
                      <Badge
                        variant={
                          pattern.severity === "high"
                            ? "destructive"
                            : pattern.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {pattern.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Metrics</CardTitle>
                <CardDescription>System performance in detecting fraud</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-gray-600">Detection Accuracy</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">1.2s</div>
                      <div className="text-xs text-gray-600">Avg Detection Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">0.3%</div>
                      <div className="text-xs text-gray-600">False Positive Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="economics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Economics</CardTitle>
              <CardDescription>JET token issuance, redemption, and circulation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.tokenEconomics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="issued" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="redeemed" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="circulating" stackId="2" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
