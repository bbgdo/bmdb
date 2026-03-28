import { IsEmail, IsString, Matches, MinLength, MaxLength } from "class-validator"

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: "Password must contain uppercase, lowercase and number",
  })
  password!: string
}
