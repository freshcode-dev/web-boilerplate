import { Controller, Get, UseGuards, Request, Delete, Post, Body, BadRequestException, Query } from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { AuthRequest } from '../interfaces/auth-request';
import { JwtRefreshGuard } from '../services/guard/jwt-refresh.guard';
import { SessionDto, SessionFilter } from '@boilerplate/shared';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Get('list')
	async listSessions(@Request() req: AuthRequest, @Query() filters: SessionFilter): Promise<SessionDto[]> {
		const { sub: userId } = req.user;

		return await this.sessionsService.listUserSessions(userId, filters);
	}

	@Post('current')
	@UseGuards(JwtRefreshGuard)
	async currentSession(@Request() req: AuthRequest, @Query() filters: SessionFilter): Promise<SessionDto> {
		const { sub: sessionId } = req.user;

		return await this.sessionsService.getSessionById(sessionId, filters);
	}

	@Post('session/interrupt')
	@UseGuards(JwtRefreshGuard)
	async interruptSession(@Request() req: AuthRequest, @Body() body: SessionDto): Promise<SessionDto> {
		const { sub: sessionId } = req.user;

		if (body.id === sessionId) {
			throw new BadRequestException('Cannot delete current session');
		}

		return await this.sessionsService.interruptSession(body.id, body.tokenId);
	}

	@Delete('others')
	@UseGuards(JwtRefreshGuard)
	async interruptOtherSessions(@Request() req: AuthRequest): Promise<SessionDto[]> {
		const { sub: sessionId, jti: tokenId } = req.user;

		return await this.sessionsService.interruptOtherSessions(sessionId, tokenId);
	}
}
