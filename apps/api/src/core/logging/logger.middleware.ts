import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

	constructor(private readonly configService: ConfigService) {}

	public use(request: Request, response: Response, next: NextFunction): void {
		const { ip, method, path: url, body } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('close', () => {
			const { statusCode } = response;
			const contentLength = response.get('content-length');

			if (!url.includes('/users')) {
				if (this.configService.get('NX_ENABLE_VERBOSE_REQUESTS_LOGGING') === 'true') {
					this.logger.log({
						method,
						url,
						statusCode,
						body,
						ip,
						contentLength: contentLength || 0,
						userAgent
					});
				} else {
					this.logger.log(`[${ip}] [${method}] ${url} - ${statusCode}`);
				}
			}
		});

		next();
	}
}
