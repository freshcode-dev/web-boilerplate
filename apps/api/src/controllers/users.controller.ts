import { Get, Controller, Param } from '@nestjs/common';
import { UserDto } from '@boilerplate/shared';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('user/:id')
	async getUserById(@Param('id') id: string): Promise<UserDto> {
		return await this.usersService.getOne({ id });
	}
}
