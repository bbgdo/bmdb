import { join } from "path"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler"
import { GraphQLModule } from "@nestjs/graphql"
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { validateEnv } from "./config/env.validation"
import { PrismaModule } from "./prisma/prisma.module"
import { MailModule } from "./mail/mail.module"
import { AuthModule } from "./auth/auth.module"
import { GenresModule } from "./genres/genres.module"
import { ActorsModule } from "./actors/actors.module"
import { DirectorsModule } from "./directors/directors.module"
import { MoviesModule } from "./movies/movies.module"
import { ReviewsModule } from "./reviews/reviews.module"
import { GraphqlModule } from "./graphql/graphql.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 10 },
      { name: "long", ttl: 60000, limit: 100 },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({
        req,
        res,
      }),
      playground: true,
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    GenresModule,
    ActorsModule,
    DirectorsModule,
    MoviesModule,
    ReviewsModule,
    GraphqlModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
