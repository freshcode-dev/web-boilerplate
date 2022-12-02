import { Injectable } from '@nestjs/common';
import { UserDto, UserFilter } from '@boilerplate/shared';
import { User } from '@boilerplate/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getLimitOptionFromFilter,
  getOffsetOptionFromFilter,
  getOrderOptionsFromFilter
} from './extensions/filters/base-filters-extensions';

@Injectable()
export class UsersService {
  constructor(
		@InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {
  }

  public async findAll(filter: UserFilter): Promise<UserDto[]> {
    return this.usersRepository.find({
      order: getOrderOptionsFromFilter(filter),
      take: getLimitOptionFromFilter(filter) as number,
      skip: getOffsetOptionFromFilter(filter) as number
    });
  }

  public async findByEmail(email: string): Promise<UserDto | null> {
  	return await this.usersRepository.findOne({ where: { email } });
	}
}

