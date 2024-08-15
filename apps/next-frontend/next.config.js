//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const nextI18next = require('./next-i18next.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env['ANALYZE_BUNDLE'] === 'true',
})

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	nx: {
		// Set this to true if you would like to to use SVGR
		// See: https://github.com/gregberge/svgr
		svgr: true,
	},

	compiler: {
		// For other options, see https://nextjs.org/docs/architecture/nextjs-compiler#emotion
		emotion: true,
	},
	i18n: nextI18next.i18n,
	reactStrictMode: true,
	compress: true
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
	withBundleAnalyzer,
];

module.exports = composePlugins(...plugins)(nextConfig);
