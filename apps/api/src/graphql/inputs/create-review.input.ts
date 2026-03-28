import { Field, InputType, Int } from "@nestjs/graphql"
import { IsString, MinLength, MaxLength, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"

@InputType()
export class CreateReviewInput {
  @Field() @IsString() @MinLength(10) @MaxLength(2000) text!: string
  @Field(() => Int) @Type(() => Number) @IsInt() @Min(1) @Max(10) rating!: number
  @Field() @IsString() movieId!: string
}
