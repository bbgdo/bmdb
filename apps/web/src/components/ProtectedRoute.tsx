import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/auth.context"

type Props = {
  children: React.ReactNode
  requiredRole?: "USER" | "ADMIN"
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isLoading } = useAuth()
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole)
    return <Navigate to="/" replace />
  return <>{children}</>
}

export default ProtectedRoute
