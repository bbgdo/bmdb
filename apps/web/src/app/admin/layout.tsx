import { redirect } from "next/navigation"
import AdminLayout from "@/views/admin/AdminLayout"
import { getCurrentUser } from "@/lib/server-api"

export const dynamic = "force-dynamic"

type Props = {
  children: React.ReactNode
}

export default async function Layout({ children }: Props) {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (user.role !== "ADMIN") redirect("/")

  return <AdminLayout>{children}</AdminLayout>
}
