import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsPhoneNumber, Length, ValidateIf } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';
import { PasswordDto } from './password.dto';
import { EmailDto } from './email.dto';
import { PhoneDto } from './phone.dto';
import { ConfirmPasswordDto } from './confirm-password.dto';
import { MatchField } from '../../decorators';
import { ConfirmationCodeDto } from './confirmation-code.dto';

export class SignUpWithEmailDto extends CreateUserDto implements ConfirmationCodeDto, EmailDto, PasswordDto, PhoneDto, ConfirmPasswordDto {
	@IsEmail()
	override email: string;

	@IsPhoneNumber()
	override phoneNumber: string;

	@Length(8, 36)
	override password: string;

	@ValidateIf((o: any) => !!o.code)
	@VerificationCode()
	code: string;

	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
