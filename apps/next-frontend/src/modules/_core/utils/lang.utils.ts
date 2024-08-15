import { TFunction } from 'i18next';
import { ErrorKeys, ErrorsMap } from '../constants/errors-map.constants';

export const errorMessage = (t: TFunction, type: unknown): string => {
	if (typeof type !== 'string') {
		return '';
	}

	const errorKey = ErrorsMap[type as ErrorKeys] as string;

	return t(errorKey) as string;
};
