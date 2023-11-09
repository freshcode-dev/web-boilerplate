import { IDatabaseConfigParams } from '@boilerplate/data';

export interface IApiConfigParams extends IDatabaseConfigParams {
  NX_LOG_DIR: string;
  NX_ENABLE_VERBOSE_REQUESTS_LOGGING: string;
  NX_ENABLE_RESPONSE_BODY_LOGGING: string;
	NX_DATABASE_HEALTHCHECK_TIMEOUT: string;

	NX_ENABLE_TWILIO: string;
	TWILIO_ACCOUNT_SID: string;
	TWILIO_AUTH_TOKEN: string;
	TWILIO_VERIFY_SID: string;
	TWILIO_VERIFY_RATE_LIMIT: string;

	NX_ENABLE_GOOGLE_AUTH: string;
	NX_GOOGLE_API_CLIENT_ID: string;
	NX_GOOGLE_API_CLIENT_SECRET: string;
	NX_GOOGLE_API_REDIRECT_URL: string;

	NX_PARSE_IP_WITH_THIRD_PARTY_SERVICE: string;

	NX_ENABLE_SES: string;
	NX_SES_SMTP_HOST: string;
	NX_SES_SMTP_PORT: string;
	NX_SES_SEND_FROM: string;
	NX_SES_ACCESS_KEY_ID: string;
	NX_SES_SECRET_ACCESS_KEY: string;
}
