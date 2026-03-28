import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { Request } from "express"

const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.["access_token"] ?? null

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get("JWT_SECRET"),
    })
  }

  validate = (payload: { id: string; email: string; role: string }) => ({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  })
}
