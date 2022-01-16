import { IsEmail, IsNotEmpty } from 'class-validator';

export interface UserDto {
  id: string;
  name: string;
	email: string;
	password?: string;
	createdAt?: Date;
  updatedAt?: Date;
}

export class LoginDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	password: string;
}

export interface ValidateUserDto {
	user?: UserDto;
	error?: boolean;
	message?: string;
}
