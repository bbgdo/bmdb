import * as crypto from "crypto"
import {
	Injectable,
	ConflictException,
	NotFoundException,
	UnauthorizedException,
	ForbiddenException,
	Logger,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { Response } from "express"
import { PrismaService } from "@/prisma/prisma.service"
import { MailService } from "@/mail/mail.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private mail: MailService,
	) {}

	getMe = (userId: string) =>
		this.prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, role: true, firstName: true, lastName: true },
		})

	register = async (dto: RegisterDto): Promise<{ message: string }> => {
		const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })

		if (existing && existing.isVerified) {
			throw new ConflictException("Email already in use")
		}

		const passwordHash = await bcrypt.hash(dto.password, 12)
		const verifyToken = crypto.randomUUID()
		console.log(`\n\x1b[43m\x1b[30m [DEMO VERIFICATION LINK] \x1b[0m http://${this.config.get('FRONTEND_URL', 'localhost:5173').replace(/^https?:\/\//, '')}/verify-email?token=${verifyToken}\n`)

		if (existing) {
			// Existing but unverified — allow re-registration with fresh data
			await this.prisma.user.update({
				where: { id: existing.id },
				data: {
					passwordHash,
					firstName: dto.firstName,
					lastName: dto.lastName,
					verifyToken,
				},
			})
		} else {
			await this.prisma.user.create({
				data: {
					email: dto.email,
					passwordHash,
					firstName: dto.firstName,
					lastName: dto.lastName,
					verifyToken,
				},
			})
		}

		try {
			await this.mail.sendVerificationEmail(dto.email, verifyToken)
		} catch (err) {
			this.logger.warn(
				`Failed to send verification email to ${dto.email}: ${err instanceof Error ? err.message : err}`,
			)
			return { message: "Check your email" }
		}

		return { message: "Check your email" }
	}

	verifyEmail = async (token: string): Promise<{ message: string }> => {
		const user = await this.prisma.user.findUnique({ where: { verifyToken: token } })
		if (!user) throw new NotFoundException("Invalid verification token")
		// Keep verifyToken in DB (don't null it) so repeated calls with the same
		// token (e.g. React StrictMode double-invoke) still find the user and
		// return success instead of 404.
		await this.prisma.user.update({
			where: { id: user.id },
			data: { isVerified: true },
		})
		return { message: "Email verified" }
	}

	login = async (dto: LoginDto, res: Response): Promise<void> => {
		const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
		if (!user) throw new UnauthorizedException("Invalid credentials")
		if (!user.isVerified) throw new ForbiddenException("Email not verified")
		const valid = await bcrypt.compare(dto.password, user.passwordHash)
		if (!valid) throw new UnauthorizedException("Invalid credentials")
		const payload = { id: user.id, email: user.email, role: user.role }
		const tokens = this.generateTokens(payload)
		const refreshHash = await bcrypt.hash(tokens.refreshToken, 10)
		await this.prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: refreshHash },
		})
		this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken)
		res.json({ message: "Logged in" })
	}

	logout = async (userId: string, res: Response): Promise<void> => {
		await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: null },
		})
		this.clearTokenCookies(res)
		res.json({ message: "Logged out" })
	}

	refreshTokens = async (userId: string, res: Response): Promise<void> => {
		const user = await this.prisma.user.findUnique({ where: { id: userId } })
		if (!user || !user.refreshToken) throw new UnauthorizedException("Invalid refresh token")
		const payload = { id: user.id, email: user.email, role: user.role }
		const tokens = this.generateTokens(payload)
		const refreshHash = await bcrypt.hash(tokens.refreshToken, 10)
		await this.prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: refreshHash },
		})
		this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken)
		res.json({ message: "Tokens refreshed" })
	}

	private generateTokens = (payload: { id: string; email: string; role: string }) => {
		const accessToken = this.jwt.sign(payload, {
			secret: this.config.get("JWT_SECRET"),
			expiresIn: this.config.get("JWT_EXPIRES_IN", "15m"),
		})
		const refreshToken = this.jwt.sign(payload, {
			secret: this.config.get("JWT_REFRESH_SECRET"),
			expiresIn: this.config.get("JWT_REFRESH_EXPIRES_IN", "7d"),
		})
		return { accessToken, refreshToken }
	}

	private setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
		res.cookie("access_token", accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 15 * 60 * 1000,
		})
		res.cookie("refresh_token", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
	}

	private clearTokenCookies = (res: Response) => {
		res.clearCookie("access_token")
		res.clearCookie("refresh_token")
	}
}
