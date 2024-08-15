import { Redirect } from "next";

export const RootRoutes = {
	Root: '/',
	NotFound: '/404',
	Auth: '/auth',
	Profile: '/profile',
};

export const redirectTo404 = (): Redirect => ({
	destination: RootRoutes.NotFound,
	permanent: false,
});
