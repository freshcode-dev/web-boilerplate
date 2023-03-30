import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { addSeconds } from 'date-fns';
import { TokenPairDto } from '@boilerplate/shared';

@Injectable()
export class TokensService {
	constructor(private readonly jwtService: JwtService) {
	}

	public getRefreshExpirationDate(issuedAt: Date): Date {
		return addSeconds(issuedAt, ms(jwtConstants.refreshTokenExpiresIn) / 1000);
	}

	public generateJwt(
		userId: string,
		sessionId: string,
		tokenId: string,
		issuedAt: Date
	): TokenPairDto {
		const iat = Math.floor(issuedAt.getTime() / 1000);

		const accessToken = this.jwtService.sign(
			{ sub: userId, iat },
			{
				expiresIn: jwtConstants.accessTokenExpiresIn,
				secret: jwtConstants.accessTokenSecret,
				jwtid: tokenId
			}
		);

		const refreshToken = this.jwtService.sign(
			{ sub: sessionId, iat },
			{
				expiresIn: jwtConstants.refreshTokenExpiresIn,
				secret: jwtConstants.refreshTokenSecret,
				jwtid: tokenId
			}
		);

		return {
			accessToken,
			refreshToken
		};
	}
}
