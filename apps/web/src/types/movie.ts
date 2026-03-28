export type Genre = { id: string; name: string }

export type Person = {
  id: string
  firstName: string
  lastName: string
  photoUrl?: string | null
}

export type Review = {
  id: string
  text: string
  rating: number
  createdAt: string
  user?: { firstName: string; lastName: string } | null
}

export type Movie = {
  id: string
  title: string
  description: string
  releaseYear: number
  posterUrl?: string | null
  isActive: boolean
  genres?: Genre[]
  actors?: Person[]
  directors?: Person[]
  reviews?: Review[]
}

export type PaginatedMovies = {
  data: Movie[]
  total: number
  page: number
  limit: number
}
