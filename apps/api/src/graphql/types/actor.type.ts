import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ActorType {
  @Field(() => ID) id!: string
  @Field() firstName!: string
  @Field() lastName!: string
  @Field({ nullable: true }) photoUrl?: string
}

@ObjectType()
export class PaginatedActorsType {
  @Field(() => [ActorType]) data!: ActorType[]
  @Field() total!: number
  @Field() page!: number
  @Field() limit!: number
}
