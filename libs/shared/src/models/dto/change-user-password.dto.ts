import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ConfirmPasswordDto } from './confirm-password.dto';
import { PasswordDto } from './password.dto';
import { MatchField } from '../../decorators';

export class ChangeUserPasswordDto extends PasswordDto implements ConfirmPasswordDto {
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	oldPassword: string;

	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
