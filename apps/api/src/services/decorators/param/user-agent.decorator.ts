import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
	const request = ctx.switchToHttp().getRequest() as Request;

	const userAgentString = request.headers['user-agent'] as string;

	return userAgentString;
});
