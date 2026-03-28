import { IsOptional, IsString, IsInt, Min, IsBoolean } from "class-validator"
import { Type, Transform } from "class-transformer"
import { PaginationDto } from "../../common/pagination.dto"

export class FilterMovieDto extends PaginationDto {
  @IsOptional() @IsString() search?: string
  @IsOptional() @IsString() genreId?: string
  @IsOptional() @Type(() => Number) @IsInt() @Min(1888) year?: number
  @IsOptional() @Transform(({ value }) => value === "true") @IsBoolean() isActive?: boolean
}
