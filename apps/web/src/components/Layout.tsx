import { Link, Outlet } from "react-router-dom"
import { useAuth } from "@/context/auth.context"
import { Button } from "@/components/ui/button"

const Layout = () => {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          BMDB
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hi, {user.firstName}
              </span>
              {user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm">
                  Admin
                </Link>
              )}
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
