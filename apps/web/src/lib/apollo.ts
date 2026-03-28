import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const link = createHttpLink({
  uri: "/graphql",
  credentials: "include",
})

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

export default client
