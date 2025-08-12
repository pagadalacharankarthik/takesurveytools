"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type User, type AuthState, getStoredAuth, login as authLogin, logout as authLogout } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredAuth()
    setAuthState(stored)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = authLogin(email, password)
    if (user) {
      const newAuthState = { user, isAuthenticated: true }
      setAuthState(newAuthState)
      return true
    }
    return false
  }

  const logout = () => {
    authLogout()
    setAuthState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
