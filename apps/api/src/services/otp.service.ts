import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { TLatestSavedCode } from '../interfaces/otp';
import { OTPEntity } from '@boilerplate/data';
import { AuthReasonEnum, VERIFICATION_CODE_LENGTH } from '@boilerplate/shared';
import { MailerService } from './mailer.service';
import { createCodeEntry, resendCodeEntry, sendNewOtpCode, verifyOtpCode } from '../utils/send-otp.utils';
import { TwilioService } from './twillio.service';

@Injectable()
export class OTPService {
	constructor(
		@InjectRepository(OTPEntity) private readonly otpRepository: Repository<OTPEntity>,
		private readonly mailerService: MailerService,
		private readonly twilioService: TwilioService
	) {}

	public async createOtpCodeEntry(assignee: string): Promise<string> {
		const codeEntry = await createCodeEntry(VERIFICATION_CODE_LENGTH, assignee, async (codeEntry) => {
			await this.storeOtpCodeInDB(codeEntry);
		});

		return codeEntry.code;
	}

	public async sendNewOtpToPhone(toPhone: string): Promise<void> {
		await this.twilioService.createVerification(toPhone);
	}

	public async resendLastOtpToEmail(toEmail: string, reason: AuthReasonEnum): Promise<void> {
		await resendCodeEntry(
			{ codeLength: VERIFICATION_CODE_LENGTH, assignee: toEmail },
			async (assignee) => await this.getLastOtpCodeFromDB(assignee),
			async (code) => {
				await this.storeOtpCodeInDB(code);
			},
			async (code) => {
				await this.sendOtpCodeToEmail(code, toEmail, reason);
			}
		);
	}

	public async resendLastOtpToPhone(toPhone: string): Promise<void> {
		await this.sendNewOtpToPhone(toPhone);
	}

	public async sendNewOtpToEmail(toEmail: string, reason: AuthReasonEnum): Promise<void> {
		await sendNewOtpCode(
			{
				codeLength: VERIFICATION_CODE_LENGTH,
				assignee: toEmail,
			},
			async (code: TLatestSavedCode) => {
				await this.storeOtpCodeInDB(code);
			},
			async (code: string) => {
				await this.sendOtpCodeToEmail(code, toEmail, reason);
			}
		);
	}

	public async verifyOtpFromPhone(fromPhone: string, code: string): Promise<void> {
		if (!this.twilioService.enabled) return;

		await this.twilioService.approveVerification(fromPhone, code);
	}

	public async verifyOtpFromEmail(fromEmail: string, code: string): Promise<void> {
		if (!this.mailerService.enabled) return;

		await verifyOtpCode(
			{
				assignee: fromEmail,
				code,
			},
			async (assignee) => await this.getOtpsByAssigneeFromDB(assignee),
			async (code) => {
				await this.markOTPAsUsedInDB(code);
			}
		);
	}

	private async sendOtpCodeToEmail(code: string, toEmail: string, reason: AuthReasonEnum): Promise<void> {
		const isEmailSent = await this.mailerService.sendEmailVerificationCode(toEmail, code, reason);

		if (isEmailSent === false) throw new BadRequestException('Cannot send email');
	}

	private async storeOtpCodeInDB(code: TLatestSavedCode): Promise<void> {
		await this.otpRepository.save(code);
	}

	private async getOtpsByAssigneeFromDB(assignee: string): Promise<TLatestSavedCode[]> {
		return await this.otpRepository.find({
			where: { assignee, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
			take: 5,
		});
	}

	private async markOTPAsUsedInDB(code: TLatestSavedCode): Promise<void> {
		await this.otpRepository.update(code.code, { usedAt: new Date() });
	}

	private async getLastOtpCodeFromDB(assignee: string): Promise<TLatestSavedCode | null> {
		return await this.otpRepository.findOne({
			where: { assignee, usedAt: IsNull(), expiresAt: MoreThan(new Date()) },
			order: { createdAt: 'DESC' },
		});
	}
}
