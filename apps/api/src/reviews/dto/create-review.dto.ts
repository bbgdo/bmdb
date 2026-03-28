import { IsString, MinLength, MaxLength, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"

export class CreateReviewDto {
  @IsString() @MinLength(10) @MaxLength(2000) text!: string
  @Type(() => Number) @IsInt() @Min(1) @Max(10) rating!: number
  @IsString() movieId!: string
}
