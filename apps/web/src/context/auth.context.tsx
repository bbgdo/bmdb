"use client"

import { createContext, useContext, useState } from "react"
import { getMe, logoutUser, type AuthUser } from "@/api/auth"

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = {
  initialUser: AuthUser | null
  children: React.ReactNode
}

export const AuthProvider = ({ initialUser, children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = async () => {
    setIsLoading(true)
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext value={{ user, isLoading, refetch, logout }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
