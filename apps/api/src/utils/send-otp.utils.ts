import { ForbiddenException } from '@nestjs/common';
import { isBoolean, isNil } from 'lodash';
import { randomUUID } from 'crypto';
import ms from 'ms';
import {
	TCreateCodeEntryAsyncFunc,
	TLatestSavedCode,
	TResendLastOtpCodeAsyncFunc,
	TSendNewOtpCodeAsyncFunc,
	TVerifyOtpCodeAsyncFunc,
} from '../interfaces/otp';
import { otpExpiresIn } from '../constants';
import { otpResendTimeout } from '@boilerplate/shared';

/* private */

const getCodeExpireDate = (issuedAt: Date): Date => new Date(issuedAt.getTime() + ms(otpExpiresIn));

const createCodeString = (codeLength: number): string => {
	const uuid = randomUUID();

	return uuid.slice(0, codeLength);
};

const isCodeEntryValid = (codeEntry: TLatestSavedCode, enteredCode: string): boolean => {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	if (!codeEntry || codeEntry?.usedAt || codeEntry?.code !== enteredCode || codeEntry?.expiresAt <= new Date()) {
		return false;
	}

	return true;
};

const findValidOtp = (codeEntries: TLatestSavedCode[], code: string): TLatestSavedCode | undefined => {
	const validOtp = codeEntries.find((codeEntry) => isCodeEntryValid(codeEntry, code));

	return validOtp;
};

/* public */

export const createCodeEntry: TCreateCodeEntryAsyncFunc = async (
	codeLength: number,
	assignee: string,
	storeCodeEntry
): Promise<TLatestSavedCode> => {
	const code = createCodeString(codeLength);

	const issuedAt = new Date();

	const codeEntry = {
		code,
		createdAt: issuedAt,
		expiresAt: getCodeExpireDate(issuedAt),
		assignee,
	};

	await storeCodeEntry(codeEntry);

	return codeEntry;
};

export const sendNewOtpCode: TSendNewOtpCodeAsyncFunc = async (
	{ codeLength, assignee },
	storeCodeEntry,
	sendCode
): Promise<string> => {
	const codeEntry = await createCodeEntry(codeLength, assignee, storeCodeEntry);

	await sendCode(codeEntry.code);

	return codeEntry.code;
};

export const resendCodeEntry: TResendLastOtpCodeAsyncFunc = async (
	{ codeLength, assignee },
	getLastCodeEntry,
	storeNewOtpCode,
	sendCode
): Promise<string> => {
	const lastCodeEntry = await getLastCodeEntry(assignee);

	if (
		lastCodeEntry &&
		!lastCodeEntry?.usedAt &&
		lastCodeEntry?.expiresAt > new Date(new Date().getTime() + ms(otpResendTimeout))
	) {
		await sendCode(lastCodeEntry.code);

		return lastCodeEntry.code;
	}

	return await sendNewOtpCode({ codeLength, assignee }, storeNewOtpCode, sendCode);
};

export const verifyOtpCode: TVerifyOtpCodeAsyncFunc = async (
	{ code, assignee },
	getCodeEntries,
	markCodeAsUsed
): Promise<boolean> => {
	const codeEntries = await getCodeEntries(assignee);

	const validCodeEntry = findValidOtp(codeEntries, code);

	if (!isNil(validCodeEntry) && !isBoolean(validCodeEntry)) {
		await markCodeAsUsed(validCodeEntry);
	}

	if (!validCodeEntry) {
		throw new ForbiddenException('Invalid verification code!');
	}

	return true;
};
