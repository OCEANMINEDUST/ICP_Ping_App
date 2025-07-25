"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Gift, Shield, Recycle, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation Header */}
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
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Eye className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Fight Counterfeits,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
              Save the Planet
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the blockchain-powered movement to authenticate products and recycle PET bottles. Earn JET tokens while
            making a positive impact on the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Earning Now
                <Gift className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">🎁 Get 100 JET tokens as welcome bonus • No credit card required</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verify Products</h3>
              <p className="text-gray-600 mb-4">
                Scan QR codes to authenticate products and fight counterfeit goods. Earn 40-50 JET tokens per verified
                product.
              </p>
              <Badge className="bg-blue-100 text-blue-800">40-50 JET per scan</Badge>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Recycle Bottles</h3>
              <p className="text-gray-600 mb-4">
                Drop off PET bottles at verified recycling points. Help the environment while earning rewards.
              </p>
              <Badge className="bg-green-100 text-green-800">25 JET per bottle</Badge>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p className="text-gray-600 mb-4">
                Redeem JET tokens for cash, gift cards, eco-friendly products, and exclusive experiences.
              </p>
              <Badge className="bg-purple-100 text-purple-800">Real rewards</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="mb-16 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
              <p className="text-green-100">Making a real impact together</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">12,543</div>
                <div className="text-sm opacity-90">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">89,234</div>
                <div className="text-sm opacity-90">Products Verified</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">45,678</div>
                <div className="text-sm opacity-90">Bottles Recycled</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">$12,450</div>
                <div className="text-sm opacity-90">Rewards Distributed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your account and get 100 JET tokens as welcome bonus</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Scan & Recycle</h3>
              <p className="text-gray-600 text-sm">Verify products and recycle bottles to earn more JET tokens</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibent mb-2">Earn Tokens</h3>
              <p className="text-gray-600 text-sm">Build up your JET token balance through various activities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-gray-600 text-sm">Exchange tokens for cash, gift cards, and eco-friendly products</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of users who are already earning rewards while fighting counterfeits and helping the
              environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Get Started Free
                  <Star className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-orange-500 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold">Ping</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/about" className="hover:text-green-400">
                About
              </Link>
              <Link href="/privacy" className="hover:text-green-400">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-green-400">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-green-400">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 Ping. All rights reserved. Built on Internet Computer.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
