import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import * as _ from 'lodash';
import { UsersService } from './users.service';
import { UserDto, ValidateUserDto } from '@boilerplate/shared';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {
	}

	public async validateUser(email: string, password: string): Promise<ValidateUserDto> {
		const foundUser: UserDto | null = await this.usersService.findByEmail(email);

		if (foundUser?.password) {
			const isEqual = await compare(password, foundUser.password);

			if (isEqual)
				return { user: _.omit(foundUser, 'password') };

			return { error: true, message: 'Incorrect password' };
		}

		return { error: true, message: 'This user does not exist' };
	}

	public generateJWT(user: UserDto): string {
		return this.jwtService.sign(user);
	}
}
