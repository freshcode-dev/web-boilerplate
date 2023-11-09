import { MatchField, SignUpWithEmailDto } from '@boilerplate/shared';
import { ValidateIf } from 'class-validator';

export class SignUpWithEmailFormData extends SignUpWithEmailDto {
	@ValidateIf((o: SignUpWithEmailFormData) => !!o.password)
	@MatchField('password', { message: 'Passwords must match' })
	confirmPassword: string;
}
