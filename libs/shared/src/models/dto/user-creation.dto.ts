import { UserDto } from './user.dto';

export type UserCreationDto = Omit<UserDto, 'id'>;
