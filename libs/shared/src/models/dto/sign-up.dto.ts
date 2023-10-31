import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';

export class SignUpDto extends CreateUserDto {
	@IsString()
	companyName: string;

	@IsPhoneNumber()
	phoneNumber: string;

	@VerificationCode()
	code: string;

	@IsUUID('4')
	@IsOptional()
	referralId?: string;
}
