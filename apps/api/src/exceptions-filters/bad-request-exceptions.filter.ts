import { Catch, HttpStatus } from '@nestjs/common';
import BaseAppExceptionsFilter from './base-app-exceptions.filter';
import BadRequestDetailedException from '../exceptions/bad-request-detailed.exception';

@Catch(BadRequestDetailedException)
export default class BadRequestExceptionsFilter extends BaseAppExceptionsFilter {
  protected defaultStatusCode = HttpStatus.BAD_REQUEST;

  protected getFieldsErrors(exception: Error): Record<string, string[]> {
    if (exception instanceof BadRequestDetailedException)
      return exception.fieldsErrors;
    else
      return undefined;
  }
}
