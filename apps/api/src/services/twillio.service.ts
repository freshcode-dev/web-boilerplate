import { ForbiddenException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IApiConfigParams } from '../interfaces/api-config-params';
import TwilioSDK from 'twilio';
import RestException from 'twilio/lib/base/RestException';
import { TooManyRequestsException } from '../exceptions/too-many-requests.exception';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class TwilioService implements OnModuleInit {
	public readonly enabled: boolean;

	private readonly verifySid: string;
	private readonly phoneRateLimitName: string;
	private readonly client?: TwilioSDK.Twilio;

	constructor(configService: ConfigService<IApiConfigParams>, private readonly logger: LoggerService) {
		this.logger.setContext(TwilioService.name);

		this.enabled = configService.get('NX_ENABLE_TWILIO') === 'true';

		if (!this.enabled) {
			this.logger.warn({
				message: 'Twilio is disabled',
			});

			return;
		}

		const accountSid: string = configService.getOrThrow('TWILIO_ACCOUNT_SID');
		const authToken: string = configService.getOrThrow('TWILIO_AUTH_TOKEN');

		this.verifySid = configService.getOrThrow('TWILIO_VERIFY_SID');
		this.phoneRateLimitName = configService.getOrThrow('TWILIO_VERIFY_RATE_LIMIT');
		this.client = TwilioSDK(accountSid, authToken);
	}

	public async createVerification(phone: string) {
		try {
			if (!this.client) {
				this.logger.warn({
					message: `Sending verification to ${phone}`,
				});

				return;
			}

			await this.client.verify.v2.services(this.verifySid).verifications.create({
				to: phone,
				channel: 'sms',
				rateLimits: {
					[this.phoneRateLimitName]: phone,
				},
			});
		} catch (exception) {
			if (!(exception instanceof RestException)) {
				throw exception;
			}

			if (exception.status === 429) {
				throw new TooManyRequestsException('Too many verification requests');
			}

			throw exception;
		}
	}

	public async approveVerification(phone: string, code: string) {
		if (!this.client) {
			return;
		}

		const { status } = await this.verifyCode(phone, code, this.client);

		if (status !== 'approved') {
			throw new ForbiddenException('Invalid verification code!');
		}
	}

	public async onModuleInit(): Promise<void> {
		try {
			if (!this.client) {
				return;
			}

			const rateLimit = await this.client.verify.v2.services(this.verifySid).rateLimits.create({
				uniqueName: this.phoneRateLimitName,
			});

			await this.client.verify.v2
				.services(this.verifySid)
				.rateLimits(rateLimit.sid)
				.buckets.create({ max: 5, interval: 300 });

			this.logger.log({ message: `Rate-limits successfully initialized` });
		} catch (exception) {
			this.logger.error({ message: `Failed to create verification rate limit`, error: exception as Error });
		}
	}

	private async verifyCode(phone: string, code: string, client: TwilioSDK.Twilio) {
		try {
			return await client.verify.v2.services(this.verifySid).verificationChecks.create({
				to: phone,
				code,
			});
		} catch (exception) {
			if (!(exception instanceof RestException)) {
				throw exception;
			}

			if (exception.status === 404 || exception.status === 429) {
				throw new ForbiddenException('Invalid verification code!');
			}

			throw exception;
		}
	}
}
