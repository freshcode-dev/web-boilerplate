import { Catch, HttpStatus } from '@nestjs/common';
import BaseAppExceptionsFilter from './base-app-exceptions.filter';

@Catch()
export default class AllExceptionsFilter extends BaseAppExceptionsFilter {
  protected defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
