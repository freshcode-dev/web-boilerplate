import { SetMetadata, applyDecorators } from '@nestjs/common';

export type LoggerSettingsParams = {
	logRequestBody?: boolean;
	logResponseBody?: boolean;
};

export const LoggerSettings = (
	{ logRequestBody, logResponseBody }: LoggerSettingsParams = { logRequestBody: true, logResponseBody: true }
) => {
	const decors = [];

	if (logRequestBody !== undefined) decors.push(SetMetadata('logRequestBody', logRequestBody));

	if (logResponseBody !== undefined) decors.push(SetMetadata('logResponseBody', logResponseBody));

	return applyDecorators(...decors);
};
