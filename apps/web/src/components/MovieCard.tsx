import { Link } from "react-router-dom"
import type { Movie } from "@/types/movie"

type Props = { movie: Movie }

const MovieCard = ({ movie }: Props) => (
  <Link to={`/movies/${movie.id}`}>
    <div className="rounded-lg border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No poster
        </div>
      )}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-muted-foreground">{movie.releaseYear}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {movie.genres?.map((g) => (
            <span
              key={g.id}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
            >
              {g.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Link>
)

export default MovieCard
