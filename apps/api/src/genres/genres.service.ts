import { Injectable, ConflictException, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateGenreDto } from "./dto/create-genre.dto"
import { UpdateGenreDto } from "./dto/update-genre.dto"

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAll = () =>
    this.prisma.genre.findMany({ orderBy: { name: "asc" } })

  findOne = async (id: string) => {
    const genre = await this.prisma.genre.findUnique({ where: { id } })
    if (!genre) throw new NotFoundException("Genre not found")
    return genre
  }

  create = async (dto: CreateGenreDto) => {
    const existing = await this.prisma.genre.findUnique({ where: { name: dto.name } })
    if (existing) throw new ConflictException("Genre already exists")
    return this.prisma.genre.create({ data: dto })
  }

  update = async (id: string, dto: UpdateGenreDto) => {
    await this.findOne(id)
    return this.prisma.genre.update({ where: { id }, data: dto })
  }

  remove = async (id: string) => {
    await this.findOne(id)
    await this.prisma.genre.delete({ where: { id } })
  }
}
