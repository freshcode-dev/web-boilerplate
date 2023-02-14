import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import * as _ from 'lodash';
import { UsersService } from './users.service';
import { AuthResultDto, UserDto } from '@boilerplate/shared';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {
	}

	public async authenticateUser(email: string, password: string): Promise<AuthResultDto> {
		const user = await this.verifyUserCredentials(email, password);
		const authToken = this.generateJWT(user);

		return { user, authToken };
	}

	public async verifyUserCredentials(email: string, password: string): Promise<UserDto> {
		const foundUser = await this.usersService.findByEmail(email);

		if (!foundUser?.password) {
			throw new UnauthorizedException('This user does not exist');
		}

		const isEqual = await compare(password, foundUser.password);

		if (!isEqual) {
			throw new UnauthorizedException('Incorrect password');
		}

		return _.omit(foundUser, 'password');
	}

	public generateJWT(user: UserDto): string {
		return this.jwtService.sign(user);
	}
}
