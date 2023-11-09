import { OTPEntity } from "@boilerplate/data";

export type TLatestSavedCode = OTPEntity;
export type TSendOtpCodeAsyncFunc = (
	options: {
		codeLength: number,
		assignee: string,
	},
	storeCodeEntry: (code: TLatestSavedCode) => Promise<void>, // Запись в любое хранилище
	sendCode: (code: string) => Promise<void> // собственно, отправка по СМС, почте, как угодно
) => Promise<string>;

export type TVerifyOtpCodeAsyncFunc = (
	data: { code: string; assignee: string },
	getCodeEntries: (assignee: string) => Promise<TLatestSavedCode[]>, // Получение из любого хранилища
	markCodeAsUsed: (code: TLatestSavedCode) => Promise<void> // Пометка в любом хранилище
) => Promise<boolean | TLatestSavedCode | undefined>;
