import { VerificationCode } from '../../decorators/verification-code.decorator';

export class ConfirmationCodeDto {
	@VerificationCode()
	code: string;
}

