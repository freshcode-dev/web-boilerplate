import { IsBoolean, Length } from 'class-validator';
import { VerificationCode } from '../../decorators';
import { EmailDto } from './email.dto';
import { ConfirmationCodeDto } from './confirmation-code.dto';
import { PhoneDto } from './phone.dto';
import { PasswordDto } from './password.dto';

export class RememberMeDto {
	@IsBoolean()
	rememberMe: boolean;
}

export class SignInWithEmailDto extends EmailDto implements PasswordDto, RememberMeDto {
	@Length(8, 36)
	password: string;

	@IsBoolean()
	rememberMe: boolean;
}

export class SignInWithPhoneDto extends PhoneDto implements ConfirmationCodeDto, RememberMeDto {
	@VerificationCode()
	code: string;

	@IsBoolean()
	rememberMe: boolean;
}
