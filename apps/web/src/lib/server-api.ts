import { cookies } from "next/headers"
import { print, type DocumentNode } from "graphql"
import { apiUrl } from "@/lib/api-url"
import { GENRES_QUERY, MOVIE_QUERY, MOVIES_QUERY } from "@/api/movies.gql"
import type { AuthUser } from "@/api/auth"
import type { Genre, Movie, PaginatedMovies } from "@/types/movie"

const getCookieHeader = async () => {
  const cookieStore = await cookies()
  return cookieStore.toString()
}

const graphqlRequest = async <T>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
  cookieHeader?: string,
): Promise<T> => {
  const res = await fetch(`${apiUrl}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ query: print(query), variables }),
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`)
  }

  const json = (await res.json()) as {
    data?: T
    errors?: { message?: string }[]
  }

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL request failed")
  }

  if (!json.data) {
    throw new Error("GraphQL response did not include data")
  }

  return json.data
}

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const cookieHeader = await getCookieHeader()
  if (!cookieHeader) return null

  try {
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    })

    if (!res.ok) return null
    return (await res.json()) as AuthUser
  } catch {
    return null
  }
}

export const getMovies = async (filter: {
  search?: string
  genreId?: string
  page: number
  limit: number
}) => {
  const data = await graphqlRequest<{ movies: PaginatedMovies }>(MOVIES_QUERY, {
    filter,
  })
  return data.movies
}

export const getGenres = async () => {
  const data = await graphqlRequest<{ genres: Genre[] }>(GENRES_QUERY)
  return data.genres
}

export const getMovie = async (id: string) => {
  try {
    const data = await graphqlRequest<{ movie: Movie }>(MOVIE_QUERY, { id })
    return data.movie
  } catch {
    return null
  }
}

export const verifyEmailToken = async (token: string) => {
  try {
    const params = new URLSearchParams({ token })
    const res = await fetch(`${apiUrl}/api/auth/verify-email?${params}`, {
      cache: "no-store",
    })
    return res.ok
  } catch {
    return false
  }
}
