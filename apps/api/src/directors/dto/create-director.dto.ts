import { IsString, MinLength, IsOptional, IsUrl } from "class-validator"

export class CreateDirectorDto {
  @IsString() @MinLength(2) firstName!: string
  @IsString() @MinLength(2) lastName!: string
  @IsOptional() @IsUrl() photoUrl?: string
}
