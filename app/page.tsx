"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Camera, MapPin, Gift, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import LandingPage from "./landing/page"

interface ActiveTask {
  id: string
  type: "scan" | "recycle" | "daily"
  title: string
  description: string
  reward: number
  progress: number
  maxProgress: number
  expiresAt: number
}

interface Transaction {
  id: string
  type: "scan" | "recycle" | "redeem" | "bonus"
  amount: number
  timestamp: number
  description: string
  status: "completed" | "pending" | "failed"
}

export default function PingApp() {
  const [user, setUser] = useState({
    id: "user_001",
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    jetTokens: 1250,
    totalScans: 47,
    totalRecycled: 23,
    level: "Silver",
    isVerified: true,
  })

  const [activeTasks] = useState([
    {
      id: "task_001",
      type: "scan",
      title: "Daily Scanner",
      description: "Scan 5 products today",
      reward: 100,
      progress: 2,
      maxProgress: 5,
      expiresAt: Date.now() + 86400000,
    },
    {
      id: "task_002",
      type: "recycle",
      title: "Eco Warrior",
      description: "Recycle 3 bottles this week",
      reward: 150,
      progress: 1,
      maxProgress: 3,
      expiresAt: Date.now() + 604800000,
    },
    {
      id: "task_003",
      type: "daily",
      title: "Daily Login",
      description: "Login for 7 consecutive days",
      reward: 200,
      progress: 4,
      maxProgress: 7,
      expiresAt: Date.now() + 259200000,
    },
  ])

  const [recentTransactions] = useState([
    {
      id: "tx_001",
      type: "scan",
      amount: 50,
      timestamp: Date.now() - 3600000,
      description: "Coca-Cola 500ml verified",
      status: "completed",
    },
    {
      id: "tx_002",
      type: "recycle",
      amount: 25,
      timestamp: Date.now() - 7200000,
      description: "PET bottle recycled at Mall Center",
      status: "completed",
    },
    {
      id: "tx_003",
      type: "bonus",
      amount: 100,
      timestamp: Date.now() - 86400000,
      description: "Daily login streak bonus",
      status: "completed",
    },
  ])

  const { toast } = useToast()

  const getUserLevel = (tokens: number) => {
    if (tokens >= 2000) return { level: "Gold", color: "bg-yellow-500", progress: 100 }
    if (tokens >= 1000) return { level: "Silver", color: "bg-gray-400", progress: (tokens - 1000) / 10 }
    return { level: "Bronze", color: "bg-amber-600", progress: tokens / 10 }
  }

  const levelInfo = getUserLevel(user.jetTokens)

  const formatTimeRemaining = (timestamp: number) => {
    const remaining = timestamp - Date.now()
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const isAuthenticated = true // Set to false to see the landing page

  if (!isAuthenticated) {
    // Redirect to landing page for non-authenticated users
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ping</h1>
                <p className="text-sm text-gray-600">Authenticate • Recycle • Earn</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {user.jetTokens.toLocaleString()} JET
              </Badge>
              <Badge className={`${levelInfo.color} text-white`}>{levelInfo.level}</Badge>
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center">
                <div className="flex-1 p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user.isVerified ? "Verified" : "New"} User!
                  </h2>
                  <p className="text-green-100 mb-4">
                    You've earned {user.jetTokens.toLocaleString()} JET tokens and helped verify {user.totalScans}{" "}
                    products
                  </p>
                  <div className="flex gap-3">
                    <Link href="/scan">
                      <Button variant="secondary" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Quick Scan
                      </Button>
                    </Link>
                    <Link href="/drop-points">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
                      >
                        <MapPin className="h-4 w-4" />
                        Find Drop Points
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block w-48 h-32 relative">
                  <Image
                    src="/placeholder.svg?height=128&width=192&text=Hero+Image"
                    alt="Ping Hero"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/scan">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">Scan Product</h3>
                <p className="text-xs text-gray-600">Verify authenticity</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/drop-points">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm">Drop Points</h3>
                <p className="text-xs text-gray-600">Find recycling spots</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wallet">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-sm">Wallet</h3>
                <p className="text-xs text-gray-600">View balance</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rewards">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm">Rewards</h3>
                <p className="text-xs text-gray-600">Redeem tokens</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Wallet Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg">
                  <div className="text-2xl font-bold">{user.jetTokens.toLocaleString()}</div>
                  <div className="text-sm opacity-90">JET Tokens</div>
                  <div className="text-xs opacity-75 mt-1">≈ ${(user.jetTokens * 0.01).toFixed(2)} USD</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level Progress</span>
                    <span>{levelInfo.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${levelInfo.color}`}
                      style={{ width: `${Math.min(levelInfo.progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">{user.totalScans}</div>
                    <div className="text-xs text-gray-600">Products Scanned</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">{user.totalRecycled}</div>
                    <div className="text-xs text-gray-600">Bottles Recycled</div>
                  </div>
                </div>

                <Link href="/wallet">
                  <Button className="w-full">View Full Wallet</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
                <CardDescription>Complete tasks to earn bonus JET tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          +{task.reward} JET
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            Progress: {task.progress}/{task.maxProgress}
                          </span>
                          <span className="text-gray-500">Expires in {formatTimeRemaining(task.expiresAt)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === "scan" ? "bg-blue-100" : tx.type === "recycle" ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      {tx.type === "scan" ? (
                        <Camera className="h-4 w-4 text-blue-600" />
                      ) : tx.type === "recycle" ? (
                        <MapPin className="h-4 w-4 text-green-600" />
                      ) : (
                        <Gift className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"
                      }
                      className={tx.status === "completed" ? "text-green-600" : ""}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount} JET
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/wallet">
                <Button variant="outline">View All Transactions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
