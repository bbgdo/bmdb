import { isAxiosError } from "axios"

export const getErrorMessage = (err: unknown): string => {
  if (isAxiosError(err)) {
    const msg = err.response?.data?.message
    if (Array.isArray(msg)) return msg.join(", ")
    if (typeof msg === "string") return msg
    return `Error ${err.response?.status ?? "unknown"}`
  }
  return "Something went wrong"
}
