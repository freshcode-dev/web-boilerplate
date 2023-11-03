import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addSeconds } from 'date-fns';
import ms from 'ms';
import { TokenPairDto } from '@boilerplate/shared';
import { jwtConstants } from '../constants';

@Injectable()
export class TokensService {
	constructor(private readonly jwtService: JwtService) {
	}

	public getAccessExpirationDate(issuedAt: Date): Date {
		return addSeconds(issuedAt, ms(jwtConstants.accessTokenExpiresIn) / 1000);
	}

	public getRefreshExpirationDate(issuedAt: Date, isRememberMe: boolean): Date {
		return addSeconds(issuedAt, ms(this.getRefreshTokenExpiresIn(isRememberMe)) / 1000);
	}

	public generateJwt(
		userId: string,
		sessionId: string,
		tokenId: string,
		issuedAt: Date,
		isRememberMe: boolean
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

		const refreshTokenExpiresIn = this.getRefreshTokenExpiresIn(isRememberMe);

		const refreshToken = this.jwtService.sign(
			{ sub: sessionId, iat },
			{
				expiresIn: refreshTokenExpiresIn,
				secret: jwtConstants.refreshTokenSecret,
				jwtid: tokenId
			}
		);

		return {
			accessToken,
			refreshToken
		};
	}

	private getRefreshTokenExpiresIn(isRememberMe = false): string {
		return isRememberMe
			? jwtConstants.refreshTokenExpiresIn
			: jwtConstants.shortRefreshTokenExpiresIn;
	}
}
