import { Module } from "@nestjs/common"
import { GenresModule } from "@/genres/genres.module"
import { ActorsModule } from "@/actors/actors.module"
import { DirectorsModule } from "@/directors/directors.module"
import { MoviesModule } from "@/movies/movies.module"
import { ReviewsModule } from "@/reviews/reviews.module"
import { GenresResolver } from "./resolvers/genres.resolver"
import { ActorsResolver } from "./resolvers/actors.resolver"
import { DirectorsResolver } from "./resolvers/directors.resolver"
import { MoviesResolver } from "./resolvers/movies.resolver"
import { ReviewsResolver } from "./resolvers/reviews.resolver"

@Module({
  imports: [GenresModule, ActorsModule, DirectorsModule, MoviesModule, ReviewsModule],
  providers: [
    GenresResolver,
    ActorsResolver,
    DirectorsResolver,
    MoviesResolver,
    ReviewsResolver,
  ],
})
export class GraphqlModule {}
