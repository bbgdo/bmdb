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

interface JunctionMovie {
	genres?: { genre: Record<string, unknown> }[]
	actors?: { actor: Record<string, unknown> }[]
	directors?: { director: Record<string, unknown> }[]
	[key: string]: unknown
}

const mapMovie = (movie: JunctionMovie) => ({
	...movie,
	genres: movie.genres?.map((g) => g.genre) ?? [],
	actors: movie.actors?.map((a) => a.actor) ?? [],
	directors: movie.directors?.map((d) => d.director) ?? [],
})

@Controller("movies")
export class MoviesController {
	constructor(private movies: MoviesService) {}

	@Get()
	async findAll(@Query() filter: FilterMovieDto) {
		const result = await this.movies.findAll(filter)
		return { ...result, data: result.data.map(mapMovie) }
	}

	@Get("admin")
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	async findAllAdmin(@Query() filter: FilterMovieDto) {
		const result = await this.movies.findAllAdmin(filter)
		return { ...result, data: result.data.map(mapMovie) }
	}

	@Get("admin/:id")
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	async findOneAdmin(@Param("id") id: string) {
		return mapMovie(await this.movies.findOneAdmin(id) as JunctionMovie)
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		return mapMovie(await this.movies.findOne(id) as JunctionMovie)
	}

	@Post()
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	async create(@Body() dto: CreateMovieDto) {
		return mapMovie(await this.movies.create(dto) as JunctionMovie)
	}

	@Patch(":id")
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	async update(@Param("id") id: string, @Body() dto: UpdateMovieDto) {
		return mapMovie(await this.movies.update(id, dto) as JunctionMovie)
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
	async activate(@Param("id") id: string) {
		return mapMovie(await this.movies.activate(id) as JunctionMovie)
	}

	@Patch(":id/deactivate")
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	async deactivate(@Param("id") id: string) {
		return mapMovie(await this.movies.deactivate(id) as JunctionMovie)
	}
}
