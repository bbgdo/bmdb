import { cn } from "@/lib/utils"

type Props = { rating: number; size?: "sm" | "md" }

const StarRating = ({ rating, size = "md" }: Props) => (
  <span
    className={cn(
      "font-semibold",
      rating >= 8
        ? "text-green-500"
        : rating >= 5
          ? "text-yellow-500"
          : "text-red-500",
      size === "sm" ? "text-sm" : "text-base",
    )}
  >
    ★ {rating}/10
  </span>
)

export default StarRating
