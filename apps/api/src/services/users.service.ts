import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, IdDto, UserDto } from '@boilerplate/shared';
import { User } from '@boilerplate/data';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, QueryFailedError, Repository } from 'typeorm';
import { hash } from 'argon2';
import { argon2DefaultConfig, DbErrorCodes } from '../constants';
import { DatabaseError } from 'pg';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async findUserByPhone(phoneNumber: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { phoneNumber }});
	}

	public async findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { email } });
	}

	public async registerUser(userDto: CreateUserDto): Promise<UserDto> {
		try {
			const { name, password, email } = userDto;

			const user = new User();
			user.name = name;
			user.phoneNumber = userDto.phoneNumber;
			user.email = email;
			user.password = password ? await hash(password, argon2DefaultConfig): password;

			await this.usersRepository.insert(user);

			return user;
		} catch (exception) {
			if (!(exception instanceof QueryFailedError)) {
				throw exception;
			}

			const dbError = exception.driverError as DatabaseError;

			if (dbError.code === DbErrorCodes.UniqueViolation) {
				throw new ConflictException('The email is already taken');
			}

			throw exception;
		}
	}

	public async findUserById(id: string): Promise<UserDto | null> {
		const user = await this.usersRepository.findOne({ where: { id } });

		return this.mapper.map(user, User, UserDto);
	}

	public async getUserById(id: string): Promise<UserDto> {
		const user = await this.findUserById(id);

		if (!user) {
			throw new NotFoundException('This user does not exist');
		}

		return user;
	}

	public async verifyIsPhoneUnique(phoneNumber: string, phoneBlacklistUserId?: string): Promise<IdDto> {
		const user = await this.usersRepository.findOne({
			where: {
				id: phoneBlacklistUserId
					? Not(phoneBlacklistUserId)
					: undefined,
				phoneNumber
			}
		});

		if (user) {
			throw new ConflictException(
				{ field: 'phoneNumber' },
				'Phone number is already in use'
			);
		}

		return {
			id: phoneNumber
		};
	}

	public async verifyIsEmailUnique(email: string, phoneBlacklistUserId?: string): Promise<IdDto> {
		const user = await this.usersRepository.findOne({
			where: {
				id: phoneBlacklistUserId
					? Not(phoneBlacklistUserId)
					: undefined,
				email: ILike(email),
			}
		});

		if (user) {
			throw new ConflictException(
				{ field: 'email' },
				'Email is already in use'
			);
		}

		return {
			id: email
		};
	}

}
