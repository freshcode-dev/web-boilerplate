import { PhoneDto } from './phone.dto';
import { EmailDto } from './email.dto';
import { AuthReasonArray, AuthReasonEnum } from '../../enums';
import { IsEmail, IsIn, ValidateIf, IsPhoneNumber, IsBoolean, IsOptional } from 'class-validator';

export class AuthVerifyDto implements Partial<PhoneDto>, Partial<EmailDto> {
	@IsOptional()
	@IsBoolean()
	isResend?: boolean;

	@IsIn(AuthReasonArray)
	reason: AuthReasonEnum;

	@ValidateIf((object: AuthVerifyDto) => !object.email)
	@IsPhoneNumber()
	phoneNumber?: string;

	@ValidateIf((object: AuthVerifyDto) => !object.phoneNumber)
	@IsEmail()
	email?: string;
}
