import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { User } from '@boilerplate/data';
import { UserDto } from '@boilerplate/shared';

@Injectable()
export class UserProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	get profile(): MappingProfile {
		return (mapper) => {
			createMap(mapper, User, UserDto);
		};
	}
}
