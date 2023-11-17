import { IsOptional, IsString, ValidateIf } from "class-validator";
import { MatchField, VerificationCode } from "../../decorators";
import { ConfirmPasswordDto } from "./confirm-password.dto";
import { ConfirmationCodeDto } from "./confirmation-code.dto";
import { PasswordDto } from "./password.dto";

export class RestorePasswordDto extends PasswordDto implements ConfirmationCodeDto, ConfirmPasswordDto {
	@IsOptional()
	@VerificationCode()
	code: string;

	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
