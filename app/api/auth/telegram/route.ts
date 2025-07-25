import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(request: NextRequest) {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { telegramData } = body

    if (!telegramData) {
      return NextResponse.json({ error: "Missing telegram data" }, { status: 400 })
    }

    // Verify Telegram data integrity
    const { hash, ...data } = telegramData
    const dataCheckString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("\n")

    // Create HMAC hash for verification
    const crypto = await import("node:crypto")
    const secretKey = crypto.createHash("sha256").update(TELEGRAM_BOT_TOKEN).digest()
    const hmac = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex")

    if (hmac !== hash) {
      return NextResponse.json({ error: "Invalid telegram data" }, { status: 401 })
    }

    // Check if data is not too old (5 minutes)
    const authDate = Number.parseInt(data.auth_date)
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime - authDate > 300) {
      return NextResponse.json({ error: "Authentication data is too old" }, { status: 401 })
    }

    // Create user object
    const user = {
      id: data.id,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      photo_url: data.photo_url,
      provider: "telegram",
    }

    // Create JWT token
    const token = await new SignJWT({ user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET)

    // Create response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user,
      message: "Authentication successful",
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Telegram auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
