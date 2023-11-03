export type TBaseLogBody = {
	message: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} & Record<string, any>;

export type TInfoLogBody = TBaseLogBody;
export type TDebugLogBody = TBaseLogBody;
export type TVerboseLogBody = TBaseLogBody;
export type TWarningLogBody = TBaseLogBody;

export type TErrorLogBody = {
	error?: Error;
	stack?: string;
} & TBaseLogBody;
