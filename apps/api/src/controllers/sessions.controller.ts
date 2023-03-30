import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { AuthRequest } from '../interfaces/auth-request';
import { SessionDto } from '@boilerplate/shared';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {
	}

	@Get()
	async listSessions(@Request() req: AuthRequest): Promise<SessionDto[]> {
		return await this.sessionsService.listUserSessions(req.user.sub);
	}
}
