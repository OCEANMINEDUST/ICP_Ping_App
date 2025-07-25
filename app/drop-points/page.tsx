"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Search, Navigation, Clock, Phone, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { geolocationService, type GeolocationCoordinates } from "@/lib/geolocation/geolocation-service"

interface DropPoint {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  distance?: number
  isActive: boolean
  hours: string
  phone?: string
  bottlesCollected: number
  capacity: number
  type: "mall" | "school" | "park" | "store"
  rewards: {
    perBottle: number
    bonusThreshold: number
    bonusAmount: number
  }
}

export default function DropPointLocator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)
  const [locationLoading, setLocationLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<DropPoint | null>(null)
  const { toast } = useToast()

  const [dropPoints, setDropPoints] = useState<DropPoint[]>([
    {
      id: "dp_001",
      name: "Central Mall Collection Hub",
      address: "123 Main Street, Downtown",
      latitude: 40.7128,
      longitude: -74.006,
      isActive: true,
      hours: "9:00 AM - 9:00 PM",
      phone: "+1 (555) 123-4567",
      bottlesCollected: 1250,
      capacity: 2000,
      type: "mall",
      rewards: {
        perBottle: 25,
        bonusThreshold: 10,
        bonusAmount: 50,
      },
    },
    {
      id: "dp_002",
      name: "Green University Campus",
      address: "456 College Avenue",
      latitude: 40.7589,
      longitude: -73.9851,
      isActive: true,
      hours: "24/7",
      bottlesCollected: 890,
      capacity: 1500,
      type: "school",
      rewards: {
        perBottle: 30,
        bonusThreshold: 5,
        bonusAmount: 25,
      },
    },
    {
      id: "dp_003",
      name: "Riverside Park Station",
      address: "789 Park Drive",
      latitude: 40.7831,
      longitude: -73.9712,
      isActive: true,
      hours: "6:00 AM - 10:00 PM",
      bottlesCollected: 456,
      capacity: 1000,
      type: "park",
      rewards: {
        perBottle: 20,
        bonusThreshold: 15,
        bonusAmount: 100,
      },
    },
    {
      id: "dp_004",
      name: "EcoMart Recycling Center",
      address: "321 Commerce Street",
      latitude: 40.7505,
      longitude: -73.9934,
      isActive: false,
      hours: "Temporarily Closed",
      bottlesCollected: 234,
      capacity: 800,
      type: "store",
      rewards: {
        perBottle: 35,
        bonusThreshold: 8,
        bonusAmount: 75,
      },
    },
  ])

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      calculateDistances()
    }
  }, [userLocation])

  const getCurrentLocation = async () => {
    setLocationLoading(true)
    setLocationError(null)

    try {
      const position = await geolocationService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      })

      setUserLocation(position)
      toast({
        title: "Location Found! 📍",
        description: "Drop points sorted by distance from your location",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get location"
      setLocationError(errorMessage)
      console.error("Geolocation error:", error)
    } finally {
      setLocationLoading(false)
    }
  }

  const calculateDistances = () => {
    if (!userLocation) return

    const updatedPoints = dropPoints.map((point) => ({
      ...point,
      distance: geolocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        point.latitude,
        point.longitude,
      ),
    }))

    // Sort by distance
    updatedPoints.sort((a, b) => (a.distance || 0) - (b.distance || 0))
    setDropPoints(updatedPoints)
  }

  const filteredPoints = dropPoints.filter((point) => {
    const matchesSearch =
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && point.isActive) ||
      (selectedFilter === "nearby" && point.distance && point.distance <= 2) ||
      point.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getDirections = (point: DropPoint) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${point.latitude},${point.longitude}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`
      window.open(url, "_blank")
    }
  }

  const recycleAtPoint = async (pointId: string) => {
    const point = dropPoints.find((p) => p.id === pointId)
    if (!point || !point.isActive) return

    // Check if user is near the drop point
    if (userLocation && point.distance) {
      const isNearby = await geolocationService.isNearLocation(
        point.latitude,
        point.longitude,
        0.1, // 100 meters
      )

      if (!isNearby) {
        toast({
          title: "Location Verification Failed",
          description: "You must be at the drop point to recycle bottles",
          variant: "destructive",
        })
        return
      }
    }

    // Simulate recycling process
    toast({
      title: "Recycling Confirmed! ♻️",
      description: `Earned ${point.rewards.perBottle} JET tokens at ${point.name}`,
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mall":
        return "🏬"
      case "school":
        return "🏫"
      case "park":
        return "🌳"
      case "store":
        return "🏪"
      default:
        return "📍"
    }
  }

  const getCapacityColor = (collected: number, capacity: number) => {
    const percentage = (collected / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
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
              <h1 className="text-2xl font-bold text-gray-900">Drop Points</h1>
              <p className="text-sm text-gray-600">Find recycling locations near you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Location Status */}
        {locationLoading && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-800">
              Getting your location to show nearby drop points...
            </AlertDescription>
          </Alert>
        )}

        {locationError && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <MapPin className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Location access denied: {locationError}. Drop points will be shown without distance sorting.
              <Button variant="link" className="p-0 h-auto ml-2 text-yellow-800 underline" onClick={getCurrentLocation}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {userLocation && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Location enabled! Drop points are sorted by distance from your current location.
              <span className="text-xs block mt-1">Accuracy: ±{userLocation.accuracy?.toFixed(0)}m</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "nearby", label: "Nearby" },
                  { key: "mall", label: "Malls" },
                  { key: "school", label: "Schools" },
                  { key: "park", label: "Parks" },
                  { key: "store", label: "Stores" },
                ].map((filter) => (
                  <Button
                    key={filter.key}
                    variant={selectedFilter === filter.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {filteredPoints.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drop points found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredPoints.map((point) => (
                <Card key={point.id} className={`${!point.isActive ? "opacity-60" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getTypeIcon(point.type)}</div>
                        <div>
                          <h3 className="font-semibold text-lg">{point.name}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {point.address}
                          </p>
                          {point.distance !== undefined && (
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Navigation className="h-3 w-3" />
                              {point.distance < 1
                                ? `${(point.distance * 1000).toFixed(0)}m away`
                                : `${point.distance.toFixed(1)}km away`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={point.isActive ? "default" : "secondary"}>
                          {point.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {point.hours}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-green-600">{point.rewards.perBottle} JET</div>
                        <div className="text-xs text-gray-600">Per Bottle</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div
                          className={`text-lg font-semibold ${getCapacityColor(point.bottlesCollected, point.capacity)}`}
                        >
                          {Math.round((point.bottlesCollected / point.capacity) * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Capacity</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-blue-600">+{point.rewards.bonusAmount}</div>
                        <div className="text-xs text-gray-600">Bonus at {point.rewards.bonusThreshold}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => getDirections(point)} variant="outline" className="flex-1">
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                      {point.phone && (
                        <Button onClick={() => window.open(`tel:${point.phone}`)} variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      <Button onClick={() => recycleAtPoint(point.id)} disabled={!point.isActive} className="flex-1">
                        Recycle Here
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                    <p>Map integration would show drop points with real-time locations</p>
                    <p className="text-sm mt-2">Found {filteredPoints.length} drop points in your area</p>
                    {userLocation && (
                      <p className="text-xs mt-1 text-green-600">
                        Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
