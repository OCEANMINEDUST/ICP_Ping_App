"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { X, Flashlight, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRScannerProps {
  onScanSuccess: (qrCode: string) => void
  onScanError?: (error: string) => void
  isActive: boolean
  onClose: () => void
}

export function QRScanner({ onScanSuccess, onScanError, isActive, onClose }: QRScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [flashEnabled, setFlashEnabled] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isActive) {
      initializeScanner()
    } else {
      stopScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isActive])

  const initializeScanner = async () => {
    try {
      // Get available cameras
      const devices = await Html5Qrcode.getCameras()
      setCameras(devices)

      if (devices.length > 0) {
        const backCamera =
          devices.find(
            (device) => device.label.toLowerCase().includes("back") || device.label.toLowerCase().includes("rear"),
          ) || devices[0]

        setSelectedCamera(backCamera.id)
        startScanning(backCamera.id)
      } else {
        onScanError?.("No cameras found")
      }
    } catch (error) {
      console.error("Camera initialization failed:", error)
      onScanError?.("Failed to access camera")
    }
  }

  const startScanning = async (cameraId: string) => {
    if (!scannerRef.current) return

    try {
      const html5QrCode = new Html5Qrcode("qr-scanner-container")
      html5QrCodeRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          toast({
            title: "QR Code Detected! 📱",
            description: `Scanned: ${decodedText.substring(0, 20)}...`,
          })
          onScanSuccess(decodedText)
          stopScanner()
        },
        (errorMessage) => {
          // Ignore frequent scanning errors
          if (!errorMessage.includes("No QR code found")) {
            console.warn("QR scan error:", errorMessage)
          }
        },
      )

      setIsScanning(true)
    } catch (error) {
      console.error("Failed to start scanning:", error)
      onScanError?.("Failed to start camera")
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
        setIsScanning(false)
      } catch (error) {
        console.error("Failed to stop scanner:", error)
      }
    }
  }

  const switchCamera = async () => {
    if (cameras.length <= 1) return

    const currentIndex = cameras.findIndex((cam) => cam.id === selectedCamera)
    const nextIndex = (currentIndex + 1) % cameras.length
    const nextCamera = cameras[nextIndex]

    await stopScanner()
    setSelectedCamera(nextCamera.id)
    await startScanning(nextCamera.id)
  }

  const toggleFlash = async () => {
    if (html5QrCodeRef.current) {
      try {
        const track = html5QrCodeRef.current.getRunningTrackCameraCapabilities()
        if (track?.torch) {
          await html5QrCodeRef.current.applyVideoConstraints({
            advanced: [{ torch: !flashEnabled }],
          })
          setFlashEnabled(!flashEnabled)
        }
      } catch (error) {
        console.error("Flash toggle failed:", error)
        toast({
          title: "Flash Not Available",
          description: "This device doesn't support camera flash",
          variant: "destructive",
        })
      }
    }
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Scan QR Code</h1>
        <div className="flex items-center gap-2">
          {cameras.length > 1 && (
            <Button variant="ghost" size="sm" onClick={switchCamera} className="text-white hover:bg-gray-800">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={toggleFlash} className="text-white hover:bg-gray-800">
            <Flashlight className={`h-4 w-4 ${flashEnabled ? "text-yellow-400" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-gray-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scanner Container */}
      <div className="flex-1 relative">
        <div id="qr-scanner-container" ref={scannerRef} className="w-full h-full" />

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="w-64 h-64 border-2 border-white rounded-lg relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
            </div>
            <p className="text-white text-center mt-4">Position QR code within the frame</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black text-white p-4 text-center">
        <p className="text-sm opacity-75">Hold your device steady and align the QR code within the frame</p>
      </div>
    </div>
  )
}
