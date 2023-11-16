import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '@boilerplate/shared';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { IApiConfigParams } from '../interfaces/api-config-params';
import { LoggerService } from '../core/logging/logger.service';

@Injectable()
export class GoogleAuthService {
	public enabled: boolean;

	private readonly client: OAuth2Client;

	constructor(private readonly configService: ConfigService<IApiConfigParams>, private readonly logger: LoggerService) {
		this.logger.setContext(GoogleAuthService.name);

		this.enabled = this.configService.get('NX_ENABLE_GOOGLE_AUTH') === 'true';

		if (!this.enabled) {
			this.logger.warn({ message: 'Google Auth is disabled' });

			return;
		}

		this.client = new OAuth2Client({
			clientId: configService.get('NX_GOOGLE_API_CLIENT_ID'),
			clientSecret: configService.get('NX_GOOGLE_API_CLIENT_SECRET'),
			redirectUri: configService.get('NX_GOOGLE_API_REDIRECT_URL'),
		});
	}

	public async getUserFromTokenId(idToken: string): Promise<Pick<UserDto, 'googleEmail' | 'name'>> {
		const payload = await this.verifyIdToken(idToken);

		const user = {
			googleEmail: payload.email,
			name: `${payload.given_name} ${payload.family_name}`,
		};

		return user;
	}

	private async verifyIdToken(idToken: string): Promise<TokenPayload> {
		if (!this.client) {
			throw new BadRequestException('Google auth is disabled');
		}

		const ticket = await this.client.verifyIdToken({
			idToken,
			audience: this.configService.get('NX_GOOGLE_API_CLIENT_ID'),
		});

		const payload = ticket.getPayload();

		if (!payload) {
			throw new BadRequestException('Invalid id token');
		}

		return payload;
	}
}
