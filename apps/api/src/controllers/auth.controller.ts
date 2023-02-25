import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthResponseDto, SignInDto } from '@boilerplate/shared';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { AuthRequest } from '../interfaces/auth-request';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('sign-in')
	async signIn(@Body() credentials: SignInDto): Promise<AuthResponseDto> {
		return await this.authService.authenticateUser(credentials);
	}

	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	async refreshTokens(@Request() req: AuthRequest): Promise<AuthResponseDto> {
		const { sub, jti } = req.user;

		return await this.authService.refreshToken(sub, jti);
	}
}
