import { IsEmail, Length } from 'class-validator';

export class SignInDto {
	@IsEmail()
	email: string;

	@Length(8, 36)
	password: string;
}
