import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, IdDto, UserDto } from '@boilerplate/shared';
import { User } from '@boilerplate/data';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, QueryFailedError, Repository } from 'typeorm';
import { hash } from 'argon2';
import { argon2DefaultConfig, DbErrorCodes } from '../constants';
import { DatabaseError } from 'pg';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { pick } from 'lodash';

interface FindUserOptions {
	doMapping?: boolean;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async findOneUser(
		where: FindOptionsWhere<User>[] | FindOptionsWhere<User>,
		{ doMapping = true }: FindUserOptions = {}
	): Promise<User | null> {
		const user = await this.usersRepository.findOne({ where });

		if (!user) {
			return null;
		}

		if (doMapping) {
			return this.mapper.map(user, User, UserDto);
		}

		return user;
	}

	public async getOneUser(
		where: FindOptionsWhere<User>[] | FindOptionsWhere<User>,
		options?: FindUserOptions
	): Promise<UserDto> {
		const user = await this.findOneUser(where, options);

		if (!user) {
			throw new NotFoundException('This user does not exist');
		}

		return user;
	}

	public async getOneUserEntity(
		where: FindOptionsWhere<User>[] | FindOptionsWhere<User>,
		options?: FindUserOptions
	): Promise<User> {
		const user = await this.findOneUser(where, { ...options, doMapping: false });

		if (!user) {
			throw new NotFoundException('This user does not exist');
		}

		return user;
	}

	public async createUser(userData: CreateUserDto): Promise<UserDto> {
		try {
			await this.verifyUserUniqueData(userData);

			const createUser = await this.prepareUserToCreate(userData);

			const {
				identifiers: [{ id }],
			} = await this.usersRepository.insert(createUser);

			return this.getOneUser({ id: id as string });
		} catch (exception) {
			if (!(exception instanceof QueryFailedError)) {
				throw exception;
			}

			const dbError = exception.driverError as DatabaseError;

			if (
				dbError.code === DbErrorCodes.UniqueViolation &&
				(dbError.column === 'email' || dbError.column === 'googleEmail')
			) {
				throw new ConflictException('The email is already taken');
			}

			if (dbError.code === DbErrorCodes.UniqueViolation && dbError.column === 'phoneNumber') {
				throw new ConflictException('The phone number is already taken');
			}

			throw exception;
		}
	}

	public async updateUser(
		userId: string,
		userData: Partial<User>,
		options: { isChangeSecure?: boolean } = {}
	): Promise<UserDto> {
		const user = await this.getOneUserEntity({ id: userId });

		await this.verifyUserUniqueData(userData, userId);

		const userToUpdate = await this.prepareUserToUpdate(userData, user, options.isChangeSecure);

		await this.usersRepository.update(user.id, userToUpdate);

		return this.getOneUser({ id: userId });
	}

	public async verifyIsPhoneUnique(phoneNumber: string, phoneBlacklistUserId?: string): Promise<IdDto> {
		const user = await this.usersRepository.findOne({
			where: {
				id: phoneBlacklistUserId ? Not(phoneBlacklistUserId) : undefined,
				phoneNumber,
			},
		});

		if (user) {
			throw new ConflictException({ field: 'phoneNumber' }, 'Phone number is already in use');
		}

		return {
			id: phoneNumber,
		};
	}

	public async verifyIsEmailUnique(email: string, emailBlacklistUserId?: string): Promise<IdDto> {
		const user = await this.usersRepository.findOne({
			where: {
				id: emailBlacklistUserId ? Not(emailBlacklistUserId) : undefined,
				email: ILike(email),
			},
		});

		if (user) {
			throw new ConflictException({ field: 'email' }, 'Email is already in use');
		}

		return {
			id: email,
		};
	}

	public async verifyIsGoogleEmailUnique(googleEmail: string, googleEmailBlacklistUserId?: string): Promise<IdDto> {
		const user = await this.usersRepository.findOne({
			where: {
				id: googleEmailBlacklistUserId ? Not(googleEmailBlacklistUserId) : undefined,
				googleEmail: ILike(googleEmail),
			},
		});

		if (user) {
			throw new ConflictException({ field: 'googleEmail' }, 'Email is already in use');
		}

		return {
			id: googleEmail,
		};
	}

	private async prepareUserToCreate(createUser: CreateUserDto): Promise<User> {
		const user = new User();
		Object.assign(user, createUser);

		if (user.password) {
			user.password = await hash(user.password, argon2DefaultConfig);
		}

		return user;
	}

	private async prepareUserToUpdate(
		user: Partial<User>,
		initialData: User,
		isChangeSecure = false
	): Promise<Partial<User>> {
		const userToUpdate: Partial<User> = {
			...pick(initialData, ['id']),
			...pick(user, ['name']),
			...(isChangeSecure
				? {
						...pick(user, ['password', 'email', 'phoneNumber', 'googleEmail']),
				  }
				: {}),
		};

		if (userToUpdate.password) {
			userToUpdate.password = await hash(userToUpdate.password, argon2DefaultConfig);
		}

		return userToUpdate;
	}

	private async verifyUserUniqueData(newData: Partial<User>, userId?: string): Promise<void> {
		if (newData.email) {
			await this.verifyIsEmailUnique(newData.email, userId);
		}

		if (newData.phoneNumber) {
			await this.verifyIsPhoneUnique(newData.phoneNumber, userId);
		}

		if (newData.googleEmail) {
			await this.verifyIsGoogleEmailUnique(newData.googleEmail, userId);
		}
	}
}
