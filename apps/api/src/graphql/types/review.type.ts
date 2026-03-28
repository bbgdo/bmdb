import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ReviewAuthorType {
  @Field() firstName!: string
  @Field() lastName!: string
}

@ObjectType()
export class ReviewType {
  @Field(() => ID) id!: string
  @Field() text!: string
  @Field(() => Int) rating!: number
  @Field() createdAt!: Date
  @Field(() => ReviewAuthorType, { nullable: true }) user?: ReviewAuthorType
}

@ObjectType()
export class PaginatedReviewsType {
  @Field(() => [ReviewType]) data!: ReviewType[]
  @Field() total!: number
  @Field() page!: number
  @Field() limit!: number
}
