import { Resolver, Query, Mutation, Args, ID, Int, Context } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { Role } from "@prisma/client"
import { ReviewsService } from "../../reviews/reviews.service"
import { ReviewType, PaginatedReviewsType } from "../types/review.type"
import { CreateReviewInput } from "../inputs/create-review.input"
import { GqlJwtAuthGuard } from "../../auth/guards/gql-jwt-auth.guard"

@Resolver(() => ReviewType)
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  @Query(() => PaginatedReviewsType)
  reviewsByMovie(
    @Args("movieId", { type: () => ID }) movieId: string,
    @Args("page", { type: () => Int, nullable: true }) page?: number,
    @Args("limit", { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.reviewsService.findByMovie(movieId, { page, limit })
  }

  @Mutation(() => ReviewType)
  @UseGuards(GqlJwtAuthGuard)
  createReview(
    @Args("input") input: CreateReviewInput,
    @Context() ctx: { req: { user: { id: string } } },
  ) {
    return this.reviewsService.create(ctx.req.user.id, input)
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard)
  async deleteReview(
    @Args("id", { type: () => ID }) id: string,
    @Context() ctx: { req: { user: { id: string; role: Role } } },
  ) {
    await this.reviewsService.remove(id, ctx.req.user.id, ctx.req.user.role)
    return true
  }
}
