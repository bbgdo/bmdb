import { Field, InputType } from "@nestjs/graphql"
import { IsString, MinLength, IsOptional, IsUrl } from "class-validator"

@InputType()
export class CreateActorInput {
  @Field() @IsString() @MinLength(2) firstName!: string
  @Field() @IsString() @MinLength(2) lastName!: string
  @Field({ nullable: true }) @IsOptional() @IsUrl() photoUrl?: string
}

@InputType()
export class UpdateActorInput {
  @Field({ nullable: true }) @IsOptional() @IsString() @MinLength(2) firstName?: string
  @Field({ nullable: true }) @IsOptional() @IsString() @MinLength(2) lastName?: string
  @Field({ nullable: true }) @IsOptional() @IsUrl() photoUrl?: string
}
