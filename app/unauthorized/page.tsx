"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact your administrator if you believe this is an
            error.
          </p>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              If you're an admin, make sure you're signed in with the correct account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/signin" className="flex-1">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
