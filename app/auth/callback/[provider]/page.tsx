"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useParams()
  const provider = params.provider as string
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get URL parameters (code, state, etc.)
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")
        const state = urlParams.get("state")
        const error = urlParams.get("error")

        if (error) {
          throw new Error(`Authentication error: ${error}`)
        }

        if (!code && provider !== "telegram") {
          throw new Error("No authorization code received")
        }

        // Handle different providers
        let authResponse
        if (provider === "telegram") {
          // For Telegram, we might have different parameters
          authResponse = await fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // Pass Telegram-specific auth data
              authData: Object.fromEntries(urlParams.entries()),
            }),
          })
        } else if (provider === "instagram") {
          authResponse = await fetch("/api/auth/instagram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, state }),
          })
        } else {
          // Handle other providers (Google, Facebook) with their standard OAuth flow
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }

        if (authResponse && !authResponse.ok) {
          throw new Error(`Authentication failed: ${authResponse.statusText}`)
        }

        setStatus("success")

        toast({
          title: "Authentication Successful! 🎉",
          description: `Successfully signed in with ${provider}`,
        })

        // Redirect to main app after a short delay
        setTimeout(() => {
          router.push("/")
        }, 1500)
      } catch (error) {
        console.error("Auth callback error:", error)
        setStatus("error")

        toast({
          title: "Authentication Failed",
          description: `Failed to complete ${provider} authentication`,
          variant: "destructive",
        })

        // Redirect to sign-in page after error
        setTimeout(() => {
          router.push("/signin")
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [provider, router, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Eye className="h-8 w-8 text-white" />
          </div>

          {status === "loading" && (
            <>
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
              <p className="text-gray-600">Finalizing your {provider} sign-in...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-600">Success!</h2>
              <p className="text-gray-600">Redirecting you to the app...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Failed</h2>
              <p className="text-gray-600">Redirecting you back to sign-in...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
