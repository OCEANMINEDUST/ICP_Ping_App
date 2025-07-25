import { type NextRequest, NextResponse } from "next/server"
import { AdminAuthService } from "@/lib/auth/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await AdminAuthService.signInAdmin(email, password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { user, token } = result

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
    })

    response.cookies.set("ping_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Admin signin error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
