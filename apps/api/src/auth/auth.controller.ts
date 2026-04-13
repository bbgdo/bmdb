import { Controller, Post, Get, Body, Query, UseGuards, Res } from "@nestjs/common"
import { SkipThrottle, Throttle } from "@nestjs/throttler"
import { Response } from "express"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { JwtRefreshGuard } from "./guards/jwt-refresh.guard"
import { CurrentUser } from "./decorators/current-user.decorator"

@Throttle({
  short: { ttl: 60000, limit: 5 },
  long: { ttl: 60000, limit: 10 },
})
@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto)
  }

  @Get("verify-email")
  verifyEmail(@Query("token") token: string) {
    return this.auth.verifyEmail(token)
  }

  @Post("login")
  login(@Body() dto: LoginDto, @Res() res: Response) {
    return this.auth.login(dto, res)
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: { id: string }, @Res() res: Response) {
    return this.auth.logout(user.id, res)
  }

  @Post("refresh")
  @UseGuards(JwtRefreshGuard)
  refresh(@CurrentUser() user: { id: string }, @Res() res: Response) {
    return this.auth.refreshTokens(user.id, res)
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  me(@CurrentUser() user: { id: string }) {
    return this.auth.getMe(user.id)
  }
}
