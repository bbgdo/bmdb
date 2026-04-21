import MovieReviews from "@/components/MovieReviews"
import type { AuthUser } from "@/api/auth"
import type { Movie } from "@/types/movie"

type Props = {
  movie: Movie | null
  user: AuthUser | null
}

const MoviePage = ({ movie, user }: Props) => {
  if (!movie)
    return (
      <p className="text-center text-muted-foreground py-12">
        Movie not found.
      </p>
    )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-48 rounded-lg object-cover self-start"
          />
        ) : (
          <div className="w-48 h-64 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm shrink-0">
            No poster
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">{movie.title}</h1>
          <p className="text-muted-foreground mb-3">{movie.releaseYear}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="text-xs bg-secondary px-2 py-1 rounded-full"
              >
                {g.name}
              </span>
            ))}
          </div>
          {movie.directors && movie.directors.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Directed by{" "}
              {movie.directors
                .map((d) => `${d.firstName} ${d.lastName}`)
                .join(", ")}
            </p>
          )}
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-muted-foreground leading-relaxed">
          {movie.description}
        </p>
      </section>
      {movie.actors && movie.actors.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Cast</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {movie.actors.map((a) => (
              <div
                key={a.id}
                className="flex flex-col items-center min-w-[80px]"
              >
                <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-1">
                  {a.photoUrl ? (
                    <img
                      src={a.photoUrl}
                      alt={`${a.firstName} ${a.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg text-muted-foreground">
                      {a.firstName[0]}
                    </div>
                  )}
                </div>
                <span className="text-xs text-center">
                  {a.firstName} {a.lastName}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      <MovieReviews movie={movie} user={user} />
    </div>
  )
}

export default MoviePage
