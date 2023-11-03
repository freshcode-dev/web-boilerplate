import { Request, UseGuards, Get, Controller, Param } from '@nestjs/common';
import { UserDto } from '@boilerplate/shared';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../services/guard/jwt.guard';
import { AuthRequest } from '../interfaces/auth-request';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Get('user/:id')
	async getUserById(@Param('id') id: string): Promise<UserDto> {
		return await this.userService.getUserById(id);
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async currentUser(@Request() req: AuthRequest): Promise<UserDto> {
		return await this.userService.getUserById(req.user.sub);
	}
}
