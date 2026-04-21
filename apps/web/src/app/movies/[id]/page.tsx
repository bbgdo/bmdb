import MoviePage from "@/views/MoviePage"
import { getCurrentUser, getMovie } from "@/lib/server-api"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const [movie, user] = await Promise.all([getMovie(id), getCurrentUser()])

  return <MoviePage movie={movie} user={user} />
}
