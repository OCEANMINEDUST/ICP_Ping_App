// Client-side environment variables (safe to expose)
export const clientEnv = {
  // App configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Social auth client IDs (safe to expose)
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  INSTAGRAM_CLIENT_ID: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "",

  // Internet Computer configuration
  INTERNET_IDENTITY_CANISTER_ID: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || "",
  PING_CANISTER_ID: process.env.NEXT_PUBLIC_PING_CANISTER_ID || "",

  // Push notifications public key
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
} as const

// Server-side environment variables (never exposed to client)
export const serverEnv = {
  // Sensitive secrets (server-only)
  JWT_SECRET: process.env.JWT_SECRET || "",
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET || "",
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || "",
} as const

// Validation function for required environment variables
export function validateEnv() {
  const requiredClientVars = ["APP_URL", "INTERNET_IDENTITY_CANISTER_ID", "PING_CANISTER_ID"] as const

  const requiredServerVars = ["JWT_SECRET"] as const

  // Check client variables
  for (const key of requiredClientVars) {
    if (!clientEnv[key]) {
      throw new Error(`Missing required client environment variable: NEXT_PUBLIC_${key}`)
    }
  }

  // Check server variables (only on server side)
  if (typeof window === "undefined") {
    for (const key of requiredServerVars) {
      if (!serverEnv[key]) {
        throw new Error(`Missing required server environment variable: ${key}`)
      }
    }
  }
}

// Type exports for better TypeScript support
export type ClientEnv = typeof clientEnv
export type ServerEnv = typeof serverEnv
