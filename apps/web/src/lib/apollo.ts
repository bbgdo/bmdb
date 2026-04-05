import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const client = new ApolloClient({
	link: createHttpLink({
		uri: "/graphql",
		credentials: "include",
	}),
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: { fetchPolicy: "network-only" },
	},
})

export default client
