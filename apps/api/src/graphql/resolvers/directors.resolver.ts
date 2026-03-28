import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { DirectorsService } from "../../directors/directors.service"
import { DirectorType, PaginatedDirectorsType } from "../types/director.type"
import { CreateDirectorInput, UpdateDirectorInput } from "../inputs/create-director.input"
import { GqlJwtAuthGuard } from "../../auth/guards/gql-jwt-auth.guard"
import { GqlRolesGuard } from "../../auth/guards/gql-roles.guard"
import { Roles } from "../../auth/decorators/roles.decorator"

@Resolver(() => DirectorType)
export class DirectorsResolver {
  constructor(private directorsService: DirectorsService) {}

  @Query(() => PaginatedDirectorsType)
  directors(
    @Args("search", { nullable: true }) search?: string,
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("limit", { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.directorsService.findAll({ search, page, limit })
  }

  @Query(() => DirectorType)
  director(@Args("id", { type: () => ID }) id: string) {
    return this.directorsService.findOne(id)
  }

  @Mutation(() => DirectorType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  createDirector(@Args("input") input: CreateDirectorInput) {
    return this.directorsService.create(input)
  }

  @Mutation(() => DirectorType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  updateDirector(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateDirectorInput,
  ) {
    return this.directorsService.update(id, input)
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async deleteDirector(@Args("id", { type: () => ID }) id: string) {
    await this.directorsService.remove(id)
    return true
  }
}
