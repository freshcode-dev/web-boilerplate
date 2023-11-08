import { IsEmail, IsOptional, IsPhoneNumber, Length } from 'class-validator';

export class CreateUserDto {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@Length(8, 36)
	password?: string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;

	@Length(1, 100)
	name: string;

	@IsOptional()
	@IsEmail()
	googleEmail?: string;
}
