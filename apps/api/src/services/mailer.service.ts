import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailModel } from '../interfaces/send-mail';
import { IApiConfigParams } from '../interfaces/api-config-params';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class MailerService {
	public readonly enabled: boolean;

	private readonly mailerFrom: string;
	private readonly mailerHost: string;
	private readonly mailerPort: number;

	private readonly mailerClient: nodemailer.Transporter;

	constructor(private readonly logger: LoggerService, private readonly configService: ConfigService<IApiConfigParams>) {
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
}
