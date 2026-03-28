import api from "@/lib/axios"
import type { Movie, Genre, Person } from "@/types/movie"

export const adminGetMovies = (params?: Record<string, unknown>) =>
  api.get<{ data: Movie[]; total: number; page: number; limit: number }>(
    "/movies/admin",
    { params },
  )

export const adminCreateMovie = (data: Record<string, unknown>) =>
  api.post<Movie>("/movies", data)

export const adminUpdateMovie = (id: string, data: Record<string, unknown>) =>
  api.patch<Movie>(`/movies/${id}`, data)

export const adminDeleteMovie = (id: string) => api.delete(`/movies/${id}`)

export const adminActivateMovie = (id: string) =>
  api.patch<Movie>(`/movies/${id}/activate`)

export const adminDeactivateMovie = (id: string) =>
  api.patch<Movie>(`/movies/${id}/deactivate`)

export const adminGetGenres = () => api.get<Genre[]>("/genres")

export const adminCreateGenre = (name: string) =>
  api.post<Genre>("/genres", { name })

export const adminUpdateGenre = (id: string, name: string) =>
  api.patch<Genre>(`/genres/${id}`, { name })

export const adminDeleteGenre = (id: string) => api.delete(`/genres/${id}`)

export const adminGetActors = (params?: Record<string, unknown>) =>
  api.get<{ data: Person[]; total: number }>("/actors", { params })

export const adminCreateActor = (data: Record<string, unknown>) =>
  api.post<Person>("/actors", data)

export const adminUpdateActor = (id: string, data: Record<string, unknown>) =>
  api.patch<Person>(`/actors/${id}`, data)

export const adminDeleteActor = (id: string) => api.delete(`/actors/${id}`)

export const adminGetDirectors = (params?: Record<string, unknown>) =>
  api.get<{ data: Person[]; total: number }>("/directors", { params })

export const adminCreateDirector = (data: Record<string, unknown>) =>
  api.post<Person>("/directors", data)

export const adminUpdateDirector = (
  id: string,
  data: Record<string, unknown>,
) => api.patch<Person>(`/directors/${id}`, data)

export const adminDeleteDirector = (id: string) =>
  api.delete(`/directors/${id}`)
