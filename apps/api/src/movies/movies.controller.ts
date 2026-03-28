import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { MoviesService } from "./movies.service"
import { CreateMovieDto } from "./dto/create-movie.dto"
import { UpdateMovieDto } from "./dto/update-movie.dto"
import { FilterMovieDto } from "./dto/filter-movie.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("movies")
export class MoviesController {
  constructor(private movies: MoviesService) {}

  @Get()
  findAll(@Query() filter: FilterMovieDto) {
    return this.movies.findAll(filter)
  }

  @Get("admin")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllAdmin(@Query() filter: FilterMovieDto) {
    return this.movies.findAllAdmin(filter)
  }

  @Get("admin/:id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOneAdmin(@Param("id") id: string) {
    return this.movies.findOneAdmin(id)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.movies.findOne(id)
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateMovieDto) {
    return this.movies.create(dto)
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() dto: UpdateMovieDto) {
    return this.movies.update(id, dto)
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.movies.remove(id)
  }

  @Patch(":id/activate")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  activate(@Param("id") id: string) {
    return this.movies.activate(id)
  }

  @Patch(":id/deactivate")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deactivate(@Param("id") id: string) {
    return this.movies.deactivate(id)
  }
}
