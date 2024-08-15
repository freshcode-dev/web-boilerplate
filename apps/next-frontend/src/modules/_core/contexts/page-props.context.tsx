import { createContext, FC, PropsWithChildren, useContext } from 'react';

export const defaultPagePropsValue = {};

export type TPagePropsContextValue = Record<string, unknown>;

export const PagePropsContext = createContext<TPagePropsContextValue>(defaultPagePropsValue);

export const usePageProps = <Type extends object = TPagePropsContextValue>(): Type =>
	(useContext(PagePropsContext) ?? {}) as Type;

export const PagePropsProvider: FC<PropsWithChildren<{ value?: TPagePropsContextValue }>> = ({ children, value }) => (
	<PagePropsContext.Provider value={value ?? defaultPagePropsValue}>{children}</PagePropsContext.Provider>
);
