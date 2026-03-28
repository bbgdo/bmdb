import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { PrismaModule } from "./prisma/prisma.module"
import { MailModule } from "./mail/mail.module"
import { AuthModule } from "./auth/auth.module"
import { GenresModule } from "./genres/genres.module"
import { ActorsModule } from "./actors/actors.module"
import { DirectorsModule } from "./directors/directors.module"
import { MoviesModule } from "./movies/movies.module"
import { ReviewsModule } from "./reviews/reviews.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    AuthModule,
    GenresModule,
    ActorsModule,
    DirectorsModule,
    MoviesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
