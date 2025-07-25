export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export class PushNotificationService {
  private static instance: PushNotificationService
  private registration: ServiceWorkerRegistration | null = null
  private subscription: PushSubscription | null = null

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService()
    }
    return PushNotificationService.instance
  }

  async init(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported")
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", this.registration)

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription()

      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("Notifications not supported")
    }

    let permission = Notification.permission

    if (permission === "default") {
      permission = await Notification.requestPermission()
    }

    return permission
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error("Service Worker not registered")
    }

    const permission = await this.requestPermission()
    if (permission !== "granted") {
      throw new Error("Notification permission denied")
    }

    try {
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription)

      return this.subscription
    } catch (error) {
      console.error("Push subscription failed:", error)
      return null
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true
    }

    try {
      const success = await this.subscription.unsubscribe()
      if (success) {
        this.subscription = null
        // Notify server about unsubscription
        await this.removeSubscriptionFromServer()
      }
      return success
    } catch (error) {
      console.error("Unsubscribe failed:", error)
      return false
    }
  }

  async showNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission()
    if (permission !== "granted") {
      throw new Error("Notification permission not granted")
    }

    if (!this.registration) {
      // Fallback to browser notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/icon-192x192.png",
        badge: payload.badge || "/badge-72x72.png",
        tag: payload.tag,
        data: payload.data,
      })
      return
    }

    await this.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icon-192x192.png",
      badge: payload.badge || "/badge-72x72.png",
      tag: payload.tag,
      data: payload.data,
      actions: payload.actions,
      requireInteraction: true,
      vibrate: [200, 100, 200],
    })
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error("Failed to send subscription to server:", error)
    }
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    try {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (error) {
      console.error("Failed to remove subscription from server:", error)
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  isSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  }

  getSubscription(): PushSubscription | null {
    return this.subscription
  }
}

export const pushNotificationService = PushNotificationService.getInstance()
