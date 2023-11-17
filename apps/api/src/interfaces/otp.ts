import { OTPEntity } from '@boilerplate/data';

export type TLatestSavedCode = OTPEntity;

export type TCreateCodeEntryAsyncFunc = (
	codeLength: number,
	assignee: string,
	storeCodeEntry: (code: TLatestSavedCode) => Promise<void> // Запись в любое хранилище
) => Promise<TLatestSavedCode>;

export type TSendNewOtpCodeAsyncFunc = (
	options: {
		codeLength: number;
		assignee: string;
	},
	storeNewOtpCode: (code: TLatestSavedCode) => Promise<void>, // Запись в любое хранилище
	sendCode: (code: string) => Promise<void> // собственно, отправка по СМС, почте, как угодно
) => Promise<string>;

export type TResendLastOtpCodeAsyncFunc = (
	options: {
		codeLength: number;
		assignee: string;
	},
	getLastCodeEntry: (assignee: string) => Promise<TLatestSavedCode | null | undefined>, // Получение из любого хранилища
	storeNewOtpCode: (code: TLatestSavedCode) => Promise<void>, // Запись в любое хранилище
	sendCode: (code: string) => Promise<void> // собственно, отправка по СМС, почте, как угодно
) => Promise<string>;

export type TVerifyOtpCodeAsyncFunc = (
	data: { code: string; assignee: string },
	getLastCodeEntries: (assignee: string) => Promise<TLatestSavedCode[]>, // Получение из любого хранилища
	markCodeAsUsed: (code: TLatestSavedCode) => Promise<void> // Пометка в любом хранилище
) => Promise<boolean>;
