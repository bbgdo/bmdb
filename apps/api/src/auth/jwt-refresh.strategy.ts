import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Request } from "express"

const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.["refresh_token"] ?? null

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_REFRESH_SECRET"),
    })
  }

  validate = (payload: { id: string; email: string; role: string }) => ({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  })
}
