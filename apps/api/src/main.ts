import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { AppModule } from "./app.module"

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.use(helmet())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })

  const port = process.env.API_PORT || 3001
  await app.listen(port)
  console.log(`API running on :${port}`)
}

bootstrap()
