import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import MovieCard from "@/components/MovieCard"
import Spinner from "@/components/Spinner"
import { MOVIES_QUERY, GENRES_QUERY } from "@/api/movies.gql"
import { useDebounce } from "@/hooks/useDebounce"
import type { PaginatedMovies, Genre } from "@/types/movie"

const LIMIT = 12

const HomePage = () => {
  const [search, setSearch] = useState("")
  const [genreId, setGenreId] = useState<string>("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(search, 400)

  const { data, loading } = useQuery<{ movies: PaginatedMovies }>(
    MOVIES_QUERY,
    {
      variables: {
        filter: {
          search: debouncedSearch || undefined,
          genreId: genreId || undefined,
          page,
          limit: LIMIT,
        },
      },
    },
  )

  const { data: genresData } = useQuery<{ genres: Genre[] }>(GENRES_QUERY)

  const movies = data?.movies.data ?? []
  const total = data?.movies.total ?? 0
  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={genreId || "all"}
          onValueChange={(v) => {
            setGenreId(v === "all" ? "" : v)
            setPage(1)
          }}
        >
          <SelectTrigger className="sm:max-w-[180px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genres</SelectItem>
            {genresData?.genres.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <Spinner />
      ) : movies.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No movies found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="text-sm flex items-center px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default HomePage
