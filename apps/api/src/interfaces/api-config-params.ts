import { IDatabaseConfigParams } from '@boilerplate/data';

export interface IApiConfigParams extends IDatabaseConfigParams {
  NX_LOG_DIR: string;
  NX_ENABLE_VERBOSE_REQUESTS_LOGGING: string;
  NX_ENABLE_RESPONSE_BODY_LOGGING: string;
	NX_DATABASE_HEALTHCHECK_TIMEOUT: string;
	NX_ENABLE_PHONE_VERIFICATION: string;
	TWILIO_ACCOUNT_SID: string;
	TWILIO_AUTH_TOKEN: string;
	TWILIO_VERIFY_SID: string;
	TWILIO_VERIFY_RATE_LIMIT: string;
}
