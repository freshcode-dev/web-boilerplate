import { FC } from 'react';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const DemoPage: FC = () => {
	const [t] = useTranslation();

	return <Container maxWidth="xl">{t('nav.demo')}</Container>;
};
