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

interface FindUserOptions {
	doMapping?: boolean;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async findOne(where: FindOptionsWhere<User>[] | FindOptionsWhere<User>, { doMapping = true }: FindUserOptions = {}): Promise<User | null> {
		const user = await this.usersRepository.findOne({ where });

		if (!user) {
			return null;
		}

		if (doMapping) {
			return this.mapper.map(user, User, UserDto);
		}

		return user;
	}

	public async getOne(where: FindOptionsWhere<User>[] | FindOptionsWhere<User>, options?: FindUserOptions): Promise<UserDto> {
		const user = await this.findOne(where, options);

		if (!user) {
			throw new NotFoundException('This user does not exist');
		}

		return user;
	}

	public async createUser(userDto: CreateUserDto): Promise<UserDto> {
		try {
			const createUser = await this.prepareUserToCreate(userDto);

			const {
				identifiers: [{ id }],
			} = await this.usersRepository.insert(createUser);

			return this.getOne({ id: id as string });
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

	public async updateUser(userId: string, userData: Partial<User>): Promise<UserDto> {
		const user = await this.getOne({ id: userId }, { withPassword: true });

		if (!user) {
			throw new NotFoundException('User does not exist');
		}

		const userToUpdate = await this.prepareUserToUpdate(userData, user);

		await this.usersRepository.update(userId, userToUpdate);

		return this.getOne({ id: userId });
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

	private async prepareUserToCreate(userDto: CreateUserDto): Promise<User> {
		const user = new User();
		user.name = userDto.name;
		user.phoneNumber = userDto.phoneNumber;
		user.email = userDto.email;
		user.googleEmail = userDto.googleEmail;
		user.password = userDto.password ? await hash(userDto.password, argon2DefaultConfig) : undefined;

		return user;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private async prepareUserToUpdate(user: Partial<User>, initialData: UserDto & User): Promise<Partial<User>> {
		const userToUpdate: Partial<User> = {
			...user,
		};

		if (userToUpdate.password) {
			userToUpdate.password = await hash(userToUpdate.password, argon2DefaultConfig);
		}

		return userToUpdate;
	}
}
