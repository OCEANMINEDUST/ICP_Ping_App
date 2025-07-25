import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET
const INSTAGRAM_CLIENT_ID = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID

export async function POST(request: NextRequest) {
  try {
    if (!INSTAGRAM_CLIENT_SECRET || !INSTAGRAM_CLIENT_ID) {
      return NextResponse.json({ error: "Instagram credentials not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { code, redirectUri } = body

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error("Instagram token exchange failed:", error)
      return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    const { access_token, user_id } = tokenData

    // Get user profile information
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${access_token}`,
    )

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 400 })
    }

    const userData = await userResponse.json()

    // Create user object
    const user = {
      id: userData.id,
      username: userData.username,
      account_type: userData.account_type,
      provider: "instagram",
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
    console.error("Instagram auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
