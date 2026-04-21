import Link from "next/link"
import { Button } from "@/components/ui/button"
import MovieCard from "@/components/MovieCard"
import HomeControls from "@/components/HomeControls"
import type { PaginatedMovies, Genre } from "@/types/movie"

const LIMIT = 12

type Props = {
  movies: PaginatedMovies
  genres: Genre[]
  search: string
  genreId: string
  page: number
}

const HomePage = ({ movies, genres, search, genreId, page }: Props) => {
  const total = movies.total
  const totalPages = Math.ceil(total / LIMIT)
  const hrefForPage = (nextPage: number) => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (genreId) params.set("genreId", genreId)
    if (nextPage > 1) params.set("page", String(nextPage))
    const query = params.toString()
    return query ? `/?${query}` : "/"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <HomeControls
        key={`${search}:${genreId}`}
        search={search}
        genreId={genreId}
        page={page}
        genres={genres}
      />
      {movies.data.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No movies found.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.data.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page === 1 ? (
            <Button variant="outline" size="sm" disabled>
              Prev
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={hrefForPage(page - 1)}>Prev</Link>
            </Button>
          )}
          <span className="text-sm flex items-center px-2">
            {page} / {totalPages}
          </span>
          {page === totalPages ? (
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href={hrefForPage(page + 1)}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage
