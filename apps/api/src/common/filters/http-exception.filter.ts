import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { Request, Response } from "express"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType<"http" | "graphql">() === "graphql") throw exception
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Internal server error"

    const parsed =
      typeof message === "string"
        ? message
        : (message as Record<string, unknown>).message

    res.status(status).json({
      statusCode: status,
      path: req.url,
      message: parsed,
      timestamp: new Date().toISOString(),
    })
  }
}
