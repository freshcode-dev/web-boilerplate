import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthResponseDto, SignInDto, UserDto } from '@boilerplate/shared';
import { verify } from 'argon2';
import { argon2DefaultConfig } from '../constants';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionService: SessionsService,
		private readonly tokensService: TokensService
	) {
	}

	public async authenticateUser(credentials: SignInDto): Promise<AuthResponseDto> {
		const { email, password } = credentials;

		const user = await this.verifyUserCredentials(email, password);
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(
			user.id,
			issuedAt
		);

		const {
			refreshToken,
			accessToken
		} = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt
		);

		return {
			refreshToken,
			accessToken,
			user
		};
	}

	public async verifyUserCredentials(email: string, password: string): Promise<UserDto> {
		const user = await this.usersService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('This user does not exist');
		}

		const isEqual = await verify(user.password, password, argon2DefaultConfig);

		if (!isEqual) {
			throw new UnauthorizedException('Incorrect password');
		}

		return user;
	}

	public async refreshToken(sessionId: string, tokenId: string): Promise<AuthResponseDto> {
		const issuedAt = new Date();

		const session = await this.sessionService.updateSessionToken(sessionId, tokenId, issuedAt);
		const user = await this.usersService.getUserById(session.userId);

		const { refreshToken, accessToken } = this.tokensService.generateJwt(
			session.userId,
			session.id,
			session.tokenId,
			issuedAt
		);

		return {
			user,
			refreshToken,
			accessToken
		};
	}
}
