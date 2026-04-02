import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@apollo/client/react"
import { z } from "zod"
import { CREATE_REVIEW_MUTATION } from "@/api/movies.gql"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(10),
  text: z.string().min(10).max(2000),
})

type ReviewInput = z.infer<typeof reviewSchema>
type Props = { movieId: string; onSuccess: () => void }

const ReviewForm = ({ movieId, onSuccess }: Props) => {
  const [error, setError] = useState("")
  const [createReview] = useMutation(CREATE_REVIEW_MUTATION)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema) })

  const onSubmit = async (data: ReviewInput) => {
    setError("")
    try {
      await createReview({
        variables: { input: { ...data, movieId } },
      })
      reset()
      onSuccess()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit review"
      if (message.includes("Already reviewed")) {
        setError("You have already reviewed this movie")
      } else {
        setError(message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border rounded-lg p-4">
      <h3 className="font-semibold text-sm">Write a review</h3>
      <div className="space-y-1">
        <Label htmlFor="rating">Rating (1-10)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={10}
          className="w-24"
          {...register("rating")}
        />
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="text">Review</Label>
        <Textarea
          id="text"
          rows={3}
          placeholder="Min 10 characters"
          {...register("text")}
        />
        {errors.text && (
          <p className="text-sm text-destructive">{errors.text.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  )
}

export default ReviewForm
