import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResponseDto, AuthVerifyDto, IdDto, SessionDto, SignInWithEmailDto, SignInWithPhoneDto, SignUpWithEmailDto, SignUpWithPhoneDto } from '@boilerplate/shared';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { AuthRequest } from '../interfaces/auth-request';
import { SessionsService } from '../services/sessions.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly sessionService: SessionsService
	) {
	}

	@Post('send-otp')
	async sendOtp(@Body() verify: AuthVerifyDto): Promise<IdDto> {
		return await this.authService.sendOtp(verify);
	}

	@Post('sign-up/phone')
	async signUpWithPhone(@Body() userPayload: SignUpWithPhoneDto): Promise<AuthResponseDto> {
		return await this.authService.registerWithPhone(userPayload);
	}

	@Post('sign-up/email')
	async signUpWithEmail(@Body() userPayload: SignUpWithEmailDto): Promise<AuthResponseDto> {
		return await this.authService.registerWithEmail(userPayload);
	}

	@Post('sign-in/phone')
	async signInWithPhone(@Body() credentials: SignInWithPhoneDto): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithPhone(credentials);
	}

	@Post('sign-in/email')
	async signInWithEmail(@Body() credentials: SignInWithEmailDto): Promise<AuthResponseDto> {
		return await this.authService.authenticateUserWithEmail(credentials);
	}

	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	async refreshTokens(@Request() req: AuthRequest): Promise<AuthResponseDto> {
		const { sub, jti } = req.user;

		return await this.authService.refreshToken(sub, jti);
	}

	@Post('sign-out')
	@UseGuards(JwtRefreshGuard)
	async signOut(@Request() req: AuthRequest): Promise<SessionDto> {
		const { sub, jti } = req.user;

		return await this.sessionService.removeSession(sub, jti);
	}
}
