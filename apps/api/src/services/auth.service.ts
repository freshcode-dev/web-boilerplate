import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import {
	AuthReasonEnum,
	AuthResponseDto,
	AuthVerifyDto,
	CreateUserDto,
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
import { GoogleAuthService } from './google-auth.service';
@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionService: SessionsService,
		private readonly tokensService: TokensService,
		private readonly phoneVerificationService: PhoneVerificationService,
		private readonly googleAuthService: GoogleAuthService,
	) {}

	public async sendOtp(payload: AuthVerifyDto): Promise<IdDto> {
		const { phoneNumber, email, reason } = payload;

		if (reason === AuthReasonEnum.SignUp && email) {
			await this.usersService.verifyIsEmailUnique(email);
		}

		const user = await this.usersService.findOne({ phoneNumber });

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

	public async registerWithPhone(payload: SignUpWithPhoneDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		const { code, ...createUser } = payload;

		await this.phoneVerificationService
			.approveVerification(createUser.phoneNumber, code);

		await this.usersService.verifyIsPhoneUnique(createUser.phoneNumber);

		const user = await this.usersService.registerUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async registerWithEmail(payload: SignUpWithEmailDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		const { ...createUser } = payload;

		await this.usersService.verifyIsEmailUnique(createUser.email);

		const user = await this.usersService.registerUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async authenticateUserWithPhone(credentials: SignInWithPhoneDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		const { phoneNumber, code, rememberMe } = credentials;

		const user = await this.verifyUserPhoneCredentials(phoneNumber, code);

		return await this.createSession(user, ipAddress, userAgent, rememberMe);
	}

	public async authenticateUserWithEmail(credentials: SignInWithEmailDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		const { email, password, rememberMe } = credentials;

		const user = await this.verifyUserEmailCredentials(email, password);

		return await this.createSession(user, ipAddress, userAgent, rememberMe);
	}

	public async verifyUserEmailCredentials(email: string, password: string): Promise<UserDto> {
		const user = await this.usersService.findOne({ email });

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

		const user = await this.usersService.findOne({ phoneNumber });

		if (!user) {
			throw new UnauthorizedException('This user does not exist');
		}

		return user;
	}

	public async refreshToken(sessionId: string, tokenId: string, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		const issuedAt = new Date();

		const session = await this.sessionService.updateSessionToken(sessionId, tokenId, issuedAt, ipAddress, userAgent);

		const user = await this.usersService.getOne({ id: session.userId });

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

	public async signInWithGoogleToken(idToken: string, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		if (!idToken) throw new ForbiddenException('Access Denied');

		const googleUser = await this.googleAuthService.getUserFromTokenId(idToken);

		if (!googleUser?.googleEmail) throw new ForbiddenException('Access Denied');

		const user = await this.usersService.findOne({ googleEmail: googleUser.googleEmail });

		if (user) {
			return this.signInWithGoogleEmail(user, ipAddress, userAgent);
		}

		return this.signUpWithGoogleEmail(googleUser, ipAddress, userAgent);
	}

	public async signInWithGoogleEmail(user: UserDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		if (!user) throw new ForbiddenException('Access Denied');

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async signUpWithGoogleEmail(createUser: CreateUserDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		await this.usersService.verifyIsGoogleEmailUnique(createUser.googleEmail as string);

		const user = await this.usersService.registerUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	private async createSession(user: UserDto, ipAddress: string, userAgent: string, rememberMe?: boolean): Promise<AuthResponseDto> {
		const issuedAt = new Date();

		const session = await this.sessionService.createSession(user.id, issuedAt, ipAddress, userAgent, rememberMe);

		const { refreshToken, accessToken } = await this.tokensService.generateJwt(
			user.id,
			session.id,
			session.tokenId,
			issuedAt,
			session.rememberMe
		);

		return {
			refreshToken,
			accessToken,
			user,
		};
	}
}
