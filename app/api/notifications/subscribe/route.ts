import { type NextRequest, NextResponse } from "next/server"

interface SubscriptionData {
  subscription: PushSubscription
  userAgent: string
}

// In a real app, you'd store subscriptions in a database
const subscriptions = new Map<string, SubscriptionData>()

export async function POST(request: NextRequest) {
  try {
    const { subscription, userAgent } = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 })
    }

    // Store subscription (in production, save to database)
    const subscriptionKey = subscription.endpoint
    subscriptions.set(subscriptionKey, { subscription, userAgent })

    console.log("Push subscription saved:", subscriptionKey)

    return NextResponse.json({ success: true, message: "Subscription saved successfully" })
  } catch (error) {
    console.error("Failed to save push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
