import { Field, InputType } from "@nestjs/graphql"
import { IsString, MinLength, IsOptional, IsUrl } from "class-validator"

@InputType()
export class CreateDirectorInput {
  @Field() @IsString() @MinLength(2) firstName!: string
  @Field() @IsString() @MinLength(2) lastName!: string
  @Field({ nullable: true }) @IsOptional() @IsUrl() photoUrl?: string
}

@InputType()
export class UpdateDirectorInput {
  @Field({ nullable: true }) @IsOptional() @IsString() @MinLength(2) firstName?: string
  @Field({ nullable: true }) @IsOptional() @IsString() @MinLength(2) lastName?: string
  @Field({ nullable: true }) @IsOptional() @IsUrl() photoUrl?: string
}
