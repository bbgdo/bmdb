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
    void (async () => {
      await refetch().finally(() => setIsLoading(false))
    })()
  }, [])

  return (
    <AuthContext value={{ user, isLoading, refetch, logout }}>
      {children}
    </AuthContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
