import { type NextRequest, NextResponse } from "next/server"
import webpush from "web-push"

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  "mailto:admin@ping.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

export async function POST(request: NextRequest) {
  try {
    const { title, body, data, userId } = await request.json()

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 })
    }

    // In a real app, you'd fetch user subscriptions from database
    // For demo, we'll simulate sending to all subscriptions
    const payload = JSON.stringify({
      title,
      body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: data || {},
    })

    // Send notifications (in production, iterate through user subscriptions)
    console.log("Sending push notification:", { title, body, userId })

    return NextResponse.json({
      success: true,
      message: "Notifications sent successfully",
      sent: 1, // In production, return actual count
    })
  } catch (error) {
    console.error("Failed to send push notifications:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
