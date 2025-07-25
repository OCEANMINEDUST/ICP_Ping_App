"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, AlertTriangle, ArrowLeft, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { QRScanner } from "@/components/qr-scanner/qr-scanner"
import { geolocationService } from "@/lib/geolocation/geolocation-service"
import { pushNotificationService } from "@/lib/notifications/push-notification-service"

interface ScanResult {
  success: boolean
  product?: {
    name: string
    brand: string
    isAuthentic: boolean
    rewardAmount: number
  }
  error?: string
}

export default function ScanInterface() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize push notifications
    initializePushNotifications()

    // Get user location
    getCurrentLocation()
  }, [])

  const initializePushNotifications = async () => {
    if (pushNotificationService.isSupported()) {
      await pushNotificationService.init()
    }
  }

  const getCurrentLocation = async () => {
    try {
      const position = await geolocationService.getCurrentPosition()
      setUserLocation({
        lat: position.latitude,
        lng: position.longitude,
      })
    } catch (error) {
      setLocationError(error instanceof Error ? error.message : "Location access failed")
    }
  }

  const handleScanSuccess = async (qrCode: string) => {
    setIsScanning(true)
    setScanResult(null)
    setShowScanner(false)

    try {
      // Get current location for verification
      let locationData = null
      if (userLocation) {
        locationData = {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          timestamp: Date.now(),
        }
      }

      // Simulate API call to verify product
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock product database
      const products = [
        {
          qrCode: "CC500ML001",
          name: "Coca-Cola 500ml",
          brand: "Coca-Cola",
          isAuthentic: true,
          rewardAmount: 50,
        },
        {
          qrCode: "PP330ML002",
          name: "Pepsi 330ml",
          brand: "PepsiCo",
          isAuthentic: true,
          rewardAmount: 40,
        },
        {
          qrCode: "FAKE001",
          name: "Unknown Product",
          brand: "Unknown",
          isAuthentic: false,
          rewardAmount: 0,
        },
      ]

      const product = products.find((p) => p.qrCode === qrCode)

      if (product) {
        const result: ScanResult = {
          success: true,
          product: product,
        }
        setScanResult(result)

        if (product.isAuthentic) {
          toast({
            title: "Product Authenticated! ✅",
            description: `Earned ${product.rewardAmount} JET tokens`,
          })

          // Send push notification
          if (pushNotificationService.isSupported()) {
            await pushNotificationService.showNotification({
              title: "Product Verified!",
              body: `You earned ${product.rewardAmount} JET tokens for verifying ${product.name}`,
              icon: "/icon-192x192.png",
              tag: "scan-success",
              data: { type: "scan", reward: product.rewardAmount },
            })
          }
        } else {
          toast({
            title: "Counterfeit Detected! ⚠️",
            description: "This product could not be verified",
            variant: "destructive",
          })

          // Send fraud alert notification
          if (pushNotificationService.isSupported()) {
            await pushNotificationService.showNotification({
              title: "Counterfeit Product Detected",
              body: "Thank you for helping fight counterfeit goods!",
              icon: "/icon-192x192.png",
              tag: "counterfeit-alert",
              data: { type: "counterfeit", qrCode },
            })
          }
        }
      } else {
        setScanResult({
          success: false,
          error: "Product not found in database",
        })

        toast({
          title: "Product Not Found",
          description: "This QR code is not in our database",
          variant: "destructive",
        })
      }
    } catch (error) {
      setScanResult({
        success: false,
        error: "Failed to verify product",
      })

      toast({
        title: "Scan Failed",
        description: "Unable to verify product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleScanError = (error: string) => {
    toast({
      title: "Scanner Error",
      description: error,
      variant: "destructive",
    })
    setShowScanner(false)
  }

  const startScanning = () => {
    setShowScanner(true)
    setScanResult(null)
  }

  const resetScan = () => {
    setScanResult(null)
    setShowScanner(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Scanner</h1>
              <p className="text-sm text-gray-600">Scan QR codes to verify product authenticity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Location Status */}
        {locationError && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <MapPin className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Location access denied. Some features may be limited. {locationError}
            </AlertDescription>
          </Alert>
        )}

        {userLocation && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Location enabled. Scans will be verified with your current location.
            </AlertDescription>
          </Alert>
        )}

        {/* Scanner Interface */}
        {!showScanner && !scanResult && (
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to Scan</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Position the QR code within the camera frame to verify product authenticity and earn JET tokens.
              </p>
              <Button onClick={startScanning} size="lg" className="px-8">
                <Camera className="h-5 w-5 mr-2" />
                Start Scanning
              </Button>
            </CardContent>
          </Card>
        )}

        {/* QR Scanner Component */}
        <QRScanner
          isActive={showScanner}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
          onClose={() => setShowScanner(false)}
        />

        {/* Scanning Progress */}
        {isScanning && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verifying Product...</h3>
              <p className="text-gray-600">Please wait while we authenticate the product</p>
            </CardContent>
          </Card>
        )}

        {/* Scan Results */}
        {scanResult && (
          <Card>
            <CardHeader className="text-center">
              {scanResult.success && scanResult.product?.isAuthentic ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              )}

              <CardTitle
                className={scanResult.success && scanResult.product?.isAuthentic ? "text-green-600" : "text-red-600"}
              >
                {scanResult.success && scanResult.product?.isAuthentic
                  ? "Product Verified!"
                  : scanResult.success && !scanResult.product?.isAuthentic
                    ? "Counterfeit Detected"
                    : "Verification Failed"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {scanResult.success && scanResult.product && (
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">{scanResult.product.name}</h3>
                  <p className="text-gray-600">{scanResult.product.brand}</p>

                  {scanResult.product.isAuthentic ? (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Authentic product verified! You earned {scanResult.product.rewardAmount} JET tokens.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        This product appears to be counterfeit. Please report this to the brand owner.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {!scanResult.success && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {scanResult.error || "Unable to verify product. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={resetScan} variant="outline" className="flex-1 bg-transparent">
                  Scan Another
                </Button>
                <Link href="/" className="flex-1">
                  <Button className="w-full">Done</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!showScanner && !scanResult && !isScanning && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Find QR Code</h4>
                  <p className="text-sm text-gray-600">Look for the QR code on the product packaging</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Align & Scan</h4>
                  <p className="text-sm text-gray-600">Position the QR code within the camera frame</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Earn Rewards</h4>
                  <p className="text-sm text-gray-600">Get JET tokens for verified authentic products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
