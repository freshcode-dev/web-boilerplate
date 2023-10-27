import { PhoneDto } from './phone.dto';
import { EmailDto } from './email.dto';
import { AuthReasonArray, AuthReasonEnum } from '../../enums';
import { IsEmail, IsIn, ValidateIf, IsPhoneNumber } from 'class-validator';

export class AuthVerifyDto implements PhoneDto, Partial<EmailDto> {
	@IsIn(AuthReasonArray)
	reason: AuthReasonEnum;

	@IsPhoneNumber()
	phoneNumber: string;

	@ValidateIf(object => object.reason === AuthReasonEnum.SignUp)
	@IsEmail()
	email?: string;
}
