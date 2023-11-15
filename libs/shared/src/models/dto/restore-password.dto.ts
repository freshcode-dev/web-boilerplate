import { ValidateIf } from "class-validator";
import { MatchField, VerificationCode } from "../../decorators";
import { ConfirmPasswordDto } from "./confirm-password.dto";
import { ConfirmationCodeDto } from "./confirmation-code.dto";
import { PasswordDto } from "./password.dto";

export class RestorePasswordDto extends PasswordDto implements ConfirmationCodeDto, ConfirmPasswordDto {
	@ValidateIf((o: any) => !!o.code)
	@VerificationCode()
	code: string;

	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
