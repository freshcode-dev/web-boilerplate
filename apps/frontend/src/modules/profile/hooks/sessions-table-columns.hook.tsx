import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { SessionDto } from '@boilerplate/shared';
import { SessionsTableActions } from '../components/sessions-table/sessions-table-actions.component';
import { SessionsTableHandlers } from '../components/sessions-table';

const helper = createColumnHelper<SessionDto>();

export const useSessionsTableColumns = (handlers: SessionsTableHandlers) => {
	const { onDeleteSession } = handlers;

	const [t] = useTranslation();

	return useMemo(
		() => [
			helper.accessor('ipAddressText', {
				header: t('profile.sessions.table.columns.ipAddress') ?? '',
			}),
			helper.accessor('userAgentText', {
				header: t('profile.sessions.table.columns.userAgent') ?? '',
			}),
			helper.accessor('createdAt', {
				header: t('profile.sessions.table.columns.createdAt') ?? '',
				cell: (props) => new Date(props.row.original.createdAt).toLocaleString(),
			}),
			helper.accessor('updatedAt', {
				header: t('profile.sessions.table.columns.updatedAt') ?? '',
				cell: (props) => new Date(props.row.original.updatedAt).toLocaleString(),
			}),
			helper.display({
				id: 'actions',
				header: t('profile.sessions.table.columns.actions') ?? '',
				cell: (props) => <SessionsTableActions session={props.row.original} onDeleteSession={onDeleteSession} />,
			}),
		],
		[t, onDeleteSession]
	);
};
