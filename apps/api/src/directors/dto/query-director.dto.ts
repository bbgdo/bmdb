import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "../../common/pagination.dto"

export class QueryDirectorDto extends PaginationDto {
  @IsOptional() @IsString() search?: string
}
