import { ReactNode } from 'react';
import { PageTitle } from '../components/system-header';
import { SystemHeaderType } from './system-header-type.constants';

export const SystemHeaders: Record<SystemHeaderType, ReactNode> = {
	Default: <PageTitle />,
};
