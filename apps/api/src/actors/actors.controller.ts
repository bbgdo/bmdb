import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common"
import { Role } from "@prisma/client"
import { ActorsService } from "./actors.service"
import { CreateActorDto } from "./dto/create-actor.dto"
import { UpdateActorDto } from "./dto/update-actor.dto"
import { QueryActorDto } from "./dto/query-actor.dto"
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard"
import { RolesGuard } from "@/auth/guards/roles.guard"
import { Roles } from "@/auth/decorators/roles.decorator"

@Controller("actors")
export class ActorsController {
  constructor(private actors: ActorsService) {}

  @Get()
  findAll(@Query() query: QueryActorDto) {
    return this.actors.findAll(query)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.actors.findOne(id)
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateActorDto) {
    return this.actors.create(dto)
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() dto: UpdateActorDto) {
    return this.actors.update(id, dto)
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string) {
    return this.actors.remove(id)
  }
}
