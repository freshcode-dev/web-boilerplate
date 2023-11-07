import { SessionDto } from '@boilerplate/shared';
import { FC, useCallback, useMemo } from 'react';
import {
	CoreTableActionsCell,
	CellAction,
} from '../../../_core/components/_ui/core-table';
import { SessionsTableHandlers } from './sessions-table.component';
import DeleteIcon from '@mui/icons-material/Delete';

export interface SessionsTableActionsProps extends SessionsTableHandlers {
	session: SessionDto;
}

export const SessionsTableActions: FC<SessionsTableActionsProps> = (props) => {
	const { session, onDeleteSession } = props;

	const handleDeleteSession = useCallback(() => {
		if (!session) {
			return;
		}

		onDeleteSession?.(session);
	}, [onDeleteSession, session]);

	const actions = useMemo<CellAction[]>(
		() => [
			{
				id: 'delete',
				type: 'button',
				props: {
					children: <DeleteIcon />,
					onClick: handleDeleteSession,
				},
			},
		],
		[handleDeleteSession]
	);

	return <CoreTableActionsCell actions={actions} />;
};
