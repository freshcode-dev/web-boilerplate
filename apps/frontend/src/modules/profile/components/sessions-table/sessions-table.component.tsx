import { FC } from 'react';
import { TableListQueryResponse } from '../../../_core/interfaces/table-list-query.interface';
import { SessionDto } from '@boilerplate/shared';
import { useTranslation } from 'react-i18next';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { useSessionsTableColumns } from '../../hooks/sessions-table-columns.hook';
import { CoreTable, CoreTableEmptyBody } from '../../../_core/components/_ui/core-table';

export interface SessionsTableHandlers {
	onDeleteSession(session: SessionDto): void;
}

type SessionsTableProps = TableListQueryResponse<SessionDto> & SessionsTableHandlers;

export const SessionsTable: FC<SessionsTableProps> = (props) => {
	const { data, sorting, onSortingChange, loading, hasMore, fetchMore, scrollRef, onDeleteSession } = props;

	const [t] = useTranslation();

	const columns = useSessionsTableColumns({
		onDeleteSession,
	});

	const table = useReactTable<SessionDto>({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<CoreTable
			px={0}
			ref={scrollRef}
			loading={loading}
			hasMore={hasMore}
			emptyListComponent={
				<CoreTableEmptyBody
					label={t('profile.sessions.table.empty-title')}
					description={t('profile.sessions.table.empty-description')}
				/>
			}
			fetchMore={fetchMore}
			rowModel={table.getRowModel()}
			headerGroups={table.getHeaderGroups()}
		/>
	);
};
