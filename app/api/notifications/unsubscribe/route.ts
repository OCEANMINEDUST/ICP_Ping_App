import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd remove the subscription from the database
    // For now, we'll just acknowledge the unsubscribe request

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" })
  } catch (error) {
    console.error("Failed to unsubscribe:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
