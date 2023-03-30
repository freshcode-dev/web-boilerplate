import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UserDto } from '@boilerplate/shared';
import { User } from '@boilerplate/data';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { hash } from 'argon2';
import { argon2DefaultConfig, DbErrorCodes } from '../constants';
import { DatabaseError } from 'pg';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>,
		@InjectMapper() private readonly mapper: Mapper
	) {}

	public async findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { email } });
	}

	public async create(userDto: CreateUserDto): Promise<UserDto> {
		try {
			const { name, password, email } = userDto;

			const user = new User();
			user.name = name;
			user.email = email;
			user.password = await hash(password, argon2DefaultConfig);

			await this.usersRepository.insert(user);

			return this.mapper.map(user, User, UserDto);
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
}
