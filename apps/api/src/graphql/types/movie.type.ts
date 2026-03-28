import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { GenreType } from "./genre.type"
import { ActorType } from "./actor.type"
import { DirectorType } from "./director.type"
import { ReviewType } from "./review.type"

@ObjectType()
export class MovieType {
  @Field(() => ID) id!: string
  @Field() title!: string
  @Field() description!: string
  @Field(() => Int) releaseYear!: number
  @Field({ nullable: true }) posterUrl?: string
  @Field() isActive!: boolean
  @Field() createdAt!: Date
  @Field(() => [GenreType], { nullable: "itemsAndList" }) genres?: GenreType[]
  @Field(() => [ActorType], { nullable: "itemsAndList" }) actors?: ActorType[]
  @Field(() => [DirectorType], { nullable: "itemsAndList" }) directors?: DirectorType[]
  @Field(() => [ReviewType], { nullable: "itemsAndList" }) reviews?: ReviewType[]
}

@ObjectType()
export class PaginatedMoviesType {
  @Field(() => [MovieType]) data!: MovieType[]
  @Field() total!: number
  @Field() page!: number
  @Field() limit!: number
}
