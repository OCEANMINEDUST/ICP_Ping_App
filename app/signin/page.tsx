"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, Mail, Lock, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Social provider icons (using simple colored divs for demo)
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

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // For demo purposes, accept any email/password
    toast({
      title: "Welcome to Ping! 🎉",
      description: "Successfully signed in with email",
    })

    // Redirect to main app
    router.push("/")

    setIsLoading(false)
  }

  const handleSocialSignIn = async (provider: string) => {
    setSocialLoading(provider)

    // Simulate social authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: `Welcome to Ping! 🎉`,
      description: `Successfully signed in with ${provider}`,
    })

    // In a real app, you would handle the OAuth flow here
    // For demo, redirect to main app
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

        {/* Main Sign In Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Ping</CardTitle>
            <CardDescription>Sign in to start authenticating products and recycling for rewards</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Sign In Options */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">Sign in with</p>
              <div className="grid grid-cols-2 gap-3">
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    onClick={() => handleSocialSignIn(provider.name)}
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
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Why join Ping?</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Earn JET tokens for product authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Get rewards for recycling PET bottles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Help fight counterfeit products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span>Contribute to environmental sustainability</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
