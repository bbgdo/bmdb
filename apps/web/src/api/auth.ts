import api from "@/lib/axios"

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "USER" | "ADMIN"
}

export const registerUser = (data: {
  firstName: string
  lastName: string
  email: string
  password: string
}) => api.post("/auth/register", data)

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data)

export const logoutUser = () => api.post("/auth/logout")

export const getMe = (): Promise<AuthUser> =>
  api.get("/auth/me").then((r) => r.data)

export const verifyEmail = (token: string) =>
  api.get(`/auth/verify-email?token=${token}`)
