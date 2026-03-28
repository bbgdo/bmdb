import { Field, InputType, Int } from "@nestjs/graphql"
import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsOptional, IsUrl, IsArray } from "class-validator"
import { Type } from "class-transformer"

@InputType()
export class CreateMovieInput {
  @Field() @IsString() @MinLength(1) @MaxLength(200) title!: string
  @Field() @IsString() @MinLength(10) description!: string
  @Field(() => Int) @Type(() => Number) @IsInt() @Min(1888) @Max(2100) releaseYear!: number
  @Field({ nullable: true }) @IsOptional() @IsUrl() posterUrl?: string
  @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() @IsString({ each: true }) genreIds?: string[]
  @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() @IsString({ each: true }) actorIds?: string[]
  @Field(() => [String], { nullable: true }) @IsOptional() @IsArray() @IsString({ each: true }) directorIds?: string[]
}
