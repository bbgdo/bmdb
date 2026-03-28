import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createTransport, Transporter } from "nodemailer"

@Injectable()
export class MailService {
  private transporter: Transporter

  constructor(private config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get("EMAIL_HOST"),
      port: this.config.get<number>("EMAIL_PORT"),
      auth: {
        user: this.config.get("EMAIL_USER"),
        pass: this.config.get("EMAIL_PASS"),
      },
    })
  }

  sendVerificationEmail = async (to: string, token: string): Promise<void> => {
    const frontendUrl = this.config.get("FRONTEND_URL")
    const link = `${frontendUrl}/verify-email?token=${token}`
    await this.transporter.sendMail({
      from: this.config.get("EMAIL_FROM"),
      to,
      subject: "Verify your email — BMDB",
      html: `<p>Click <a href="${link}">here</a> to verify your email.</p>`,
    })
  }
}
