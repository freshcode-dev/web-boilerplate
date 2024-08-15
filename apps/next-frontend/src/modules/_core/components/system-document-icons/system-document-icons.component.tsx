import { FC } from 'react';

const icons = {
	favicon: '/favicon.ico',
	iconSizes: [16, 32, 72, 96, 128, 144, 152, 192, 384, 512],
	iconTemplate: (size: number) => `/assets/logo-${size}x${size}.png`,
};

function makeIcon(rel: string, type: string, href: string, sizes: string) {
	return <link key={href} rel={rel} type={type} href={href} sizes={sizes} />;
}

function makeListIcons(rel: string, iconSizes: number[], iconTemplate: (size: number) => string) {
	return iconSizes.map((size) => makeIcon(rel, 'image/png', iconTemplate(size), `${size}x${size}`));
}

export const SystemDocumentIcons: FC = () => (
	<>
		{/* <!-- IE --> */}
		{makeIcon('shortcut icon', 'image/x-icon', icons.favicon, 'any')}
		{/* Windows */}
		{makeIcon('favicon', 'image/x-icon', icons.favicon, 'any')}
		{/* <!-- Apple --> */}
		{makeListIcons('apple-touch-icon', icons.iconSizes, icons.iconTemplate)}
		{/* <!-- Other browsers --> */}
		{makeListIcons('icon', icons.iconSizes, icons.iconTemplate)}
	</>
);
