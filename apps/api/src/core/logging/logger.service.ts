import { Injectable, Logger, Scope } from '@nestjs/common';
import {
	TDebugLogBody,
	TErrorLogBody,
	TInfoLogBody,
	TVerboseLogBody,
	TWarningLogBody
} from './types';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
	setContext(context: string) {
		super.context = context;
	}

	/**
	 * @deprecated use typed alternatives instead
	 */
	public logPlain(message: string, context?: string) {
		super.log(message, context ?? this.context);
	}

	override log(body: TInfoLogBody, context?: string) {
		super.log(this.prepareLogBody(body), context ?? this.context, body);
	}

	override warn(body: TWarningLogBody, context?: string) {
		super.warn(this.prepareLogBody(body), context ?? this.context);
	}

	override error(body: TErrorLogBody, context?: string) {
		const stack = body.stack;
		delete body.stack;

		super.error(this.prepareLogBody(body), stack, context ?? this.context);
	}

	override debug(body: TDebugLogBody, context?: string) {
		super.debug(this.prepareLogBody(body), context ?? this.context);
	}

	override verbose(body: TVerboseLogBody, context?: string) {
		super.verbose(this.prepareLogBody(body), context ?? this.context);
	}

	private prepareLogBody<T>(body: T): T {
		const untypedBody = (body as Record<string, unknown>);
		untypedBody.value = undefined;

		return untypedBody as T;
	}
}
