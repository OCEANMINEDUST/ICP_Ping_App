"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, MapPin, Wallet, Gift, Settings, LogOut, Recycle, Coins, Trophy, Users } from "lucide-react"

const HomePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 12543,
    totalScans: 89234,
    totalRecycled: 45678,
    jetTokensCirculating: 234567,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/landing")
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate("/landing")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const levelProgress = ((user.totalScans % 100) / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Recycle className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Ping</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {user.level}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name || "Eco Warrior"}! 🌱
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            You're making a difference! Keep scanning and recycling to earn more JET tokens.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">JET Tokens</CardTitle>
              <Coins className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.jetTokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <QrCode className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalScans}</div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bottles Recycled</CardTitle>
              <Recycle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalRecycled}</div>
              <p className="text-xs text-muted-foreground">+8 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.level}</div>
              <Progress value={levelProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{100 - (user.totalScans % 100)} scans to next level</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/scan")}>
                <CardHeader className="text-center">
                  <QrCode className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Scan Product</CardTitle>
                  <CardDescription>Scan QR codes to verify authenticity</CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate("/drop-points")}
              >
                <CardHeader className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-green-600 mb-2" />
                  <CardTitle className="text-lg">Find Drop Points</CardTitle>
                  <CardDescription>Locate nearby recycling centers</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/wallet")}>
                <CardHeader className="text-center">
                  <Wallet className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                  <CardTitle className="text-lg">My Wallet</CardTitle>
                  <CardDescription>Manage your JET tokens</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/rewards")}>
                <CardHeader className="text-center">
                  <Gift className="h-12 w-12 mx-auto text-orange-600 mb-2" />
                  <CardTitle className="text-lg">Rewards</CardTitle>
                  <CardDescription>Redeem tokens for rewards</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest scans and recycling activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <QrCode className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium">Scanned Coca-Cola Bottle</p>
                    <p className="text-sm text-muted-foreground">2 hours ago • +10 JET</p>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Recycle className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">Recycled at EcoCenter Downtown</p>
                    <p className="text-sm text-muted-foreground">1 day ago • +25 JET</p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Trophy className="h-8 w-8 text-purple-600" />
                  <div className="flex-1">
                    <p className="font-medium">Level Up! Reached Bronze</p>
                    <p className="text-sm text-muted-foreground">3 days ago • +50 JET Bonus</p>
                  </div>
                  <Badge variant="secondary">Achievement</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Global Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Users</span>
                    <span className="font-bold">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Products Scanned</span>
                    <span className="font-bold">{stats.totalScans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bottles Recycled</span>
                    <span className="font-bold">{stats.totalRecycled.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>JET Tokens</span>
                    <span className="font-bold">{stats.jetTokensCirculating.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                  <CardDescription>Top recyclers this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">1</Badge>
                    <div className="flex-1">
                      <p className="font-medium">EcoWarrior2024</p>
                      <p className="text-sm text-muted-foreground">1,234 bottles</p>
                    </div>
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">2</Badge>
                    <div className="flex-1">
                      <p className="font-medium">GreenHero</p>
                      <p className="text-sm text-muted-foreground">987 bottles</p>
                    </div>
                    <Trophy className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">3</Badge>
                    <div className="flex-1">
                      <p className="font-medium">RecycleKing</p>
                      <p className="text-sm text-muted-foreground">756 bottles</p>
                    </div>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default HomePage
