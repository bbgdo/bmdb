import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { PrismaService } from "../prisma/prisma.service"
import { CreateReviewDto } from "./dto/create-review.dto"
import { PaginationDto } from "../common/pagination.dto"
import { paginate } from "../common/paginate"

const reviewInclude = {
  user: { select: { firstName: true, lastName: true } },
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create = async (userId: string, dto: CreateReviewDto) => {
    const movie = await this.prisma.movie.findUnique({
      where: { id: dto.movieId, isActive: true },
    })
    if (!movie) throw new NotFoundException("Movie not found")
    const existing = await this.prisma.review.findUnique({
      where: { userId_movieId: { userId, movieId: dto.movieId } },
    })
    if (existing) throw new ConflictException("Already reviewed")
    return this.prisma.review.create({
      data: { text: dto.text, rating: dto.rating, userId, movieId: dto.movieId },
      include: reviewInclude,
    })
  }

  findByMovie = async (movieId: string, pagination: PaginationDto) => {
    const where = { movieId }
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: reviewInclude,
        orderBy: { createdAt: "desc" },
        ...paginate(pagination.page, pagination.limit),
      }),
      this.prisma.review.count({ where }),
    ])
    return { data, total, page: pagination.page ?? 1, limit: pagination.limit ?? 20 }
  }

  remove = async (id: string, userId: string, userRole: Role) => {
    const review = await this.prisma.review.findUnique({ where: { id } })
    if (!review) throw new NotFoundException("Review not found")
    if (userRole !== Role.ADMIN && review.userId !== userId) {
      throw new ForbiddenException("Not allowed")
    }
    await this.prisma.review.delete({ where: { id } })
  }
}
