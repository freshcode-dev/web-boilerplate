import { ValidateIf } from 'class-validator';
import { ConfirmPasswordDto, MatchField, PasswordDto } from "@boilerplate/shared";

export class RestorePasswordFormDto extends PasswordDto implements ConfirmPasswordDto {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
