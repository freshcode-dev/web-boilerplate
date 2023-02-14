import { Body, Controller, Post } from '@nestjs/common';
import { AuthResultDto, SignInDto, waitAsync } from '@boilerplate/shared';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@Post('/sign-in')
	public async signIn(@Body() body: SignInDto): Promise<AuthResultDto> {
		return this.authService.authenticateUser(body.email, body.password);
	}

	@Post('/refresh')
	public async refresh(@Body('refreshToken') refreshToken: string): Promise<AuthResultDto | null> {
		await waitAsync(1000);

		return { authToken: '23232323', user: {email: '2112', id: '232323', name: '232323'} };
	}
}
