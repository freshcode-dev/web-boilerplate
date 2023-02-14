import { IsEmail, IsNotEmpty } from 'class-validator';

export interface UserDto {
	id: string;
	name: string;
	email: string;
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class SignInDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;
}

export class AuthResultDto {
	user: UserDto;
	authToken: string;
}
