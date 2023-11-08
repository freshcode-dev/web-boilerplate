import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import {
	AuthResponseDto,
	AuthVerifyDto,
	IdDto,
	SessionDto,
	SignInWithEmailDto,
	SignInWithPhoneDto,
	SignUpWithEmailDto,
	SignUpWithPhoneDto,
} from '@boilerplate/shared';
import { AuthService } from '../services/auth.service';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { AuthRequest } from '../interfaces/auth-request';
import { SessionsService } from '../services/sessions.service';
import { LoggerSettings } from '../services/decorators/route/logging-settings.decorator';
import { UserAgent } from '../services/decorators/param/user-agent.decorator';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly sessionService: SessionsService) {}

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

	@Post('sign-up/phone')
	async signUpWithPhone(@Body() userPayload: SignUpWithPhoneDto, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		return await this.authService.registerWithPhone(userPayload, ipAddress, userAgent);
	}

	@Post('sign-up/email')
	async signUpWithEmail(@Body() userPayload: SignUpWithEmailDto, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		return await this.authService.registerWithEmail(userPayload, ipAddress, userAgent);
	}

	@Post('sign-in/phone')
	async signInWithPhone(@Body() credentials: SignInWithPhoneDto, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithPhone(credentials, ipAddress, userAgent);
	}

	@Post('sign-in/email')
	async signInWithEmail(@Body() credentials: SignInWithEmailDto, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithEmail(credentials, ipAddress, userAgent);
	}

	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	async refreshTokens(@Request() req: AuthRequest, @RealIP() ipAddress: string, @UserAgent() userAgent: string): Promise<AuthResponseDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.authService.refreshToken(sessionId, tokenId, ipAddress, userAgent);
	}

	@Post('sign-out')
	@UseGuards(JwtRefreshGuard)
	async signOut(@Request() req: AuthRequest): Promise<SessionDto> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.sessionService.removeSession(sessionId, tokenId);
	}
}
