import { Request, Response } from 'express';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { IApiConfigParams } from '../../interfaces/api-config-params';
import { UserDto } from '@boilerplate/shared';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	private readonly logger = new Logger('HTTP');
	private readonly isResponseBodyLoggingEnabled: boolean;
	private readonly isVerboseLoggingEnabled: boolean;

	constructor(private readonly configService: ConfigService<IApiConfigParams>, private readonly reflector: Reflector) {
		this.isVerboseLoggingEnabled = this.configService.get('NX_ENABLE_VERBOSE_REQUESTS_LOGGING') === 'true';
		this.isResponseBodyLoggingEnabled = this.configService.get('NX_ENABLE_RESPONSE_BODY_LOGGING') === 'true';
	}

	getContextValue<T>(key: string, context: ExecutionContext): T {
		return this.reflector.get<T>(key, context.getHandler());
	}

	getLoggerSettings(context: ExecutionContext) {
		const logRequestBody = this.getContextValue<boolean>('logRequestBody', context);
		const logResponseBody = this.getContextValue<boolean>('logResponseBody', context);

		return {
			logRequestBody: logRequestBody ?? true,
			logResponseBody: logResponseBody ?? false,
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const httpContext = context.switchToHttp();
		const request = httpContext.getRequest<Request>();
		const response = httpContext.getResponse<Response>();

		const startTime = new Date().getTime();
		const { ip, method, body, query } = request;
		const userAgent = request.get('user-agent') || '';

		const { logRequestBody, logResponseBody } = this.getLoggerSettings(context);

		if (this.isResponseBodyLoggingEnabled) {
			const oldJsonFunc = response.json;
			response.json = (body) => {
				response.locals._jsonBody = body;

				return oldJsonFunc.call(response, body);
			};
		}

		response.on('close', () => {
			const responseTime = new Date().getTime() - startTime;
			const { statusCode, locals } = response;
			const contentLength = response.get('content-length');

			const url = request.url;
			const path = request.route?.path;
			const currentUserId = (request.user as UserDto)?.id;

			if (this.isVerboseLoggingEnabled) {
				this.logger.log({
					method,
					url,
					path,
					statusCode,
					body: logRequestBody ? body : undefined,
					ip,
					query,
					contentLength: contentLength || 0,
					userAgent,
					currentUserId,
					responseJsonBody: logResponseBody ? locals._jsonBody : undefined,
					responseTime,
				});
			} else {
				this.logger.log(
					`[${ip}] [${method}] ${url} - ${statusCode} [userId: ${currentUserId}] [time: ${responseTime} ms]`
				);
			}
		});

		return next
			.handle()
			// .pipe
			// tap(() => console.log(`After... ${Date.now() - now}ms`)),
			// ();
	}
}
