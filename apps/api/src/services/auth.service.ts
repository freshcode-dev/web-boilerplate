import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import {
	AuthReasonEnum,
	AuthResponseDto,
	AuthVerifyDto,
	IdDto,
	SignInWithEmailDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	SignUpWithPhoneDto,
	UserDto,
} from '@boilerplate/shared';
import { verify } from 'argon2';
import { argon2DefaultConfig } from '../constants';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
import { PhoneVerificationService } from './phone-verification.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { User } from '@boilerplate/data';
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionService: SessionsService,
		private readonly tokensService: TokensService,
		private readonly phoneVerificationService: PhoneVerificationService,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async sendOtp(payload: AuthVerifyDto): Promise<IdDto> {
		const { phoneNumber, email, reason } = payload;

		if (reason === AuthReasonEnum.SignUp && email) {
			await this.usersService.verifyIsEmailUnique(email);
		}

		const user = await this.usersService.findUserByPhone(phoneNumber);

		if (reason === AuthReasonEnum.SignIn && !user) {
			throw new NotFoundException('User not found, please try to register');
		}

		if (reason === AuthReasonEnum.SignUp && user) {
			throw new ConflictException({ field: 'phoneNumber' }, 'Phone number is already in use');
		}

		await this.phoneVerificationService.createVerification(phoneNumber);

		return {
			id: phoneNumber,
		};
	}

	public async registerWithPhone(payload: SignUpWithPhoneDto): Promise<AuthResponseDto> {
		const { code, ...userPayload } = payload;

		await this.phoneVerificationService
			.approveVerification(userPayload.phoneNumber, code);

		const user = await this.usersService.registerUser(userPayload);
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(user.id, issuedAt);

		const { refreshToken, accessToken } = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt,
			true
		);

		return {
			user,
			refreshToken,
			accessToken
		};
	}

	public async registerWithEmail(payload: SignUpWithEmailDto): Promise<AuthResponseDto> {
		const { ...userPayload } = payload;

		const user = await this.usersService.registerUser(userPayload);
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(user.id, issuedAt);

		const { refreshToken, accessToken } = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt,
			true
		);

		return {
			user,
			refreshToken,
			accessToken
		};
	}

	public async authenticateUserWithPhone(credentials: SignInWithPhoneDto): Promise<AuthResponseDto> {
		const { phoneNumber, code, rememberMe } = credentials;

		const user = await this.verifyUserPhoneCredentials(phoneNumber, code);
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(user.id, issuedAt, rememberMe);

		const { refreshToken, accessToken } = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt,
			rememberMe
		);

		return {
			refreshToken,
			accessToken,
			user,
		};
	}

	public async authenticateUserWithEmail(credentials: SignInWithEmailDto): Promise<AuthResponseDto> {
		const { email, password, rememberMe } = credentials;

		const user = await this.verifyUserEmailCredentials(email, password);
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(user.id, issuedAt, rememberMe);

		const { refreshToken, accessToken } = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt,
			rememberMe
		);

		return {
			refreshToken,
			accessToken,
			user,
		};
	}

	public async verifyUserEmailCredentials(email: string, password: string): Promise<UserDto> {
		const user = await this.usersService.findByEmail(email);

		if (!user?.password) {
			throw new UnauthorizedException('This user does not exist');
		}

		const isEqual = await verify(user.password, password, argon2DefaultConfig);

		if (!isEqual) {
			throw new UnauthorizedException('Incorrect password');
		}

		return user;
	}

	public async verifyUserPhoneCredentials(phoneNumber: string, code: string): Promise<UserDto> {
		await this.phoneVerificationService
			.approveVerification(phoneNumber, code);

		const user = await this.usersService.findUserByPhone(phoneNumber);

		if (!user) {
			throw new UnauthorizedException('This user does not exist');
		}

		return this.mapper.map(user, User, UserDto);
	}

	public async refreshToken(sessionId: string, tokenId: string): Promise<AuthResponseDto> {
		const issuedAt = new Date();

		const session = await this.sessionService.updateSessionToken(sessionId, tokenId, issuedAt);

		const user = await this.usersService.getUserById(session.userId);

		const { refreshToken, accessToken } = this.tokensService.generateJwt(
			session.userId,
			session.id,
			session.tokenId,
			issuedAt,
			session.rememberMe
		);

		return {
			user,
			refreshToken,
			accessToken,
		};
	}
}
