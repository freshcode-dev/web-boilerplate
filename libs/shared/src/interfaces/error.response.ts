export interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  description?: string;
  exceptionDetails?: unknown;
  fieldsErrors?: Record<string, string[]>;
}
