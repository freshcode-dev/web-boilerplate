import { ValidateIf } from "class-validator";
import { MatchField } from "../../decorators";

export class ConfirmPasswordDto {
	@ValidateIf((o: any) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
