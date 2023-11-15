import { Body, Controller, Post, UseGuards, Request, Get, Req, Put } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from '../services/auth.service';
import {
	AuthResponseDto,
	AuthVerifyDto,
	AuthWithGoogle,
	ChangeUserLoginDto,
	ChangeUserLoginRequest,
	EmailDto,
	IdDto,
	RestorePasswordDto,
	SessionDto,
	SignInWithEmailDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	UserDto,
} from '@boilerplate/shared';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { RequestWithAuth } from '../interfaces/auth-request';
import { SessionsService } from '../services/sessions.service';
import { UserAgent } from '../services/decorators/params/user-agent.decorator';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { UsersService } from '../services/users.service';
import { LoggerSettings } from '../services/decorators/route/logging-settings.decorator';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionsService,
		private readonly usersService: UsersService
	) {}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async currentUser(@Request() req: RequestWithAuth): Promise<UserDto> {
		const { sub: userId } = req.user;

		return await this.usersService.getOne({ id: userId });
	}

	@Post('send-otp')
	async sendOtp(@Body() verify: AuthVerifyDto): Promise<IdDto> {
		return await this.authService.sendOtp(verify);
	}

	@Post('/google')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	public async googleAuthWithToken(
		@Body() body: AuthWithGoogle,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return this.authService.signInWithGoogleToken(body.idToken, ipAddress, userAgent);
	}

	@Post('/google/assign')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	@UseGuards(JwtAuthGuard)
	public async assignGoogle(@Req() req: RequestWithAuth, @Body() body: AuthWithGoogle): Promise<void> {
		const { sub: userId } = req.user;

		await this.authService.assignGoogleToUser(userId, body.idToken);
	}

	@Post('sign-up/email')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	async signUpWithEmail(
		@Body() userPayload: SignUpWithEmailDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.registerWithEmail(userPayload, ipAddress, userAgent);
	}

	@Post('sign-in/phone')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	async signInWithPhone(
		@Body() credentials: SignInWithPhoneDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithPhone(credentials, ipAddress, userAgent);
	}

	@Post('sign-in/email')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	async signInWithEmail(
		@Body() credentials: SignInWithEmailDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithEmail(credentials, ipAddress, userAgent);
	}

	@Post('refresh')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	@UseGuards(JwtRefreshGuard)
	async refreshTokens(
		@Request() req: RequestWithAuth,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.authService.refreshToken(sessionId, tokenId, ipAddress, userAgent);
	}

	@Post('sign-out')
	@UseGuards(JwtRefreshGuard)
	async signOut(@Request() req: RequestWithAuth): Promise<SessionDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.sessionService.interruptSession(sessionId, tokenId);
	}

	@Post('restore-password-request')
	public async restorePasswordRequest(@Body() data: EmailDto): Promise<void> {
		return await this.authService.restorePasswordRequest(data);
	}

	@Post('restore-password')
	@UseGuards(JwtAuthGuard)
	public async restorePassword(@Req() req: RequestWithAuth, @Body() data: RestorePasswordDto): Promise<void> {
		const { sub: userId } = req.user;

		return await this.authService.restorePassword(userId, data.password, data.code);
	}

	@Post('change-login-request')
	@UseGuards(JwtAuthGuard)
	async changeLoginRequest(@Req() req: RequestWithAuth, @Body() data: ChangeUserLoginRequest): Promise<void> {
		const { sub: userId } = req.user;

		return await this.authService.changeUserLoginRequest(userId, data);
	}

	@Put('change-login')
	@UseGuards(JwtAuthGuard)
	async changeLogin(@Req() req: RequestWithAuth, @Body() data: ChangeUserLoginDto): Promise<void> {
		const { sub: userId } = req.user;

		return await this.authService.changeUserLogin(userId, data);
	}
}
