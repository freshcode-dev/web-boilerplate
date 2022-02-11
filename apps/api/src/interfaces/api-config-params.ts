import { IDatabaseConfigParams } from '@boilerplate/data';

export interface IApiConfigParams extends IDatabaseConfigParams {
  NX_LOG_DIR: string;
  NX_ENABLE_VERBOSE_REQUESTS_LOGGING: string;
  NX_ENABLE_RESPONSE_BODY_LOGGING: string;
}
