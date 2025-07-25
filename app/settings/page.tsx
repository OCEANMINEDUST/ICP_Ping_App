"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Wallet, Globe, Bell, Shield, MessageSquare, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    language: "en",
    notifications: {
      rewards: true,
      scanning: true,
      recycling: false,
      marketing: false,
    },
    privacy: {
      shareStats: true,
      publicProfile: false,
    },
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  })

  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    })
  }

  const handleWalletSwitch = () => {
    toast({
      title: "Wallet Switch",
      description: "Wallet switching functionality would be implemented here",
    })
  }

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please enter your feedback before submitting",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Feedback Sent! 📝",
      description: "Thank you for your feedback. We'll review it soon.",
    })
    setFeedback("")
  }

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    // Implement logout logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Account Status</h4>
                    <p className="text-sm text-gray-600">Your account is verified and active</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Settings */}
          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Management
                </CardTitle>
                <CardDescription>Manage your connected wallet and payment preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">Connected Wallet</h4>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <p className="text-blue-700 font-mono text-sm break-all">{settings.walletAddress}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={handleWalletSwitch}>
                      Switch Wallet
                    </Button>
                    <Button size="sm" variant="outline">
                      View on Explorer
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Supported Wallets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: "MetaMask", status: "Connected", color: "green" },
                      { name: "WalletConnect", status: "Available", color: "gray" },
                      { name: "Coinbase Wallet", status: "Available", color: "gray" },
                      { name: "Trust Wallet", status: "Coming Soon", color: "yellow" },
                    ].map((wallet) => (
                      <div key={wallet.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{wallet.name[0]}</span>
                          </div>
                          <span className="font-medium">{wallet.name}</span>
                        </div>
                        <Badge
                          variant={wallet.color === "green" ? "default" : "secondary"}
                          className={
                            wallet.color === "green"
                              ? "bg-green-100 text-green-800"
                              : wallet.color === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                          }
                        >
                          {wallet.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Security Reminder</h4>
                  <p className="text-yellow-700 text-sm">
                    Never share your private keys or seed phrase. Ping will never ask for this information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>Set your preferred language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc-5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="utc+0">UTC</SelectItem>
                      <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "rewards",
                    label: "Reward Updates",
                    description: "Get notified when you earn or can claim rewards",
                  },
                  {
                    key: "scanning",
                    label: "Scanning Results",
                    description: "Notifications about product authentication results",
                  },
                  {
                    key: "recycling",
                    label: "Recycling Reminders",
                    description: "Reminders to recycle and find drop points",
                  },
                  {
                    key: "marketing",
                    label: "Marketing Updates",
                    description: "News about new features and promotions",
                  },
                ].map((notification) => (
                  <div key={notification.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{notification.label}</h4>
                      <p className="text-sm text-gray-600">{notification.description}</p>
                    </div>
                    <Switch
                      checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                      onCheckedChange={(checked) => handleSettingChange("notifications", notification.key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy settings and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Share Statistics</h4>
                    <p className="text-sm text-gray-600">Allow anonymous sharing of your activity statistics</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareStats}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "shareStats", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                  </div>
                  <Switch
                    checked={settings.privacy.publicProfile}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "publicProfile", checked)}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Data Protection</h4>
                  <p className="text-blue-700 text-sm mb-3">
                    Your personal data is protected according to GDPR and other privacy regulations.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Download My Data
                    </Button>
                    <Button size="sm" variant="outline">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Help & Support
                </CardTitle>
                <CardDescription>Get help or send us your feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
                    <h4 className="font-semibold mb-1">FAQ</h4>
                    <p className="text-sm text-gray-600">Find answers to common questions</p>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
                    <h4 className="font-semibold mb-1">Contact Support</h4>
                    <p className="text-sm text-gray-600">Get help from our support team</p>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
                    <h4 className="font-semibold mb-1">Community</h4>
                    <p className="text-sm text-gray-600">Join our Discord community</p>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
                    <h4 className="font-semibold mb-1">Report Bug</h4>
                    <p className="text-sm text-gray-600">Report technical issues</p>
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Send Feedback</h4>
                  <Textarea
                    placeholder="Tell us what you think about Ping or suggest improvements..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleFeedbackSubmit}>Send Feedback</Button>
                </div>

                <div className="p-4 bg-gray-50 border rounded-lg">
                  <h4 className="font-semibold mb-2">App Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Version: 1.0.0</p>
                    <p>Build: 2024.01.15</p>
                    <p>Platform: Web</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <LogOut className="h-5 w-5" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account status</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
