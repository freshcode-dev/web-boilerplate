import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsPhoneNumber, Length } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';
import { PasswordDto } from './password.dto';
import { EmailDto } from './email.dto';
import { PhoneDto } from './phone.dto';
import { ConfirmationCodeDto } from './confirmation-code.dto';

export class SignUpWithEmailDto extends CreateUserDto implements EmailDto, PasswordDto {
	@IsEmail()
	override email: string;

	@Length(8, 36)
	override password: string;
}

export class SignUpWithPhoneDto extends CreateUserDto implements PhoneDto, ConfirmationCodeDto {
	@IsPhoneNumber()
	override phoneNumber: string;

	@IsOptional()
	@VerificationCode()
	code: string;
}
