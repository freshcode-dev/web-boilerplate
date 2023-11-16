import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { UsersService } from './users.service';
import {
	AuthReasonEnum,
	AuthResponseDto,
	AuthVerifyDto,
	ChangeUserLoginDto,
	ChangeUserLoginRequest,
	ChangeUserPasswordDto,
	CreateUserDto,
	EmailDto,
	IdDto,
	SignInWithEmailDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	UserDto,
	VERIFICATION_CODE_LENGTH,
} from '@boilerplate/shared';
import { argon2DefaultConfig } from '../constants';
import { SessionsService } from './sessions.service';
import { TokensService } from './tokens.service';
import { GoogleAuthService } from './google-auth.service';
import { MailerService } from './mailer.service';
import { OTPService } from './otp.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionService: SessionsService,
		private readonly googleAuthService: GoogleAuthService,
		private readonly tokensService: TokensService,
		private readonly mailerService: MailerService,
		private readonly otpService: OTPService
	) {}

	// eslint-disable-next-line complexity
	public async sendOtpVerification(payload: AuthVerifyDto): Promise<IdDto> {
		const { phoneNumber, email, reason } = payload;

		const user = await this.usersService.findOneUser([{ phoneNumber }, { email }]);

		if (reason === AuthReasonEnum.SignIn && !user) {
			throw new NotFoundException('User not found, please try to register');
		} else if (reason === AuthReasonEnum.SignUp && user) {
			throw new ConflictException('User with this data already exists');
		}

		let id = '';

		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		const userPhone = phoneNumber || user?.phoneNumber;
		const userEmail = email || user?.email;

		const canSendOtpToPhone = reason !== AuthReasonEnum.ChangePhoneNumber;
		const canSendOtpToEmail = reason !== AuthReasonEnum.ChangeEmail;

		// send otp
		// prefer phone over email
		if (userPhone && canSendOtpToPhone) {
			await this.sendOtpToAssignee('phone', userPhone);

			id = userPhone;
		} else if (userEmail && canSendOtpToEmail) {
			await this.sendOtpToAssignee('email', userEmail, reason);

			id = userEmail;
		}

		return { id };
	}

	public async registerWithEmail(
		payload: SignUpWithEmailDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const { code, ...createUser } = payload;

		await this.verifyOtp('email', createUser.email, code);

		const user = await this.usersService.createUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async authenticateUserWithPhone(
		credentials: SignInWithPhoneDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const { phoneNumber, code, rememberMe } = credentials;

		const user = await this.verifyUserPhoneCredentials(phoneNumber, code);

		return await this.createSession(user, ipAddress, userAgent, rememberMe);
	}

	public async authenticateUserWithEmail(
		credentials: SignInWithEmailDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const { email, password, rememberMe } = credentials;

		const user = await this.verifyUserEmailCredentials(email, password);

		return await this.createSession(user, ipAddress, userAgent, rememberMe);
	}

	public async verifyUserEmailCredentials(email: string, password: string): Promise<UserDto> {
		const user = await this.usersService.getOneUserEntity({ email });

		if (!user.password) {
			throw new UnauthorizedException('This user does not have a password. Please sign in with Phone number or Google');
		}

		const isEqual = await verify(user.password, password, argon2DefaultConfig);

		if (!isEqual) {
			throw new UnauthorizedException('Incorrect password');
		}

		return user;
	}

	public async verifyUserPhoneCredentials(phoneNumber: string, code: string): Promise<UserDto> {
		await this.verifyOtp('phone', phoneNumber, code);

		return await this.usersService.getOneUser({ phoneNumber });
	}

	public async refreshToken(
		sessionId: string,
		tokenId: string,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const issuedAt = new Date();

		const session = await this.sessionService.updateSessionToken(sessionId, tokenId, issuedAt, ipAddress, userAgent);

		const user = await this.usersService.getOneUser({ id: session.userId });

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
		const googleUser = await this.googleAuthService.getUserFromTokenId(idToken);

		const user = await this.usersService.findOneUser({ googleEmail: googleUser.googleEmail });

		if (user) {
			return this.signInWithGoogleEmail(user, ipAddress, userAgent);
		}

		return this.signUpWithGoogleEmail(googleUser, ipAddress, userAgent);
	}

	public async signInWithGoogleEmail(user: UserDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
		if (!user) throw new ForbiddenException('Access Denied');

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async signUpWithGoogleEmail(
		createUser: CreateUserDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const user = await this.usersService.createUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async assignGoogleToUser(userId: string, idToken: string): Promise<void> {
		const googleUser = await this.googleAuthService.getUserFromTokenId(idToken);

		try {
			await this.usersService.verifyIsGoogleEmailUnique(googleUser.googleEmail);
		} catch (error) {
			throw new ConflictException(
				'This google account is already assigned to another user. Try logging in with google'
			);
		}

		const user = await this.usersService.getOneUser({ id: userId });

		await this.usersService.updateUser(
			user.id,
			{ googleEmail: googleUser.googleEmail },
			{
				isChangeSecure: true,
			}
		);
	}

	public async restorePasswordRequest(request: EmailDto): Promise<void> {
		const { email } = request;

		const user = await this.usersService.getOneUser({ email });

		if (user.email) {
			await this.sendPasswordRestoreEmail(email, user);
		}
	}

	public async restorePassword(userId: string, newPassword: string, code: string): Promise<void> {
		const user = await this.usersService.getOneUser({ id: userId });

		if (!user.email) throw new BadRequestException('User does not have an email');

		await this.verifyOtp('email', user.email, code);

		await this.usersService.updateUser(
			userId,
			{ password: newPassword },
			{
				isChangeSecure: true,
			}
		);
	}

	public async changeUserLoginRequest(userId: string, data: ChangeUserLoginRequest): Promise<void> {
		const { email, phoneNumber } = data;

		const user = await this.usersService.getOneUser({ id: userId });

		if (email && user.phoneNumber) {
			await this.usersService.verifyIsEmailUnique(email);

			await this.sendOtpVerification({ phoneNumber: user.phoneNumber as string, reason: AuthReasonEnum.ChangeEmail });
		} else if (phoneNumber && user.email) {
			await this.usersService.verifyIsPhoneUnique(phoneNumber);

			await this.sendOtpVerification({ email: user.email as string, reason: AuthReasonEnum.ChangePhoneNumber });
		}
	}

	public async changeUserLogin(userId: string, data: ChangeUserLoginDto): Promise<void> {
		const { email, phoneNumber, code } = data;

		const user = await this.usersService.getOneUser({ id: userId });

		if (email && user.phoneNumber) {
			await this.verifyOtp('phone', user.phoneNumber, code);

			await this.usersService.updateUser(
				userId,
				{
					email,
				},
				{
					isChangeSecure: true,
				}
			);
		} else if (phoneNumber && user.email) {
			await this.verifyOtp('email', user.email, code);

			await this.usersService.updateUser(
				userId,
				{
					phoneNumber,
				},
				{
					isChangeSecure: true,
				}
			);
		}
	}

	public async changeUserPassword(userId: string, data: ChangeUserPasswordDto): Promise<void> {
		const { email, oldPassword, password: newPassword } = data;

		await this.verifyUserEmailCredentials(email, oldPassword);

		await this.usersService.updateUser(
			userId,
			{ password: newPassword },
			{
				isChangeSecure: true,
			}
		);
	}

	private async sendPasswordRestoreEmail(toEmail: string, user: UserDto): Promise<void> {
		// INFO: create code outside from `sendPasswordRestoreEmail` method to resolve circular dependency MailerService <-> OTPService
		const otpCode = await this.otpService.createOtpCodeEntry(VERIFICATION_CODE_LENGTH, toEmail);

		await this.mailerService.sendPasswordRestoreEmail(toEmail, user, otpCode);
	}

	private async sendOtpToAssignee(type: 'email' | 'phone', assignee: string, reason?: AuthReasonEnum): Promise<void> {
		if (type === 'email' && reason) {
			await this.otpService.sendOtpToEmail(assignee, reason);
		} else if (type === 'phone') {
			await this.otpService.sendOtpToPhone(assignee);
		}
	}

	private async verifyOtp(type: 'email' | 'phone', assignee: string, code: string): Promise<void> {
		if (type === 'email') {
			await this.otpService.verifyOtpFromEmail(assignee, code);
		} else if (type === 'phone') {
			await this.otpService.verifyOtpFromPhone(assignee, code);
		}
	}

	private async createSession(
		user: UserDto,
		ipAddress: string,
		userAgent: string,
		rememberMe?: boolean
	): Promise<AuthResponseDto> {
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
