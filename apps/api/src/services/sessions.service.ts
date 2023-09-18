import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '@boilerplate/data';
import { MoreThan, Repository } from 'typeorm';
import { SessionDto } from '@boilerplate/shared';
import { randomUUID } from 'crypto';
import { TokensService } from '../services/tokens.service';

@Injectable()
export class SessionsService {
	constructor(
		@InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
		private readonly tokensService: TokensService
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

		return session;
	}

	public async listUserSessions(userId: string): Promise<SessionDto[]> {
		const sessionsList = await this.sessionRepository.find({
			where: {
				userId,
				expiredAt: MoreThan(new Date())
			},
			order: {
				createdAt: 'DESC'
			}
		});

		return sessionsList;
	}

	public async findSessionById(id: string): Promise<SessionDto | null> {
		const session = await this.sessionRepository.findOne({ where: { id } });

		return session;
	}

	public async getSessionById(id: string): Promise<SessionDto> {
		const session = await this.findSessionById(id);

		if (!session) {
			throw new NotFoundException('This session does not exist');
		}

		return session;
	}

	public async removeSession(id: string, tokenId: string): Promise<SessionDto> {
		const { affected, raw } = await this.sessionRepository
			.createQueryBuilder()
			.delete()
			.where({
				id,
				tokenId
			})
			.returning('*')
			.execute();

		if (affected === 0) {
			throw new NotFoundException('This session does not exist');
		}

		const deletedSession = this.sessionRepository.create(raw[0] as Session);

		return deletedSession;
	}
}
