"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Eye, Wallet, Shield, Calendar, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface OnboardingStep {
  id: number
  title: string
  description: string
  component: React.ReactNode
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    birthDate: "",
    acceptTerms: false,
    walletConnected: false,
    walletAddress: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const connectWallet = async () => {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockWalletAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
    handleInputChange("walletConnected", true)
    handleInputChange("walletAddress", mockWalletAddress)

    toast({
      title: "Wallet Connected! 🎉",
      description: "Your wallet has been successfully connected to Ping",
    })
  }

  const verifyAge = () => {
    if (!formData.birthDate) {
      toast({
        title: "Date Required",
        description: "Please enter your birth date to continue",
        variant: "destructive",
      })
      return false
    }

    const birthDate = new Date(formData.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      toast({
        title: "Age Verification Failed",
        description: "You must be 18 or older to use Ping",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const nextStep = () => {
    if (currentStep === 2 && !verifyAge()) return
    if (currentStep === 3 && !formData.walletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      })
      return
    }
    if (currentStep === 4 && !formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive",
      })
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    toast({
      title: "Welcome to Ping! 🎉",
      description: "You've earned 100 JET tokens as a welcome bonus!",
    })
    router.push("/")
  }

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Ping",
      description: "Join the fight against counterfeit products and help save the environment",
      component: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <Eye className="h-12 w-12 text-white" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Ping</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Authenticate products, recycle bottles, and earn JET tokens while making a positive impact on the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm">Verify Products</h3>
              <p className="text-xs text-gray-600">Fight counterfeit goods</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm">Recycle Bottles</h3>
              <p className="text-xs text-gray-600">Help the environment</p>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-sm">Earn Rewards</h3>
              <p className="text-xs text-gray-600">Get JET tokens</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">🎁 Welcome Bonus</h3>
            <p className="text-sm">Get 100 JET tokens just for signing up!</p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Age Verification",
      description: "Confirm you're 18 or older to continue",
      component: (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Age Verification</h2>
            <p className="text-gray-600">You must be 18 or older to use Ping and earn JET tokens.</p>
          </div>

          <div className="max-w-sm mx-auto">
            <Label htmlFor="birthDate" className="text-left block mb-2">
              Date of Birth
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-semibold text-blue-800 text-sm">Privacy Protected</h4>
                <p className="text-blue-700 text-xs">
                  Your birth date is only used for age verification and is not stored or shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Connect Wallet",
      description: "Connect your wallet to start earning JET tokens",
      component: (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Wallet className="h-8 w-8 text-purple-600" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600">Connect your wallet to securely store and manage your JET tokens.</p>
          </div>

          {!formData.walletConnected ? (
            <div className="space-y-4">
              <Button onClick={connectWallet} size="lg" className="w-full max-w-sm">
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>

              <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-xs font-bold">M</span>
                    </div>
                    <span className="font-medium">MetaMask</span>
                  </div>
                  <Badge variant="outline">Popular</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">W</span>
                    </div>
                    <span className="font-medium">WalletConnect</span>
                  </div>
                  <Badge variant="secondary">Soon</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-semibold text-green-800 mb-2">Wallet Connected!</h4>
                <p className="text-green-700 text-sm font-mono break-all">{formData.walletAddress}</p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 border rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-800 text-sm">Secure & Private</h4>
                <p className="text-gray-600 text-xs">
                  Your wallet connection is secure and we never access your private keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Terms & Conditions",
      description: "Review and accept our terms to complete setup",
      component: (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Shield className="h-8 w-8 text-gray-600" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
            <p className="text-gray-600">Please review and accept our terms to start using Ping.</p>
          </div>

          <div className="max-w-md mx-auto bg-gray-50 border rounded-lg p-4 h-48 overflow-y-auto text-left text-sm">
            <h4 className="font-semibold mb-2">Ping Terms of Service</h4>
            <div className="space-y-2 text-gray-600">
              <p>1. You must be 18 or older to use this service.</p>
              <p>2. JET tokens are utility tokens for rewards redemption.</p>
              <p>3. Product authentication requires valid QR codes or NFC tags.</p>
              <p>4. Recycling rewards are subject to verification.</p>
              <p>5. Account suspension may occur for fraudulent activities.</p>
              <p>6. We reserve the right to modify rewards and terms.</p>
              <p>7. Your privacy is protected according to our Privacy Policy.</p>
              <p>8. Disputes are governed by applicable jurisdiction laws.</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 max-w-md mx-auto">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
            />
            <Label htmlFor="terms" className="text-sm text-left">
              I have read and agree to the{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>{currentStepData?.title}</CardTitle>
            <CardDescription>{currentStepData?.description}</CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {currentStepData?.component}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <Button onClick={nextStep}>
                {currentStep === steps.length ? "Complete Setup" : "Continue"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
