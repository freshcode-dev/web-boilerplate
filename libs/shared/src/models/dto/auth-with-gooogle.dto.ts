import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class AuthWithGoogle {
	@IsString()
	@IsNotEmpty()
	idToken: string;
}

export class GoogleUserDto implements Required<Pick<UserDto, 'googleEmail' | 'name'>> {
	googleEmail: string;
	name: string;
}
