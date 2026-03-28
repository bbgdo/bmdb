import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateActorDto } from "./dto/create-actor.dto"
import { UpdateActorDto } from "./dto/update-actor.dto"
import { PaginationDto } from "../common/pagination.dto"
import { paginate } from "../common/paginate"

@Injectable()
export class ActorsService {
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
      this.prisma.actor.findMany({
        where,
        orderBy: { lastName: "asc" },
        ...paginate(query.page, query.limit),
      }),
      this.prisma.actor.count({ where }),
    ])
    return { data, total, page: query.page ?? 1, limit: query.limit ?? 20 }
  }

  findOne = async (id: string) => {
    const actor = await this.prisma.actor.findUnique({
      where: { id },
      include: { movies: { include: { movie: true } } },
    })
    if (!actor) throw new NotFoundException("Actor not found")
    return actor
  }

  create = (dto: CreateActorDto) =>
    this.prisma.actor.create({ data: dto })

  update = async (id: string, dto: UpdateActorDto) => {
    await this.findOne(id)
    return this.prisma.actor.update({ where: { id }, data: dto })
  }

  remove = async (id: string) => {
    await this.findOne(id)
    await this.prisma.actor.delete({ where: { id } })
  }
}
