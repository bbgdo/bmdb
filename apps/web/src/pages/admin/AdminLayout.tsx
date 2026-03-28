import { NavLink, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

const links = [
  { to: "/admin/movies", label: "Movies" },
  { to: "/admin/genres", label: "Genres" },
  { to: "/admin/actors", label: "Actors" },
  { to: "/admin/directors", label: "Directors" },
]

const AdminLayout = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
    <nav className="flex gap-1 mb-6 border-b pb-2">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          className={({ isActive }) =>
            cn(
              "px-4 py-2 text-sm rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted",
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
    </nav>
    <Outlet />
  </div>
)

export default AdminLayout
