import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResponseDto, SessionDto, SignInEmailDto } from '@boilerplate/shared';
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

	@Post('sign-in/email')
	async signIn(@Body() credentials: SignInEmailDto): Promise<AuthResponseDto> {
		return await this.authService.authenticateUser(credentials);
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
