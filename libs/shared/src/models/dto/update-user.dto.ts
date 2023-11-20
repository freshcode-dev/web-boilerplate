import { Length } from 'class-validator';
import { UserDto } from './user.dto';

export class UpdateUserDataDto implements Pick<Partial<UserDto>, 'name'> {
	@Length(1, 100)
	name?: string;

	static instantiate(user: UserDto): UpdateUserDataDto {
		const updateUserDto = new UpdateUserDataDto();
		updateUserDto.name = user.name;

		return updateUserDto;
	}
}
