import { Field, InputType, Int } from "@nestjs/graphql"
import { IsInt, IsOptional, IsString, Min } from "class-validator"
import { Type } from "class-transformer"

@InputType()
export class MovieFilterInput {
  @Field({ nullable: true }) @IsOptional() @IsString() search?: string
  @Field({ nullable: true }) @IsOptional() @IsString() genreId?: string
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(1888) @Type(() => Number) year?: number
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(1) @Type(() => Number) limit?: number
}
