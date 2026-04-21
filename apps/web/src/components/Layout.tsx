"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.refresh()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          BMDB
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hi, {user.firstName}
              </span>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-sm">
                  Admin
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

export default Layout
