import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConfigParam } from '../../enums/config-params.enum';
import { UserDto } from '@boilerplate/shared';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly isResponseBodyLoggingEnabled: boolean;

	constructor(private readonly configService: ConfigService) {
    this.isResponseBodyLoggingEnabled = this.configService.get(ConfigParam.ENABLE_RESPONSE_BODY_LOGGING) === 'true';
  }

	public use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, path: url, route, body, query } = request;
		const userAgent = request.get('user-agent') || '';

    if (this.isResponseBodyLoggingEnabled) {
      const oldJsonFunc = response.json;
      response.json = (body) => {
        response.locals._jsonBody = body;

        return oldJsonFunc.call(response, body);
      };
    }

		response.on('close', () => {
			const { statusCode, locals } = response;
			const contentLength = response.get('content-length');

      const url = request.url;
      const path = request.route?.path;

			if (!url.includes('/users')) {
				if (this.configService.get('NX_ENABLE_VERBOSE_REQUESTS_LOGGING') === 'true') {
					this.logger.log({
						method,
						url,
            path,
						statusCode,
						body,
						ip,
            query,
						contentLength: contentLength || 0,
						userAgent,
            currentUserId: (request.user as UserDto)?.id,
            responseJsonBody: locals._jsonBody
					});
				} else {
					this.logger.log(`[${ip}] [${method}] ${url} - ${statusCode}`);
				}
			}
		});

		next();
	}
}
