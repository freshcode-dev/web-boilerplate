import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Session } from '@boilerplate/data';
import { SessionDto } from '@boilerplate/shared';

export class SessionProfile extends AutomapperProfile {
	constructor(@InjectMapper() mapper: Mapper) {
		super(mapper);
	}

	get profile(): MappingProfile {
		return (mapper) => {
			createMap(mapper, Session, SessionDto);
		};
	}
}
