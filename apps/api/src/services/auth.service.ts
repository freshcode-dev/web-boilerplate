import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { UsersService } from './users.service';
import {
	AuthReasonEnum,
	AuthResponseDto,
	AuthVerifyDto,
	ChangeUserLoginDto,
	ChangeUserLoginRequest,
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
import { TwilioService } from './twillio.service';
import { GoogleAuthService } from './google-auth.service';
import { MailerService } from './mailer.service';
import { OTPService } from './otp.service';
import { TLatestSavedCode } from '../interfaces/otp';
import {
	EmailCodeReasonsEnum,
	emailCodeSubject,
	renderEmailCodeTemplate,
} from '../utils/templates/email-code.template';
import { renderResetPassTemplate, resetPassSubject } from '../utils/templates/reset-pass.template';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly sessionService: SessionsService,
		private readonly tokensService: TokensService,
		private readonly googleAuthService: GoogleAuthService,
		private readonly mailerService: MailerService,
		private readonly twilioService: TwilioService,
		private readonly otpService: OTPService
	) {}

	// eslint-disable-next-line complexity
	public async sendOtp(payload: AuthVerifyDto): Promise<IdDto> {
		const { phoneNumber, email, reason } = payload;

		const user = await this.usersService.findOne([{ phoneNumber }, { email }]);

		if (reason === AuthReasonEnum.SignIn && !user) {
			throw new NotFoundException('User not found, please try to register');
		} else if (reason === AuthReasonEnum.SignUp && user) {
			throw new ConflictException('User with this data already exists');
		}

		let id = '';
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		const userEmail = email || user?.email;

		// send otp
		if (reason === AuthReasonEnum.SignUp && userEmail) {
			id = userEmail;
			await this.sendOtpToEmail(userEmail as string, EmailCodeReasonsEnum.SignUp);
		} else if (reason === AuthReasonEnum.SignIn && phoneNumber) {
			id = phoneNumber;
			await this.sendOtpToPhone(phoneNumber);
		}

		return {
			id,
		};
	}

	public async registerWithEmail(
		payload: SignUpWithEmailDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const { code, ...createUser } = payload;

		await this.verifyOtpEmail(createUser.email, code);

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
		const user = await this.usersService.findOne({ email }, { doMapping: false });

		if (!user) {
			throw new UnauthorizedException('This user does not exist');
		}

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
		await this.twilioService.approveVerification(phoneNumber, code);

		const user = await this.usersService.findOne({ phoneNumber });

		if (!user) {
			throw new UnauthorizedException('This user does not exist');
		}

		return user;
	}

	public async refreshToken(
		sessionId: string,
		tokenId: string,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
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

	public async signUpWithGoogleEmail(
		createUser: CreateUserDto,
		ipAddress: string,
		userAgent: string
	): Promise<AuthResponseDto> {
		const user = await this.usersService.createUser(createUser);

		return await this.createSession(user, ipAddress, userAgent);
	}

	public async assignGoogleToUser(userId: string, idToken: string): Promise<void> {
		if (!idToken) throw new ForbiddenException('Access Denied');

		const googleUser = await this.googleAuthService.getUserFromTokenId(idToken);

		if (!googleUser?.googleEmail) throw new ForbiddenException('Access Denied');

		const userWithGoogleEmail = await this.usersService.findOne({ googleEmail: googleUser.googleEmail });

		if (userWithGoogleEmail)
			throw new BadRequestException(
				'This google account is already assigned to another user. Try logging in with google'
			);

		const user = await this.usersService.getOne({ id: userId });

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

		const user = await this.usersService.getOne({ email });

		if (user.email) {
			await this.sendPasswordRestoreEmail(user.email, user);
		}
	}

	public async restorePassword(userId: string, newPassword: string, code: string): Promise<void> {
		const user = await this.usersService.getOne({ id: userId });

		if (!user.email) throw new BadRequestException('User does not have an email');

		await this.verifyOtpEmail(user.email, code);

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

		const user = await this.usersService.getOne({ id: userId });

		if (email && user.phoneNumber) {
			await this.usersService.verifyIsEmailUnique(email);

			await this.sendOtpToPhone(user.phoneNumber as string);
		} else if (phoneNumber && user.email) {
			await this.usersService.verifyIsPhoneUnique(phoneNumber);

			await this.sendOtpToEmail(user.email as string, EmailCodeReasonsEnum.ChangePhoneNumber);
		}
	}

	public async changeUserLogin(userId: string, data: ChangeUserLoginDto): Promise<void> {
		const { email, phoneNumber, code } = data;

		const user = await this.usersService.getOne({ id: userId });

		if (email && user.phoneNumber) {
			await this.twilioService.approveVerification(user.phoneNumber, code);

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
			await this.verifyOtpEmail(user.email, code);

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

	private async sendOtpToPhone(phoneNumber: string): Promise<void> {
		await this.twilioService.createVerification(phoneNumber);
	}

	private async sendOtpToEmail(toEmail: string, reason: EmailCodeReasonsEnum): Promise<void> {
		await this.otpService.sendOtpCode(
			{
				codeLength: VERIFICATION_CODE_LENGTH,
				assignee: toEmail,
			},
			async (code: TLatestSavedCode) => this.otpService.storeOtpCodeInDB(code),
			async (code: string) => {
				const subject = emailCodeSubject();
				const body = await renderEmailCodeTemplate({ code, reason });

				const isEmailSent = await this.mailerService.sendMail({
					to: toEmail,
					subject,
					body,
				});

				if (isEmailSent === false) throw new BadRequestException('Cannot send email');
			}
		);
	}

	private async sendPasswordRestoreEmail(toEmail: string, user: UserDto): Promise<void> {
		const tempAccessToken = await this.tokensService.generateResetPassJwt(user.id);
		const otpCode = await this.otpService.createOtpCode(VERIFICATION_CODE_LENGTH, toEmail);
		const resetLink = `${this.configService.get(
			'NX_FRONTED_URL'
		)}/auth/restore-password/?token=${tempAccessToken}&code=${otpCode}`;

		const subject = resetPassSubject();
		const body = await renderResetPassTemplate({
			profile: user,
			resetLink,
		});

		await this.mailerService.sendMail({
			to: toEmail,
			subject,
			body,
		});
	}

	private async verifyOtpEmail(email: string, code: string): Promise<void> {
		await this.otpService.verifyOtpCode(
			{
				assignee: email,
				code,
			},
			async (assignee) => await this.otpService.getOtpsByAssigneeFromDB(assignee),
			async (code) => {
				await this.otpService.markOTPAsUsedInDB(code);
			}
		);
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
