import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
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
	@IsString()
	@IsNotEmpty()
	override verifyId: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber?: string;
}
