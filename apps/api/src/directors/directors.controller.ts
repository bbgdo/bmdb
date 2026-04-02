import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { DirectorsService } from "./directors.service"
import { CreateDirectorDto } from "./dto/create-director.dto"
import { UpdateDirectorDto } from "./dto/update-director.dto"
import { QueryDirectorDto } from "./dto/query-director.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("directors")
export class DirectorsController {
  constructor(private directors: DirectorsService) {}

  @Get()
  findAll(@Query() query: QueryDirectorDto) {
    return this.directors.findAll(query)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.directors.findOne(id)
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateDirectorDto) {
    return this.directors.create(dto)
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() dto: UpdateDirectorDto) {
    return this.directors.update(id, dto)
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.directors.remove(id)
  }
}
