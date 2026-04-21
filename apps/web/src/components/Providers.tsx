"use client"

import { ApolloProvider } from "@apollo/client/react"
import apolloClient from "@/lib/apollo"
import { AuthProvider } from "@/context/auth.context"
import type { AuthUser } from "@/api/auth"

type Props = {
  initialUser: AuthUser | null
  children: React.ReactNode
}

const Providers = ({ initialUser, children }: Props) => (
  <ApolloProvider client={apolloClient}>
    <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
  </ApolloProvider>
)

export default Providers
