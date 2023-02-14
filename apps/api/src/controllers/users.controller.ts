import { Controller, Get, Query } from '@nestjs/common';
import { UserDto, UserFilter } from '@boilerplate/shared';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get()
  public async findAll(@Query() filter: UserFilter): Promise<UserDto[]> {
		return await this.usersService.findAll(filter);
  }

  // @Put()
  // public async create(@Body() entity: UserDto): Promise<UserDto> {
  //   return this.usersService.upsert(entity);
  // }
}
