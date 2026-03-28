import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { GenresService } from "./genres.service"
import { CreateGenreDto } from "./dto/create-genre.dto"
import { UpdateGenreDto } from "./dto/update-genre.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("genres")
export class GenresController {
  constructor(private genres: GenresService) {}

  @Get()
  findAll() {
    return this.genres.findAll()
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.genres.findOne(id)
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateGenreDto) {
    return this.genres.create(dto)
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() dto: UpdateGenreDto) {
    return this.genres.update(id, dto)
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.genres.remove(id)
  }
}
