"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recycle, QrCode, Coins, Shield, Users, Leaf, ArrowRight, CheckCircle } from "lucide-react"

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: QrCode,
      title: "Product Authentication",
      description: "Scan QR codes to verify product authenticity and earn rewards",
      color: "text-blue-600",
    },
    {
      icon: Recycle,
      title: "Smart Recycling",
      description: "Find nearby drop points and track your recycling impact",
      color: "text-green-600",
    },
    {
      icon: Coins,
      title: "JET Token Rewards",
      description: "Earn JET tokens for every verified scan and recycling activity",
      color: "text-yellow-600",
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Built on Internet Computer for maximum security and transparency",
      color: "text-purple-600",
    },
  ]

  const stats = [
    { label: "Active Users", value: "12,543", icon: Users },
    { label: "Products Scanned", value: "89,234", icon: QrCode },
    { label: "Bottles Recycled", value: "45,678", icon: Recycle },
    { label: "JET Tokens Earned", value: "234,567", icon: Coins },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Ping</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/signin")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🌱 Powered by Internet Computer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Authenticate Products,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Earn Rewards
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the sustainable revolution! Scan product QR codes, verify authenticity, and earn JET tokens while
            contributing to a cleaner planet through smart recycling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="text-lg px-8 py-3">
              Start Earning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signin")} className="text-lg px-8 py-3">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How Ping Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to start earning rewards while making a positive environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 mx-auto ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Start Your Journey</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Three simple steps to start earning JET tokens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Scan Products</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use your phone to scan QR codes on PET bottles and verify their authenticity
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Recycle Smart</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Find nearby drop points and recycle your bottles at verified locations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Earn Rewards</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive JET tokens for every verified scan and recycling activity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">Why Choose Ping?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Blockchain Security</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Built on Internet Computer for maximum security and transparency
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Real Rewards</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Earn JET tokens that can be redeemed for real-world rewards
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Environmental Impact</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Track your contribution to a cleaner, more sustainable planet
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Community Driven</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Join a global community of eco-conscious individuals
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 text-white">
                <Leaf className="h-16 w-16 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Make a Difference</h3>
                <p className="text-lg mb-6">
                  Every scan and recycling activity contributes to a cleaner planet and earns you rewards.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">45K+</div>
                    <div className="text-sm opacity-90">Bottles Recycled</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">234K+</div>
                    <div className="text-sm opacity-90">JET Tokens Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users who are already making a difference and earning rewards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/signup")} className="text-lg px-8 py-3">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/signin")}
              className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-green-600"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Recycle className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold">Ping</span>
              </div>
              <p className="text-gray-400">
                Sustainable recycling platform powered by Internet Computer blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rewards
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Ping. All rights reserved. Built on Internet Computer.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
