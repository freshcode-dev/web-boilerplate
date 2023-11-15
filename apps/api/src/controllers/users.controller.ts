import { Get, Controller, Param, Body, Put, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UpdateUserDataDto, UserDto } from '@boilerplate/shared';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { RequestWithAuth } from '../interfaces/auth-request';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('user/:id')
	async getUserById(@Param('id') id: string): Promise<UserDto> {
		return await this.usersService.getOneUser({ id });
	}

	@Put('user/:id')
	@UseGuards(JwtAuthGuard)
	async updateUser(
		@Req() request: RequestWithAuth,
		@Param('id') id: string,
		@Body() data: UpdateUserDataDto
	): Promise<UserDto> {
		const { sub: userId } = request.user;

		if (userId !== id) {
			throw new ForbiddenException('You are not allowed to update this user');
		}

		return await this.usersService.updateUser(id, data);
	}
}
