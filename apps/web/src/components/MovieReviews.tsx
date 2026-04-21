"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client/react"
import { DELETE_REVIEW_MUTATION } from "@/api/movies.gql"
import { Button } from "@/components/ui/button"
import ReviewForm from "@/components/ReviewForm"
import StarRating from "@/components/StarRating"
import type { AuthUser } from "@/api/auth"
import type { Movie } from "@/types/movie"

type Props = {
  movie: Movie
  user: AuthUser | null
}

const MovieReviews = ({ movie, user }: Props) => {
  const router = useRouter()
  const [deleteReview] = useMutation(DELETE_REVIEW_MUTATION)
  const hasReviewed = movie.reviews?.some(
    (review) =>
      review.user &&
      user &&
      review.user.firstName === user.firstName &&
      review.user.lastName === user.lastName,
  )

  const refresh = () => {
    router.refresh()
  }

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview({ variables: { id: reviewId } })
    refresh()
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Reviews ({movie.reviews?.length ?? 0})
      </h2>
      {user && !hasReviewed && (
        <div className="mb-6">
          <ReviewForm movieId={movie.id} onSuccess={refresh} />
        </div>
      )}
      <div className="space-y-3">
        {movie.reviews?.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">
                {review.user?.firstName} {review.user?.lastName}
              </span>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">{review.text}</p>
            {user?.role === "ADMIN" && (
              <Button
                variant="ghost"
                size="sm"
                className="self-end text-destructive"
                onClick={() => handleDeleteReview(review.id)}
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
  )
}

export default MovieReviews
