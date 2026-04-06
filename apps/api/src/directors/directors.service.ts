import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "@/prisma/prisma.service"
import { CreateDirectorDto } from "./dto/create-director.dto"
import { UpdateDirectorDto } from "./dto/update-director.dto"
import { PaginationDto } from "@/common/pagination.dto"
import { paginate } from "@/common/paginate"

@Injectable()
export class DirectorsService {
  constructor(private prisma: PrismaService) {}

  findAll = async (query: { search?: string } & PaginationDto) => {
    const where = query.search
      ? {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" as const } },
            { lastName: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {}
    const [data, total] = await Promise.all([
      this.prisma.director.findMany({
        where,
        orderBy: { lastName: "asc" },
        ...paginate(query.page, query.limit),
      }),
      this.prisma.director.count({ where }),
    ])
    return { data, total, page: query.page ?? 1, limit: query.limit ?? 20 }
  }

  findOne = async (id: string) => {
    const director = await this.prisma.director.findUnique({
      where: { id },
      include: { movies: { include: { movie: true } } },
    })
    if (!director) throw new NotFoundException("Director not found")
    return director
  }

  create = (dto: CreateDirectorDto) =>
    this.prisma.director.create({ data: dto })

  update = async (id: string, dto: UpdateDirectorDto) => {
    await this.findOne(id)
    return this.prisma.director.update({ where: { id }, data: dto })
  }

  remove = async (id: string) => {
    await this.findOne(id)
    await this.prisma.director.delete({ where: { id } })
  }
}
