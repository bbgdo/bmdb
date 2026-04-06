import { IsOptional, IsString } from "class-validator"
import { PaginationDto } from "@/common/pagination.dto"

export class QueryActorDto extends PaginationDto {
  @IsOptional() @IsString() search?: string
}
