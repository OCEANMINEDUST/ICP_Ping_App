import { type NextRequest, NextResponse } from "next/server"
import { AdminAuthService } from "@/lib/auth/admin-auth"

export async function GET(request: NextRequest) {
  try {
    const admin = await AdminAuthService.getCurrentAdmin(request)

    if (!admin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    })
  } catch (error) {
    console.error("Get admin user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
