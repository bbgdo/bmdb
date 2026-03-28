import { createContext, useContext, useEffect, useState } from "react"
import { getMe, logoutUser, type AuthUser } from "@/api/auth"

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refetch = async () => {
    try {
      const me = await getMe()
      setUser(me)
    } catch {
      setUser(null)
    }
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  useEffect(() => {
    refetch().finally(() => setIsLoading(false))
  }, [])

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
