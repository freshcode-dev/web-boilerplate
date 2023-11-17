import { To, NavigateOptions } from 'react-router-dom';

export interface HeaderNavParams {
	path: To;
	options?: NavigateOptions;
}

export interface NavHandle {
	to: number | HeaderNavParams;
}
