import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	email: string;

	@Length(1, 100)
	name: string;

	@Length(8, 36)
	password: string;
}
