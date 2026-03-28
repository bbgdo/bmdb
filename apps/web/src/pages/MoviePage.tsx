import { useParams, Navigate } from "react-router-dom"
import { useQuery, useMutation } from "@apollo/client"
import {
  MOVIE_QUERY,
  DELETE_REVIEW_MUTATION,
} from "@/api/movies.gql"
import { useAuth } from "@/context/auth.context"
import Spinner from "@/components/Spinner"
import StarRating from "@/components/StarRating"
import ReviewForm from "@/components/ReviewForm"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"

const MoviePage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const { data, loading, refetch } = useQuery<{ movie: Movie }>(MOVIE_QUERY, {
    variables: { id },
    skip: !id,
  })

  const [deleteReview] = useMutation(DELETE_REVIEW_MUTATION)

  if (!id) return <Navigate to="/" replace />
  if (loading) return <Spinner />
  if (!data?.movie)
    return (
      <p className="text-center text-muted-foreground py-12">
        Movie not found.
      </p>
    )

  const movie = data.movie
  const hasReviewed = movie.reviews?.some(
    (r) =>
      r.user &&
      user &&
      r.user.firstName === user.firstName &&
      r.user.lastName === user.lastName,
  )

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview({ variables: { id: reviewId } })
    await refetch()
  }

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
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Reviews ({movie.reviews?.length ?? 0})
        </h2>
        {user && !hasReviewed && (
          <div className="mb-6">
            <ReviewForm movieId={movie.id} onSuccess={() => refetch()} />
          </div>
        )}
        <div className="space-y-3">
          {movie.reviews?.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {r.user?.firstName} {r.user?.lastName}
                </span>
                <StarRating rating={r.rating} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
              {user?.role === "ADMIN" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-end text-destructive"
                  onClick={() => handleDeleteReview(r.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          ))}
          {(!movie.reviews || movie.reviews.length === 0) && (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default MoviePage
