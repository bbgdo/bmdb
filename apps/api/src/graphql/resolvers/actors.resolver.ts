import { Resolver, Query, Mutation, Args, ID, Int } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { ActorsService } from "@/actors/actors.service"
import { ActorType, PaginatedActorsType } from "../types/actor.type"
import { CreateActorInput, UpdateActorInput } from "../inputs/create-actor.input"
import { GqlJwtAuthGuard } from "@/auth/guards/gql-jwt-auth.guard"
import { GqlRolesGuard } from "@/auth/guards/gql-roles.guard"
import { Roles } from "@/auth/decorators/roles.decorator"

@Resolver(() => ActorType)
export class ActorsResolver {
  constructor(private actorsService: ActorsService) {}

  @Query(() => PaginatedActorsType)
  actors(
    @Args("search", { nullable: true }) search?: string,
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("limit", { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.actorsService.findAll({ search, page, limit })
  }

  @Query(() => ActorType)
  actor(@Args("id", { type: () => ID }) id: string) {
    return this.actorsService.findOne(id)
  }

  @Mutation(() => ActorType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  createActor(@Args("input") input: CreateActorInput) {
    return this.actorsService.create(input)
  }

  @Mutation(() => ActorType)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  updateActor(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateActorInput,
  ) {
    return this.actorsService.update(id, input)
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtAuthGuard, GqlRolesGuard)
  async deleteActor(@Args("id", { type: () => ID }) id: string) {
    await this.actorsService.remove(id)
    return true
  }
}
