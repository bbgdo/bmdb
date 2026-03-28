import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class DirectorType {
  @Field(() => ID) id!: string
  @Field() firstName!: string
  @Field() lastName!: string
  @Field({ nullable: true }) photoUrl?: string
}

@ObjectType()
export class PaginatedDirectorsType {
  @Field(() => [DirectorType]) data!: DirectorType[]
  @Field() total!: number
  @Field() page!: number
  @Field() limit!: number
}
