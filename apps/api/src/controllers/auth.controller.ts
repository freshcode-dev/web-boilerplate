import { Body, Controller, Post, UseGuards, Request, Get, Req } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { AuthService } from '../services/auth.service';
import {
	AuthResponseDto,
	AuthVerifyDto,
	EmailDto,
	IdDto,
	PasswordDto,
	SessionDto,
	SignInWithEmailDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	UserDto,
} from '@boilerplate/shared';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { AuthRequest } from '../interfaces/auth-request';
import { SessionsService } from '../services/sessions.service';
import { UserAgent } from '../services/decorators/params/user-agent.decorator';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { UsersService } from '../services/users.service';
import { LoggerSettings } from '../services/decorators/route/logging-settings.decorator';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionsService,
		private readonly usersService: UsersService
	) {}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async currentUser(@Request() req: AuthRequest): Promise<UserDto> {
		const { sub: userId } = req.user;

		return await this.usersService.getOne({ id: userId });
	}

	@Post('send-otp')
	async sendOtp(@Body() verify: AuthVerifyDto): Promise<IdDto> {
		return await this.authService.sendOtp(verify);
	}

	@Post('/google')
	@LoggerSettings({ logRequestBody: false, logResponseBody: false })
	@ApiExcludeEndpoint()
	public async googleAuthWithToken(@Body() body: { idToken: string }, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		return this.authService.signInWithGoogleToken(body.idToken, ipAddress, userAgent);
	}

	@Post('sign-up/email')
	async signUpWithEmail(
		@Body() userPayload: SignUpWithEmailDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.registerWithEmail(userPayload, ipAddress, userAgent);
	}

	@Post('sign-in/phone')
	async signInWithPhone(
		@Body() credentials: SignInWithPhoneDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithPhone(credentials, ipAddress, userAgent);
	}

	@Post('sign-in/email')
	async signInWithEmail(
		@Body() credentials: SignInWithEmailDto,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithEmail(credentials, ipAddress, userAgent);
	}

	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	async refreshTokens(
		@Request() req: AuthRequest,
		@RealIP() ipAddress: string,
		@UserAgent() userAgent: string
	): Promise<AuthResponseDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.authService.refreshToken(sessionId, tokenId, ipAddress, userAgent);
	}

	@Post('sign-out')
	@UseGuards(JwtRefreshGuard)
	async signOut(@Request() req: AuthRequest): Promise<SessionDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.sessionService.interruptSession(sessionId, tokenId);
	}

	@Post('restore-request')
	public async restorePAsswordRequest(@Body() data: EmailDto): Promise<void> {
		return await this.authService.restorePasswordRequest({ email: data.email });
	}

	@Post('restore-password')
	@UseGuards(JwtAuthGuard)
	public async restorePassword(@Req() req: AuthRequest, @Body() data: PasswordDto): Promise<void> {
		const { sub: userId } = req.user;

		return await this.authService.restorePassword(userId, data.password);
	}
}
