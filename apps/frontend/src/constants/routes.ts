export const RootRoutes = {
	auth: '/auth',
	profile: '/demo',
	stylesExamples: '/styles-examples',
};

export const AuthRoutes = {
	root: RootRoutes.auth,
	loginPhone: `${RootRoutes.auth}/login/phone`,
	loginEmail: `${RootRoutes.auth}/login/email`,
	signUp: `${RootRoutes.auth}/sign-up`,
};

export const StylesExamplesRoutes = {
	root: RootRoutes.stylesExamples,
	page: 'page',
};
