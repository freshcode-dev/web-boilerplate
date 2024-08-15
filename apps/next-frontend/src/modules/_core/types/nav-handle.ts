export interface NavigateOptions {
	replace?: boolean;
}

export interface HeaderNavParams {
	path: string;
	options?: NavigateOptions;
}

export interface NavHandle {
	to: number | HeaderNavParams;
}
