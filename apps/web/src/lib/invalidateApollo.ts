import apolloClient from "@/lib/apollo"

export const invalidateMovies = () =>
  apolloClient.refetchQueries({ include: ["Movies", "Movie"] })

export const invalidateGenres = () =>
  apolloClient.refetchQueries({ include: ["Genres"] })
