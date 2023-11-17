import { useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { SessionDto } from '@boilerplate/shared';
import { SessionsTableActions } from '../components/sessions-table/sessions-table-actions.component';
import { SessionsTableHandlers } from '../components/sessions-table';

const helper = createColumnHelper<SessionDto & { createdAt: string; updatedAt: string }>();

export function useSessionsTableColumns(handlers: SessionsTableHandlers): ColumnDef<SessionDto, string>[] {
	const { onDeleteSession } = handlers;

	const [t] = useTranslation();

	const result = useMemo(
		() => [
			helper.accessor('ipAddressText', {
				header: t('profile.sessions.table.columns.ipAddress') ?? '',
				meta: {
					flex: 1,
				},
			}) as ColumnDef<SessionDto, string>,
			helper.accessor('userAgentText', {
				header: t('profile.sessions.table.columns.userAgent') ?? '',
				meta: {
					flex: 1,
				},
			}) as ColumnDef<SessionDto, string>,
			helper.accessor('createdAt', {
				header: t('profile.sessions.table.columns.createdAt') ?? '',
				cell: (props) => new Date(props.row.original.createdAt).toLocaleString(),
				minSize: 240,
			}) as ColumnDef<SessionDto, string>,
			helper.accessor('updatedAt', {
				header: t('profile.sessions.table.columns.updatedAt') ?? '',
				cell: (props) => new Date(props.row.original.updatedAt).toLocaleString(),
				minSize: 240,
			}) as ColumnDef<SessionDto, string>,
			helper.display({
				id: 'actions',
				cell: (props) => <SessionsTableActions session={props.row.original} onDeleteSession={onDeleteSession} />,
			}) as ColumnDef<SessionDto>,
		],
		[t, onDeleteSession]
	);

	return result;
}
