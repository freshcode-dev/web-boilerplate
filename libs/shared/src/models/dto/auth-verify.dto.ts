import { PhoneDto } from './phone.dto';
import { EmailDto } from './email.dto';
import { AuthReasonArray, AuthReasonEnum } from '../../enums';
import { IsEmail, IsIn, ValidateIf, IsPhoneNumber } from 'class-validator';

export class AuthVerifyDto implements Partial<PhoneDto>, Partial<EmailDto> {
	@IsIn(AuthReasonArray)
	reason: AuthReasonEnum;

	@ValidateIf((object: AuthVerifyDto) => object.reason === AuthReasonEnum.SignIn)
	@IsPhoneNumber()
	phoneNumber?: string;

	@ValidateIf((object: AuthVerifyDto) => object.reason === AuthReasonEnum.SignUp)
	@IsEmail()
	email?: string;
}
