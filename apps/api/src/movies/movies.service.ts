import { Injectable, NotFoundException } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "@/prisma/prisma.service"
import { CreateMovieDto } from "./dto/create-movie.dto"
import { UpdateMovieDto } from "./dto/update-movie.dto"
import { FilterMovieDto } from "./dto/filter-movie.dto"
import { paginate } from "@/common/paginate"

const movieInclude = {
  genres: { include: { genre: true } },
  actors: { include: { actor: true } },
  directors: { include: { director: true } },
  _count: { select: { reviews: true } },
}

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  findAll = async (filter: FilterMovieDto) => {
    const where: Prisma.MovieWhereInput = {}
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
      ]
    }
    if (filter.genreId) {
      where.genres = { some: { genreId: filter.genreId } }
    }
    if (filter.year) {
      where.releaseYear = filter.year
    }
    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive
    } else {
      where.isActive = true
    }
    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: movieInclude,
        orderBy: { createdAt: "desc" },
        ...paginate(filter.page, filter.limit),
      }),
      this.prisma.movie.count({ where }),
    ])
    return { data, total, page: filter.page ?? 1, limit: filter.limit ?? 20 }
  }

  findAllAdmin = async (filter: FilterMovieDto) => {
    const where: Prisma.MovieWhereInput = {}
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
      ]
    }
    if (filter.genreId) {
      where.genres = { some: { genreId: filter.genreId } }
    }
    if (filter.year) {
      where.releaseYear = filter.year
    }
    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: movieInclude,
        orderBy: { createdAt: "desc" },
        ...paginate(filter.page, filter.limit),
      }),
      this.prisma.movie.count({ where }),
    ])
    return { data, total, page: filter.page ?? 1, limit: filter.limit ?? 20 }
  }

  findOne = async (id: string) => {
    const movie = await this.prisma.movie.findUnique({
      where: { id, isActive: true },
      include: {
        ...movieInclude,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })
    if (!movie) throw new NotFoundException("Movie not found")
    return movie
  }

  findOneAdmin = async (id: string) => {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        ...movieInclude,
        reviews: {
          include: { user: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })
    if (!movie) throw new NotFoundException("Movie not found")
    return movie
  }

  create = async (dto: CreateMovieDto) => {
    const { genreIds, actorIds, directorIds, ...movieData } = dto
    return this.prisma.$transaction(async (tx) => {
      const movie = await tx.movie.create({ data: movieData })
      if (genreIds?.length) {
        await tx.genreOnMovie.createMany({
          data: genreIds.map((genreId) => ({ movieId: movie.id, genreId })),
        })
      }
      if (actorIds?.length) {
        await tx.actorOnMovie.createMany({
          data: actorIds.map((actorId) => ({ movieId: movie.id, actorId })),
        })
      }
      if (directorIds?.length) {
        await tx.directorOnMovie.createMany({
          data: directorIds.map((directorId) => ({ movieId: movie.id, directorId })),
        })
      }
      return tx.movie.findUnique({ where: { id: movie.id }, include: movieInclude })
    })
  }

  update = async (id: string, dto: UpdateMovieDto) => {
    await this.findOneAdmin(id)
    const { genreIds, actorIds, directorIds, ...movieData } = dto
    return this.prisma.$transaction(async (tx) => {
      await tx.movie.update({ where: { id }, data: movieData })
      if (genreIds !== undefined) {
        await tx.genreOnMovie.deleteMany({ where: { movieId: id } })
        if (genreIds.length) {
          await tx.genreOnMovie.createMany({
            data: genreIds.map((genreId) => ({ movieId: id, genreId })),
          })
        }
      }
      if (actorIds !== undefined) {
        await tx.actorOnMovie.deleteMany({ where: { movieId: id } })
        if (actorIds.length) {
          await tx.actorOnMovie.createMany({
            data: actorIds.map((actorId) => ({ movieId: id, actorId })),
          })
        }
      }
      if (directorIds !== undefined) {
        await tx.directorOnMovie.deleteMany({ where: { movieId: id } })
        if (directorIds.length) {
          await tx.directorOnMovie.createMany({
            data: directorIds.map((directorId) => ({ movieId: id, directorId })),
          })
        }
      }
      return tx.movie.findUnique({ where: { id }, include: movieInclude })
    })
  }

  remove = async (id: string) => {
    await this.findOneAdmin(id)
    await this.prisma.movie.delete({ where: { id } })
  }

  activate = async (id: string) => {
    await this.findOneAdmin(id)
    return this.prisma.movie.update({
      where: { id },
      data: { isActive: true },
      include: movieInclude,
    })
  }

  deactivate = async (id: string) => {
    await this.findOneAdmin(id)
    return this.prisma.movie.update({
      where: { id },
      data: { isActive: false },
      include: movieInclude,
    })
  }
}
