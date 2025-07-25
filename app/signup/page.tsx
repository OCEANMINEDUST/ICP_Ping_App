"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Mail, Lock, User, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Social provider icons (reusing from signin)
const GoogleIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">G</span>
  </div>
)

const FacebookIcon = () => (
  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">f</span>
  </div>
)

const TelegramIcon = () => (
  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">T</span>
  </div>
)

const InstagramIcon = () => (
  <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
    <span className="text-white text-xs font-bold">I</span>
  </div>
)

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Account Created! 🎉",
      description: "Welcome to Ping! You can now start earning JET tokens.",
    })

    // Redirect to main app
    router.push("/")

    setIsLoading(false)
  }

  const handleSocialSignUp = async (provider: string) => {
    setSocialLoading(provider)

    // Simulate social authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: `Welcome to Ping! 🎉`,
      description: `Account created successfully with ${provider}`,
    })

    // In a real app, you would handle the OAuth flow here
    router.push("/")

    setSocialLoading(null)
  }

  const socialProviders = [
    {
      name: "Google",
      icon: <GoogleIcon />,
      color: "hover:bg-red-50 border-red-200",
      textColor: "text-red-700",
    },
    {
      name: "Facebook",
      icon: <FacebookIcon />,
      color: "hover:bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      name: "Telegram",
      icon: <TelegramIcon />,
      color: "hover:bg-blue-50 border-blue-200",
      textColor: "text-blue-600",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      color: "hover:bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Main Sign Up Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Join Ping</CardTitle>
            <CardDescription>Create your account and start earning rewards for sustainable actions</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign Up Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">Sign up with</p>
              <div className="grid grid-cols-2 gap-3">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    onClick={() => handleSocialSignUp(provider.name)}
                    disabled={socialLoading !== null}
                    className={`${provider.color} ${provider.textColor} transition-colors`}
                  >
                    {socialLoading === provider.name ? (
                      <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                      <>
                        {provider.icon}
                        <span className="ml-2">{provider.name}</span>
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or create account with email</span>
              </div>
            </div>

            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Bonus Info */}
        <Card className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">🎁 Welcome Bonus!</h3>
            <p className="text-sm mb-3">Get 100 JET tokens when you create your account</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>Verify your first product: +50 JET</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>Complete profile setup: +25 JET</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <span>First bottle recycled: +25 JET</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
