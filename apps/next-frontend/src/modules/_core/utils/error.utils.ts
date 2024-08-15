export const getErrorStatusCode = (error: unknown | (Error & Record<'status', unknown>)): number | null =>
	'status' in (error as Error) ? ((error as Error & Record<'status', unknown>).status as number) : null;

export const getFieldFromHttpError = (error: unknown | (Error & Record<'data', unknown>)): string | undefined => {
	const err = error as Error & Record<'data', unknown>;

	const data = 'data' in err ? (err.data as object) : null;
	const exceptionDetails = data && 'exceptionDetails' in data ? (data.exceptionDetails as { field?: string }) : null;

	return exceptionDetails && 'field' in exceptionDetails ? (exceptionDetails.field as string) : undefined;
};

export const isErrorStatus = (error: unknown | Error, isStatus: number): boolean => {
	const status = getErrorStatusCode(error as Error);

	return status === isStatus;
};

export const isUnauthorizedError = (error: unknown | Error): boolean => isErrorStatus(error, 401);

export const isConflictError = (error: unknown | Error): boolean => isErrorStatus(error, 409);

export const isNotFoundError = (error: unknown | Error): boolean => isErrorStatus(error, 404);

export const isForbiddenError = (error: unknown | Error): boolean => isErrorStatus(error, 403);

export const passStatusErrorThrough = (error: unknown | Error, isStatus: number): void => {
	// this error should be catched in place of usage
	// e.g. conflict error
	if (isErrorStatus(error, isStatus)) {
		throw error;
	}
};

export const passConflictErrorThrough = (error: unknown | Error): void => {
	// this error should be catched in place of usage
	// e.g. conflict error
	if (isConflictError(error)) {
		throw error;
	}
};
export const passNotFoundErrorThrough = (error: unknown | Error): void => {
	// this error should be catched in place of usage
	// e.g. conflict error
	if (isNotFoundError(error)) {
		throw error;
	}
};
export const markErrorField = (
	error: unknown | Error,
	markError: (errField?: string) => void,
	elseMarkError = true
): void => {
	const status = getErrorStatusCode(error as Error);

	if (status === 409) {
		const field = getFieldFromHttpError(error as Error);

		if (field) {
			markError(field);

			return;
		}
	}

	if (elseMarkError) {
		markError();
	}
};
