import {
  Controller, Get, Post, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { ReviewsService } from "./reviews.service"
import { CreateReviewDto } from "./dto/create-review.dto"
import { PaginationDto } from "@/common/pagination.dto"
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard"
import { CurrentUser } from "@/auth/decorators/current-user.decorator"

@Controller("reviews")
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviews.create(user.id, dto)
  }

  @Get("movie/:id")
  findByMovie(@Param("id") id: string, @Query() pagination: PaginationDto) {
    return this.reviews.findByMovie(id, pagination)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: { id: string; role: Role }, @Param("id") id: string) {
    return this.reviews.remove(id, user.id, user.role)
  }
}
