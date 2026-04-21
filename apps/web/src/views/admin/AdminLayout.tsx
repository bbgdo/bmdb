"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { to: "/admin/movies", label: "Movies" },
  { to: "/admin/genres", label: "Genres" },
  { to: "/admin/actors", label: "Actors" },
  { to: "/admin/directors", label: "Directors" },
]

type Props = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <nav className="flex gap-1 mb-6 border-b pb-2">
        {links.map((link) => {
          const isActive = pathname === link.to

          return (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "px-4 py-2 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      {children}
    </div>
  )
}

export default AdminLayout
