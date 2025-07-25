import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Admin route patterns
const ADMIN_ROUTES = ["/admin"]
const PUBLIC_ROUTES = ["/", "/signin", "/signup", "/landing", "/auth"]

// JWT secret for verification
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

interface AdminTokenPayload {
  userId: string
  email: string
  role: "super_admin" | "moderator" | "analyst"
  permissions: string[]
  exp: number
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and API routes
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check if accessing admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    return await handleAdminRoute(request)
  }

  // For user routes, check basic authentication
  return await handleUserRoute(request)
}

async function handleAdminRoute(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromRequest(request)

  if (!token) {
    console.log("Admin access denied: No token provided")
    return redirectToSignIn(request, "admin_required")
  }

  try {
    const payload = await verifyAdminToken(token)

    if (!payload) {
      console.log("Admin access denied: Invalid token")
      return redirectToSignIn(request, "invalid_admin_token")
    }

    // Check if user has admin role
    if (!["super_admin", "moderator", "analyst"].includes(payload.role)) {
      console.log(`Admin access denied: Insufficient role - ${payload.role}`)
      return redirectToUnauthorized(request)
    }

    // Check specific admin permissions for different routes
    const requiredPermission = getRequiredPermission(request.nextUrl.pathname)
    if (requiredPermission && !payload.permissions.includes(requiredPermission)) {
      console.log(`Admin access denied: Missing permission - ${requiredPermission}`)
      return redirectToUnauthorized(request)
    }

    // Add admin info to headers for the page to use
    const response = NextResponse.next()
    response.headers.set("x-admin-user-id", payload.userId)
    response.headers.set("x-admin-role", payload.role)
    response.headers.set("x-admin-email", payload.email)
    response.headers.set("x-admin-permissions", JSON.stringify(payload.permissions))

    console.log(`Admin access granted: ${payload.email} (${payload.role}) accessing ${request.nextUrl.pathname}`)
    return response
  } catch (error) {
    console.error("Admin token verification failed:", error)
    return redirectToSignIn(request, "token_verification_failed")
  }
}

async function handleUserRoute(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromRequest(request)

  // For now, allow access to user routes without strict authentication
  // In production, you might want to enforce authentication for all routes
  if (!token) {
    // Redirect to landing page for unauthenticated users
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/landing", request.url))
    }
  }

  return NextResponse.next()
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Try to get token from cookie
  const tokenCookie = request.cookies.get("ping_admin_token")
  if (tokenCookie) {
    return tokenCookie.value
  }

  // Try to get token from ping_auth_token cookie (for regular users)
  const userTokenCookie = request.cookies.get("ping_auth_token")
  if (userTokenCookie) {
    return userTokenCookie.value
  }

  return null
}

async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    // Validate payload structure
    if (
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      typeof payload.role === "string" &&
      Array.isArray(payload.permissions)
    ) {
      return payload as AdminTokenPayload
    }

    return null
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

function getRequiredPermission(pathname: string): string | null {
  // Define permission requirements for different admin routes
  const permissionMap: Record<string, string> = {
    "/admin/users": "manage_users",
    "/admin/fraud": "investigate_fraud",
    "/admin/analytics": "view_analytics",
    "/admin/settings": "manage_settings",
    "/admin/system": "system_admin",
  }

  // Find the most specific matching route
  const matchingRoute = Object.keys(permissionMap)
    .sort((a, b) => b.length - a.length) // Sort by length descending for most specific match
    .find((route) => pathname.startsWith(route))

  return matchingRoute ? permissionMap[matchingRoute] : null
}

function redirectToSignIn(request: NextRequest, reason?: string): NextResponse {
  const signInUrl = new URL("/signin", request.url)

  if (reason) {
    signInUrl.searchParams.set("error", reason)
  }

  // Store the original URL to redirect back after login
  signInUrl.searchParams.set("redirect", request.nextUrl.pathname)

  const response = NextResponse.redirect(signInUrl)

  // Clear any existing auth cookies
  response.cookies.delete("ping_admin_token")
  response.cookies.delete("ping_auth_token")

  return response
}

function redirectToUnauthorized(request: NextRequest): NextResponse {
  const unauthorizedUrl = new URL("/unauthorized", request.url)
  return NextResponse.redirect(unauthorizedUrl)
}

// Rate limiting for admin routes
const adminRequestCounts = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(request: NextRequest): boolean {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 100 // Max requests per window

  const current = adminRequestCounts.get(ip)

  if (!current || now > current.resetTime) {
    adminRequestCounts.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
}
