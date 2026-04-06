import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { MoviesService } from "@/movies/movies.service"
import { MovieType, PaginatedMoviesType } from "../types/movie.type"
import { MovieFilterInput } from "../inputs/movie-filter.input"
import { CreateMovieInput } from "../inputs/create-movie.input"
import { UpdateMovieInput } from "../inputs/update-movie.input"
import { GqlJwtAuthGuard } from "@/auth/guards/gql-jwt-auth.guard"
import { GqlRolesGuard } from "@/auth/guards/gql-roles.guard"
import { Roles } from "@/auth/decorators/roles.decorator"

interface JunctionMovie {
  genres?: { genre: Record<string, unknown> }[]
  actors?: { actor: Record<string, unknown> }[]
  directors?: { director: Record<string, unknown> }[]
  [key: string]: unknown
}

const mapMovie = (movie: JunctionMovie) => ({
  ...movie,
  genres: movie.genres?.map((g) => g.genre) ?? [],
  actors: movie.actors?.map((a) => a.actor) ?? [],
  directors: movie.directors?.map((d) => d.director) ?? [],
})

const mapPaginated = (result: { data: JunctionMovie[]; total: number; page: number; limit: number }) => ({
  ...result,
  data: result.data.map(mapMovie),
})

@Resolver(() => MovieType)
export class MoviesResolver {
  constructor(private moviesService: MoviesService) {}

  @Query(() => PaginatedMoviesType)
  async movies(@Args("filter", { nullable: true }) filter?: MovieFilterInput) {
    return mapPaginated(await this.moviesService.findAll(filter ?? {}))
  }

  @Query(() => PaginatedMoviesType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async moviesAdmin(@Args("filter", { nullable: true }) filter?: MovieFilterInput) {
    return mapPaginated(await this.moviesService.findAllAdmin(filter ?? {}))
  }

  @Query(() => MovieType)
  async movie(@Args("id", { type: () => ID }) id: string) {
    return mapMovie(await this.moviesService.findOne(id))
  }

  @Query(() => MovieType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async movieAdmin(@Args("id", { type: () => ID }) id: string) {
    return mapMovie(await this.moviesService.findOneAdmin(id))
  }

  @Mutation(() => MovieType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async createMovie(@Args("input") input: CreateMovieInput) {
    const result = await this.moviesService.create(input)
    return mapMovie(result as JunctionMovie)
  }

  @Mutation(() => MovieType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async updateMovie(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateMovieInput,
  ) {
    const result = await this.moviesService.update(id, input)
    return mapMovie(result as JunctionMovie)
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async deleteMovie(@Args("id", { type: () => ID }) id: string) {
    await this.moviesService.remove(id)
    return true
  }

  @Mutation(() => MovieType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async activateMovie(@Args("id", { type: () => ID }) id: string) {
    return mapMovie(await this.moviesService.activate(id) as JunctionMovie)
  }

  @Mutation(() => MovieType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async deactivateMovie(@Args("id", { type: () => ID }) id: string) {
    return mapMovie(await this.moviesService.deactivate(id) as JunctionMovie)
  }
}
