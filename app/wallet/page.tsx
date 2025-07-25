"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, ArrowLeft, Download, Send, Plus, Search, TrendingUp, TrendingDown, Gift } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  type: "scan" | "recycle" | "redeem" | "bonus" | "referral"
  amount: number
  timestamp: number
  description: string
  status: "completed" | "pending" | "failed"
  hash?: string
}

interface WalletStats {
  totalEarned: number
  totalSpent: number
  thisWeekEarned: number
  thisMonthEarned: number
  averageDaily: number
}

export default function WalletPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const [walletStats] = useState<WalletStats>({
    totalEarned: 2450,
    totalSpent: 1200,
    thisWeekEarned: 180,
    thisMonthEarned: 650,
    averageDaily: 25,
  })

  const [transactions] = useState<Transaction[]>([
    {
      id: "tx_001",
      type: "scan",
      amount: 50,
      timestamp: Date.now() - 3600000,
      description: "Coca-Cola 500ml verified",
      status: "completed",
      hash: "0x1234...5678",
    },
    {
      id: "tx_002",
      type: "recycle",
      amount: 25,
      timestamp: Date.now() - 7200000,
      description: "PET bottle recycled at Mall Center",
      status: "completed",
      hash: "0x2345...6789",
    },
    {
      id: "tx_003",
      type: "bonus",
      amount: 100,
      timestamp: Date.now() - 86400000,
      description: "Daily login streak bonus",
      status: "completed",
      hash: "0x3456...7890",
    },
    {
      id: "tx_004",
      type: "redeem",
      amount: -500,
      timestamp: Date.now() - 172800000,
      description: "Redeemed: Eco-Friendly Water Bottle",
      status: "completed",
      hash: "0x4567...8901",
    },
    {
      id: "tx_005",
      type: "referral",
      amount: 200,
      timestamp: Date.now() - 259200000,
      description: "Referral bonus from friend signup",
      status: "completed",
      hash: "0x5678...9012",
    },
    {
      id: "tx_006",
      type: "scan",
      amount: 40,
      timestamp: Date.now() - 345600000,
      description: "Pepsi 330ml verified",
      status: "pending",
    },
  ])

  const currentBalance = 1250

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "earned" && tx.amount > 0) ||
      (selectedFilter === "spent" && tx.amount < 0) ||
      tx.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "scan":
        return "🔍"
      case "recycle":
        return "♻️"
      case "redeem":
        return "🎁"
      case "bonus":
        return "⭐"
      case "referral":
        return "👥"
      default:
        return "💰"
    }
  }

  const getTransactionColor = (amount: number, status: string) => {
    if (status === "pending") return "text-yellow-600"
    if (status === "failed") return "text-red-600"
    return amount > 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
                <p className="text-sm text-gray-600">Manage your JET tokens</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Total Balance</p>
                <p className="text-4xl font-bold">{currentBalance.toLocaleString()}</p>
                <p className="text-sm opacity-90">JET Tokens</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">USD Value</p>
                <p className="text-2xl font-semibold">${(currentBalance * 0.01).toFixed(2)}</p>
                <p className="text-xs opacity-75">≈ $0.01 per JET</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/20">
              <Link href="/rewards" className="flex-1">
                <Button variant="secondary" className="w-full">
                  <Gift className="h-4 w-4 mr-2" />
                  Redeem
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{walletStats.totalEarned.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{walletStats.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{walletStats.thisWeekEarned}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{walletStats.averageDaily}</div>
              <div className="text-sm text-gray-600">Daily Average</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your JET token transactions</CardDescription>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All" },
                  { key: "earned", label: "Earned" },
                  { key: "spent", label: "Spent" },
                  { key: "scan", label: "Scans" },
                  { key: "recycle", label: "Recycle" },
                  { key: "redeem", label: "Redeemed" },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions found</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                          {tx.hash && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{tx.hash}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getTransactionColor(tx.amount, tx.status)}`}>
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString()} JET
                      </div>
                      <Badge
                        variant={
                          tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"
                        }
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredTransactions.length > 0 && (
              <div className="mt-6 text-center">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
