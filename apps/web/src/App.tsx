import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ApolloProvider } from "@apollo/client/react"
import apolloClient from "@/lib/apollo"
import { AuthProvider } from "@/context/auth.context"
import Layout from "@/components/Layout"
import ProtectedRoute from "@/components/ProtectedRoute"
import HomePage from "@/pages/HomePage"
import MoviePage from "@/pages/MoviePage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"
import VerifyEmailPage from "@/pages/VerifyEmailPage"
import AdminLayout from "@/pages/admin/AdminLayout"
import MoviesPage from "@/pages/admin/MoviesPage"
import GenresPage from "@/pages/admin/GenresPage"
import ActorsPage from "@/pages/admin/ActorsPage"
import DirectorsPage from "@/pages/admin/DirectorsPage"

const queryClient = new QueryClient()

const App = () => (
  <ApolloProvider client={apolloClient}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="movies/:id" element={<MoviePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route
                path="admin"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="movies" replace />} />
                <Route path="movies" element={<MoviesPage />} />
                <Route path="genres" element={<GenresPage />} />
                <Route path="actors" element={<ActorsPage />} />
                <Route path="directors" element={<DirectorsPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ApolloProvider>
)

export default App
