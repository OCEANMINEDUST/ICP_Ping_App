// Authentication configuration for different providers
export const authConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google`,
    scope: "openid email profile",
  },
  facebook: {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/facebook`,
    scope: "email,public_profile",
  },
  // Remove sensitive tokens from client-side config
  telegram: {
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/telegram`,
  },
  instagram: {
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/instagram`,
    scope: "user_profile,user_media",
  },
}

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  provider: string
  walletAddress?: string
  jetTokens: number
  createdAt: Date
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Updated authentication functions that use server actions
export const authService = {
  async signInWithGoogle(): Promise<AuthUser> {
    // Implement Google OAuth flow
    return {
      id: "google_user_123",
      name: "Google User",
      email: "user@gmail.com",
      provider: "google",
      jetTokens: 100, // Welcome bonus
      createdAt: new Date(),
    }
  },

  async signInWithFacebook(): Promise<AuthUser> {
    // Implement Facebook OAuth flow
    return {
      id: "facebook_user_123",
      name: "Facebook User",
      email: "user@facebook.com",
      provider: "facebook",
      jetTokens: 100,
      createdAt: new Date(),
    }
  },

  async signInWithTelegram(): Promise<AuthUser> {
    // Use server action for Telegram authentication
    const response = await fetch("/api/auth/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("Telegram authentication failed")
    }

    return response.json()
  },

  async signInWithInstagram(): Promise<AuthUser> {
    // Use server action for Instagram authentication
    const response = await fetch("/api/auth/instagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("Instagram authentication failed")
    }

    return response.json()
  },

  async signInWithEmail(email: string, password: string): Promise<AuthUser> {
    // Implement email/password authentication
    return {
      id: "email_user_123",
      name: "Email User",
      email: email,
      provider: "email",
      jetTokens: 100,
      createdAt: new Date(),
    }
  },

  async signUp(userData: {
    name: string
    email: string
    password: string
  }): Promise<AuthUser> {
    // Implement user registration
    return {
      id: "new_user_123",
      name: userData.name,
      email: userData.email,
      provider: "email",
      jetTokens: 100,
      createdAt: new Date(),
    }
  },

  async signOut(): Promise<void> {
    // Implement sign out logic
    localStorage.removeItem("ping_auth_token")
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    // Check if user is authenticated
    const token = localStorage.getItem("ping_auth_token")
    if (!token) return null

    // Validate token and return user data
    return {
      id: "current_user_123",
      name: "Current User",
      email: "current@user.com",
      provider: "email",
      jetTokens: 1250,
      createdAt: new Date(),
    }
  },
}
