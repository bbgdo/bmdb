import apolloClient from "@/lib/apollo"

export const invalidateMovies = () => {
  apolloClient.cache.evict({ fieldName: "movies" })
  apolloClient.cache.evict({ fieldName: "movie" })
  apolloClient.cache.gc()
}

export const invalidateGenres = () => {
  apolloClient.cache.evict({ fieldName: "genres" })
  apolloClient.cache.gc()
}
