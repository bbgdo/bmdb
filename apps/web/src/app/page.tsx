import HomePage from "@/views/HomePage"
import { getGenres, getMovies } from "@/lib/server-api"

const LIMIT = 12

export const dynamic = "force-dynamic"

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

const pageNumber = (value: string | undefined) => {
  const page = Number(value ?? "1")
  return Number.isFinite(page) && page > 0 ? page : 1
}

export default async function Page({ searchParams }: Props) {
  const params = (await searchParams) ?? {}
  const search = firstValue(params.search)?.trim() ?? ""
  const genreId = firstValue(params.genreId) ?? ""
  const page = pageNumber(firstValue(params.page))
  const [movies, genres] = await Promise.all([
    getMovies({
      search: search || undefined,
      genreId: genreId || undefined,
      page,
      limit: LIMIT,
    }),
    getGenres(),
  ])

  return (
    <HomePage
      movies={movies}
      genres={genres}
      search={search}
      genreId={genreId}
      page={page}
    />
  )
}
