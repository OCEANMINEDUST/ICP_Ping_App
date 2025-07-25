export interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  heading?: number
  speed?: number
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export class GeolocationService {
  private static instance: GeolocationService
  private watchId: number | null = null
  private currentPosition: GeolocationCoordinates | null = null

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService()
    }
    return GeolocationService.instance
  }

  async getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      const defaultOptions: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options,
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: GeolocationCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
          }
          this.currentPosition = coords
          resolve(coords)
        },
        (error) => {
          let errorMessage = "Unknown geolocation error"
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out"
              break
          }
          reject(new Error(errorMessage))
        },
        defaultOptions,
      )
    })
  }

  watchPosition(
    onSuccess: (position: GeolocationCoordinates) => void,
    onError?: (error: Error) => void,
    options?: GeolocationOptions,
  ): number {
    if (!navigator.geolocation) {
      onError?.(new Error("Geolocation is not supported"))
      return -1
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options,
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: GeolocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          heading: position.coords.heading || undefined,
          speed: position.coords.speed || undefined,
        }
        this.currentPosition = coords
        onSuccess(coords)
      },
      (error) => {
        let errorMessage = "Unknown geolocation error"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location timeout"
            break
        }
        onError?.(new Error(errorMessage))
      },
      defaultOptions,
    )

    return this.watchId
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  async isNearLocation(targetLat: number, targetLon: number, radiusKm = 0.1): Promise<boolean> {
    try {
      const currentPos = await this.getCurrentPosition()
      const distance = this.calculateDistance(currentPos.latitude, currentPos.longitude, targetLat, targetLon)
      return distance <= radiusKm
    } catch (error) {
      console.error("Location verification failed:", error)
      return false
    }
  }

  getLastKnownPosition(): GeolocationCoordinates | null {
    return this.currentPosition
  }
}

export const geolocationService = GeolocationService.getInstance()
