import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addSeconds } from 'date-fns';
import ms from 'ms';
import { TokenPairDto } from '@boilerplate/shared';
import { jwtConstants } from '../constants';
import { randomUUID } from 'crypto';

@Injectable()
export class TokensService {
	constructor(private readonly jwtService: JwtService) {}

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

		const accessToken = this.generateAccessToken(userId, iat, tokenId);
		const refreshToken = this.generateRefreshToken(sessionId, iat, tokenId, isRememberMe);

		return {
			accessToken,
			refreshToken,
		};
	}

	public generateResetPassJwt(userId: string): string {
		const iat = Math.floor(Date.now() / 1000);

		const token = this.generateAccessToken(userId, iat, randomUUID(), true);

		return token;
	}

	private generateAccessToken(userId: string, iat: number, tokenId: string, isResetPass?: boolean): string {
		return this.jwtService.sign(
			{ sub: userId, iat },
			{
				expiresIn: this.getAccessTokenExpiresIn(isResetPass),
				secret: jwtConstants.accessTokenSecret,
				jwtid: tokenId,
			}
		);
	}

	private generateRefreshToken(sessionId: string, iat: number, tokenId: string, rememberMe?: boolean): string {
		return this.jwtService.sign(
			{ sub: sessionId, iat },
			{
				expiresIn: this.getRefreshTokenExpiresIn(rememberMe),
				secret: jwtConstants.refreshTokenSecret,
				jwtid: tokenId,
			}
		);
	}

	private getRefreshTokenExpiresIn(isRememberMe = true): string {
		return isRememberMe ? jwtConstants.refreshTokenExpiresIn : jwtConstants.shortRefreshTokenExpiresIn;
	}

	private getAccessTokenExpiresIn(isResetPass = false): string {
		return isResetPass ? jwtConstants.resetPassTokenExpiresIn : jwtConstants.accessTokenExpiresIn;
	}
}
