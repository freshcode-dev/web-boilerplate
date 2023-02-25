import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '@boilerplate/data';
import { MoreThan, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SessionDto } from '@boilerplate/shared';
import { randomUUID } from 'crypto';
import { TokensService } from '../services/tokens.service';

@Injectable()
export class SessionsService {
	constructor(
		@InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
		private readonly tokensService: TokensService,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async updateSessionToken(id: string, tokenId: string, issuedAt: Date): Promise<SessionDto> {
		const session = new Session();

		session.tokenId = randomUUID();
		session.expiredAt = this.tokensService.getRefreshExpirationDate(issuedAt);

		const { affected } = await this.sessionRepository.update(
			{ id, tokenId },
			session
		);

		if (affected === 0) {
			throw new NotFoundException('This session does not exist');
		}

		return this.getSessionById(id);
	}

	public async createSession(
		userId: string,
		issuedAt: Date
	): Promise<SessionDto> {
		const session = new Session();

		session.userId = userId;
		session.expiredAt = this.tokensService.getRefreshExpirationDate(issuedAt);

		await this.sessionRepository.insert(session);

		return this.mapper.map(session, Session, SessionDto);
	}

	public async listUserSessions(userId: string): Promise<SessionDto[]> {
		const sessionsList = await this.sessionRepository.find({
			where: {
				user: {
					id: userId
				},
				expiredAt: MoreThan(new Date())
			},
			order: {
				createdAt: 'DESC'
			}
		});

		return this.mapper.mapArray(sessionsList, Session, SessionDto);
	}

	public async findSessionById(id: string): Promise<SessionDto | null> {
		const session = await this.sessionRepository.findOne({ where: { id } });

		return this.mapper.map(session, Session, SessionDto);
	}

	public async getSessionById(id: string): Promise<SessionDto> {
		const session = await this.findSessionById(id);

		if (!session) {
			throw new NotFoundException('This session does not exist');
		}

		return session;
	}
}
