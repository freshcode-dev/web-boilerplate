import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';
import { PasswordDto } from './password.dto';
import { EmailDto } from './email.dto';

export class SignUpWithEmailDto extends CreateUserDto implements EmailDto, PasswordDto {
	@IsEmail()
	override email: string;

	@Length(8, 36)
	override password: string;

	@IsOptional()
	@VerificationCode()
	code: string;
}
