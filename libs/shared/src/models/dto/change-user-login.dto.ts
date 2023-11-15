import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { ConfirmationCodeDto } from './confirmation-code.dto';

export class ChangeUserLoginRequest {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;
}

export class ChangeUserLoginDto extends ConfirmationCodeDto implements ChangeUserLoginRequest {
	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;
}
