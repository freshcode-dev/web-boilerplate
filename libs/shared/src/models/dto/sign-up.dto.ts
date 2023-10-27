import { UserPayloadDto } from './create-user.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';

export class SignUpDto extends UserPayloadDto {
	@IsString()
	companyName: string;

	@VerificationCode()
	code: string;

	@IsUUID('4')
	@IsOptional()
	referralId?: string;
}
