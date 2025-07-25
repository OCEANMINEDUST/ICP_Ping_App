"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Gift, ArrowLeft, Search, Star, Clock, CheckCircle, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface Reward {
  id: string
  name: string
  description: string
  cost: number
  category: "cash" | "products" | "vouchers" | "experiences"
  image: string
  availability: number
  rating: number
  estimatedDelivery: string
  terms: string[]
  isPopular: boolean
  discount?: number
}

interface ClaimedReward {
  id: string
  rewardId: string
  rewardName: string
  claimedAt: number
  status: "processing" | "ready" | "delivered" | "expired"
  qrCode?: string
  voucherCode?: string
  expiresAt?: number
}

export default function RewardsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const { toast } = useToast()

  const currentBalance = 1250

  const [rewards] = useState<Reward[]>([
    {
      id: "r_001",
      name: "Cash Withdrawal",
      description: "$10 USD equivalent direct to your bank account",
      cost: 1000,
      category: "cash",
      image: "/placeholder.svg?height=200&width=300&text=Cash",
      availability: 100,
      rating: 4.8,
      estimatedDelivery: "1-2 business days",
      terms: ["Minimum withdrawal $10", "Processing fee may apply", "Bank transfer only"],
      isPopular: true,
    },
    {
      id: "r_002",
      name: "Eco-Friendly Water Bottle",
      description: "Premium stainless steel water bottle with Ping branding",
      cost: 500,
      category: "products",
      image: "/placeholder.svg?height=200&width=300&text=Water+Bottle",
      availability: 25,
      rating: 4.6,
      estimatedDelivery: "3-5 business days",
      terms: ["Free shipping", "1-year warranty", "BPA-free materials"],
      isPopular: false,
    },
    {
      id: "r_003",
      name: "Amazon Gift Card",
      description: "$7.50 Amazon gift card for online shopping",
      cost: 750,
      category: "vouchers",
      image: "/placeholder.svg?height=200&width=300&text=Amazon+Card",
      availability: 50,
      rating: 4.9,
      estimatedDelivery: "Instant delivery",
      terms: ["Digital delivery", "Valid for 1 year", "US Amazon only"],
      isPopular: true,
      discount: 10,
    },
    {
      id: "r_004",
      name: "Coffee Shop Voucher",
      description: "$5 voucher for participating coffee shops",
      cost: 400,
      category: "vouchers",
      image: "/placeholder.svg?height=200&width=300&text=Coffee",
      availability: 75,
      rating: 4.4,
      estimatedDelivery: "Instant delivery",
      terms: ["Valid at 500+ locations", "Cannot be combined", "Expires in 6 months"],
      isPopular: false,
    },
    {
      id: "r_005",
      name: "Tree Planting Certificate",
      description: "Plant a tree in your name and receive a digital certificate",
      cost: 300,
      category: "experiences",
      image: "/placeholder.svg?height=200&width=300&text=Tree+Planting",
      availability: 200,
      rating: 4.7,
      estimatedDelivery: "2-3 weeks",
      terms: ["Digital certificate", "GPS coordinates provided", "Environmental impact report"],
      isPopular: false,
    },
    {
      id: "r_006",
      name: "Premium Membership",
      description: "3 months of Ping Premium with exclusive benefits",
      cost: 2000,
      category: "experiences",
      image: "/placeholder.svg?height=200&width=300&text=Premium",
      availability: 10,
      rating: 4.5,
      estimatedDelivery: "Instant activation",
      terms: ["Auto-renewal disabled", "Exclusive rewards access", "Priority support"],
      isPopular: false,
    },
  ])

  const [claimedRewards] = useState<ClaimedReward[]>([
    {
      id: "cr_001",
      rewardId: "r_003",
      rewardName: "Amazon Gift Card",
      claimedAt: Date.now() - 86400000,
      status: "ready",
      voucherCode: "AMZN-1234-5678-9012",
      expiresAt: Date.now() + 31536000000, // 1 year
    },
    {
      id: "cr_002",
      rewardId: "r_002",
      rewardName: "Eco-Friendly Water Bottle",
      claimedAt: Date.now() - 172800000,
      status: "processing",
    },
  ])

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || reward.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleClaimReward = async (reward: Reward) => {
    if (currentBalance < reward.cost) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${reward.cost - currentBalance} more JET tokens to claim this reward`,
        variant: "destructive",
      })
      return
    }

    // Simulate claiming process
    toast({
      title: "Reward Claimed! 🎉",
      description: `Successfully claimed ${reward.name}. Check your claimed rewards for details.`,
    })

    setShowClaimDialog(false)
    setSelectedReward(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "text-green-600"
      case "processing":
        return "text-yellow-600"
      case "delivered":
        return "text-blue-600"
      case "expired":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "delivered":
        return <Gift className="h-4 w-4" />
      case "expired":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
                <p className="text-sm text-gray-600">Redeem your JET tokens for amazing rewards</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">{currentBalance.toLocaleString()} JET</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Rewards</TabsTrigger>
            <TabsTrigger value="claimed">My Rewards</TabsTrigger>
          </TabsList>

          {/* Browse Rewards */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search rewards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: "all", label: "All" },
                      { key: "cash", label: "Cash" },
                      { key: "products", label: "Products" },
                      { key: "vouchers", label: "Vouchers" },
                      { key: "experiences", label: "Experiences" },
                    ].map((category) => (
                      <Button
                        key={category.key}
                        variant={selectedCategory === category.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.key)}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    {reward.isPopular && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {reward.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500">{reward.discount}% OFF</Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{reward.name}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{reward.cost} JET</div>
                        {reward.discount && (
                          <div className="text-sm text-gray-500 line-through">
                            {Math.round(reward.cost / (1 - reward.discount / 100))} JET
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{reward.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{reward.rating}</span>
                      </div>
                      <span>{reward.availability} available</span>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => setSelectedReward(reward)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{reward.name}</DialogTitle>
                            <DialogDescription>{reward.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Image
                              src={reward.image || "/placeholder.svg"}
                              alt={reward.name}
                              width={400}
                              height={200}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Cost:</span>
                                <span className="font-semibold">{reward.cost} JET</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Rating:</span>
                                <span>{reward.rating}/5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>{reward.estimatedDelivery}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {reward.terms.map((term, index) => (
                                  <li key={index}>• {term}</li>
                                ))}
                              </ul>
                            </div>
                            <Button
                              onClick={() => handleClaimReward(reward)}
                              disabled={currentBalance < reward.cost}
                              className="w-full"
                            >
                              {currentBalance >= reward.cost ? `Claim for ${reward.cost} JET` : "Insufficient Balance"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleClaimReward(reward)}
                        disabled={currentBalance < reward.cost}
                        className="flex-1"
                      >
                        Claim
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Claimed Rewards */}
          <TabsContent value="claimed" className="space-y-6">
            {claimedRewards.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No rewards claimed yet</h3>
                  <p className="text-gray-600 mb-4">Start claiming rewards to see them here</p>
                  <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>Browse Rewards</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {claimedRewards.map((claimed) => (
                  <Card key={claimed.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{claimed.rewardName}</h3>
                          <p className="text-gray-600">Claimed on {new Date(claimed.claimedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center gap-1 ${getStatusColor(claimed.status)}`}>
                            {getStatusIcon(claimed.status)}
                            <span className="capitalize font-medium">{claimed.status}</span>
                          </div>
                          {claimed.expiresAt && (
                            <p className="text-sm text-gray-500 mt-1">
                              Expires: {new Date(claimed.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {claimed.status === "ready" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800">Ready to Use!</h4>
                              {claimed.voucherCode && (
                                <p className="text-sm text-green-700 font-mono mt-1">Code: {claimed.voucherCode}</p>
                              )}
                            </div>
                            {claimed.qrCode && (
                              <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center">
                                <QrCode className="h-8 w-8" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {claimed.status === "processing" && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-semibold text-yellow-800">Processing</h4>
                          <p className="text-sm text-yellow-700">
                            Your reward is being prepared and will be ready soon.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
