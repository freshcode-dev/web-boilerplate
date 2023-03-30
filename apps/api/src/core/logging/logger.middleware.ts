import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '@boilerplate/shared';
import { IApiConfigParams } from '../../interfaces/api-config-params';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly isResponseBodyLoggingEnabled: boolean;
  private readonly isVerboseRequestsLoggingEnabled: boolean;

	constructor(private readonly configService: ConfigService<IApiConfigParams>) {
    this.isResponseBodyLoggingEnabled = this.configService.get('NX_ENABLE_RESPONSE_BODY_LOGGING') === 'true';
    this.isVerboseRequestsLoggingEnabled = this.configService.get('NX_ENABLE_VERBOSE_REQUESTS_LOGGING') === 'true';
  }

	public use(request: Request, response: Response, next: NextFunction): void {
		const startTime = new Date().getTime();
		const { ip, method, body, query } = request;
		const userAgent = request.get('user-agent') ?? '';

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

			if (!url.includes('/users')) {
				if (this.isVerboseRequestsLoggingEnabled) {
					this.logger.log({
						message: 'Request',
						method,
						url,
            path,
						statusCode,
						body,
						ip,
            query,
						params: request.params,
						contentLength: contentLength ?? 0,
						userAgent,
            currentUserId: (request.user as UserDto)?.id,
            responseJsonBody: locals._jsonBody,
						responseTime
					});
				} else {
					this.logger.log(`[${ip}] [${method}] ${url} - ${statusCode}`);
				}
			}
		});

		next();
	}
}
