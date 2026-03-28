import { plainToInstance } from "class-transformer"
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  validateSync,
} from "class-validator"

class EnvironmentVariables {
  @IsString() JWT_SECRET!: string
  @IsString() JWT_REFRESH_SECRET!: string
  @IsString() DATABASE_URL!: string
  @IsInt() @Min(1) API_PORT!: number
  @IsString() FRONTEND_URL!: string
  @IsString() @IsOptional() EMAIL_HOST?: string
  @IsInt() @IsOptional() EMAIL_PORT?: number
  @IsString() @IsOptional() EMAIL_USER?: string
  @IsString() @IsOptional() EMAIL_PASS?: string
  @IsString() @IsOptional() EMAIL_FROM?: string
}

export const validateEnv = (config: Record<string, unknown>) => {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validated, { skipMissingProperties: false })
  if (errors.length > 0) throw new Error(errors.toString())
  return validated
}
