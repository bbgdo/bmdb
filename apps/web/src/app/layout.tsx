import type { Metadata } from "next"
import "./globals.css"
import Providers from "@/components/Providers"
import Layout from "@/components/Layout"
import { getCurrentUser } from "@/lib/server-api"

export const metadata: Metadata = {
  title: "BMDB",
  description: "Browse movies, reviews, actors, directors, and genres.",
}

type Props = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body>
        <Providers initialUser={user}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
