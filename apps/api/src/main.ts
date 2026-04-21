import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { AllExceptionsFilter } from "./common/filters/http-exception.filter"

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.setGlobalPrefix("api", { exclude: ["graphql"] })
  app.use(cookieParser())
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())

  app.enableCors({
    origin: config.get("FRONTEND_URL", "http://localhost:3000"),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })

  const port = config.get("API_PORT", 3001)
  await app.listen(port)
  console.log(`API running on :${port}`)
}

bootstrap()
