import { IsOptional, IsString } from 'class-validator';
import { VerificationCode } from '../../decorators/verification-code.decorator';

export class ConfirmationCodeDto {
	@IsOptional()
	@IsString()
	verifyId?: string;

	@VerificationCode()
	code: string;
}
