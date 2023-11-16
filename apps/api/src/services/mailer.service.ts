import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailModel } from '../interfaces/send-mail';
import { IApiConfigParams } from '../interfaces/api-config-params';
import { LoggerService } from '../core/logging/logger.service';
import { emailCodeSubject, renderEmailCodeTemplate } from '../utils/templates/email-code.template';
import { AuthReasonEnum, UserDto, VERIFICATION_CODE_LENGTH } from '@boilerplate/shared';
import { OTPService } from './otp.service';
import { TokensService } from './tokens.service';
import { renderResetPassTemplate, resetPassSubject } from '../utils/templates/reset-pass.template';

@Injectable()
export class MailerService {
	public readonly enabled: boolean;

	private readonly mailerFrom: string;
	private readonly mailerHost: string;
	private readonly mailerPort: number;

	private readonly mailerClient: nodemailer.Transporter;

	constructor(
		private readonly logger: LoggerService,
		private readonly configService: ConfigService<IApiConfigParams>,
		private readonly otpService: OTPService,
		private readonly tokensService: TokensService
	) {
		this.logger.setContext(MailerService.name);

		this.enabled = this.configService.get('NX_ENABLE_SES') === 'true';

		if (!this.enabled) {
			this.logger.warn({
				message: 'SES is disabled',
			});

			return;
		}

		const mailerUser = this.configService.get('NX_SES_ACCESS_KEY_ID') as string;
		const mailerPass = this.configService.get('NX_SES_SECRET_ACCESS_KEY') as string;

		this.mailerHost = this.configService.get('NX_SES_SMTP_HOST') as string;
		this.mailerPort = +this.configService.get('NX_SES_SMTP_PORT');
		this.mailerFrom = this.configService.get('NX_SES_SEND_FROM') as string;
		this.mailerClient = nodemailer.createTransport({
			host: this.mailerHost,
			port: this.mailerPort,
			auth: {
				user: mailerUser,
				pass: mailerPass,
			},
		});
	}

	public async sendMail(sendMailModel: SendMailModel): Promise<boolean | null> {
		if (!this.mailerClient) {
			this.logger.warn({
				message: `Sending email to ${sendMailModel.to}`,
			});

			return null;
		}

		try {
			await this.mailerClient.sendMail({
				from: this.mailerFrom,
				to: sendMailModel.to,
				subject: sendMailModel.subject,
				html: sendMailModel.body,
				attachments: sendMailModel.attachments,
			});
		} catch (error) {
			this.logger.error({
				message: 'Error while sending email',
				error: error as Error,
			});

			return false;
		}

		return true;
	}

	public async sendEmailVerificationCode(
		toEmail: string,
		code: string,
		reason: AuthReasonEnum
	): Promise<boolean | null> {
		const subject = emailCodeSubject();
		const body = await renderEmailCodeTemplate({ code, reason });

		const isEmailSent = await this.sendMail({
			to: toEmail,
			subject,
			body,
		});

		return isEmailSent;
	}

	public async sendPasswordRestoreEmail(toEmail: string, user: UserDto): Promise<void> {
		const tempAccessToken = await this.tokensService.generateResetPassJwt(user.id);
		const otpCode = await this.otpService.createOtpCodeEntry(VERIFICATION_CODE_LENGTH, toEmail);
		const resetLink = `${this.configService.get(
			'NX_FRONTED_URL'
		)}/auth/restore-password/?token=${tempAccessToken}&code=${otpCode}`;

		const subject = resetPassSubject();
		const body = await renderResetPassTemplate({
			profile: user,
			resetLink,
		});

		await this.sendMail({
			to: toEmail,
			subject,
			body,
		});
	}
}
