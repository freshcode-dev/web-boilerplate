import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '@boilerplate/data';
import { MoreThan, Not, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SessionDto } from '@boilerplate/shared';
import { TokensService } from '../services/tokens.service';
import { ExternalApisService } from './external.service';

@Injectable()
export class SessionsService {
	constructor(
		@InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
		private readonly tokensService: TokensService,
		private readonly externalApiService: ExternalApisService
	) {}

	public async updateSessionToken(
		id: string,
		tokenId: string,
		issuedAt: Date,
		ipAddress: string,
		userAgent: string
	): Promise<SessionDto> {
		const session = await this.getSessionById(id);

		session.tokenId = randomUUID();
		session.expiredAt = this.tokensService.getRefreshExpirationDate(issuedAt, session.rememberMe);
		session.ipAddress = ipAddress ?? '';
		session.userAgent = userAgent ?? '';

		const { affected } = await this.sessionRepository.update({ id, tokenId }, session);

		if (affected === 0) {
			throw new NotFoundException('This session does not exist');
		}

		return this.getSessionById(id);
	}

	public async createSession(
		userId: string,
		issuedAt: Date,
		ipAddress: string,
		userAgent: string,
		isRememberMe = true
	): Promise<SessionDto> {
		const session = new Session();

		session.userId = userId;
		session.rememberMe = isRememberMe;
		session.expiredAt = this.tokensService.getRefreshExpirationDate(issuedAt, isRememberMe);
		session.ipAddress = ipAddress ?? '';
		session.userAgent = userAgent ?? '';

		await this.sessionRepository.insert(session);

		return session;
	}

	public async listUserSessions(userId: string, filters?: { withIpDetails?: boolean }): Promise<SessionDto[]> {
		const sessionsList = await this.sessionRepository.find({
			where: {
				userId,
				expiredAt: MoreThan(new Date()),
			},
			order: {
				createdAt: 'DESC',
			},
		});

		if (filters?.withIpDetails) {
			await Promise.all(
				sessionsList.map(async (session) => {
					await this.extendWithIpDetails(session);
				})
			);
		}

		return sessionsList;
	}

	public async findSessionById(id: string, filters?: { withIpDetails?: boolean }): Promise<SessionDto | null> {
		const session = await this.sessionRepository.findOne({ where: { id } });

		if (filters?.withIpDetails && session) {
			await this.extendWithIpDetails(session);
		}

		return session;
	}

	public async getSessionById(id: string, filters?: { withIpDetails?: boolean }): Promise<SessionDto> {
		const session = await this.findSessionById(id, filters);

		if (!session) {
			throw new NotFoundException('This session does not exist');
		}

		return session;
	}

	public async interruptSession(id: string, tokenId: string): Promise<SessionDto> {
		const { affected, raw } = await this.sessionRepository
			.createQueryBuilder()
			.delete()
			.where({
				id,
				tokenId,
			})
			.returning('*')
			.execute();

		if (affected === 0) {
			throw new NotFoundException('This session does not exist');
		}

		const deletedSession = this.sessionRepository.create(raw[0] as Session);

		return deletedSession;
	}

	public async interruptOtherSessions(id: string, tokenId: string): Promise<SessionDto[]> {
		const { affected, raw } = await this.sessionRepository
			.createQueryBuilder()
			.delete()
			.where({
				id: Not(id),
				tokenId: Not(tokenId),
			})
			.returning('*')
			.execute();

		if (affected === 0) {
			throw new NotFoundException('This session does not exist');
		}

		const deletedSessions = this.sessionRepository.create(raw as Session[]);

		return deletedSessions;
	}

	private async extendWithIpDetails(session?: SessionDto): Promise<void> {
		if (!session) {
			return;
		}

		session.ipAddressDetails = await this.externalApiService.getIpAddressDetails(session.ipAddress);
	}
}
