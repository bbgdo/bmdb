import { gql } from "@apollo/client"

export const MOVIES_QUERY = gql`
  query Movies($filter: MovieFilterInput) {
    movies(filter: $filter) {
      data {
        id
        title
        description
        releaseYear
        posterUrl
        isActive
        genres { id name }
        directors { id firstName lastName }
      }
      total
      page
      limit
    }
  }
`

export const MOVIE_QUERY = gql`
  query Movie($id: ID!) {
    movie(id: $id) {
      id
      title
      description
      releaseYear
      posterUrl
      isActive
      genres { id name }
      actors { id firstName lastName photoUrl }
      directors { id firstName lastName photoUrl }
      reviews {
        id
        text
        rating
        createdAt
        user { firstName lastName }
      }
    }
  }
`

export const GENRES_QUERY = gql`
  query Genres {
    genres { id name }
  }
`

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      text
      rating
      createdAt
      user { firstName lastName }
    }
  }
`

export const DELETE_REVIEW_MUTATION = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`
