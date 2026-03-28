import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { GenresService } from "../../genres/genres.service"
import { GenreType } from "../types/genre.type"
import { GqlJwtAuthGuard } from "../../auth/guards/gql-jwt-auth.guard"
import { GqlRolesGuard } from "../../auth/guards/gql-roles.guard"
import { Roles } from "../../auth/decorators/roles.decorator"

@Resolver(() => GenreType)
export class GenresResolver {
  constructor(private genresService: GenresService) {}

  @Query(() => [GenreType])
  genres() {
    return this.genresService.findAll()
  }

  @Query(() => GenreType)
  genre(@Args("id", { type: () => ID }) id: string) {
    return this.genresService.findOne(id)
  }

  @Mutation(() => GenreType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  createGenre(@Args("name") name: string) {
    return this.genresService.create({ name })
  }

  @Mutation(() => GenreType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  updateGenre(
    @Args("id", { type: () => ID }) id: string,
    @Args("name") name: string,
  ) {
    return this.genresService.update(id, { name })
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async deleteGenre(@Args("id", { type: () => ID }) id: string) {
    await this.genresService.remove(id)
    return true
  }
}
