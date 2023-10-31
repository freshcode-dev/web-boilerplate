import { Length } from 'class-validator';
import { EmailDto } from './email.dto';
import { ConfirmationCodeDto } from './confirmation-code.dto';
import { PhoneDto } from './phone.dto';

export class SignInEmailDto extends EmailDto {
	@Length(8, 36)
	password: string;
}

export class SignInPhoneDto extends ConfirmationCodeDto implements PhoneDto {
	phoneNumber: string;
}
