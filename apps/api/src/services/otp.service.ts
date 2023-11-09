import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { TLatestSavedCode, TSendOtpCodeAsyncFunc, TVerifyOtpCodeAsyncFunc } from '../interfaces/otp';
import { OTPEntity } from '@boilerplate/data';
import { IApiConfigParams } from '../interfaces/api-config-params';
import { isBoolean, isNil } from 'lodash';

@Injectable()
export class OTPService {
	constructor(
		@InjectRepository(OTPEntity) private readonly otpRepository: Repository<OTPEntity>,
		private readonly configService: ConfigService<IApiConfigParams>
	) {}

	public sendOtpCode: TSendOtpCodeAsyncFunc = async ({ codeLength, assignee }, storeCodeEntry, sendCode) => {
		const codeEntry = this.createCodeEntry(codeLength, assignee);

		await storeCodeEntry(codeEntry);

		await sendCode(codeEntry.code);

		return codeEntry.code;
	};

	public verifyOtpCode: TVerifyOtpCodeAsyncFunc = async ({ code, assignee }, getCodeEntries, markCodeAsUsed) => {
		const codeEntry = await this.getValidOTP(code, assignee, getCodeEntries);

		if (!isNil(codeEntry) && !isBoolean(codeEntry)) {
			await markCodeAsUsed(codeEntry);
		}

		if (!codeEntry) {
			throw new ForbiddenException('Invalid verification code!');
		}

		return true;
	};

	public async storeOtpCodeInDB(code: TLatestSavedCode): Promise<void> {
		await this.otpRepository.save(code);
	}

	public async getOtpsByAssigneeFromDB(assignee: string): Promise<TLatestSavedCode[]> {
		return await this.otpRepository.find({
			where: { assignee, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
			take: 5,
		});
	}

	public async markOTPAsUsedInDB(code: TLatestSavedCode): Promise<void> {
		await this.otpRepository.update(code.code, { usedAt: new Date() });
	}

	public async getValidOTP(
		code: string,
		assignee: string,
		getCodeEntries: (assignee: string) => Promise<TLatestSavedCode[]>
	): Promise<TLatestSavedCode | undefined | boolean> {
		if (this.configService.get('NX_ENABLE_SES') !== 'true') {
			return true;
		}

		const codeEntries = await getCodeEntries(assignee);

		const validOtp = codeEntries.find((codeEntry) => this.verifyCodeEntry(codeEntry, code));

		return validOtp;
	}

	private createCodeEntry(codeLength: number, assignee: string): TLatestSavedCode {
		const code = this.createCodeString(codeLength);

		const issuedAt = new Date();

		return {
			code,
			createdAt: issuedAt,
			expiresAt: this.getCodeExpireDate(issuedAt),
			assignee,
		};
	}

	private createCodeString(codeLength: number): string {
		return '' + Math.floor(Math.random() * Math.pow(10, codeLength));
	}

	private verifyCodeEntry(codeEntry: TLatestSavedCode, code: string): boolean {
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		if (!codeEntry || codeEntry?.usedAt || codeEntry?.code !== code || codeEntry?.expiresAt <= new Date()) {
			return false;
		}

		return true;
	}

	private getCodeExpireDate(issuedAt: Date) {
		return new Date(issuedAt.getTime() + 1000 * 60 * 5);
	}
}
