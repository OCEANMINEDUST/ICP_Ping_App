"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { internetIdentityService } from "@/lib/auth/internet-identity"

interface InternetIdentityButtonProps {
  onSuccess?: (user: any) => void
  className?: string
}

export function InternetIdentityButton({ onSuccess, className }: InternetIdentityButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      const user = await internetIdentityService.login()

      if (user) {
        toast({
          title: "Internet Identity Login Successful! 🎉",
          description: `Welcome! Principal: ${user.principal.toString().substring(0, 20)}...`,
        })

        onSuccess?.(user)
      } else {
        throw new Error("Login cancelled or failed")
      }
    } catch (error) {
      console.error("Internet Identity login failed:", error)
      toast({
        title: "Login Failed",
        description: "Failed to authenticate with Internet Identity",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogin} disabled={isLoading} className={className} variant="outline">
      {isLoading ? (
        <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full mr-2" />
      ) : (
        <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 flex items-center justify-center">
          <span className="text-white text-xs font-bold">∞</span>
        </div>
      )}
      {isLoading ? "Connecting..." : "Internet Identity"}
    </Button>
  )
}
