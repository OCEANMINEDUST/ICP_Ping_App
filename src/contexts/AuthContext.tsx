"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  walletAddress: string
  jetTokens: number
  totalScans: number
  totalRecycled: number
  level: string
  isVerified: boolean
  email?: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("ping_user")
    const storedToken = localStorage.getItem("ping_token")

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("ping_user")
        localStorage.removeItem("ping_token")
      }
    }
    setLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("ping_user", JSON.stringify(userData))
    localStorage.setItem("ping_token", `token_${userData.id}`)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("ping_user")
    localStorage.removeItem("ping_token")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("ping_user", JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
