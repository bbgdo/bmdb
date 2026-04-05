import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsOptional, IsUrl, IsArray } from "class-validator"
import { Type, Transform } from "class-transformer"

export class CreateMovieDto {
  @IsString() @MinLength(1) @MaxLength(200) title!: string
  @IsString() @MinLength(10) description!: string
  @Type(() => Number) @IsInt() @Min(1888) @Max(2100) releaseYear!: number
  @IsOptional() @Transform(({ value }: { value: unknown }) => (value === "" ? undefined : value)) @IsUrl() posterUrl?: string
  @IsOptional() @IsArray() @IsString({ each: true }) genreIds?: string[]
  @IsOptional() @IsArray() @IsString({ each: true }) actorIds?: string[]
  @IsOptional() @IsArray() @IsString({ each: true }) directorIds?: string[]
}
