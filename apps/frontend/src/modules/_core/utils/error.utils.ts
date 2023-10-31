export const getErrorStatusCode = (error: Error): number | null =>
	'status' in error ? (error.status as number) : null;

export const getFieldFromConflictError = (error: Error): string | null => {
	const data = 'data' in error ? (error.data as object) : null;
	const exceptionDetails = data && 'exceptionDetails' in data ? (data.exceptionDetails as { field?: string }) : null;

	return exceptionDetails && 'field' in exceptionDetails ? (exceptionDetails.field as string) : null;
};
